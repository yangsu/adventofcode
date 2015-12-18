/*
--- Day 17: No Such Thing as Too Much ---

The elves bought too much eggnog again - 150 liters this time. To fit it all into your refrigerator, you'll need to move
it into smaller containers. You take an inventory of the capacities of the available containers.

For example, suppose you have containers of size 20, 15, 10, 5, and 5 liters. If you need to store 25 liters, there are
four ways to do it:

15 and 10
20 and 5 (the first 5)
20 and 5 (the second 5)
15, 5, and 5

Filling all containers entirely, how many different combinations of containers can exactly fit all 150 liters of eggnog?
*/
import _ from 'lodash';

function descendingOrder(list) {
  return _.sortBy(list, n => n).reverse();
}

function computePermutations(sizes, liters) {
  const sorted = descendingOrder(sizes);
  const sum = _.sum(sizes);
  if (sum < liters || sizes.length * liters === 0) {
    return [];
  } else if (sum === liters) {
    return [sorted];
  }

  const size = _.first(sorted);
  const otherSizes = _.rest(sorted);
  const permutations = [];
  if (size === liters) {
    permutations.push([size]);
  }
  computePermutations(otherSizes, liters - size).forEach(permutation => {
    permutations.push([size].concat(permutation));
  });
  computePermutations(otherSizes, liters).forEach(permutation => {
    permutations.push(permutation);
  });
  return permutations;
}

// const containers = [20, 15, 10, 5, 5];
const containers = [
  33,
  14,
  18,
  20,
  45,
  35,
  16,
  35,
  1,
  13,
  18,
  13,
  50,
  44,
  48,
  6,
  24,
  41,
  30,
  42,
];

const permutations = computePermutations(containers, 150);

const groupByNumContainers = _.groupBy(permutations, p => p.length);
const numSmallestContainers = groupByNumContainers[_.min(_.keys(groupByNumContainers))];
console.log(permutations.length, numSmallestContainers.length);
