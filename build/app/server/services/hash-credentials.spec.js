"use strict";
// ensure environment knows testing is occurring
process.env.mocha = true;
// Store original process.argv
const oldProcArgs = Object.assign({}, process.argv);
const chai_1 = require("chai");
/************************************ IMPORT FILE TO BE TESTED ************************************/
const hash_credentials_1 = require("./hash-credentials");
/********************************************* TESTS **********************************************/
describe('hashString', function () {
    it('exists', function () {
        chai_1.expect(true).to.equal(true);
        console.log(hash_credentials_1.hashString('my_dumb_password'));
    });
});
process.argv = Object.assign({}, oldProcArgs); // Restore original process.argv
//# sourceMappingURL=hash-credentials.spec.js.map