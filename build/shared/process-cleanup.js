const __ON_DEATH__ = require('death');
const terminate = require('terminate');
const afterTermination = (pid, quiet) => (err, done) => {
    console.log(`EXITING`);
    if (!quiet && err) {
        console.error('\n\nERROR: APP TERMINATION FAILED\n\n');
        console.error(`Process ${pid} failed to terminate`);
    }
    if (process.hasShownExitMessage !== true) {
        console.log(`\nPRESS ENTER TO RETURN TO SHELL`);
        process.hasShownExitMessage = true;
    }
    process.exit(1);
};
/**
 * Kill ghost node processes
 * @param {Int} signal - kill code received
 * @param {Error} [OPTIONAL] err - error message received
 */
const cleanupAction = (TAG, verbose) => (signal, err) => {
    if (verbose) {
        console.log(`${TAG} KILL SIGNAL RECEIVED: `, signal);
        if (err) {
            console.error(`${TAG} ERROR ON EXIT (below):`);
            console.error(err);
        }
    }
    console.log(`\n${TAG} Received signal ${signal} - exiting process ${process.pid}...`);
    terminate(process.pid, afterTermination(process.pid, verbose));
};
/**
 * Register callbacks on all process killing events, to ensure all child processes also get killed.
 * This includes SIGINT, SIGKILL, and SIGTERM. Having this in place prevents ghost processes.
 * @param  {string} TAG - label to display on output
 * @param  {boolean} quiet - if true, display no output
 * @param  {function} onTerminate (optional) - function to run when
 * @return {[type]}             [description]
 */
const registerProcessCleanup = (TAG, verbose = false) => {
    console.log(`${TAG} registered trap to kill child processes on detecting kill signal`);
    return __ON_DEATH__(cleanupAction(TAG, verbose));
};
/**
 * No-frills insta-death registration. Just run it once and you're safe from ghosts.
 */
registerProcessCleanup.silentKill = () => __ON_DEATH__(terminate(process.pid, afterTermination(process.pid, true)));
registerProcessCleanup.cleanupAction = cleanupAction;
registerProcessCleanup.afterTermination = afterTermination;
module.exports = registerProcessCleanup;
//# sourceMappingURL=process-cleanup.js.map