"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
//************************************** THIRD-PARTY MODULES **************************************/
const express = require("express");
const bodyParser = require("body-parser");
// IMPORT FLASHES ON SESSINO LOGIN SUCCESS
const connectFlash = require('connect-flash');
const util_1 = require("util");
const jwt = require("jsonwebtoken");
//*************************************** PROJECT MODULES *****************************************/
const error_objects_1 = require("../../../shared/error-objects");
const hash_credentials_1 = require("../services/hash-credentials");
const user_model_1 = require("../models/user-model");
const authentication_1 = require("../services/authentication");
/******************************************** LOGGING *********************************************/
const mad_logs_1 = require("mad-logs");
const colors = require("colors");
const TAG = mad_logs_1.buildFileTag('auth-routes.ts', colors.bgMagenta.white);
/********************************************* CONFIG *********************************************/
const config_1 = require("../../../config/config");
const secret = new Buffer('__TEMPORARY_SHARED_SECRET__OOO_CATCATCATTIME__*($ngg89tgby78g345yhrh9089g45th88t__', 'base64');
//******************************************* LOGGING *********************************************/
util_1.inspect.defaultOptions = {
    showProxy: true,
    colors: true,
    showHidden: true,
    depth: 10,
    breakLength: 120,
};
//************************************** ATTACH MIDDLEWARES ***************************************/
let app = express();
exports.authRouter = app;
app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }));
//******************************************* HELPERS *********************************************/
const handlePasswordMismatch = (res, username) => {
    const loginFailed = new error_objects_1.LoginError(`Password does not match username`, `auth-routes.ts`, username);
    console.error(loginFailed.summary);
    return res.json(loginFailed);
};
/**
 * Handler for successful authentication. Send a token to the user along with a success message.
 * @param res - express response
 * @param user - the user model object
 */
const handleAuthSuccess = (res, user) => {
    console.log(`${TAG} handleAuthSuccess:: Auth succeeded for user: ${user.username}`);
    const token = jwt.sign(user, config_1.config.auth.token.secret, { expiresIn: config_1.config.auth.expiry });
    return res.status(200).json({
        success: true,
        message: 'win! User exists! Enjoy your token!',
        username: user.username,
        token
    });
};
const handleAuthFail = (e, res) => {
    e.message = (e.message ? (e.message + '\n') : '') + `${TAG} handleLoginReq : login failed.`;
    console.error(`${TAG} handleLoginReq: Error: `, e.summary ? e.summary : e);
    console.error('Login failed');
    return res.redirect('/');
};
/**************************************** ROUTE FUNCTIONS *****************************************/
const handleLoginReq = (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`${TAG} handleLoginReq: req.body:`, util_1.inspect(req.body));
    const { username, password, admin } = req.body;
    // res.status(200).json({ token: 'JWT ' + generateToken(userInfo), user: setUserInfo(req.user) });
    try {
        const user = yield user_model_1.UserModel.findOne({ username });
        console.log(`${TAG} handleLoginReq: found user:`, user);
        const isMatch = yield hash_credentials_1.verifyPassVsHash(password, user.pHash, true);
        console.log(`${TAG} handleLoginReq: isMatch?:`, isMatch);
        if (!isMatch)
            return handlePasswordMismatch(res, username);
        return handleAuthSuccess(res, user);
    }
    catch (e) {
        handleAuthFail(e, res);
    }
});
const authedTest = (req, res) => {
    console.log('USER IS AUTHENTICATED!');
    res.json({ result: 'you are authenticated!', 'huh?': 'just letting you know :)' });
};
const loginRoute = (req, res) => {
    res.json({ ping: 'pong', msg: 'POST to this route to log in.' });
};
//******************************************** ROUTES *********************************************/
app
    .get('/login', loginRoute)
    .post('/login', handleLoginReq)
    .post('/must_be_authed', authentication_1.passportWJwtAndLocal.authenticate('jwt', { session: false }), authedTest);
//# sourceMappingURL=auth-route.js.map