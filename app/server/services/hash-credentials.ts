//************************************** THIRD-PARTY MODULES **************************************/
import { inspect } from 'util';
import * as path from 'path';
import * as fs from 'fs';

import * as express from 'express';
import * as argon2 from 'argon2';

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

async function stabilizeHash(hash: string) {
    return hashInfo + extractChar(extractChar(hash, 16), 5);
}

/******************************************** EXPORTS *********************************************/
export const buildWonkyHash = async (str: string) => {
    let salt = new Buffer('');

    try {
        salt = await argon2.generateSalt(30);
        const hash = await argon2.hash(str, salt, { argon2d: true });
        const rawHash: string = _.last(hash.split(hashInfo))
        return injectRandom(injectRandom(rawHash, 5), 16);

    } catch (e) {
        const err = new HashGenerationError(
            `Failed to generate hash. ${e.name} :: ${e.message}`,
            'hash-credentials.ts', str, 'argon2', salt ? salt : '[no salt generated]');
        throw err;
    }
};

export const verifyPassVsHash = async (pass: string, storedHash: string) => {
    const stabilizedHash = await stabilizeHash(storedHash);

    if (await argon2.verify(stabilizedHash, pass)) {
        console.log('login success!');
        return 'TODO login token or something here';
    }

    console.log('login failed :(');
    return 'login failed - TODO set up redirect or something';
};
