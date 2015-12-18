/*

--- Day 13: Knights of the Dinner Table ---

In years past, the holiday feast with your family hasn't gone so well. Not everyone gets along! This year, you resolve, will be different. You're going to find the optimal seating arrangement and avoid all those awkward conversations.

You start by writing up a list of everyone invited and the amount their happiness would increase or decrease if they were to find themselves sitting next to each other person. You have a circular table that will be just big enough to fit everyone comfortably, and so each person will have exactly two neighbors.

For example, suppose you have only four attendees planned, and you calculate their potential happiness as follows:

Alice would gain 54 happiness units by sitting next to Bob.
Alice would lose 79 happiness units by sitting next to Carol.
Alice would lose 2 happiness units by sitting next to David.
Bob would gain 83 happiness units by sitting next to Alice.
Bob would lose 7 happiness units by sitting next to Carol.
Bob would lose 63 happiness units by sitting next to David.
Carol would lose 62 happiness units by sitting next to Alice.
Carol would gain 60 happiness units by sitting next to Bob.
Carol would gain 55 happiness units by sitting next to David.
David would gain 46 happiness units by sitting next to Alice.
David would lose 7 happiness units by sitting next to Bob.
David would gain 41 happiness units by sitting next to Carol.
Then, if you seat Alice next to David, Alice would lose 2 happiness units (because David talks so much), but David would gain 46 happiness units (because Alice is such a good listener), for a total change of 44.

If you continue around the table, you could then seat Bob next to Alice (Bob gains 83, Alice gains 54). Finally, seat Carol, who sits next to Bob (Carol gains 60, Bob loses 7) and David (Carol gains 55, David gains 41). The arrangement looks like this:

     +41 +46
+55   David    -2
Carol       Alice
+60    Bob    +54
     -7  +83
After trying every other seating arrangement in this hypothetical scenario, you find that this one is the most optimal, with a total change in happiness of 330.

What is the total change in happiness for the optimal seating arrangement of the actual guest list?
*/

const _ = require('lodash');

const regex = /^(\w+) would (\w+) (\d+) .+ (\w+)\.$/;

const matrix = {};

function processFact(line) {
  const [_ignore, person1, winOrLose, number, person2] = line.match(regex);
  const change = (winOrLose === 'gain' ? 1 : -1) * number;
  matrix[person1] = matrix[person1] || {};
  matrix[person2] = matrix[person2] || {};
  matrix[person1][person2] = change;
}

const facts = [
  'Alice would gain 2 happiness units by sitting next to Bob.',
  'Alice would gain 26 happiness units by sitting next to Carol.',
  'Alice would lose 82 happiness units by sitting next to David.',
  'Alice would lose 75 happiness units by sitting next to Eric.',
  'Alice would gain 42 happiness units by sitting next to Frank.',
  'Alice would gain 38 happiness units by sitting next to George.',
  'Alice would gain 39 happiness units by sitting next to Mallory.',
  'Bob would gain 40 happiness units by sitting next to Alice.',
  'Bob would lose 61 happiness units by sitting next to Carol.',
  'Bob would lose 15 happiness units by sitting next to David.',
  'Bob would gain 63 happiness units by sitting next to Eric.',
  'Bob would gain 41 happiness units by sitting next to Frank.',
  'Bob would gain 30 happiness units by sitting next to George.',
  'Bob would gain 87 happiness units by sitting next to Mallory.',
  'Carol would lose 35 happiness units by sitting next to Alice.',
  'Carol would lose 99 happiness units by sitting next to Bob.',
  'Carol would lose 51 happiness units by sitting next to David.',
  'Carol would gain 95 happiness units by sitting next to Eric.',
  'Carol would gain 90 happiness units by sitting next to Frank.',
  'Carol would lose 16 happiness units by sitting next to George.',
  'Carol would gain 94 happiness units by sitting next to Mallory.',
  'David would gain 36 happiness units by sitting next to Alice.',
  'David would lose 18 happiness units by sitting next to Bob.',
  'David would lose 65 happiness units by sitting next to Carol.',
  'David would lose 18 happiness units by sitting next to Eric.',
  'David would lose 22 happiness units by sitting next to Frank.',
  'David would gain 2 happiness units by sitting next to George.',
  'David would gain 42 happiness units by sitting next to Mallory.',
  'Eric would lose 65 happiness units by sitting next to Alice.',
  'Eric would gain 24 happiness units by sitting next to Bob.',
  'Eric would gain 100 happiness units by sitting next to Carol.',
  'Eric would gain 51 happiness units by sitting next to David.',
  'Eric would gain 21 happiness units by sitting next to Frank.',
  'Eric would gain 55 happiness units by sitting next to George.',
  'Eric would lose 44 happiness units by sitting next to Mallory.',
  'Frank would lose 48 happiness units by sitting next to Alice.',
  'Frank would gain 91 happiness units by sitting next to Bob.',
  'Frank would gain 8 happiness units by sitting next to Carol.',
  'Frank would lose 66 happiness units by sitting next to David.',
  'Frank would gain 97 happiness units by sitting next to Eric.',
  'Frank would lose 9 happiness units by sitting next to George.',
  'Frank would lose 92 happiness units by sitting next to Mallory.',
  'George would lose 44 happiness units by sitting next to Alice.',
  'George would lose 25 happiness units by sitting next to Bob.',
  'George would gain 17 happiness units by sitting next to Carol.',
  'George would gain 92 happiness units by sitting next to David.',
  'George would lose 92 happiness units by sitting next to Eric.',
  'George would gain 18 happiness units by sitting next to Frank.',
  'George would gain 97 happiness units by sitting next to Mallory.',
  'Mallory would gain 92 happiness units by sitting next to Alice.',
  'Mallory would lose 96 happiness units by sitting next to Bob.',
  'Mallory would lose 51 happiness units by sitting next to Carol.',
  'Mallory would lose 81 happiness units by sitting next to David.',
  'Mallory would gain 31 happiness units by sitting next to Eric.',
  'Mallory would lose 73 happiness units by sitting next to Frank.',
  'Mallory would lose 89 happiness units by sitting next to George.',
];

facts.forEach(processFact);

function computeHappiness(seatingArrangement) {
  // add first person to the end to account for wrapping
  const wrappedArrangement = seatingArrangement.concat(seatingArrangement[0]);
  let totalHappiness = 0;
  for (let i = 0, l = wrappedArrangement.length - 1; i < l; i += 1) {
    const person1 = wrappedArrangement[i];
    const person2 = wrappedArrangement[i + 1];
    totalHappiness += matrix[person1][person2] + matrix[person2][person1];
  }
  return totalHappiness;
}

function computeArrangements(persons) {
  if (persons.length > 1) {
    return persons.reduce((list, person) => {
      const otherPersons = _.without(persons, person);
      return list.concat(computeArrangements(otherPersons).map((arrangement) => {
        return [person].concat(arrangement);
      }));
    }, []);
  }
  return [persons];
}

function computeBestArrangement(persons) {
  return _.chain(computeArrangements(persons))
    .map(computeHappiness)
    .max()
    .value();
}

// Part 1
// console.log(computeBestArrangement(Object.keys(matrix)));
// Part 2

matrix.me = {};
Object.keys(matrix).forEach(person => {
  matrix[person].me = 0;
  matrix.me[person] = 0;
});
console.log(computeBestArrangement(Object.keys(matrix)));
