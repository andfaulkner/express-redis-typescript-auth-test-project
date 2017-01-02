"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const hash_credentials_1 = require("../services/hash-credentials");
const detect_node_1 = require("detect-node");
var btoa = btoa || hash_credentials_1.toBase64url;
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
        const dataToBase64Ascii = (detect_node_1.isNode) ? hash_credentials_1.toBase64url : btoa;
        const headerB64 = dataToBase64Ascii(JSON.stringify(header));
        const payloadB64 = dataToBase64Ascii(JSON.stringify(payload));
        const token = headerB64 + '.' + payloadB64;
        const signature = yield hash_credentials_1.buildSignature(`token`);
        const signatureB64 = dataToBase64Ascii(signature);
        return {
            headerB64,
            payloadB64,
            signatureB64,
            salt: signature.salt
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
//# sourceMappingURL=jwt.js.map