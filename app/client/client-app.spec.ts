// ensure environment knows testing is occurring
process.env.mocha = true;

// Store original process.argv
const oldProcArgs = Object.assign({}, process.argv);

/************************************** THIRD-PARTY IMPORTS ***************************************/
const { expect } = require('chai');
const sinon = require('sinon');
import 'mocha';

import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

/************************************ IMPORT FILE TO BE TESTED ************************************/
// const exportFromTestedFile = require('./');

/********************************************* TESTS **********************************************/
describe('client testing proof-of-concept', function() {
    it('ran a chai+mocha test on the client code', function() {
        expect(true).to.equal(true);
    });
});

// Restore original process.argv
process.argv = Object.assign({}, oldProcArgs);
