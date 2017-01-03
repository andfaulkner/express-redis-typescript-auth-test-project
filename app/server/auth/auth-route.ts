//************************************** THIRD-PARTY MODULES **************************************/
import * as express from 'express';
import * as bodyParser from 'body-parser';

// IMPORT FLASHES ON SESSINO LOGIN SUCCESS
const connectFlash = require('connect-flash');

import { inspect } from 'util';
import { _ } from '../../../shared/lodash-mixins';
import * as jwt from 'jsonwebtoken';

console.log(jwt);

//*************************************** PROJECT MODULES *****************************************/
import { LoginError, ILoginError } from '../../../shared/error-objects';
import { buildJwt, verifyPassVsHash } from '../services/hash-credentials';
import { UserModel } from '../models/user-model';
import { generateToken, setUserInfo, passportWJwtAndLocal } from '../services/authentication';

/******************************************** LOGGING *********************************************/
import { buildFileTag } from 'mad-logs';
import * as colors from 'colors';
const TAG = buildFileTag('auth-route.ts', colors.bgMagenta.white);

/********************************************* CONFIG *********************************************/
import { config } from '../../../config/config';

const secret = new Buffer(
    '__TEMPORARY_SHARED_SECRET__OOO_CATCATCATTIME__*($ngg89tgby78g345yhrh9089g45th88t__',
    'base64'
);

//*************************************** TYPE DEFINITIONS ****************************************/
interface expressRequestExtended<T> extends express.Request {
    body: T;
    user: {
        username: string;
        password: string;
    },
    flash(message: string): any;
    flash(event: string, message: string): any;
}

interface UserProps {
  username: string;
  password: string;
  admin?: boolean | string;
}

//******************************************* LOGGING *********************************************/
(inspect as any).defaultOptions = {
    showProxy: true,
    colors: true,
    showHidden: true,
    depth: 10,
    breakLength: 120,
}

//************************************** ATTACH MIDDLEWARES ***************************************/
let app: express.Router = express();

app
   // .use(connectFlash())
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: false }));

//******************************************* HELPERS *********************************************/
const handlePasswordMismatch = (res: express.Response, username: string) => {
    const loginFailed = new LoginError(
        `Password does not match username`, `auth-route.ts`, username
    );
    console.error(loginFailed.summary);
    return res.json(loginFailed);
};

/**
 * Handler for successful authentication. Send a token to the user along with a success message.
 * @param res - express response
 * @param user - the user model object
 */
const handleAuthSuccess = (res: express.Response, user: UserModel) => {
    console.log(`${TAG} handleAuthSuccess:: Auth succeeded for user: ${user.username}`);
    const token = jwt.sign(user, config.auth.token.secret, { expiresIn: config.auth.expiry });
    return res.status(200).json({
        success: true,
        message: 'win! User exists! Enjoy your token!',
        username: user.username,
        token
    });
};

const handleAuthFail = (e: ILoginError, res: express.Response) => {
    e.message = (e.message ? (e.message + '\n') : '') + `${TAG} handleLoginReq : login failed.`;
    console.error(`${TAG} handleLoginReq: Error: `, e.summary ? e.summary : e);
    console.log('Login failed');

    return res.redirect('/');
}


/**************************************** ROUTE FUNCTIONS *****************************************/
const handleLoginReq = async (req: expressRequestExtended<UserProps>, res: express.Response) => {
    // res.status(200).json({ token: 'JWT ' + generateToken(userInfo), user: setUserInfo(req.user) });

    const { username, password, admin } = req.body;
    console.log(`${TAG} handleLoginReq: req.body:`, inspect(req.body));

    try {
        const user = await UserModel.findOne({ username });
        console.log(`${TAG} handleLoginReq: found user:`, user);

        const isMatch = await verifyPassVsHash(password, user.pHash, true);
        console.log(`${TAG} handleLoginReq: isMatch?:`, isMatch);

        if (!isMatch) return handlePasswordMismatch(res, username);
        return handleAuthSuccess(res, user);

    } catch(e) {
        return handleAuthFail(e, res);
    }
};

const authedTest = (req: expressRequestExtended<{}>, res: express.Response): void => {
    console.log('USER IS AUTHENTICATED!');
    res.json({ result: 'you are authenticated!', 'huh?': 'just letting you know :)' });
};

//******************************************** ROUTES *********************************************/
app
    .get('/login', (req: expressRequestExtended<{}>, res: express.Response): void => {
        res.json({ ping: 'pong', msg: 'please POST to this route only' });
    })

    .post('/login', handleLoginReq)

    .post('/must_be_authed',
          passportWJwtAndLocal.authenticate('jwt', { session: false }),
          authedTest
    );

/**
 * @EXPORT authRouter
 */
export { app as authRouter }
