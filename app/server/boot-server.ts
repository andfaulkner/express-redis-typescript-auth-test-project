//************************************** THIRD-PARTY MODULES **************************************/
import * as path from 'path';
import * as colors from 'colors';
import { launchServer } from './server-process';

import { spawn, spawnSync } from 'child_process';

const nodemon = require('nodemon') as any;
import { inspect } from 'util';

/**************************************** PROJECT MODULES *****************************************/
import { buildFileTag } from 'mad-logs';

/******************************************* LOG SETUP ********************************************/
const TAG = buildFileTag('[express]', colors.white);

//************************************* KILL SIGNAL HANDLER ***************************************/
import * as __REGISTER_CLEANUP_ON_DEATH__ from '../../shared/process-cleanup';
__REGISTER_CLEANUP_ON_DEATH__(TAG);

/***************************************** GET ROOT PATH ******************************************/
import { rootPath } from './get-root-path';

//********************************* LAUNCH ACTUAL SERVER PROCESS **********************************/
console.log(`\n${TAG} ****** Launching Express static asset & REST API server... ******\n`);

if (process.env.NODE_ENV === 'development') {
    (function rerunner() {
        var currentProcess;

        function onBoot(filesChanged){
            if (currentProcess) {
                currentProcess.kill();
            }
            console.log(`${TAG} Express server rebuilt`);
            console.log(`${TAG} updates triggered by:`, filesChanged ? filesChanged : ' initial load');
            console.log(`${TAG} Restarting...`);
            spawnSync('tsc',
                ['-p', path.join(rootPath, './app/server/tsconfig.json')],
                { env: process.env, stdio: 'inherit' });
            currentProcess = spawn('node', [path.join(rootPath, './build/app/server/server-process.js')], {
                env: Object.assign({}, process.env, { AUTO_LAUNCH: true }),
                detached: true,
                stdio: 'inherit',
            });
        }

        nodemon({
            exec: `tsc -p ${
                path.join(rootPath, './app/server/tsconfig.json')
            }`,
            stdout: true,
            ext: 'ts tsx js jsx json',
            verbose: (process.env.LOG_LEVEL === 'verbose' || process.env.LOG_LEVEL === 'silly'),
            watch: [
                path.join(rootPath, './app/server/'),
                path.join(rootPath, './shared/'),
                path.join(rootPath, './config/')
            ],
            exclude: [path.join(rootPath, './build')],
            env: Object.assign({}, {
                LOG_LEVEL: process.env.LOG_LEVEL || 'info',
                NODE_ENV: 'development',
            })
        })
        .on('restart', onBoot)
        .on('start', onBoot);
    })();

} else {
    launcher();
}

function launcher() {
    launchServer((app) => {
        console.log(`\n${TAG} ***** Express boot sequence complete! *****\n`);
    });
}
