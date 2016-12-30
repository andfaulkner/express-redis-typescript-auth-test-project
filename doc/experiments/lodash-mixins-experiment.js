#!/usr/bin/env node
const inspect = require('util').inspect;
const _ = require('lodash');
const { expect } = require('chai');

_.mixin({
    // aliases
    any: _.some,
    all: _.every,

    // pass-through logger
    puts: (...str) => {
        console.log(...str);
        return str;
    },

    // Sugar for accessing elements at the start and end of a collection
    secondLast: (coll: string | any[]) => coll[coll.length - 2],
    thirdLast: (coll: string | any[]) => coll[coll.length - 3],
    fourthLast: (coll: string | any[]) => coll[coll.length - 4],
    fifthLast: (coll: string | any[]) => coll[coll.length - 5],
    second: (coll: string | any[]) => coll[1],
    third: (coll: string | any[]) => coll[2],
    fourth: (coll: string | any[]) => coll[3],
    fifth: (coll: string | any[]) => coll[4],

    // True if any element in the 1st collection is the same as any element in the 2nd
    hasOverlap: (coll1: any[], coll2: any[]) => _.some(coll1, (item) => _.includes(coll2, item)),

    // Insert item into array (coll) at given index (idx)
    insertAt<T>: (coll: T[] | string, idx: number, item: T): T[] | string => {
        let preppedArr = (typeof coll === 'string') ? coll.split('') : coll;
        preppedArr.splice(idx, 0, item);
        return preppedArr;
    },
});

// function insertAt(arr, idx, item) {
//     const newArr = arr;
//     newArr.splice(idx, 0, item);
//     return newArr;
// }

if (process.env.test === 'test') {
    const test = function(msg, tests) {
        try {
            console.log(' ' + msg);
            tests();
            console.log(`    ✓  success\n`);
        } catch (e) {
            console.log(`    ✘  failed: ${e.message}`);
        }
    };

    test('hasOverlap exists', () => expect(_.hasOverlap).to.exist);

    test('hasOverlap returns true if 1 or more items overlap between 2 given arrays', () => {
        expect(_.hasOverlap(['a', 'b', 'c'], ['a', 'b', 'c'])).to.be.true
        expect(_.hasOverlap(['a', 'b', 'c'], ['a', 'b', 'd'])).to.be.true
        expect(_.hasOverlap(['a', 'b', 'c'], ['z', 'c', 'd'])).to.be.true
        expect(_.hasOverlap([1, 2, 3], [5, 10, 2])).to.be.true
        expect(_.hasOverlap("asdf", "iuyta")).to.be.true
    });

    test('hasOverlap returns false if the 2 given arrays have no element in common', () => {
        expect(_.hasOverlap("rerg", "miik")).to.be.false
        expect(_.hasOverlap([1, 2, 3], [4, 5, 6])).to.be.false
        expect(_.hasOverlap([1, 2, 3], [])).to.be.false
    });     
}

module.exports = _;