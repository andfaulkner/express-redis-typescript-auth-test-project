const _ = require('lodash');

var funcs = getConfig('config/config.ts');

var funcs2 = require("./sample-files/ts-file-to-try-to-import.ts");

console.log(`\n\nrequire.prototype.constructor after everything ::`); console.log(require.prototype.constructor); console.log(`\n\n`);

console.log(`funcs:`, funcs);
