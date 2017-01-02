"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
// ensure environment knows testing is occurring
process.env.mocha = true;
// Store original process.argv
const oldProcArgs = Object.assign({}, process.argv);
const chai_1 = require("chai");
/************************************ IMPORT FILE TO BE TESTED ************************************/
const hash_credentials_1 = require("./hash-credentials");
/********************************************* TESTS **********************************************/
describe('generateHash', function () {
    it('exists', function () {
        chai_1.expect(hash_credentials_1.generateHash).to.exist;
    });
    it('builds a long, randomly-salted argon2 hash from a plain string', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const testHash = yield hash_credentials_1.generateHash('my_dumb_password');
            chai_1.expect(testHash).to.be.a('string');
            chai_1.expect(testHash).to.have.length(127);
            console.log(testHash);
        });
    });
});
describe('verifyPassVsHash', function () {
    let testHash;
    before(() => __awaiter(this, void 0, void 0, function* () {
        testHash = yield hash_credentials_1.generateHash('test123password');
    }));
    it('exists', function () {
        chai_1.expect(hash_credentials_1.verifyPassVsHash).to.exist;
    });
    it('returns true if given a string (password) and its matching hash', function () {
        return __awaiter(this, void 0, void 0, function* () {
            chai_1.expect(yield hash_credentials_1.verifyPassVsHash('test123password', testHash)).to.be.true;
        });
    });
    it('returns false if given a string (password) and a non-matching hash', function () {
        return __awaiter(this, void 0, void 0, function* () {
            chai_1.expect(yield hash_credentials_1.verifyPassVsHash('_anotherTestPassword_', testHash)).to.be.false;
        });
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
describe('toBase64', function () {
    it('exists', function () {
        chai_1.expect(hash_credentials_1.toBase64).to.exist;
    });
    it('returns a base64 encoded version of the passed-in string', function () {
        chai_1.expect(hash_credentials_1.toBase64(testString1)).to.not.equal(testString1);
        chai_1.expect(hash_credentials_1.toBase64(testString1)).to.have.lengthOf(computeExpectedBase64Len(testString1));
        chai_1.expect(hash_credentials_1.toBase64(testString2)).to.have.lengthOf(computeExpectedBase64Len(testString2));
        chai_1.expect(hash_credentials_1.toBase64(testString3)).to.have.lengthOf(computeExpectedBase64Len(testString3));
        chai_1.expect(hash_credentials_1.toBase64(testString4)).to.have.lengthOf(computeExpectedBase64Len(testString4));
        chai_1.expect(hash_credentials_1.toBase64(testString5)).to.have.lengthOf(computeExpectedBase64Len(testString5));
        chai_1.expect(hash_credentials_1.toBase64(testString6)).to.have.lengthOf(computeExpectedBase64Len(testString6));
        chai_1.expect(hash_credentials_1.toBase64(testString7)).to.have.lengthOf(computeExpectedBase64Len(testString7));
        chai_1.expect(hash_credentials_1.toBase64(testString8)).to.have.lengthOf(computeExpectedBase64Len(testString8));
        chai_1.expect(hash_credentials_1.toBase64(testString9)).to.not.equal(testString9);
        chai_1.expect(hash_credentials_1.toBase64(testString9)).to.have.lengthOf(computeExpectedBase64Len(testString9));
    });
});
describe('toBase64url', function () {
    it('exists', function () {
        chai_1.expect(hash_credentials_1.toBase64url).to.exist;
    });
    it('returns a base64url encoded version of the passed-in string', function () {
        chai_1.expect(isBase64urlInLenRange(testString1, hash_credentials_1.toBase64url(testString1))).to.be.true;
        chai_1.expect(isBase64urlInLenRange(testString2, hash_credentials_1.toBase64url(testString2))).to.be.true;
        chai_1.expect(isBase64urlInLenRange(testString3, hash_credentials_1.toBase64url(testString3))).to.be.true;
        chai_1.expect(isBase64urlInLenRange(testString4, hash_credentials_1.toBase64url(testString4))).to.be.true;
        chai_1.expect(isBase64urlInLenRange(testString5, hash_credentials_1.toBase64url(testString5))).to.be.true;
        chai_1.expect(isBase64urlInLenRange(testString6, hash_credentials_1.toBase64url(testString6))).to.be.true;
        chai_1.expect(isBase64urlInLenRange(testString7, hash_credentials_1.toBase64url(testString7))).to.be.true;
        chai_1.expect(isBase64urlInLenRange(testString8, hash_credentials_1.toBase64url(testString8))).to.be.true;
        chai_1.expect(isBase64urlInLenRange(testString9, hash_credentials_1.toBase64url(testString9))).to.be.true;
    });
});
process.argv = Object.assign({}, oldProcArgs); // Restore original process.argv
function computeExpectedBase64Len(str) {
    return ((Math.floor((str.length - 1) / 3) * 4) + 4);
}
function isBase64urlInLenRange(str, base64UrlStr) {
    const base64Len = computeExpectedBase64Len(str);
    if (!(base64Len >= base64UrlStr.length))
        return false;
    if (base64Len - 2 > base64UrlStr.length)
        return false;
    return true;
}
//# sourceMappingURL=hash-credentials.spec.js.map