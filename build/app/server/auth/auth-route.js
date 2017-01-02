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
//*************************************** PROJECT MODULES *****************************************/
const error_objects_1 = require("../../../shared/error-objects");
const hash_credentials_1 = require("../services/hash-credentials");
const user_mock_1 = require("../models/user-mock");
const authentication_1 = require("../services/authentication");
/******************************************** LOGGING *********************************************/
const mad_logs_1 = require("mad-logs");
const colors = require("colors");
const TAG = mad_logs_1.buildFileTag('auth-route.ts', colors.bgMagenta.white);
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
/******************************************* USER MOCKS *******************************************/
const userMock = {
    username: 'test',
    password: '123',
    admin: false
};
const userMockTokenData = (() => __awaiter(this, void 0, void 0, function* () { return yield hash_credentials_1.buildJwt(userMock); }))();
//******************************************* HELPERS *********************************************/
const handleLoginReq = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // console.log(inspect(req, false, 10, true));
    // console.log(inspect(req.body, false, 10, true));
    // let userInfo = setUserInfo(req.user);
    // res.status(200).json({ token: 'JWT ' + generateToken(userInfo), user: userInfo });
    const { username, password, admin } = req.body;
    console.log(`${TAG} handleLoginReq: req.body:`, util_1.inspect(req.body));
    console.log(`${TAG} handleLoginReq: username:`, username, `\n${TAG} password:`, password);
    try {
        const user = yield user_mock_1.UserMock.findOne({ username });
        console.log(`${TAG} handleLoginReq: found user:`, user);
        const isMatch = yield hash_credentials_1.verifyPassVsHash(password, user.id, true);
        console.log(`${TAG} handleLoginReq: isMatch?:`, isMatch);
        if (!isMatch) {
            const loginFailed = new error_objects_1.LoginFailedError(`Password does not match username`, `auth-route.ts`, username);
            console.error(loginFailed);
            return res.json(loginFailed);
        }
        return res.json({ success: 'win! User exists!', username });
    }
    catch (e) {
        console.error(`${TAG} handleLoginReq: Error: `, e.summary ? e.summary : e);
        res.redirect('/');
    }
    // req.flash('info', 'Hi there!')
    // const newToken = await buildJwt(userData);
    // console.log(newToken);
    // const storedToken = await userMockTokenData;
    // console.log('\n\nstoredToken'); console.log(storedToken);
    // if (newToken.token === storedToken.token) {
    //     console.log('logged in successfully');
    //     res.json({ loginSuccessful: 'true', token: 'TODO' });
    // } else {
    //     console.log('failed to log in');
    //     res.redirect('/');
    // }
});
const authedTest = (req, res) => {
    console.log('USER IS AUTHENTICATED!');
    res.json({ result: 'you are authenticated!', 'huh?': 'just letting you know :)' });
};
//******************************************** ROUTES *********************************************/
app
    .get('/login', (req, res) => {
    res.json({ ping: 'pong', msg: 'please POST to this route only' });
})
    .post('/login', handleLoginReq)
    .post('/must_be_authed', authentication_1.passportWJwtAndLocal.authenticate('jwt', { session: false }), authedTest);
//# sourceMappingURL=auth-route.js.map