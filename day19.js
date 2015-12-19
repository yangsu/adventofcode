/* eslint-disable no-loop-func */

/*
--- Day 19: Medicine for Rudolph ---

Rudolph the Red-Nosed Reindeer is sick! His nose isn't shining very brightly, and he needs medicine.

Red-Nosed Reindeer biology isn't similar to regular reindeer biology; Rudolph is going to need custom-made medicine. Unfortunately, Red-Nosed Reindeer chemistry isn't similar to regular reindeer chemistry, either.

The North Pole is equipped with a Red-Nosed Reindeer nuclear fusion/fission plant, capable of constructing any Red-Nosed Reindeer molecule you need. It works by starting with some input molecule and then doing a series of replacements, one per step, until it has the right molecule.

However, the machine has to be calibrated before it can be used. Calibration involves determining the number of molecules that can be generated in one step from a given starting point.

For example, imagine a simpler machine that supports only the following replacements:

H => HO
H => OH
O => HH
Given the replacements above and starting with HOH, the following molecules could be generated:

HOOH (via H => HO on the first H).
HOHO (via H => HO on the second H).
OHOH (via H => OH on the first H).
HOOH (via H => OH on the second H).
HHHH (via O => HH).
So, in the example above, there are 4 distinct molecules (not five, because HOOH appears twice) after one replacement from HOH. Santa's favorite molecule, HOHOHO, can become 7 distinct molecules (over nine replacements: six from H, and three from O).

The machine replaces without regard for the surrounding characters. For example, given the string H2O, the transition H => OO would result in OO2O.

Your puzzle input describes all of the possible replacements and, at the bottom, the medicine molecule for which you need to calibrate the machine. How many distinct molecules can be created after all the different ways you can do one replacement on the medicine molecule?
*/

import _ from 'lodash';

const readline = require('readline').createInterface({
  input: process.stdin,
});

const replacements = [];
const regex = /(\w+) => (\w+)/;
let input;

function parse(line) {
  if (regex.test(line)) {
    const [_match, source, replacement] = line.match(regex);
    replacements.push({source, replacement});
  } else if (line.length) {
    input = line;
  }
}

function findAllIndices(source, search) {
  const indices = [];
  let index = source.indexOf(search);
  while (index >= 0) {
    indices.push(index);
    index = source.indexOf(search, index + 1);
  }
  return indices;
}

function replaceAtIndex(string, source, replacement, index) {
  return string.substring(0, index) + replacement + string.substring(index + source.length);
}

function computeCombinations(sequence) {
  const allCombinatins = _.reduce(replacements, (combinations, {source, replacement}) => {
    return combinations.concat(findAllIndices(sequence, source).map(index => {
      return replaceAtIndex(sequence, source, replacement, index);
    }));
  }, []);
  return _.uniq(allCombinatins);
}

function findCandidatesSubtitutions(text) {
  return _.chain(replacements)
    .filter(({replacement}) => text.indexOf(replacement) >= 0)
    .sortBy(({replacement}) => replacement.length)
    .reverse()
    .value();
}

function computeHops(start, destination) {
  const visited = [start];
  const queue = [{string: start, count: 0}];
  const solution = [];
  const stack = [];

  while (queue.length) {
    const {string, count} = queue.shift();
    if (string === destination) {
      return count;
    }

    const candidates = findCandidatesSubtitutions(string)
      .map(({source, replacement}) => ({
        string: string.replace(replacement, source),
        count: count + 1,
      }))
      .filter((candidate) => !_.contains(visited, candidate.string));

    let next = _.first(candidates);
    stack.push(..._.rest(candidates));
    if (!next) { // no candidates/dead end
      solution.pop();
      next = stack.pop();
    }
    visited.push(next.string);
    queue.push(next);
    solution.push(next);
  }
}

readline.on('line', parse);
readline.on('close', () => {
  console.log(computeCombinations(input).length);
  console.log(computeHops(input, 'e'));
});
