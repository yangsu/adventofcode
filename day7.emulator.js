const cache = {};

class Wire {
  constructor({identifier}) {
    this.identifier = identifier;
  }

  addInput(input) {
    this.input = input;
  }

  get value() {
    const identifier = this.identifier;
    if (!(identifier in cache)) {
      cache[identifier] = this.input.value;
    }
    return cache[identifier];
  }
}

class Numeric {
  constructor({value}) {
    this.value = value;
  }
}

class UnaryOperator {
  constructor({operand}) {
    this.operand = operand;
  }
}

class Not extends UnaryOperator {
  constructor(properties) {
    super(properties);
  }

  get value() {
    return (~this.operand.value) >>> 0 & ((1 << 16) - 1);
  }
}

class BinaryOperator {
  constructor({operand1, operand2}) {
    this.operand1 = operand1;
    this.operand2 = operand2;
  }
}

class And extends BinaryOperator {
  get value() {
    return this.operand1.value & this.operand2.value;
  }
}

class Or extends BinaryOperator {
  get value() {
    return this.operand1.value | this.operand2.value;
  }
}

class LShift extends BinaryOperator {
  get value() {
    return this.operand1.value << this.operand2.value;
  }
}

class RShift extends BinaryOperator {
  get value() {
    return this.operand1.value >> this.operand2.value;
  }
}

const REGEX = {
  Numeric: /^(\d+)$/,
  UnaryOperator: /^([A-Z]+) (\w+)$/,
  BinaryOperator: /^(\w+) ([A-Z]+) (\w+)$/,
};

export default class CircuitEmulator {
  constructor() {
    this.wires = {};
  }

  getWireById(identifier) {
    this.wires[identifier] = this.wires[identifier] || new Wire({identifier});
    return this.wires[identifier];
  }

  parseInput(input) {
    if (REGEX.Numeric.test(input)) {
      const value = parseInt(input.match(REGEX.Numeric)[1], 10);
      return new Numeric({value});
    } else if (REGEX.UnaryOperator.test(input)) {
      const [_, operator, operandString] = input.match(REGEX.UnaryOperator);
      const operand = this.parseInput(operandString);

      if (operator === 'NOT') {
        return new Not({operand});
      }
    } else if (REGEX.BinaryOperator.test(input)) {
      const [_, operand1String, operator, operand2String] = input.match(REGEX.BinaryOperator);
      const operand1 = this.parseInput(operand1String);
      const operand2 = this.parseInput(operand2String);

      if (operator === 'AND') {
        return new And({operand1, operand2});
      } else if (operator === 'OR') {
        return new Or({operand1, operand2});
      } else if (operator === 'LSHIFT') {
        return new LShift({operand1, operand2});
      } else if (operator === 'RSHIFT') {
        return new RShift({operand1, operand2});
      }
    } else {
      return this.getWireById(input);
    }
  }

  executeInstructions(instructions) {
    instructions.map(instruction => {
      const [input, output] = instruction.split(' -> ');
      const inputNode = this.parseInput(input);
      this.getWireById(output).addInput(inputNode);
    });
  }

  getWireValueById(id) {
    return this.wires[id].value;
  }
}
