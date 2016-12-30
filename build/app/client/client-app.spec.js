"use strict";
// ensure environment knows testing is occurring
process.env.mocha = true;
// Store original process.argv
const oldProcArgs = Object.assign({}, process.argv);
/************************************** THIRD-PARTY IMPORTS ***************************************/
const { expect } = require('chai');
const sinon = require('sinon');
require("mocha");
/************************************ IMPORT FILE TO BE TESTED ************************************/
// const exportFromTestedFile = require('./');
/********************************************* TESTS **********************************************/
describe('test', function () {
    it('exists', function () {
        expect(true).to.equal(true);
    });
});
// Restore original process.argv
process.argv = Object.assign({}, oldProcArgs);
//# sourceMappingURL=client-app.spec.js.map