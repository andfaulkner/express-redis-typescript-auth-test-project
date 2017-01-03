// ensure environment knows testing is occurring
process.env.mocha = true;

// Store original process.argv
const oldProcArgs = Object.assign({}, process.argv);

/************************************** THIRD-PARTY IMPORTS ***************************************/
// Testing modules
import 'mocha';
import * as sinon from 'sinon';
import { expect } from 'chai';

// Utility modules
import * as fs from 'fs';
import * as path from 'path';
import { inspect } from 'util';

/************************************ IMPORT FILE TO BE TESTED ************************************/
import { _ } from './lodash-mixins';
const { assignClone, flattenObjectOnce, secondLast, thirdLast,
        fourthLast, fifthLast, second, third, fourth, fifth } = _;

/********************************************* TESTS **********************************************/
describe('assignClone', function() {
    it('exists', function() {
        expect(assignClone).to.exist;
    });
    
    it('returns a new merged object from 2 other objects', function() {
        expect({ a: 1, b: 2, c: 3 }).to.eql(assignClone({ a: 1 }, { b: 2 }, { c: 3 }));
    });
});

describe('flattenObjectOnce', function() {
    it('exists', function() {
        expect(flattenObjectOnce).to.exist;
    });

});

describe('secondLast', function() {
    it('exists', function() {
        expect(secondLast).to.exist;
    });
    it('returns second last item from an array', function() {
        expect(secondLast([0, 1, 2, 3, 'asdf', 'ok'])).to.eql('asdf');
        expect(secondLast(['0', 1])).to.eql('0');
        expect(secondLast(['oooo'])).to.eql(null);
    });
});

describe('thirdLast', function() {
    it('exists', function() {
        expect(thirdLast).to.exist;
    });
    it('returns third last item from an array', function() {
        expect(thirdLast([0, 1, 2, 3, 'asdf', 'ok'])).to.eql(3);
        expect(thirdLast(['0', 1])).to.eql(null);
        expect(thirdLast(['yay muffins', 'gr', 'arg', false, 10])).to.eql('arg');
    });
});

describe('fourthLast', function() {
    it('exists', function() {
        expect(fourthLast).to.exist;
    });
    it('returns fourth last item from an array', function() {
        expect(fourthLast([0, 1, 2, 3, 'asdf', 'ok'])).to.eql(2);
        expect(fourthLast(['0', 1])).to.eql(null);
        expect(fourthLast(['yay muffins', 'gr', 'arg', false, 10])).to.eql('gr');
    });
});

describe('fifthLast', function() {
    it('exists', function() {
        expect(fifthLast).to.exist;
    });
    it('returns fifth last item from an array', function() {
        expect(fifthLast([0, 1, 2, 3, 'asdf', 'ok'])).to.eql(1);
        expect(fifthLast(['0', 1])).to.eql(null);
        expect(fifthLast(['yay muffins', 'gr', 'arg', false, 10])).to.eql('yay muffins');
    });
});

describe('second', function() {
    it('exists', function() {
        expect(second).to.exist;
    });
    it('returns second item from an array', function() {
        expect(second([0, 1, 2, 3, 'asdf', 'ok'])).to.eql(1);
        expect(second(['0', 1])).to.eql(1);
        expect(second(['yay muffins', 'gr', 'arg', false, 10])).to.eql('gr');
    });
});

describe('third', function() {
    it('exists', function() {
        expect(third).to.exist;
    });
    it('returns third item from an array', function() {
        expect(third([0, 1, 2, 3, 'asdf', 'ok'])).to.eql(2);
        expect(third(['0', 1])).to.eql(null);
        expect(third(['yay muffins', 'gr', 'arg', false, 10])).to.eql('arg');
    });
});

describe('fourth', function() {
    it('exists', function() {
        expect(fourth).to.exist;
    });
    it('returns fourth item from an array', function() {
        expect(fourth([0, 1, 2, 3, 'asdf', 'ok'])).to.eql(3);
        expect(fourth(['0', 1])).to.eql(null);
        expect(fourth(['yay muffins', 'gr', 'arg', false, 10])).to.eql(false);
        expect(fourth(['uno', 'dos', 'tres', 'quatro', 'cinco'])).to.eql('quatro');
    });
});

describe('fifth', function() {
    it('exists', function() {
        expect(fifth).to.exist;
    });
    it('returns fifth item from an array', function() {
        expect(fifth([0, 1, 2, 3, 'asdf', 'ok'])).to.eql('asdf');
        expect(fifth(['0', 1])).to.eql(null);
        expect(fifth(['yay muffins', 'gr', 'arg', false, 10])).to.eql(10);
        expect(fifth(['uno', 'dos', 'tres', 'quatro', 'cinco'])).to.eql('cinco');
    });
});


// Restore original process.argv
process.argv = Object.assign({}, oldProcArgs);
