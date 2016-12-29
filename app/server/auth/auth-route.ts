import * as express from 'express';

let app: express.Router = express();

app
    .get('/login', (req: express.Request, res: express.Response): void => {
        res.json({ ping: 'pong', msg: 'please POST to this route only' });
    })

    .post('/login', (req: express.Request, res: express.Response): void => {
        res.json({ loginAttempted: 'true', allowedIn: 'maybe' });
    });

export { app as authRouter }
