#!/usr/bin/env node
const inspect = require('util').inspect;
const _ = require('lodash');
const {expect} = require('chai');

_.mixin({
    puts: (str) => {
        console.log(`str: ${str}`);
        return str;
    },
    secondLast: (coll) => coll[coll.length - 2],
    thirdLast: (coll) => coll[coll.length - 3],
    fourthLast: (coll) => coll[coll.length - 4],
    fifthLast: (coll) => coll[coll.length - 5],
    second: (coll) => coll[1],
    third: (coll) => coll[2],
    fourth: (coll) => coll[3],
    fifth: (coll) => coll[4],
    hasOverlap: (coll1, coll2) => _.some(coll1, (item) => _.includes(coll2, item)),
    any: _.some
});

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
