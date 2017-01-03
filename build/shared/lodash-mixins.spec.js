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
const { assignClone, flattenObjectOnce, secondLast, thirdLast, fourthLast, fifthLast, second, third, fourth, fifth } = lodash_mixins_1._;
/********************************************* TESTS **********************************************/
describe('assignClone', function () {
    it('exists', function () {
        chai_1.expect(assignClone).to.exist;
    });
    it('returns a new merged object from 2 other objects', function () {
        chai_1.expect({ a: 1, b: 2, c: 3 }).to.eql(assignClone({ a: 1 }, { b: 2 }, { c: 3 }));
    });
});
describe('flattenObjectOnce', function () {
    it('exists', function () {
        chai_1.expect(flattenObjectOnce).to.exist;
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
// Restore original process.argv
process.argv = Object.assign({}, oldProcArgs);
//# sourceMappingURL=lodash-mixins.spec.js.map