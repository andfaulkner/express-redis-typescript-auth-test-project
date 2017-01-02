//************************************** THIRD-PARTY MODULES **************************************/
import { inspect } from 'util';
import * as path from 'path';
import * as fs from 'fs';

import * as express from 'express';
import * as argon2 from 'argon2';
import * as CryptoJS from 'crypto-js';

import { isNode } from 'detect-node';

/**************************************** PROJECT MODULES *****************************************/
import { _ } from '../../../shared/lodash-mixins';
import { HashGenerationError } from '../../../shared/error-objects';

/******************************************** LOGGING *********************************************/
import { buildFileTag } from 'mad-logs';
import * as colors from 'colors';
const TAG = buildFileTag('hash-credentials.ts', colors.bgCyan.black);



const hashInfo = '$argon2d$v=19$m=4096,t=3,p=1$';

/**************************************** TYPE DEFINITIONS ****************************************/
type BuildJwtSigPtsRet = Promise<{
    headerB64: string, payloadB64: string, signatureB64: string, salt: string
}>

type BJSHeaderArg   = { typ: string }

var btoa = btoa || toBase64url;

interface Signature extends String {
    salt: Buffer
}

type VerifyPassVsHashFunc = (pass: string, hash: string, prependInfo?: boolean) => Promise<boolean>;

/******************************************** HELPERS *********************************************/
function insertAt(arr, idx, item) {
    const newArr = arr;
    newArr.splice(idx, 0, item);
    return newArr;
}

async function stabilizeHash(hash: string, prependHashInfo: boolean = false) {
    return ((prependHashInfo) ? hashInfo : '') + hash;
}

/**
 * Convert a string to base64url format.
 * @param {string} str - string to convert to base64url format
 * @return {string} base64url version of the inputted string
 */
export function toBase64url(source: string) {
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
export function toBase64(str: string) {
    return new Buffer(str).toString('base64');
};

/******************************************** EXPORTS *********************************************/
export const generateHash = async (str: string): Promise<{ hash: string, salt: string }> | never => {
    let salt: Buffer | string = new Buffer('');

    try {
        salt = await argon2.generateSalt(40);
        const rawHash = (await argon2.hash(str, salt, { argon2d: true })) as string;
        const outputHash = rawHash.split(hashInfo)[1];
        console.log(`${TAG} generateHash: outputHash  ::`, outputHash);

        return { hash: outputHash, salt: salt.toString() }

    } catch (e) {
        const err = new HashGenerationError(
            `Failed to generate hash. ${e.name} :: ${e.message}`,
            'hash-credentials.ts', str, 'argon2', salt ? salt : '[no salt generated]');
        throw err;
    }
};

/**
 * Verify that the result of running the given string (password) through the
 * hash algorithm matches the given hash
 * @param  {string}           pass - string to run through the hash algorithm
 * @param  {string}           hash - hash to compare against
 * @return {Promise<boolean>} resolves to true if the hash of the given string
 *                            matches the given hash. Otherwise resolves false.
 */
export const verifyPassVsHash: VerifyPassVsHashFunc = async (pass, hash, prependInfo = false) => {
    const stabilizedHash = await stabilizeHash(hash, prependInfo);

    if (await argon2.verify(stabilizedHash, pass)) {
        console.log('login success!');
        return true;
    }

    console.log('login failed :(');
    return false;
};


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
async function buildJwtPts(header: BJSHeaderArg, payload): BuildJwtSigPtsRet {
    const dataToBase64Ascii = (isNode) ? toBase64url : btoa;

    const headerB64    = dataToBase64Ascii(JSON.stringify(header));
    const payloadB64   = dataToBase64Ascii(JSON.stringify(payload));

    const token = headerB64 + '.' + payloadB64;

    const { hash, salt } = await generateHash(`token`);
    const signatureB64 = dataToBase64Ascii(hash);

    return {
        headerB64,
        payloadB64,
        signatureB64,
        salt,
    };
}

/**
 * Construct a JSON web token from the given payload data and provided header.
 * @param  {Object} payload - actual data in the jwt (username, password)
 * @param  {Object} sigHeader - usually just { typ: "JWT" }
 * @return {Promise<string>} constructed JSON web token
 */
export const buildJwt = async (payload, sigHeader = header): Promise<{ token: string, salt: string }> => {
    const { headerB64, payloadB64, signatureB64, salt } =
        await buildJwtPts(sigHeader, payload);

    /***** Construct actual JSON web token from 3 preceding parts *****/
    return { token: `${headerB64}.${payloadB64}.${signatureB64}`, salt };
}

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