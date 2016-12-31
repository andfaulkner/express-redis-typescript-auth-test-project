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
describe('buildWonkyHash', function () {
    it('exists', function () {
        chai_1.expect(hash_credentials_1.buildWonkyHash).to.exist;
    });
    it('builds a long, randomly-salted argon2 hash from a plain string', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const myHash = yield hash_credentials_1.buildWonkyHash('my_dumb_password');
            console.log(myHash.length);
            chai_1.expect(myHash).to.be.a('string');
            chai_1.expect(myHash).to.have.length(86);
        });
    });
});
describe('verifyPassVsHash', function () {
    let testHash;
    before(() => __awaiter(this, void 0, void 0, function* () {
        testHash = yield hash_credentials_1.buildWonkyHash('test123password');
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
process.argv = Object.assign({}, oldProcArgs); // Restore original process.argv
//# sourceMappingURL=hash-credentials.spec.js.map