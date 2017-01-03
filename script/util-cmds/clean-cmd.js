const rimrafPromise = require('rimraf-promise');
const _ = require('lodash');
const Bluebird = require('bluebird');
const fs = require('fs-extra');
const mkdirAsync = Bluebird.promisify(fs.mkdir);
const colors = require('colors');

const childProcessPromise = require('child-process-promise');
const spawnAsync = childProcessPromise.spawn;

const { wasRunAsScript, extractChattiness } = require('../helpers/was-run-as-script');

/***************************************** LOGGING SETUP ******************************************/
const { buildFileTag } = require('mad-logs');
const TAG = buildFileTag("[clean-cmd.js]", colors.bgWhite.gray);

/*********************************** HELPERS AND ERROR HANDLING ***********************************/
/**
 * Run on failure to delete build directory
 * @param    {Error} error
 */
const handleCleanError = (error) => {
    console.error(`${TAG} [ERROR[ action#clean (clean-cmd): ${error}`);
    throw (new Error(error));
};

const buildDirDeleteSuccessBanner = () => {
    console.log(`${TAG} successfully removed build folder`);
    Promise.resolve('Success!');
};

/**************************************** COMMAND HANDLER *****************************************/
/**
 * Delete the /build folder and create it again
 * @param {Object} opts - only clean if opts.clean is true
 */
module.exports = (opts) => {
    if (!opts.quiet)
    console.log(`${TAG} Initiating clean action (entered \'clean\' function)...`);

    if (opts.clean) {
        return rimrafPromise('./build')
            .then(buildDirDeleteSuccessBanner)
            .catch(handleCleanError)
            .then(() => mkdirAsync('./build'));
    }
    return spawnAsync(`echo`, ["${TAG} --clean was not provided as an argument"]);
};


/**************************** HANDLE RUNNING THE FILE AS A STANDALONE *****************************/
if (wasRunAsScript(__filename, process.argv, TAG)) {
    // set 'quietness' levels, and pass them to actual script as it gets run
    module.exports(Object.assign({ clean: true }, extractChattiness(process.argv)));
}
