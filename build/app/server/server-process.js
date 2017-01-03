"use strict";
//************************************* GLOBAL NODE MODULES ***************************************/
const path = require("path");
const http = require("http");
//Determine and store project root path
const get_root_path_1 = require("get-root-path");
/************************************** THIRD-PARTY MODULES ***************************************/
const express = require("express");
const helmet = require("helmet");
const colors = require("colors");
const mad_logs_1 = require("mad-logs");
/**************************************** PROJECT MODULES *****************************************/
const TAG = mad_logs_1.buildFileTag('[server-process.ts]', colors.white.bgBlack);
// routes
const auth_routes_1 = require("./routes/auth-routes");
// middlewares
const middlewares_1 = require("./middlewares/middlewares");
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
//
// tslint:disable-next-line
//  TODO: proper global error handling. e.g. see: http://stackoverflow.com/questions/35550855/best-way-to-handle-exception-globally-in-node-js-with-express-4
//
//******************************************** SERVER *********************************************/
exports.launchServer = (next) => {
    const app = express()
        .use(middlewares_1.requestLogFactory())
        .use(helmet())
        .use('/auth', auth_routes_1.authRouter)
        .use('/', express.static(path.join(get_root_path_1.rootPath, 'build/app/client')))
        .listen(config_1.config.port.server, function startServer() {
        console.log(`${TAG} Server running: http://127.0.0.1:` + config_1.config.port.server + '/');
        console.log(`${TAG} Server process id (pid): ` + process.pid); //emit process ID
        console.log(`${TAG} Wow. So server. Very running. Much bootup success. Such win.`);
        return;
    });
    return next(app);
};
if (process.env.AUTO_LAUNCH) {
    exports.launchServer((app) => {
        console.log(`\n***** ${TAG} Express boot sequence complete! *****\n`);
    });
}
//# sourceMappingURL=server-process.js.map