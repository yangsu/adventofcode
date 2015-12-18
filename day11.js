/*
--- Day 11: Corporate Policy ---

Santa's previous password expired, and he needs help choosing a new one.

To help him remember his new password after the old one expires, Santa has devised a method of coming up with a password based on the previous one. Corporate policy dictates that passwords must be exactly eight lowercase letters (for security reasons), so he finds his new password by incrementing his old password string repeatedly until it is valid.

Incrementing is just like counting with numbers: xx, xy, xz, ya, yb, and so on. Increase the rightmost letter one step; if it was z, it wraps around to a, and repeat with the next letter to the left until one doesn't wrap around.

Unfortunately for Santa, a new Security-Elf recently started, and he has imposed some additional password requirements:

Passwords must include one increasing straight of at least three letters, like abc, bcd, cde, and so on, up to xyz. They cannot skip letters; abd doesn't count.
Passwords may not contain the letters i, o, or l, as these letters can be mistaken for other characters and are therefore confusing.
Passwords must contain at least two different, non-overlapping pairs of letters, like aa, bb, or zz.
For example:

hijklmmn meets the first requirement (because it contains the straight hij) but fails the second requirement requirement (because it contains i and l).
abbceffg meets the third requirement (because it repeats bb and ff) but fails the first requirement.
abbcegjk fails the third requirement, because it only has one double letter (bb).
The next password after abcdefgh is abcdffaa.
The next password after ghijklmn is ghjaabcc, because you eventually skip all the passwords that start with ghi..., since i is not allowed.
Given Santa's current password (your puzzle input), what should his next password be?

Your puzzle input is hepxcrrq.
*/

const end = 122; // 'z'

function increment(str) {
  const i = str.length - 1;
  const currentCharCode = str.charCodeAt(i);
  const nextCharCode = currentCharCode + 1;
  const initial = str.substr(0, i);
  if (nextCharCode > end && initial.length > 0) {
    return increment(initial) + 'a';
  } else if (nextCharCode > end && initial.length === 0) {
    return 'aa';
  }
  return initial + String.fromCharCode(nextCharCode);
}

function strContains(str, search) {
  return str.indexOf(search) >= 0;
}

function isIncreasingSequence(str) {
  for (let i = 0, l = str.length - 1; i < l; i += 1) {
    const currentCharCode = str.charCodeAt(i);
    const nextCharCode = str.charCodeAt(i + 1);
    if (nextCharCode - currentCharCode !== 1) {
      return false;
    }
  }
  return true;
}

function hasIncreasingSequence(password, n) {
  for (let i = 0, l = password.length - n; i < l; i += 1) {
    if (isIncreasingSequence(password.substr(i, n))) {
      return true;
    }
  }
  return false;
}

function containsBadLetters(password) {
  return strContains(password, 'i') || strContains(password, 'o') || strContains(password, 'l');
}

function containsNPairs(password, n) {
  let pairCount = 0;
  for (let i = 0, l = password.length - 1; i < l; i += 1) {
    if (password[i] === password[i + 1]) {
      i += 1;
      pairCount += 1;
    }
  }
  return pairCount >= n;
}

function validPassword(password) {
  return hasIncreasingSequence(password, 3) && !containsBadLetters(password) && containsNPairs(password, 2);
}

function nextPassword(password) {
  let newPassword = increment(password);
  while (!validPassword(newPassword)) {
    newPassword = increment(newPassword);
  }
  return newPassword;
}

console.log(validPassword('hijklmmn'));
console.log(validPassword('abbceffg'));
console.log(validPassword('abbcegjk'));
console.log(nextPassword('abcdefgh'));
console.log(nextPassword('hepxcrrq'));
