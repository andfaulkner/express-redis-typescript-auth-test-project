"use strict";
const morgan = require("morgan");
const colors = require("colors");
const moment = require("moment");
const util = require("util");
const _ = require("lodash");
const format = {
    shortDate: '\\[ HH:mm:ss.SS \\]',
    mLog: ':shortdate :cmethod -> :path :cstatus :params :response-time ms - SIZE: :res[content-length]',
};
const startOrEndBraceRegex = /(^\{ )|( \}$)/g;
/**
 * Create new 'tokens' for altering format of express route log
 */
const morganTokens = {
    cmethod: (req, res) => colors.blue.bgWhite(req.method),
    cstatus: (req, res) => colors.white(`(${res.statusCode})`),
    nl: (req, res) => '\n',
    params: (req, res) => (req.params) ? (prepReqParamsForDisplay(req)) : '|',
    path: (req, res) => colors.cyan(`PATH: ${req.url}`),
    requestroute: (req, res) => util.inspect(req, { depth: 10 }),
    shortdate: (req, res) => colors.yellow(moment().format(format.shortDate)),
};
/**
 * Augment & export the morgan logging module by bind new log tokens.
 * @return {Morgan} augmented morgan module. Usable like standard Morgan, but with new
 *                  format tokens available in the format string:
 *                      :cmethod :cstatus :nl :params :path :requestroute :shortdate
 */
const augmentMorgan = (tokens = morganTokens) => {
    _.each(tokens, (fn, name) => morgan.token(name, fn));
    return morgan;
};
/**
 * Build and return an Express middleware for logging request info
 * @export {Morgan}
 */
exports.requestLogFactory = (style = format.mLog) => {
    return augmentMorgan()(style);
};
/******************************************** HELPERS *********************************************/
const prepReqParamsForDisplay = (req) => {
    return ('| ' + colors.white(`params : ${__cleanReqParams(req)}`) + ' |');
};
function __cleanReqParams(req) {
    return util.inspect(req.params)
        .replace(startOrEndBraceRegex, '')
        .replace(': ', '=>');
}
;
//# sourceMappingURL=log-requests.js.map