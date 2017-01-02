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
const detect_node_1 = require("detect-node");
const error_objects_1 = require("../../../shared/error-objects");
/******************************************** LOGGING *********************************************/
const mad_logs_1 = require("mad-logs");
const colors = require("colors");
const TAG = mad_logs_1.buildFileTag('hash-credentials.ts', colors.bgCyan.black);
const hashInfo = '$argon2d$v=19$m=4096,t=3,p=1$';
var btoa = btoa || toBase64url;
/******************************************** HELPERS *********************************************/
function insertAt(arr, idx, item) {
    const newArr = arr;
    newArr.splice(idx, 0, item);
    return newArr;
}
function stabilizeHash(hash, prependHashInfo = false) {
    return __awaiter(this, void 0, void 0, function* () {
        return ((prependHashInfo) ? hashInfo : '') + hash;
    });
}
/**
 * Convert a string to base64url format.
 * @param {string} str - string to convert to base64url format
 * @return {string} base64url version of the inputted string
 */
function toBase64url(source) {
    // Encode in classical base64
    let encodedSource = new Buffer(source).toString('base64');
    // Remove padding equal characters, then replace chars according to base64url specs
    encodedSource = encodedSource.replace(/=+$/, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    return encodedSource;
}
exports.toBase64url = toBase64url;
;
/**
 * Convert a string to base64 format.
 * @param {string} str - string to convert to base64 format
 * @return {string} base64 version of the inputted string
 */
function toBase64(str) {
    return new Buffer(str).toString('base64');
}
exports.toBase64 = toBase64;
;
/******************************************** EXPORTS *********************************************/
exports.generateHash = (str) => __awaiter(this, void 0, void 0, function* () {
    let salt = new Buffer('');
    try {
        salt = yield argon2.generateSalt(40);
        const rawHash = (yield argon2.hash(str, salt, { argon2d: true }));
        const outputHash = rawHash.split(hashInfo)[1];
        console.log(`${TAG} generateHash: outputHash  ::`, outputHash);
        return { hash: outputHash, salt: salt.toString() };
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
    const stabilizedHash = yield stabilizeHash(hash, prependInfo);
    if (yield argon2.verify(stabilizedHash, pass)) {
        console.log('login success!');
        return true;
    }
    console.log('login failed :(');
    return false;
});
/*********************************** BUILD JWT ************************************/
/***** JWT pt 1: header *****/
const header = {
    "typ": "JWT",
};
/***** JWT pt 2: payload (aka JWT 'claims') *****/
//  JUST A DEFAULT 
const samplePayload = {
    "username": "FAIL",
    "password": "DOUBLE_FAIL",
    "admin": true,
};
/***** JWT pt 3: signature *****/
function buildJwtPts(header, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataToBase64Ascii = (detect_node_1.isNode) ? toBase64url : btoa;
        const headerB64 = dataToBase64Ascii(JSON.stringify(header));
        const payloadB64 = dataToBase64Ascii(JSON.stringify(payload));
        const token = headerB64 + '.' + payloadB64;
        const { hash, salt } = yield exports.generateHash(`token`);
        const signatureB64 = dataToBase64Ascii(hash);
        return {
            headerB64,
            payloadB64,
            signatureB64,
            salt,
        };
    });
}
/**
 * Construct a JSON web token from the given payload data and provided header.
 * @param  {Object} payload - actual data in the jwt (username, password)
 * @param  {Object} sigHeader - usually just { typ: "JWT" }
 * @return {Promise<string>} constructed JSON web token
 */
exports.buildJwt = (payload, sigHeader = header) => __awaiter(this, void 0, void 0, function* () {
    const { headerB64, payloadB64, signatureB64, salt } = yield buildJwtPts(sigHeader, payload);
    /***** Construct actual JSON web token from 3 preceding parts *****/
    return { token: `${headerB64}.${payloadB64}.${signatureB64}`, salt };
});
// Steps:
//     1.  grab the content you're going to put in the JWT, along with the header
//     2.  convert the header to a base64Ascii format
//     3.  convert the content to a base64Ascii format
//     4.  concatenate the header and content strings, with a '.' separating the 2 parts
//             headerStringHere.contentStringHere
//     5.  randomly generate a 40 character salt
//     6.  run the argon2 hash algorithm on the generated salt and header+'.'+content string
//         *    a salt and header+.+content string are both required by argon2
//     7.  convert the resultant hash into base64Ascii format
//      
//# sourceMappingURL=hash-credentials.js.map