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
function stabilizeHash(hash, prependHashInfo = false) {
    return __awaiter(this, void 0, void 0, function* () {
        return ((prependHashInfo) ? hashInfo : '') + extractChar(extractChar(hash, 16), 12);
    });
}
/******************************************** EXPORTS *********************************************/
exports.buildWonkyHash = (str) => __awaiter(this, void 0, void 0, function* () {
    let salt = new Buffer('');
    try {
        salt = yield argon2.generateSalt(30);
        const hash = yield argon2.hash(str, salt, { argon2d: true });
        return injectRandom(injectRandom(hash, 12), 16);
    }
    catch (e) {
        const err = new error_objects_1.HashGenerationError(`Failed to generate hash. ${e.name} :: ${e.message}`, 'hash-credentials.ts', str, 'argon2', salt ? salt : '[no salt generated]');
        throw err;
    }
});
/**
 * Verify that the result of running the given string (password) through the
 * hash algorithm matches the given hash
 * @param  {string}           pass - string to run through the hash algorithm
 * @param  {string}           hash - hash to compare against
 * @return {Promise<boolean>} resolves to true if the hash of the given string
 *                            matches the given hash. Otherwise resolves false.
 */
exports.verifyPassVsHash = (pass, hash, prependInfo = false) => __awaiter(this, void 0, void 0, function* () {
    const stabilizedHash = yield stabilizeHash(hash);
    if (yield argon2.verify(stabilizedHash, pass)) {
        console.log('login success!');
        return true;
    }
    console.log('login failed :(');
    return false;
});
/**
 * Convert a string to base64url format.
 * @param {string} str - string to convert to base64url format
 * @return {string} base64url version of the inputted string
 */
exports.toBase64url = (source) => {
    // Encode in classical base64
    let encodedSource = new Buffer(source).toString('base64');
    // Remove padding equal characters, then replace chars according to base64url specs
    encodedSource = encodedSource.replace(/=+$/, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    return encodedSource;
};
/**
 * Convert a string to base64 format.
 * @param {string} str - string to convert to base64 format
 * @return {string} base64 version of the inputted string
 */
exports.toBase64 = (str) => {
    return new Buffer(str).toString('base64');
};
//# sourceMappingURL=hash-credentials.js.map