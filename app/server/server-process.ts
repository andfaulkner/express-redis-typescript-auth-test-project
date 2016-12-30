//************************************* GLOBAL NODE MODULES ***************************************/
import * as path from 'path';
import * as http from 'http';

//Determine and store project root path
import { rootPath } from './get-root-path';

/************************************** THIRD-PARTY MODULES ***************************************/
const express = require('express');
import * as colors from 'colors';
import { buildFileTag } from 'mad-logs';

/**************************************** PROJECT MODULES *****************************************/
const TAG = buildFileTag('[server-process.ts]', colors.white.bgBlack);

import { authRouter } from './auth/auth-route';

import { requestLogFactory } from './middlewares/log-requests';

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

//******************************************** SERVER *********************************************/
export const launchServer = (next) => {
    const app = express()
        .use(requestLogFactory())

        /* MIDDLEWARES GO HERE - EXAMPLES DIRECTLY BELOW */
        .use('/', express.static(path.join(rootPath, 'build/app/client')))
        .use('/auth', authRouter)

        //Build Express app itself (loads & runs a constructor module), serve over web
        .listen(config.port.server, function startServer() {
            console.log('Server running: http://127.0.0.1:' + config.port.server + '/');
            console.log('Server process id (pid): ' + process.pid); //emit process ID
            return console.log('Wow. So server. Very running. Much bootup success. Such win.');
        });
    return next(app);
};

if (process.env.AUTO_LAUNCH) {
    launchServer((app) => {
        console.log(`\n***** ${TAG} Express boot sequence complete! *****\n`);
    });
}
