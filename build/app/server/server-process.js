"use strict";
//************************************* GLOBAL NODE MODULES ***************************************/
const path = require("path");
const http = require("http");
//Determine and store project root path
const get_root_path_1 = require("./get-root-path");
/************************************** THIRD-PARTY MODULES ***************************************/
const express = require('express');
const colors = require("colors");
const mad_logs_1 = require("mad-logs");
/**************************************** PROJECT MODULES *****************************************/
const TAG = mad_logs_1.buildFileTag('[server-process.ts]', colors.white.bgBlack);
const auth_route_1 = require("./auth/auth-route");
const log_requests_1 = require("./middlewares/log-requests");
//******************************************** CONFIG *********************************************/
const config_1 = require("../../config/config");
//Ensure infinite number of concurrent sockets can be open
http.globalAgent.maxSockets = Infinity;
//**************************************** ERROR HANDLING *****************************************/
if (process.env.NODE_ENV !== 'production') {
    Error.stackTraceLimit = Infinity;
    // require('trace'); // activate long stack trace
    require('clarify'); // Exclude node internal calls from the stack
}
//** Error handling module(s) here **/
// const log = require('server/debug/winston-logger');
// require('server/debug/uncaught-error-handler');
//******************************************** SERVER *********************************************/
exports.launchServer = (next) => {
    const app = express()
        .use(log_requests_1.requestLogFactory())
        .use('/', express.static(path.join(get_root_path_1.rootPath, 'build/app/client')))
        .use('/auth', auth_route_1.authRouter)
        .listen(config_1.config.port.server, function startServer() {
        console.log('Server running: http://127.0.0.1:' + config_1.config.port.server + '/');
        console.log('Server process id (pid): ' + process.pid); //emit process ID
        return console.log('Wow. So server. Very running. Much bootup success. Such win.');
    });
    return next(app);
};
if (process.env.AUTO_LAUNCH) {
    exports.launchServer((app) => {
        console.log(`\n***** ${TAG} Express boot sequence complete! *****\n`);
    });
}
//# sourceMappingURL=server-process.js.map