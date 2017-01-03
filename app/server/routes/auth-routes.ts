//************************************** THIRD-PARTY MODULES **************************************/
import * as express from 'express';
import * as bodyParser from 'body-parser';

// IMPORT FLASHES ON SESSINO LOGIN SUCCESS
const connectFlash = require('connect-flash');

import { inspect } from 'util';
import { _ } from '../../../shared/lodash-mixins';
import * as jwt from 'jsonwebtoken';

//*************************************** PROJECT MODULES *****************************************/
import { LoginError } from '../../../shared/error-objects';
import { buildJwt, verifyPassVsHash } from '../services/hash-credentials';
import { UserModel } from '../models/user-model';
import { generateToken, setUserInfo, passportWJwtAndLocal } from '../services/authentication';

import { expressRequestExtended } from '../express-typedef';
import { config } from '../../../config/config';
import { verifyAuthToken } from '../middlewares/middlewares';

/******************************************** LOGGING *********************************************/
import { buildFileTag } from 'mad-logs';
import * as colors from 'colors';
const TAG = buildFileTag('auth-routes.ts', colors.bgMagenta.white);


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
        `Password does not match username`, `auth-routes.ts`, username
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

const handleAuthFail = (e: LoginError, res: express.Response) => {
    e.message = (e.message ? (e.message + '\n') : '') + `${TAG} handleLoginReq : login failed.`;
    console.error(`${TAG} handleLoginReq: Error: `, e.summary ? e.summary : e);
    console.error('Login failed');
    return res.redirect('/');
}


/**************************************** ROUTE FUNCTIONS *****************************************/
/**
 * Handles POST to /auth/login
 */
const handleLoginReq = async (req: expressRequestExtended, res: express.Response): Promise<{}> => {
    console.log(`${TAG} handleLoginReq: req.body:`, inspect(req.body));
    const { username, password, admin } = req.body;
    // res.status(200).json({ token: 'JWT ' + generateToken(userInfo), user: setUserInfo(req.user) });

    try {
        const user = await UserModel.findOne({ username });
        console.log(`${TAG} handleLoginReq: found user:`, user);

        const isMatch = await verifyPassVsHash(password, user.pHash, true);
        console.log(`${TAG} handleLoginReq: isMatch?:`, isMatch);

        if (!isMatch) return handlePasswordMismatch(res, username);
        return handleAuthSuccess(res, user);

    } catch(e) {
        handleAuthFail(e, res);
    }
};

/**
 * Test route to ensure auth is working
 */
const authedTest = (req: expressRequestExtended, res: express.Response): void => {
    console.log('USER IS AUTHENTICATED!');
    res.json({ result: 'you are authenticated!', 'huh?': 'just letting you know :)' });
};

const loginRoute = (req: expressRequestExtended, res: express.Response): void => {
    res.json({ ping: 'pong', msg: 'POST to this route to log in.' });
};


//******************************************** ROUTES *********************************************/
app
    .get('/login', loginRoute)
    .post('/login', handleLoginReq);

app
    .use(verifyAuthToken)
    .get('/must_be_authed',
          // verifyAuthToken,
          // passportWJwtAndLocal.authenticate('jwt', { session: false }),
          authedTest
    );

/**
 * @EXPORT authRouter
 */
export { app as authRouter }
