// 2978, column 3083.

function coordinateToN(r, c) {
  const n = (r + c) - 2;
  return (1 + n) * n / 2 + c;
}

function findN(n) {
  let value = 20151125;
  for (let i = 1; i < n; i += 1) {
    value = value * 252533 % 33554393;
  }
  return value;
}

console.log(findN(1));
console.log(findN(2));
console.log(findN(3));
console.log(findN(4));

console.log(findN(coordinateToN(2978, 3083)));
