/*
--- Day 3: Perfectly Spherical Houses in a Vacuum ---

Santa is delivering presents to an infinite two-dimensional grid of houses.

He begins by delivering a present to the house at his starting location, and then an elf at the North Pole calls him via radio and tells him where to move next. Moves are always exactly one house to the north (^), south (v), east (>), or west (<). After each move, he delivers another present to the house at his new location.

However, the elf back at the north pole has had a little too much eggnog, and so his directions are a little off, and Santa ends up visiting some houses more than once. How many houses receive at least one present?

For example:

> delivers presents to 2 houses: one at the starting location, and one to the east.
^>v< delivers presents to 4 houses in a square, including twice to the house at his starting/ending location.
^v^v^v^v^v delivers a bunch of presents to some very lucky children at only 2 houses.
*/

function pos(x, y) {
  return x + ',' + y;
}

function deliver(presents, x, y) {
  const position = pos(x, y);
  presents[position] = (presents[position] || 0) + 1;
}

function move(startingX, startingY, instruction) {
  let x = startingX;
  let y = startingY;
  switch (instruction) {
    case '^':
      y += 1;
      break;
    case '>':
      x += 1;
      break;
    case 'v':
      y -= 1;
      break;
    case '<':
      x -= 1;
      break;
    default:
      break;
  }
  return {x, y};
}

function deliverPresents(moves) {
  const presents = {};

  let x = 0;
  let y = 0;
  deliver(presents, x, y);
  for (let i = 0; i < moves.length; i += 1) {
    const newLoc = move(x, y, moves[i]);
    x = newLoc.x;
    y = newLoc.y;
    deliver(presents, x, y);
  }
  return Object.keys(presents).length;
}

function deliverPresentsWithRobot(moves) {
  const presents = {};
  let santaX = 0;
  let santaY = 0;
  let robotX = 0;
  let robotY = 0;
  deliver(presents, 0, 0);
  for (let i = 0; i < moves.length; i += 1) {
    if (i % 2 === 0) { // santa
      const newLoc = move(santaX, santaY, moves[i]);
      santaX = newLoc.x;
      santaY = newLoc.y;
      deliver(presents, santaX, santaY);
    } else {
      const newLoc = move(robotX, robotY, moves[i]);
      robotX = newLoc.x;
      robotY = newLoc.y;
      deliver(presents, robotX, robotY);
    }
  }
  return Object.keys(presents).length;
}

console.log(deliverPresents('>'));
console.log(deliverPresents('^>v<'));
console.log(deliverPresents('^v^v^v^v^v'));
console.log(deliverPresentsWithRobot('^v'));
const readline = require('readline').createInterface({
  input: process.stdin,
});

readline.on('line', line => {
  const moves = line.split('');
  console.log(deliverPresents(moves));
  console.log(deliverPresentsWithRobot(moves));
});
