import _ from 'lodash';

function parseOffset(sign, offset) {
  return (sign === '+' ? 1 : -1) * parseInt(offset, 10);
}

const registers = {
  a: 1,
  b: 0,
};

let instructionOffset = 0;
let instructions = [];

const instructionTypes = [{
  regex: /hlf (\w+)/,
  description: 'hlf r sets register r to half its current value, then continues with the next instruction.',
  f: ([_match, register]) => {
    registers[register] /= 2;
    instructionOffset += 1;
  },
}, {
  regex: /tpl (\w+)/,
  description: 'tpl r sets register r to triple its current value, then continues with the next instruction.',
  f: ([_match, register]) => {
    registers[register] *= 3;
    instructionOffset += 1;
  },
}, {
  regex: /inc (\w+)/,
  description: 'inc r increments register r, adding 1 to it, then continues with the next instruction.',
  f: ([_match, register]) => {
    registers[register] += 1;
    instructionOffset += 1;
  },
}, {
  regex: /jmp (\+|-)(\w+)/,
  description: 'jmp offset is a jump; it continues with the instruction offset away relative to itself.',
  f: ([_match, sign, offset]) => {
    instructionOffset += parseOffset(sign, offset);
  },
}, {
  regex: /jie (\w+), (\+|-)(\w+)/,
  description: 'jie r, offset is like jmp, but only jumps if register r is even ("jump if even").',
  f: ([_match, register, sign, offset]) => {
    instructionOffset += (registers[register] % 2 === 0) ? parseOffset(sign, offset) : 1;
  },
}, {
  regex: /jio (\w+), (\+|-)(\w+)/,
  description: 'jio r, offset is like jmp, but only jumps if register r is 1 ("jump if one", not odd).',
  f: ([_match, register, sign, offset]) => {
    instructionOffset += (registers[register] === 1) ? parseOffset(sign, offset) : 1;
  },
}];

const readline = require('readline').createInterface({
  input: process.stdin,
});

readline.on('line', instructions.push.bind(instructions));

readline.on('close', () => {
  let instruction = instructions[instructionOffset];
  while (instruction) {
    const matched = _.any(instructionTypes, ({regex, f}) => {
      const matches = instruction.match(regex);
      if (matches) {
        f(matches);
        return true;
      }
    });
    instruction = instructions[instructionOffset];
  }
  console.log(registers);
});
