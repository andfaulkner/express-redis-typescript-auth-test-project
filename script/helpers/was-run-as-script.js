const _ = require('lodash');

function baseFilename(filename){
    return filename.split('/').slice(-1)[0];
}

/**
 * Returns true if the given filename was run as a script
 * @param  {string} filename - name of the file the command was run from.
 */
function wasRunAsScript(filename, processArgv = process.argv, TAG = '') {
    const findFilename = new RegExp(baseFilename(filename).replace('.', '\.'), 'g');
    const wasScript = !!(findFilename.exec(processArgv[1]));
    if (wasScript) console.log(`${TAG ? TAG + ' ' : ''}Running ${__filename} as a standalone script...`);
    return wasScript;
}

/**
 * Rudimentary parsing for common arguments indicating how much logging the user wants to see
 */
function extractChattiness(processArgv = process.argv) {
    const chattiness = {
        verbose: _.some(processArgv, (arg) => arg.match(/^--verbose$/)),
        silly: _.some(processArgv, (arg) => arg.match(/^--silly$/)),
        debug: _.some(processArgv, (arg) => arg.match(/^--debug$/)),
        quiet: _.some(processArgv, (arg) => arg.match(/^--quiet$/)),
    }

    // quiet trumps all
    if (chattiness.quiet) {
        chattiness.verbose = chattiness.silly = chattiness.debug = false;
        return chattiness;        
    }

    // quiet is default if no level provided
    chattiness.quiet = !(chattiness.verbose || chattiness.silly || chattiness.debug);

    // auto-activates lower levels (e.g. silly --> verbose & debug), excepting "quiet" (a silencer)
    if (chattiness.silly) chattiness.verbose = chattiness.debug = true;
    if (chattiness.verbose) chattiness.debug = true;

    return chattiness;
}

module.exports = {
    baseFilename,
    wasRunAsScript,
    extractChattiness
};