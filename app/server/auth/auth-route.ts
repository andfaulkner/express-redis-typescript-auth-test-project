//************************************** THIRD-PARTY MODULES **************************************/
import * as express from 'express';
import { inspect } from 'util';
import * as bodyParser from 'body-parser';

//*************************************** TYPE DEFINITIONS ****************************************/
interface expressRequestWithBody<T> extends express.Request {
    body: T;
}

interface LoginReq {
  username: string;
  password: string;
}

/******************************************** LOGGING *********************************************/
(inspect as any).defaultOptions = {
    showProxy: true,
    colors: true,
    showHidden: true,
    depth: 10,
    breakLength: 120,
}

/*************************************** ATTACH MIDDLEWARES ***************************************/
let app: express.Router = express();

app.use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: false }));

/********************************************* ROUTES *********************************************/
app
    .get('/login', (req: expressRequestWithBody<{}>, res: express.Response): void => {
        res.json({ ping: 'pong', msg: 'please POST to this route only' });
    })

    .post('/login', (req: expressRequestWithBody<LoginReq>, res: express.Response): void => {
        console.log(inspect("\n\nreq.body"));
        console.log(inspect(req.body));
        const username = req.body.username;
        const password = req.body.password;
        console.log(username);
        console.log(password);
        res.json({ loginAttempted: 'true', allowedIn: 'maybe' });
    });

/**
 * @EXPORT authRouter
 */
export { app as authRouter }
