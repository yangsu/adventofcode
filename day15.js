/*
--- Day 15: Science for Hungry People ---

Today, you set out on the task of perfecting your milk-dunking cookie recipe. All you have to do is find the right balance of ingredients.

Your recipe leaves room for exactly 100 teaspoons of ingredients. You make a list of the remaining ingredients you could use to finish the recipe (your puzzle input) and their properties per teaspoon:

capacity (how well it helps the cookie absorb milk)
durability (how well it keeps the cookie intact when full of milk)
flavor (how tasty it makes the cookie)
texture (how it improves the feel of the cookie)
calories (how many calories it adds to the cookie)
You can only measure ingredients in whole-teaspoon amounts accurately, and you have to be accurate so you can reproduce your results in the future. The total score of a cookie can be found by adding up each of the properties (negative totals become 0) and then multiplying together everything except calories.

For instance, suppose you have these two ingredients:

Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3
Then, choosing to use 44 teaspoons of butterscotch and 56 teaspoons of cinnamon (because the amounts of each ingredient must add up to 100) would result in a cookie with the following properties:

A capacity of 44*-1 + 56*2 = 68
A durability of 44*-2 + 56*3 = 80
A flavor of 44*6 + 56*-2 = 152
A texture of 44*3 + 56*-1 = 76
Multiplying these together (68 * 80 * 152 * 76, ignoring calories for now) results in a total score of 62842880, which happens to be the best score possible given these ingredients. If any properties had produced a negative total, it would have instead become zero, causing the whole score to multiply to zero.

Given the ingredients in your kitchen and their properties, what is the total score of the highest-scoring cookie you can make?

*/
import _ from 'lodash';

const inputs = [
  // 'Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8',
  // 'Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3',

  'Frosting: capacity 4, durability -2, flavor 0, texture 0, calories 5',
  'Candy: capacity 0, durability 5, flavor -1, texture 0, calories 8',
  'Butterscotch: capacity -1, durability 0, flavor 5, texture 0, calories 6',
  'Sugar: capacity 0, durability 0, flavor -2, texture 2, calories 1',
];

const regex = /(\w+):.+ (-?\d+).+ (-?\d+).+ (-?\d+).+ (-?\d+).+ (\d+)/;
const maxCookies = 100;

const cookies = inputs.reduce((memo, input) => {
  const [_match, cookie, capacity, durability, flavor, texture, calories] = input.match(regex);
  memo[cookie] = {capacity, durability, flavor, texture, calories};
  return memo;
}, {});

function computeScore(cookieConfiguration) {
  const scores = cookieConfiguration.reduce((memo, {cookie, count}) => {
    const {capacity, durability, flavor, texture} = cookies[cookie];
    memo.capacity += capacity * count;
    memo.durability += durability * count;
    memo.flavor += flavor * count;
    memo.texture += texture * count;
    return memo;
  }, {capacity: 0, durability: 0, flavor: 0, texture: 0});
  return _.values(scores).map(score => Math.max(score, 0)).reduce((a, b) => a * b);
}

function generateCookieConfigurations(listOfCookies, total) {
  if (listOfCookies.length === 0) {
    return listOfCookies;
  } else if (listOfCookies.length === 1) {
    return [{cookie: listOfCookies[0], count: total}];
  }
  const cookie = _.first(listOfCookies);
  const otherCookies = _.rest(listOfCookies);
  return _.range(0, total + 1).reduce((configurations, count) => {
    const restConfigurations = generateCookieConfigurations(otherCookies, Math.max(total - count, 0));
    // console.log(restConfigurations);
    const newConfigurations = restConfigurations.map((configuration) => {
      return [{cookie, count}].concat(configuration);
    });
    return configurations.concat(newConfigurations);
  }, []);
}

const configurations = generateCookieConfigurations(Object.keys(cookies), maxCookies);
console.log(_.max(configurations.map(computeScore)));
