import * as express from 'express';
import { inspect } from 'util';
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';

import * as argon2 from 'argon2';

import { HashGenerationError } from '../../../shared/error-objects';

const salt = new Buffer('somesalt');

export const hashString = async (str) => {
    try {
        const salt = await argon2.generateSalt(32);
        const hash = await argon2.hash(str, salt, {
            argon2d: true
            // raw: false, type: 'argon2id' //<<< using argon2id is essential: argon2i has a hole
        });
    } catch (e) {
        const err = new HashGenerationError(
            'Failed to generate hash. ${e.name} :: ${e.message}',
            'hash-credentials.ts', str, 'argon2', salt ? salt : '[no salt generated]');
        throw err;
    }
};
