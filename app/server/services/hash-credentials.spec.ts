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
import { buildWonkyHash, verifyPassVsHash } from './hash-credentials';

/********************************************* TESTS **********************************************/
describe('buildWonkyHash', function() {
    it('exists', function() {
        expect(buildWonkyHash).to.exist;
    });

    it('builds a long, randomly-salted argon2 hash from a plain string', async function() {
        const myHash = await buildWonkyHash('my_dumb_password');
        console.log(myHash.length);
        expect(myHash).to.be.a('string');
        expect(myHash).to.have.length(86);
    });
});

describe('verifyPassVsHash', function() {
    let testHash;
    before(async () => {
        testHash = await buildWonkyHash('test123password');
    });

    it('exists', function() {
        expect(verifyPassVsHash).to.exist;
    });

    it('returns true if given a string (password) and its matching hash', async function() {
        expect(await verifyPassVsHash('test123password', testHash)).to.be.true;
    });

    it('returns false if given a string (password) and a non-matching hash', async function() {
        expect(await verifyPassVsHash('_anotherTestPassword_', testHash)).to.be.false;
    });
});

process.argv = Object.assign({}, oldProcArgs); // Restore original process.argv
