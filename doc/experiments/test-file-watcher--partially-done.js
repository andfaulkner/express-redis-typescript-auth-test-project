#!/usr/bin/env node

//************************************** THIRD-PARTY MODULES **************************************/
const path = require('path');
const fs = require('fs');
const { execFileSync, execSync, spawnSync, spawn } = require('child_process');

const colors = require('colors');
const program = require('commander');
const chokidar = require('chokidar');

const _ = require('lodash');

/******************************************** MAIN APP ********************************************/
try {
    program
        .version('0.0.1')
        .option('-e, --env <env>',       'Environment', /^(development|production)$/, 'development')
        .option(    '--side <side>',     'Runs on server-side, client-side, or both?',
                                         /^(server|client|both)$/, 'both')
        .option('-w, --no-watch',        'watch for changes, reload if changes occur')
        .option('-d, --debug',           'run in debug mode (expose to Chrome Dev Tools)')
        .option('-l, --loglvl <loglvl>', 'Set the log level',
                                         /^(silly|verbose|debug|info|warn|error|wtf)$/, 'info')
        .parse(process.argv);

console.log('program.loglvl:', program.loglvl);
console.log('program.watch:', program.watch);
console.log('program.debug:', program.debug);
console.log('program.env:', program.env);
console.log('program.side:', program.side);

// initial build
buildSync(program, true);

//***************************************** WATCH SCRIPT ******************************************/
const watcher = chokidar.watch(rebuildWatchArgsFactory(program), {
    ignored: /(((^|[\/\\])(IGNORE(_|-)?).)|(^.+\.config\.js$))/,
    persistent: true,
});

//************************************ EVENT-TRIGGERED ACTIONS ************************************/
const rebuild = rebuildFactory();

watcher
    .on('change', rebuild)
    .on('addDir', rebuild);

//******************************************** HELPERS ********************************************/
/**
 * Immediately run the app, and return a function that allows you to rebuild the relevant
 * parts of the app then re-run it again when the un-transpiled code changes.
 *
 * @return {(path: string, _event: [[rebuild event]] ) => void} - rebuilder function
 */
function rebuildFactory() {
    let currentTestProcess = launchApp();

    return function rebuild(path, _event) {
        console.log(emptyLineBefore(colors.bgMagenta.white.bold(`[Changed]`) + ` ./${path}`));
        console.log('Recompiling...');

        buildSync(program);

        // accounts for manually closed Mocha processes
        if (currentTestProcess) {
            console.log('Terminating previous Mocha process...');
            console.log('currentTestProcess.pid: ${currentTestProcess.pid}');
            process.kill(currentTestProcess.pid/* + 1*/, 'SIGTERM');
        }

        currentTestProcess = launchApp();
    }
}

function buildSync(program, blockWatch = false) {
    spawnSync('npm',
        buildArgsFactory(program, blockWatch),
        { stdio: 'inherit' }
    );
}

function launchApp() {
    return spawn('mocha',
        testArgsFactory(program),
        { stdio: 'inherit', detached: true }
    )
}

function emptyLineBefore(msg) {
    return '\n' + msg;
}

/*********************************** PROCESS ARGUMENT FACTORIES ***********************************/
function rebuildWatchArgsFactory(program) {
    if (!program.watch) return [];

    let watchPaths = [];
    switch(program.side) {
      case "client":
        watchPaths.concat(['./app/client', './config', './shared']);
        break;
      case "server":
        watchPaths.concat(['./app/server', './config', './shared'])
        break;
      case "both": default:
        watchPaths.concat(['./app/server', './app/client', './config', './shared'])
        break;
    }
    return watchPaths;
}

function buildArgsFactory(program, blockWatch = false) {
    let buildCommand = 'build';

    if (program.side === 'client') {
        buildCommand = `${buildCommand}:client`;

    } else if (program.side === 'server') {
        buildCommand = `${buildCommand}:server`;
    }

    if (program.watch && !blockWatch) {
        buildCommand = `${buildCommand}:watch`
    }

    return ['run', buildCommand]
}

function testArgsFactory(program) {
    const clientTestGlobs = ["build/app/client/*.spec.js", "build/app/client/**/*.spec.js"];
    const serverTestGlobs = ["build/app/server/*.spec.js", "build/app/server/**/*.spec.js"];
    const testDirTestGlobs = ["build/test/*.spec.js", "build/test/**/*.spec.js"];

    const watchArg = [program.watch ? '--watch' : ''];

    switch(program.side) {
      case 'client':
        return clientTestGlobs.concat(watchArg);
      case 'server':
        return serverTestGlobs.concat(watchArg);
      case 'both': default:
        return clientTestGlobs.concat(serverTestGlobs)
                              .concat(testDirTestGlobs)
                              .concat(watchArg);

    }
}

// "npm run build:client"
// "chokidar --debounce 2000 --initial ./build/app/client/*.js ./build/app/client/**/*.js ./build/config/**/*.js ./build/shared/**/*.js -c \"mocha build/app/client/*.spec.js\"",


/***************************************** ERROR HANDLING *****************************************/
// output help on error or invalid input
} catch(err) {
    console.error(err);
    program.outputHelp()
}



// //
// // --keep-running: keep electron browser running after script terminates. Otherwise close it
// //                 when elm-watcher closes.
// //


// //**************************************** PROJECT MODULES ****************************************/
// const { emptyLineBefore, padToMsgLength } = require('./helpers/script-log-helpers');

// //**************************************** WATCHER CONFIG *****************************************/
// const config = {
//     watchPath: './app/**/*.elm',
//     watchIntroMsg: (config) => `Watching ${config.watchPath}, will recompile on change.`,
//     appRunEntryPoint: "app/main.js",
//     outputFile: 'build/elm.js',
//     elmBuildEntryPoint: 'app/main.elm',
//     cliArgs: {
//         doKeepRunning: (_.includes(process.argv, '--keep-running'))
//     }
// };

// console.log('config.cliArgs.doKeepRunning: ', config.cliArgs.doKeepRunning);

// //****************************************** INTRO LOGS *******************************************/
// const watchIntroMsg = config.watchIntroMsg(config);
// console.log(emptyLineBefore(padToMsgLength(watchIntroMsg)));
// console.log(watchIntroMsg.bgBlue.white.bold);

// //***************************************** WATCH SCRIPT ******************************************/
// const watcher = chokidar.watch(config.watchPath, {
//     ignored: /(^|[\/\\])(IGNORE(_|-)?)./,
//     persistent: true,
// });

// //************************************ EVENT-TRIGGERED ACTIONS ************************************/
// const rebuild = rebuildFactory();

// watcher
//     .on('change', rebuild)
//     .on('addDir', rebuild)w

// //******************************************** HELPERS ********************************************/
// function rebuildFactory() {
//     let currentElectronProcess = launchApp();

//     return function rebuild(path, event) {
//         console.log(emptyLineBefore(`[Changed]`.bgMagenta.white.bold + ` ./${path}`));
//         console.log('Recompiling...');

//         spawnSync('elm',
//             ["make", config.elmBuildEntryPoint, '--output', config.outputFile],
//             { stdio: 'inherit' }
//         );

//         // accounts for manually closed electron processes
//         if (currentElectronProcess) {
//             console.log('Terminating previous Electron process...');
//             process.kill(currentElectronProcess.pid + 1, 'SIGTERM');
//         }

//         currentElectronProcess = launchApp()
//         return;
//     }
// }

// function launchApp() {
//     return spawn('electron',
//         [config.appRunEntryPoint],
//         { stdio: 'inherit', detached: config.cliArgs.doKeepRunning }
//     )
// }

// // Replaces:
// // chokidar 'app/**/*.elm' 'app/**/*.js' \
// // -c 'elm make app/main.elm --output build/elm.js' --debounce 1000 --throttle 1000