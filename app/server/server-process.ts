//************************************* GLOBAL NODE MODULES ***************************************/
import * as path from 'path';
import * as http from 'http';

//Determine and store project root path
import { rootPath } from 'get-root-path'

/************************************** THIRD-PARTY MODULES ***************************************/
import * as express from 'express';
import * as helmet from 'helmet'

import * as colors from 'colors';
import { buildFileTag } from 'mad-logs';

/**************************************** PROJECT MODULES *****************************************/
const TAG = buildFileTag('[server-process.ts]', colors.white.bgBlack);

// routes
import { authRouter } from './routes/auth-routes';

// middlewares
import { requestLogFactory } from './middlewares/middlewares';

//******************************************** CONFIG *********************************************/
import { config } from '../../config/config';

//Ensure infinite number of concurrent sockets can be open
http.globalAgent.maxSockets = Infinity;

//**************************************** ERROR HANDLING *****************************************/
if (process.env.NODE_ENV !== 'production') {
    (Error as any).stackTraceLimit = Infinity;
    // require('trace'); // activate long stack trace
    require('clarify'); // Exclude node internal calls from the stack
}

//** Error handling module(s) here **/
// const log = require('server/debug/winston-logger');
// require('server/debug/uncaught-error-handler');
//
// tslint:disable-next-line
//  TODO: proper global error handling. e.g. see: http://stackoverflow.com/questions/35550855/best-way-to-handle-exception-globally-in-node-js-with-express-4
//

//******************************************** SERVER *********************************************/
export const launchServer = (next) => {
    const app = express()

        //******* MIDDLEWARES *******//
        .use(requestLogFactory())
        .use(helmet())

        //********* ROUTES *********//
        .use('/auth', authRouter)
        .use('/', express.static(path.join(rootPath, 'build/app/client')))

        //Build Express app itself (loads & runs a constructor module), serve over web
        .listen(config.port.server, function startServer() {
            console.log(`${TAG} Server running: http://127.0.0.1:` + config.port.server + '/');
            console.log(`${TAG} Server process id (pid): ` + process.pid); //emit process ID
            console.log(`${TAG} Wow. So server. Very running. Much bootup success. Such win.`);
            return;
        });

    return next(app);
};

if (process.env.AUTO_LAUNCH) {
    launchServer((app) => {
        console.log(`\n***** ${TAG} Express boot sequence complete! *****\n`);
    });
}
