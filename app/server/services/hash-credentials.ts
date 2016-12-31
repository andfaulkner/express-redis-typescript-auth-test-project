//************************************** THIRD-PARTY MODULES **************************************/
import { inspect } from 'util';
import * as path from 'path';
import * as fs from 'fs';

import * as express from 'express';
import * as argon2 from 'argon2';
import * as CryptoJS from 'crypto-js';

/**************************************** PROJECT MODULES *****************************************/
import { _ } from '../../../shared/lodash-mixins';
import { HashGenerationError } from '../../../shared/error-objects';

const hashInfo = '$argon2d$v=19$m=4096,t=3,p=1$';

/******************************************** HELPERS *********************************************/
function insertAt(arr, idx, item) {
    const newArr = arr;
    newArr.splice(idx, 0, item);
    return newArr;
}

function injectRandom(hash: string, insertPosition: number): string {
    return _.insertAt(hash, insertPosition, _.randomAlphanumeric()) as string;
}

function extractChar(hash: string, extractPosition: number): string {
    const hashArr = hash.split('');
    hashArr.splice(extractPosition, 1);
    return hashArr.join('');
}

async function stabilizeHash(hash: string, prependHashInfo: boolean = false) {
    return ((prependHashInfo) ? hashInfo : '') + extractChar(extractChar(hash, 16), 12);
}

/******************************************** EXPORTS *********************************************/
export const buildWonkyHash = async (str: string) => {
    let salt = new Buffer('');

    try {
        salt = await argon2.generateSalt(30);
        const hash = await argon2.hash(str, salt, { argon2d: true });
        return injectRandom(injectRandom(hash, 12), 16);

    } catch (e) {
        const err = new HashGenerationError(
            `Failed to generate hash. ${e.name} :: ${e.message}`,
            'hash-credentials.ts', str, 'argon2', salt ? salt : '[no salt generated]');
        throw err;
    }
};



type VerifyPassVsHashFunc = (pass: string, hash: string, prependInfo?: boolean) => Promise<boolean>;

/**
 * Verify that the result of running the given string (password) through the
 * hash algorithm matches the given hash
 * @param  {string}           pass - string to run through the hash algorithm
 * @param  {string}           hash - hash to compare against
 * @return {Promise<boolean>} resolves to true if the hash of the given string
 *                            matches the given hash. Otherwise resolves false.
 */
export const verifyPassVsHash: VerifyPassVsHashFunc = async (pass, hash, prependInfo = false) => {
    const stabilizedHash = await stabilizeHash(hash);

    if (await argon2.verify(stabilizedHash, pass)) {
        console.log('login success!');
        return true;
    }

    console.log('login failed :(');
    return false;
};

/**
 * Convert a string to base64url format.
 * @param {string} str - string to convert to base64url format
 * @return {string} base64url version of the inputted string
 */
export const toBase64url = (source: string) => {
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
export const toBase64 = (str: string) => {
    return new Buffer(str).toString('base64');
};
