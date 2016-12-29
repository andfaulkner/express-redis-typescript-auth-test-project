"use strict";
//************************************** THIRD-PARTY MODULES **************************************/
const path = require("path");
const colors = require("colors");
const server_process_1 = require("./server-process");
const child_process_1 = require("child_process");
const nodemon = require('nodemon');
/**************************************** PROJECT MODULES *****************************************/
const mad_logs_1 = require("mad-logs");
/******************************************* LOG SETUP ********************************************/
const TAG = mad_logs_1.buildFileTag('[express]', colors.white);
//************************************* KILL SIGNAL HANDLER ***************************************/
const __REGISTER_CLEANUP_ON_DEATH__ = require("../../shared/process-cleanup");
__REGISTER_CLEANUP_ON_DEATH__(TAG);
/***************************************** GET ROOT PATH ******************************************/
const get_root_path_1 = require("./get-root-path");
//********************************* LAUNCH ACTUAL SERVER PROCESS **********************************/
console.log(`\n${TAG} ****** Launching Express static asset & REST API server... ******\n`);
if (process.env.NODE_ENV === 'development') {
    (function rerunner() {
        var currentProcess;
        function onBoot(filesChanged) {
            if (currentProcess) {
                currentProcess.kill();
            }
            console.log(`${TAG} Express server rebuilt`);
            console.log(`${TAG} updates triggered by:`, filesChanged ? filesChanged : ' initial load');
            console.log(`${TAG} Restarting...`);
            child_process_1.spawnSync('tsc', ['-p', path.join(get_root_path_1.rootPath, './app/server/tsconfig.json')], { env: process.env, stdio: 'inherit' });
            currentProcess = child_process_1.spawn('node', [path.join(get_root_path_1.rootPath, './build/app/server/server-process.js')], {
                env: Object.assign({}, process.env, { AUTO_LAUNCH: true }),
                detached: true,
                stdio: 'inherit',
            });
        }
        nodemon({
            exec: `tsc -p ${path.join(get_root_path_1.rootPath, './app/server/tsconfig.json')}`,
            stdout: true,
            ext: 'ts tsx js jsx json',
            verbose: (process.env.LOG_LEVEL === 'verbose' || process.env.LOG_LEVEL === 'silly'),
            watch: [
                path.join(get_root_path_1.rootPath, './app/server/'),
                path.join(get_root_path_1.rootPath, './shared/'),
                path.join(get_root_path_1.rootPath, './config/')
            ],
            exclude: [path.join(get_root_path_1.rootPath, './build')],
            env: Object.assign({}, {
                LOG_LEVEL: process.env.LOG_LEVEL || 'info',
                NODE_ENV: 'development',
            })
        })
            .on('restart', onBoot)
            .on('start', onBoot);
    })();
}
else {
    launcher();
}
function launcher() {
    server_process_1.launchServer((app) => {
        console.log(`\n${TAG} ***** Express boot sequence complete! *****\n`);
    });
}
//# sourceMappingURL=boot-server.js.map