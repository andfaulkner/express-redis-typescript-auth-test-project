#!/usr/bin/env node
/**************************************************************************************************
*
*            Abandoned experiment to filter the logs such that the chokidar
*            "double-post" doesn't occur. Involved essentially making a micro-output compiler.
*            Not worth the effort in the end
*
*/

const inspect = require('util').inspect;
const _ = require('./lodash-mixins-experiment');

console.log(`\nprocess.pid: ${process.pid}\n`);

const curDataflow = DataFlow(12);
const curDataflow2 = DataFlow();

curDataflow.resetCountdownToDataClear();

/*********************************** HANDLE INCOMING DATA EVENT ***********************************/
process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (curDataflow.eatChunk(chunk)) {
        process.stdout.write(`${chunk}`);
    }
});

/***************************************** DATA END EVENT *****************************************/
process.stdin.on('end', () => {
    console.log(`END END END`);
});

/******************************************** HELPERS *********************************************/
function DataFlow(initialTimeToDataStop = 5) {
    if (DataFlow.existingDataFlow) {
        console.log(`There can only be 1 DataFlow`);
        return DataFlow.existingDataFlow;
    }

    const state = {
        timeRemaining: initialTimeToDataStop,
        countdownInitialized: false,
        isStopped: true,
        chunkColl: [],
        matchableChunks: [],
    };

    const countdown = () => {
        if (state.timeRemaining > 0) {
            setTimeout(() => {
                console.log(state.timeRemaining);
                state.timeRemaining = state.timeRemaining - 1;
                countdown();
            }, 1000);
        } else {
            console.log(`Resetting state.chunkColl & state.matchableChunks`); // empty before here
            state.chunkColl = [];
            state.matchableChunks = [];
            console.log(`Data stream has completed, awaiting next...`);
            state.isStopped = true;
        }
    };

    const resetCountdownToDataClear = () => {
        if (state.timeRemaining < 1) {
            console.log(`resetting...`);
            state.timeRemaining = 5;
            state.isStopped = false;
            countdown();
        } else {
            state.timeRemaining = 5;
        }
    };

    /**
     * Convert a data chunk from a stream into a 'clean' flat array, where the array has been
     * split on \n, and all empty spaces have been removed
     * @param  {[type]} chunk [description]
     * @return {[type]}       [description]
     */
    const chunkToCleanArray = (chunk) => {
        const preppedChunk = _.compact(chunk.toString().split('\n'));
        return _.flatten([preppedChunk]);
    };

    /**
     * Store a chunk in the given state property in the current DataFlow object. Splits on
     * \n first. After storing, it reset the countdown, as this demonstrates that useful data
     * is still flowing in.
     *
     * @param  {Buffer | String} chunk - chunk of data from a stream.
     * @param  {String} collType - property on the state object: either chunkColl | matchableChunks
     * @return {String[]}
     */
    const storeChunk = (chunk, collType = 'chunkColl', doReset = true) => {
        const chunkArray = chunkToCleanArray(chunk);
        state[collType] = state[collType].concat(chunkArray);
        if (doReset) resetCountdownToDataClear();
        return chunkArray;
    };

    /**
     * DataFlow uses this to 'consume' a data chunk from a stream. It could 
     * @param  {[type]} chunk [description]
     * @return {[type]}       [description]
     */
    const eatChunk = (chunk) => {
        const chunkStr = chunk.toString();
        if (chunkStr !== null && !areLast2Newlines(state.chunks, chunkStr)) {
            if (chunkStr === '\n') return storeChunk(chunkStr);
            if (!chunkStr.match(/^  /gi)) return storeChunk(chunkStr);

            return _.reduce(chunkToCleanArray(chunkStr), (acc, cnk) => {
                if (!_.includes(state.matchableChunks, cnk)) {
                    storeChunk(cnk);
                    storeChunk(chunkStr, 'matchableChunks', false);
                    acc.push(cnk);
                }
                return acc;
            }, []).join('\n')
        }
    };

    function areLast2Newlines(chunks, chunk) {
        return _.all([...(_.takeRight(chunks, 1)), `${chunk}`], (item) => item === '\n');
    }

    DataFlow.existingDataFlow = {
        resetCountdownToDataClear,
        eatChunk,
        state
    };

    return (() => {
        state.isStopped = false;
        countdown();
        return DataFlow.existingDataFlow;
    })();
};
