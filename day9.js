/*
--- Day 9: All in a Single Night ---

Every year, Santa manages to deliver all of his presents in a single night.

This year, however, he has some new locations to visit; his elves have provided him the distances between every pair of locations. He can start and end at any two (different) locations he wants, but he must visit each location exactly once. What is the shortest distance he can travel to achieve this?

For example, given the following distances:

London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141
The possible routes are therefore:

Dublin -> London -> Belfast = 982
London -> Dublin -> Belfast = 605
London -> Belfast -> Dublin = 659
Dublin -> Belfast -> London = 659
Belfast -> Dublin -> London = 605
Belfast -> London -> Dublin = 982
The shortest of these is London -> Dublin -> Belfast = 605, and so the answer is 605 in this example.

What is the distance of the shortest route?
*/
const _ = require('lodash');

function bfs(currentCity, distSoFar, visited, adjacencyMap) {
  const destinations = adjacencyMap[currentCity];
  const notYetVisited = _.filter(destinations, ({city}) => !_.contains(visited, city));
  if (!_.isEmpty(notYetVisited)) {
    const newVisited = visited.concat(currentCity);
    const results = notYetVisited.map(({city, dist}) => {
      return bfs(city, distSoFar + dist, newVisited, adjacencyMap);
    });
    return _.min(results);
  }

  return distSoFar;
}

function shortestPath(inputs) {
  const adjacencyMap = {};

  inputs.forEach((input) => {
    const [city1, city2, distString] = input.replace(/\s(to|=)\s/g, ' ').split(' ');
    const dist = parseInt(distString, 10);
    adjacencyMap[city1] = adjacencyMap[city1] || [];
    adjacencyMap[city1].push({city: city2, dist});
    adjacencyMap[city2] = adjacencyMap[city2] || [];
    adjacencyMap[city2].push({city: city1, dist});
  });

  const allMins = Object.keys(adjacencyMap).map((city) => {
    return bfs(city, 0, [city], adjacencyMap);
  });
  return _.min(allMins);
}


const inputs = [
  'AlphaCentauri to Snowdin = 66',
  'AlphaCentauri to Tambi = 28',
  'AlphaCentauri to Faerun = 60',
  'AlphaCentauri to Norrath = 34',
  'AlphaCentauri to Straylight = 34',
  'AlphaCentauri to Tristram = 3',
  'AlphaCentauri to Arbre = 108',
  'Snowdin to Tambi = 22',
  'Snowdin to Faerun = 12',
  'Snowdin to Norrath = 91',
  'Snowdin to Straylight = 121',
  'Snowdin to Tristram = 111',
  'Snowdin to Arbre = 71',
  'Tambi to Faerun = 39',
  'Tambi to Norrath = 113',
  'Tambi to Straylight = 130',
  'Tambi to Tristram = 35',
  'Tambi to Arbre = 40',
  'Faerun to Norrath = 63',
  'Faerun to Straylight = 21',
  'Faerun to Tristram = 57',
  'Faerun to Arbre = 83',
  'Norrath to Straylight = 9',
  'Norrath to Tristram = 50',
  'Norrath to Arbre = 60',
  'Straylight to Tristram = 27',
  'Straylight to Arbre = 81',
  'Tristram to Arbre = 90',
];

console.log(shortestPath(inputs));
