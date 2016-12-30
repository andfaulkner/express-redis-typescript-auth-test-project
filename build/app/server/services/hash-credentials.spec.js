"use strict";
// ensure environment knows testing is occurring
process.env.mocha = true;
// Store original process.argv
const oldProcArgs = Object.assign({}, process.argv);
const chai_1 = require("chai");
/********************************************* TESTS **********************************************/
describe('hashString', function () {
    it('exists', function () {
        chai_1.expect(true).to.equal(true);
    });
});
process.argv = Object.assign({}, oldProcArgs); // Restore original process.argv
//# sourceMappingURL=hash-credentials.spec.js.map