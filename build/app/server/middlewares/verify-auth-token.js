"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const jsonwebtoken = require("jsonwebtoken");
//**************************************** PROJECT MODULES ****************************************/
const config_1 = require("../../../config/config");
/******************************************** LOGGING *********************************************/
const mad_logs_1 = require("mad-logs");
const colors = require("colors");
const TAG = mad_logs_1.buildFileTag('verify-auth-token.ts', colors.blue.bgWhite);
//******************************************* HELPERS *********************************************/
/**
 * Searches all the likely places on the express request object for tokens
 */
const findToken = (req) => {
    return req.body.token || req.query.token || req.headers['x-access-token'];
};
/**
 * Promisification of jwt.verify
 */
const verifyAsync = (token, secret) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, secret, function (error, decoded) {
            if (error)
                reject(error);
            resolve(decoded);
        });
    });
};
/******************************************* MIDDLEWARE *******************************************/
const verifyAuthToken = function verifyAuthToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = findToken(req);
        console.log(`${TAG} verifyAuthToken: token: ${token}`);
        if (token) {
            const decoded = yield verifyAsync(token, config_1.config.auth.token.secret);
            req.decoded = decoded;
            console.log(decoded);
            next();
        }
        else {
            return res.status(403).json({
                success: false,
                message: 'No token provided'
            });
        }
    });
};
exports.verifyAuthToken = verifyAuthToken;
//# sourceMappingURL=verify-auth-token.js.map