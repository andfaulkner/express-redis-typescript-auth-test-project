"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const argon2 = require("argon2");
/**************************************** PROJECT MODULES *****************************************/
const lodash_mixins_1 = require("../../../shared/lodash-mixins");
const error_objects_1 = require("../../../shared/error-objects");
const hashInfo = '$argon2d$v=19$m=4096,t=3,p=1$';
/******************************************** HELPERS *********************************************/
function insertAt(arr, idx, item) {
    const newArr = arr;
    newArr.splice(idx, 0, item);
    return newArr;
}
function injectRandom(hash, insertPosition) {
    return lodash_mixins_1._.insertAt(hash, insertPosition, lodash_mixins_1._.randomAlphanumeric());
}
function extractChar(hash, extractPosition) {
    const hashArr = hash.split('');
    hashArr.splice(extractPosition, 1);
    return hashArr.join('');
}
function stabilizeHash(hash) {
    return __awaiter(this, void 0, void 0, function* () {
        return hashInfo + extractChar(extractChar(hash, 16), 5);
    });
}
/******************************************** EXPORTS *********************************************/
exports.buildWonkyHash = (str) => __awaiter(this, void 0, void 0, function* () {
    let salt = new Buffer('');
    try {
        salt = yield argon2.generateSalt(30);
        const hash = yield argon2.hash(str, salt, { argon2d: true });
        const rawHash = lodash_mixins_1._.last(hash.split(hashInfo));
        return injectRandom(injectRandom(rawHash, 5), 16);
    }
    catch (e) {
        const err = new error_objects_1.HashGenerationError(`Failed to generate hash. ${e.name} :: ${e.message}`, 'hash-credentials.ts', str, 'argon2', salt ? salt : '[no salt generated]');
        throw err;
    }
});
exports.verifyPassVsHash = (pass, storedHash) => __awaiter(this, void 0, void 0, function* () {
    const stabilizedHash = yield stabilizeHash(storedHash);
    if (yield argon2.verify(stabilizedHash, pass)) {
        console.log('login success!');
        return 'TODO login token or something here';
    }
    console.log('login failed :(');
    return 'login failed - TODO set up redirect or something';
});
//# sourceMappingURL=hash-credentials.js.map