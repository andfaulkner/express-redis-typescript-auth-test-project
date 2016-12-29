#!/usr/bin/env node
const inspect = require('util').inspect;

const chunks = [];

console.log('\n\ninspect:');
console.log(inspect(inspect, { colors: true, depth: 10, showHidden: true }));
console.log('\n\ninspect.prototype:');
console.log(inspect(inspect.prototype, { colors: true, depth: 10, showHidden: true }));
console.log('\n\ninspect.constructor:');
console.log(inspect(inspect.constructor, { colors: true, depth: 10, showHidden: true }));

console.log(`\n\n************************************ process.stdin ************************************`);
console.log(inspect(process.stdin, { colors: true, depth: 10, showHidden: true }));
console.log(`END process.stdin`);

console.log(`\n\n************************************ process.stdin.constructor ************************************`);
console.log(inspect(process.stdin.constructor, { colors: true, depth: 10, showHidden: true }));
console.log(`END process.stdin.constructor`);

// console.log(`\n\n************************************ process.stdout ************************************`);
// console.log(inspect(process.stdout, { colors: true, depth: 10, showHidden: true }));
// console.log(`END process.stdin`);
