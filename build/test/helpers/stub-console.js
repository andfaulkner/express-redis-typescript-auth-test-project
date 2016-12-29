"use strict";
const _ = require("lodash");
/**
 * Prevents console.error messages emitted by code from reaching the console for given function
 * @param  {Function} fn - function to run without showing errors
 * @return {Object<{errorLogs: string[], warnLogs: string[], result: any}>} array containing
 *              warnings & errors outputted running the function, and the function result
 */
function blockErrorOutput(fn) {
    const logLogs = [];
    const errorLogs = [];
    const warnLogs = [];
    const errorOrig = console.error;
    console.error = (...msgs) => errorLogs.push(msgs);
    const warnOrig = console.warn;
    console.warn = (...msgs) => warnLogs.push(msgs);
    const logOrig = console.log;
    console.log = (...msgs) => logLogs.push(msgs);
    const result = fn();
    console.error = errorOrig;
    console.warn = warnOrig;
    console.log = logOrig;
    return { errorLogs, warnLogs, logLogs, result };
}
exports.blockErrorOutput = blockErrorOutput;
exports.StubConsole = (doStub) => {
    let origConsole = {};
    origConsole = _.assign(origConsole, console);
    const state = {
        store: {
            log: [],
            warn: [],
            error: [],
            time: [],
            timeEnd: [],
            trace: [],
            info: [],
        },
        isStubbed: false,
    };
    const wipeState = () => {
        state.store = _.reduce(state.store, (acc, __val, key) => {
            acc[key] = [];
            return acc;
        }, {});
    };
    const stubConsoleMethods = () => {
        console.backdoor = (...msg) => origConsole.log(msg);
        console.log = (...msg) => state.store.log.push(msg);
        console.info = (...msg) => state.store.info.push(msg);
        console.warn = (...msg) => state.store.warn.push(msg);
        console.error = (...msg) => state.store.error.push(msg);
        console.time = (...msg) => state.store.time.push(msg);
        console.timeEnd = (...msg) => state.store.timeEnd.push(msg);
        console.trace = (...msg) => state.store.trace.push(msg);
        state.isStubbed = true;
    };
    const restoreMethods = () => {
        console.log = origConsole.log;
        console.log = origConsole.info;
        console.warn = origConsole.warn;
        console.error = origConsole.error;
        console.time = origConsole.time;
        console.timeEnd = origConsole.timeEnd;
        console.trace = origConsole.trace;
        state.isStubbed = false;
        return console;
    };
    const restoreConsole = (next) => {
        restoreMethods();
        return next();
    };
    const restoreConsoleSync = () => {
        restoreMethods();
        return console;
    };
    if (doStub)
        stubConsoleMethods();
    return {
        origConsole,
        restoreConsole,
        state,
        wipeState,
        restoreConsoleSync
    };
};
//# sourceMappingURL=stub-console.js.map