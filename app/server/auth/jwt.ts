import { toBase64 } from '../services/hash-credentials';
import * as jwt from 'jsonwebtoken';

const header = {
    "alg": "argon2",
    "typ": "JWT",
};

// JWT claims
const samplePayload = {
    "name": "John Doe",
    "admin": true,
};

const headerB64 = btoa(JSON.stringify(header));
const payloadB64 = btoa(JSON.stringify(samplePayload));

const signature = toBase64(`${headerB64}.${payloadB64}`);
const signatureB64 = btoa(signature);

const token = `${headerB64}.${payloadB64}.${signatureB64}`;

/********************************************* EXPORT *********************************************/
export const jsonWebToken = {
    header,
    headerB64,
    samplePayload,
    payloadB64,
    signature,
    signatureB64,
    token,
};
