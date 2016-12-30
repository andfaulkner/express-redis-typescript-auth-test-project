// ensure environment knows testing is occurring
process.env.mocha = true;

// Store original process.argv
const oldProcArgs = Object.assign({}, process.argv);

/************************************** THIRD-PARTY IMPORTS ***************************************/
// const sinon = require('sinon');
// const mocha = require('mocha');

// Test modules
import * as mocha from 'mocha';
import * as sinon from 'sinon';
import { inspect } from 'util';
import { expect } from 'chai';

// Utility modules
import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

/************************************ IMPORT FILE TO BE TESTED ************************************/
import { hashString } from './hash-credentials';

/********************************************* TESTS **********************************************/
describe('hashString', function() {
    it('exists', async function() {
        expect(true).to.equal(true);
        const myHash = await hashString('my_dumb_password');
        console.log(myHash);
    });
});

process.argv = Object.assign({}, oldProcArgs); // Restore original process.argv
