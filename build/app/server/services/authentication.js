"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const util_1 = require("util");
const jsonwebtoken = require("jsonwebtoken");
const passport = require("passport");
exports.passportWJwtAndLocal = passport;
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const user_model_1 = require("../models/user-model");
const config_1 = require("../../../config/config");
/******************************************** LOGGING *********************************************/
const mad_logs_1 = require("mad-logs");
const colors = require("colors");
const TAG = mad_logs_1.buildFileTag('authentication.ts', colors.bgWhite.black);
/**************************************** AUTH STRATEGIES *****************************************/
/**
 * Create local login strategy
 *
 * TODO create real local login strategy: this must be promisified, hashed, & shouldn't be 'local'
 */
const localLogin = new passport_local_1.Strategy({}, function (username, password, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.UserModel.findOne({ username });
            const isMatch = yield user.comparePassword(password);
            next(null, user);
        }
        catch (e) {
            e.message = e.message + `\n ${TAG} localLogin failed: login details couldn't be verified`;
            return next(e);
        }
    });
});
/**
 * Set up options to be used with JSON Web Token authentication strategy
 */
const jwtOptions = {
    // check authorization headers for JWT
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeader(),
    secretOrKey: config_1.config.auth.token.secret,
};
/**
 * Create JSON Web Token (JWT) authentication strategy.
 * Searches all users for the given username, then returns all user data
 */
const jwtLogin = new passport_jwt_1.Strategy(jwtOptions, function (payload, done) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`${TAG} jwtLogin:: payload:: `, util_1.inspect(payload, true, 10, true));
        try {
            const user = user_model_1.UserModel.findOne({ username: payload.username });
            return done(null, user);
        }
        catch (e) {
            console.error(`${TAG}: jwtLogin: Error: `, e.summary);
            return done(e);
        }
    });
});
/*********************************** GLUE STRATEGY TO PASSPORT ************************************/
passport.use(jwtLogin);
passport.use(localLogin);
/******************************************** HELPERS *********************************************/
/**
 * Generate a JSON web token from the user object passed in
 */
function generateToken(user) {
    return jsonwebtoken.sign(user, config_1.config.auth.token.secret, {
        expiresIn: 1000,
    });
}
exports.generateToken = generateToken;
/**
 * Selects user info we want to pass into the JSON web token (from the request object)
 */
function setUserInfo(request) {
    return {
        _id: request._id,
        firstName: request.profile.firstName,
        lastName: request.profile.lastName,
        email: request.email,
        role: request.role,
    };
}
exports.setUserInfo = setUserInfo;
//# sourceMappingURL=authentication.js.map