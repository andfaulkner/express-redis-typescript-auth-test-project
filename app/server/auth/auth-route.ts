//************************************** THIRD-PARTY MODULES **************************************/
import * as express from 'express';
import * as bodyParser from 'body-parser';

// IMPORT FLASHES ON SESSINO LOGIN SUCCESS
const connectFlash = require('connect-flash');

import { inspect } from 'util';
import * as _ from 'lodash';

//*************************************** PROJECT MODULES *****************************************/
import { LoginFailedError } from '../../../shared/error-objects';
import { buildJwt, verifyPassVsHash } from '../services/hash-credentials';
import { UserMock } from '../models/user-mock';
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

/******************************************* USER MOCKS *******************************************/
const userMock: UserProps = {
    username: 'test',
    password: '123', 
    admin: false
};
type TokenData = { token: string, salt: string };
const userMockTokenData = (async (): Promise<TokenData> => await buildJwt(userMock))();


//******************************************* HELPERS *********************************************/
const handleLoginReq = async (req: expressRequestExtended<UserProps>, res: express.Response) => {
    // console.log(inspect(req, false, 10, true));
    // console.log(inspect(req.body, false, 10, true));
    // let userInfo = setUserInfo(req.user);

    // res.status(200).json({ token: 'JWT ' + generateToken(userInfo), user: userInfo });

    const { username, password, admin } = req.body;
    console.log(`${TAG} handleLoginReq: req.body:`, inspect(req.body));
    console.log(`${TAG} handleLoginReq: username:`, username, `\n${TAG} password:`, password);

    try {
        const user = await UserMock.findOne({ username });
        console.log(`${TAG} handleLoginReq: found user:`, user);

        const isMatch = await verifyPassVsHash(password, user.id, true);
        console.log(`${TAG} handleLoginReq: isMatch?:`, isMatch);

        if (!isMatch) {
            const loginFailed = new LoginFailedError(
                `Password does not match username`, `auth-route.ts`, username);
            console.error(loginFailed);
            return res.json(loginFailed);
        }

        return res.json({ success: 'win! User exists!', username });

    } catch(e) {
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
