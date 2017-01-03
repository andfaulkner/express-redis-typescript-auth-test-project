const { execSync, spawnSync } = require('child_process');
const { intersection, reverse, compact, map, flow, each, xor } = require('lodash/fp');
const _ = require('lodash/fp');
const { wasRunAsScript, extractChattiness } = require('../helpers/was-run-as-script');

/***************************************** LOGGING SETUP ******************************************/
const colors = require('colors');
const { buildFileTag } = require('mad-logs');
const TAG = buildFileTag("[clean-cmd.js]", colors.bgGreen.white.bold);

/**
 * Split a large multiline string into an array where each line is an item
 */
const splitLines = (str) => compact(str.toString().split('\n'));

/**
 * Split a Unix terminal 'table' into an array: one column per array item.
 */
const splitColumnsGetIds = map((line) => (line.split(/\s+/)[1]));

/**
 * Extract process IDs from ps output
 */
const getProcessIds = flow(splitLines, splitColumnsGetIds, reverse);

/**
 * Kill all processes in the given list of process ids
 */
const killAll = each(((id) => process.kill(id)));

//*********************************** MAIN NODEJS PROCESS NAMES ***********************************/

/**
 * Escape string for use as a shell command
 */
const shEscape = (cmd) => cmd.replace(/\|/g, '\\|')
                             .replace(/\(/g, '\\(')
                             .replace(/\)/g, '\\)');

/**
 * Wrap process name to ensure node is actually driving the process with the given name
 * (for use with strings given to grep for searching 'ps aux' output)
 * @param    {string} cmd - name of process
 */
const chkNode = (cmd) => `(node.*${cmd})`;

const procsToKill = [
    'npm',                  'node',            'ts-node',           'cordova',
    'gulp',                 'grunt',           'babel',             'webpack',
    'mocha',                'karma',           'knex',              'eslint',
    'tslint',               'bower',           'ts-babel-node',     'nodenv',
    chkNode('livereload'),  chkNode('yarn'),   chkNode('typings'),  chkNode('tsc'),
    chkNode('ember'),       chkNode('nvm'),    chkNode('mimosa'),   chkNode('tsd'),
    chkNode('meteor'),      chkNode('ember'),  chkNode('forever'),  chkNode('pm2'),
];

/**
 *    Convert list of node process names to a string usable for defining grep matches 
 */
// const nodeProcs = _.reduce(procsToKill, (acc, proc) => (`${acc}|${proc}`), '').replace(/^\|/, '')
const nodeProcs = _.reduce((acc, proc) => (`${acc}|${proc}`), '', procsToKill).replace(/^\|/, '');

// Grep command to remove items we don't want to kill from the list of processes to kill.
const killExclude = `grep -v "(Visual Studio Code)|(Electron)|(tsserver.js)"`


//******************************************** OUTPUT *********************************************/
/**
 * Kill all node processes
 */
module.exports = (opts) => {
    const { verbose, quiet } = opts.parent || false;

    console.log(`${TAG} Killing all regular node processes (ignoring IDE internal instances)...`);


    if (!quiet) console.log(
        `${TAG} COMMAND:`, `ps aux | grep "${shEscape(nodeProcs)}" | ${shEscape(killExclude)}`
    );

    const childProc = execSync(
        `ps aux | grep "${shEscape(nodeProcs)}" | ${shEscape(killExclude)}`
    );
    const childProc2 = execSync(
        `ps aux | grep "${shEscape(nodeProcs)}" | ${shEscape(killExclude)}`
    );

    const processIds = getProcessIds(childProc);
    const processIds2 = getProcessIds(childProc2);

    if (verbose) {
        console.log(`${TAG} process.pid: `, process.pid);
        console.log(`${TAG} processIds: `, processIds);
    }

    // excludes current process and temporary shell processes
    const killList = intersection(xor(processIds, [process.pid.toString()]), processIds2);
    if (verbose) console.log(`${TAG} kill list: `, killList);

    killAll(killList);

    console.log(`${TAG} Killed regular node processes. Killing pm2...`);
    spawnSync('pm2', ['delete', 'all'], { detached: true, env: process.env });
    spawnSync('pm2', ['kill'],          { detached: true, env: process.env });

    console.log(`${TAG} Terminated all non-IDE NodeJS processes`);
}


/**************************** HANDLE RUNNING THE FILE AS A STANDALONE *****************************/
if (wasRunAsScript(__filename, process.argv, TAG)) {
    // set 'quietness' levels, and pass them to actual script as it gets run
    module.exports({ parent: extractChattiness(process.argv)});
}
