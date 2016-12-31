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
import { buildWonkyHash, verifyPassVsHash, toBase64, toBase64url } from './hash-credentials';

/********************************************* TESTS **********************************************/
describe('buildWonkyHash', function() {
    it('exists', function() {
        expect(buildWonkyHash).to.exist;
    });

    it('builds a long, randomly-salted argon2 hash from a plain string', async function() {
        const testHash = await buildWonkyHash('my_dumb_password');
        expect(testHash).to.be.a('string');
        expect(testHash).to.have.length(115);
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

const testString1 = '(';
const testString2 = '2m';
const testString3 = '(vr';
const testString4 = 'vI*(';
const testString5 = 'vI*(vh7';
const testString6 = 'vir4a@_8';
const testString7 = 'm1ic5o7z9a12';
const testString8 = `a long (but 'sane') length string to test base64 conversion against`;
const testString9 = `An insanely, unreasonably, excessively long string to further test ` +
                    `base64 conversion against, because catching all the edge cases ===` +
                    ` 'YAY PONIES!' ...or something. On that note, keyboard cat time! ` + 
                    `sfoiajw faoi iaeiuaw h4 p3ty3498g34iue fyw387o d788&YT&*T#Yfb`;

describe('toBase64', function() {
    it('exists', function() {
        expect(toBase64).to.exist;
    });

    it('returns a base64 encoded version of the passed-in string', function() {
        expect(toBase64(testString1)).to.not.equal(testString1);
        expect(toBase64(testString1)).to.have.lengthOf(computeExpectedBase64Len(testString1));
        expect(toBase64(testString2)).to.have.lengthOf(computeExpectedBase64Len(testString2));
        expect(toBase64(testString3)).to.have.lengthOf(computeExpectedBase64Len(testString3));
        expect(toBase64(testString4)).to.have.lengthOf(computeExpectedBase64Len(testString4));
        expect(toBase64(testString5)).to.have.lengthOf(computeExpectedBase64Len(testString5));
        expect(toBase64(testString6)).to.have.lengthOf(computeExpectedBase64Len(testString6));
        expect(toBase64(testString7)).to.have.lengthOf(computeExpectedBase64Len(testString7));
        expect(toBase64(testString8)).to.have.lengthOf(computeExpectedBase64Len(testString8));
        expect(toBase64(testString9)).to.not.equal(testString9);
        expect(toBase64(testString9)).to.have.lengthOf(computeExpectedBase64Len(testString9));
    });
});

describe('toBase64url', function() {
    it('exists', function() {
        expect(toBase64url).to.exist;
    });

    it('returns a base64url encoded version of the passed-in string', function() {
        expect(isBase64urlInLenRange(testString1, toBase64url(testString1))).to.be.true;
        expect(isBase64urlInLenRange(testString2, toBase64url(testString2))).to.be.true;
        expect(isBase64urlInLenRange(testString3, toBase64url(testString3))).to.be.true;
        expect(isBase64urlInLenRange(testString4, toBase64url(testString4))).to.be.true;
        expect(isBase64urlInLenRange(testString5, toBase64url(testString5))).to.be.true;
        expect(isBase64urlInLenRange(testString6, toBase64url(testString6))).to.be.true;
        expect(isBase64urlInLenRange(testString7, toBase64url(testString7))).to.be.true;
        expect(isBase64urlInLenRange(testString8, toBase64url(testString8))).to.be.true;
        expect(isBase64urlInLenRange(testString9, toBase64url(testString9))).to.be.true;
    });
});

process.argv = Object.assign({}, oldProcArgs); // Restore original process.argv

function computeExpectedBase64Len(str) {
    return ((Math.floor((str.length - 1) / 3) * 4) + 4);
}

function isBase64urlInLenRange(str, base64UrlStr) {
    const base64Len = computeExpectedBase64Len(str)
    if (!(base64Len >= base64UrlStr.length)) return false;
    if (base64Len - 2 > base64UrlStr.length) return false;
    return true;
}
