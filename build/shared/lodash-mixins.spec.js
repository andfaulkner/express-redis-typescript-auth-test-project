"use strict";
// ensure environment knows testing is occurring
process.env.mocha = true;
// Store original process.argv
const oldProcArgs = Object.assign({}, process.argv);
/************************************** THIRD-PARTY IMPORTS ***************************************/
// Testing modules
require("mocha");
const chai_1 = require("chai");
/************************************ IMPORT FILE TO BE TESTED ************************************/
const lodash_mixins_1 = require("./lodash-mixins");
const { second, third, fourth, fifth, secondLast, thirdLast, fourthLast, fifthLast, hasOverlap, assignClone, flattenObjectOnce, randomAlphanumeric, randomAlphanumerics } = lodash_mixins_1._;
/********************************************* TESTS **********************************************/
describe('assignClone', function () {
    it('exists', function () {
        chai_1.expect(assignClone).to.exist;
    });
    it('returns a new merged object from 2 other objects', function () {
        chai_1.expect({ a: 1, b: 2, c: 3 }).to.eql(assignClone({ a: 1 }, { b: 2 }, { c: 3 }));
        // TODO more tests on this one
    });
});
describe('flattenObjectOnce', function () {
    it('exists', function () {
        chai_1.expect(flattenObjectOnce).to.exist;
    });
    // TODO more tests on this one
});
describe('hasOverlap', function () {
    it('exists', function () {
        chai_1.expect(hasOverlap).to.exist;
    });
    it('returns true if any item in the 1st array/string matches one in the 2nd', function () {
        chai_1.expect(hasOverlap([1, 2, 3], [6, 3])).to.be.true;
        chai_1.expect(hasOverlap('bee', 'spider')).to.be.true;
        chai_1.expect(hasOverlap('dude', 'sweet')).to.be.true;
        chai_1.expect(hasOverlap('sushi', ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'])).to.be.true;
    });
    it('returns false if no item in the 1st array/string matches any item in the 2nd.' +
        "Doesn't type coerce.", function () {
        chai_1.expect(hasOverlap('chicken', 'woof')).to.be.false;
        chai_1.expect(hasOverlap([7, 4, 1], [11, 32, 6])).to.be.false;
        chai_1.expect(hasOverlap(['a', '7', 'c'], [7, 'u', 'hrgea'])).to.be.false;
    });
});
describe('secondLast', function () {
    it('exists', function () {
        chai_1.expect(secondLast).to.exist;
    });
    it('returns second last item from an array', function () {
        chai_1.expect(secondLast([0, 1, 2, 3, 'asdf', 'ok'])).to.eql('asdf');
        chai_1.expect(secondLast(['0', 1])).to.eql('0');
        chai_1.expect(secondLast(['oooo'])).to.eql(null);
    });
});
describe('thirdLast', function () {
    it('exists', function () {
        chai_1.expect(thirdLast).to.exist;
    });
    it('returns third last item from an array', function () {
        chai_1.expect(thirdLast([0, 1, 2, 3, 'asdf', 'ok'])).to.eql(3);
        chai_1.expect(thirdLast(['0', 1])).to.eql(null);
        chai_1.expect(thirdLast(['yay muffins', 'gr', 'arg', false, 10])).to.eql('arg');
    });
});
describe('fourthLast', function () {
    it('exists', function () {
        chai_1.expect(fourthLast).to.exist;
    });
    it('returns fourth last item from an array', function () {
        chai_1.expect(fourthLast([0, 1, 2, 3, 'asdf', 'ok'])).to.eql(2);
        chai_1.expect(fourthLast(['0', 1])).to.eql(null);
        chai_1.expect(fourthLast(['yay muffins', 'gr', 'arg', false, 10])).to.eql('gr');
    });
});
describe('fifthLast', function () {
    it('exists', function () {
        chai_1.expect(fifthLast).to.exist;
    });
    it('returns fifth last item from an array', function () {
        chai_1.expect(fifthLast([0, 1, 2, 3, 'asdf', 'ok'])).to.eql(1);
        chai_1.expect(fifthLast(['0', 1])).to.eql(null);
        chai_1.expect(fifthLast(['yay muffins', 'gr', 'arg', false, 10])).to.eql('yay muffins');
    });
});
describe('second', function () {
    it('exists', function () {
        chai_1.expect(second).to.exist;
    });
    it('returns second item from an array', function () {
        chai_1.expect(second([0, 1, 2, 3, 'asdf', 'ok'])).to.eql(1);
        chai_1.expect(second(['0', 1])).to.eql(1);
        chai_1.expect(second(['yay muffins', 'gr', 'arg', false, 10])).to.eql('gr');
    });
});
describe('third', function () {
    it('exists', function () {
        chai_1.expect(third).to.exist;
    });
    it('returns third item from an array', function () {
        chai_1.expect(third([0, 1, 2, 3, 'asdf', 'ok'])).to.eql(2);
        chai_1.expect(third(['0', 1])).to.eql(null);
        chai_1.expect(third(['yay muffins', 'gr', 'arg', false, 10])).to.eql('arg');
    });
});
describe('fourth', function () {
    it('exists', function () {
        chai_1.expect(fourth).to.exist;
    });
    it('returns fourth item from an array', function () {
        chai_1.expect(fourth([0, 1, 2, 3, 'asdf', 'ok'])).to.eql(3);
        chai_1.expect(fourth(['0', 1])).to.eql(null);
        chai_1.expect(fourth(['yay muffins', 'gr', 'arg', false, 10])).to.eql(false);
        chai_1.expect(fourth(['uno', 'dos', 'tres', 'quatro', 'cinco'])).to.eql('quatro');
    });
});
describe('fifth', function () {
    it('exists', function () {
        chai_1.expect(fifth).to.exist;
    });
    it('returns fifth item from an array', function () {
        chai_1.expect(fifth([0, 1, 2, 3, 'asdf', 'ok'])).to.eql('asdf');
        chai_1.expect(fifth(['0', 1])).to.eql(null);
        chai_1.expect(fifth(['yay muffins', 'gr', 'arg', false, 10])).to.eql(10);
        chai_1.expect(fifth(['uno', 'dos', 'tres', 'quatro', 'cinco'])).to.eql('cinco');
    });
});
describe('randomAlphanumeric', function () {
    it('exists', function () {
        chai_1.expect(randomAlphanumeric).to.exist;
    });
    it('always returns only 1 char, which is always within a-z, A-Z, or 0-9', function () {
        lodash_mixins_1._.times(50, () => {
            const currentVal = randomAlphanumeric();
            chai_1.expect(currentVal).to.be.length(1);
            chai_1.expect(currentVal).to.match(/^[a-zA-Z0-9]$/);
            chai_1.expect(currentVal).to.not.match(/^[^a-zA-Z0-9]$/);
        });
    });
});
describe('randomAlphanumerics', function () {
    it('exists', function () {
        chai_1.expect(randomAlphanumerics).to.exist;
    });
    it('returns the requested number of characters', function () {
        chai_1.expect(randomAlphanumerics(0)).to.be.length(0);
        chai_1.expect(randomAlphanumerics(1)).to.be.length(1);
        chai_1.expect(randomAlphanumerics(5)).to.be.length(5);
        chai_1.expect(randomAlphanumerics(12)).to.be.length(12);
        chai_1.expect(randomAlphanumerics(40)).to.be.length(40);
    });
    it('only returns characters within a-z, A-Z, and 0-9', function () {
        lodash_mixins_1._.times(50, () => {
            const currentLength = Math.floor(Math.random() * 10);
            const currentVal = randomAlphanumerics(currentLength);
            chai_1.expect(currentVal).to.be.length(currentLength);
            chai_1.expect(currentVal).to.match(/^[a-zA-Z0-9]*$/);
            chai_1.expect(currentVal).to.not.match(/.*[^a-zA-Z0-9].*/);
        });
    });
});
// Restore original process.argv
process.argv = Object.assign({}, oldProcArgs);
//# sourceMappingURL=lodash-mixins.spec.js.map