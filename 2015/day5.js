/*
--- Day 5: Doesn't He Have Intern-Elves For This? ---

Santa needs help figuring out which strings in his text file are naughty or nice.

A nice string is one with all of the following properties:

It contains at least three vowels (aeiou only), like aei, xazegov, or aeiouaeiouaeiou.
It contains at least one letter that appears twice in a row, like xx, abcdde (dd), or aabbccdd (aa, bb, cc, or dd).
It does not contain the strings ab, cd, pq, or xy, even if they are part of one of the other requirements.
For example:

ugknbfddgicrmopn is nice because it has at least three vowels (u...i...o...), a double letter (...dd...), and none of the disallowed substrings.
aaa is nice because it has at least three vowels and a double letter, even though the letters used by different rules overlap.
jchzalrnumimnmhp is naughty because it has no double letter.
haegwjzuvuyypxyu is naughty because it contains the string xy.
dvszwmarrgswjxmb is naughty because it contains only one vowel.
How many strings are nice?
*/
const readline = require('readline').createInterface({
  input: process.stdin,
});

const vowels = 'aeiou';
const badLetters = ['ab', 'cd', 'pq', 'xy'];

function contains(input, searchString) {
  return input.indexOf(searchString) >= 0;
}

function containsVowels(input) {
  const vowelCount = input.split('').reduce((count, letter) => {
    return count + (contains(vowels, letter) ? 1 : 0);
  }, 0);
  return vowelCount >= 3;
}

function doubleLetters(input) {
  return /([a-z])\1/.test(input);
}

function notNaughty(input) {
  return badLetters.every((bad) => {
    return !contains(input, bad);
  });
}

function naughtyOrNice(input) {
  if (containsVowels(input) && doubleLetters(input) && notNaughty(input)) {
    return 'nice';
  }
  return 'naughty';
}

function nonOverlappingDoubleLetters(input) {
  return /([a-z]{2}).*\1/.test(input);
}

function inBetween(input) {
  return /([a-z]).\1/.test(input);
}

function naughtyOrNice2(input) {
  if (nonOverlappingDoubleLetters(input) && inBetween(input)) {
    return 'nice';
  }
  return 'naughty';
}

function countNaughtyOrNice(lines, f) {
  return lines.reduce((memo, input) => {
    const result = f(input);
    memo[result] = (memo[result] || 0) + 1;
    return memo;
  }, {});
}
const lines = [];
readline.on('line', lines.push.bind(lines));
readline.on('close', () => {
  console.log(countNaughtyOrNice(lines, naughtyOrNice));
  console.log(countNaughtyOrNice(lines, naughtyOrNice2));
});
