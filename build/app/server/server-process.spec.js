"use strict";
// ensure environment knows testing is occurring
process.env.mocha = true;
// Store original process.argv
const oldProcArgs = Object.assign({}, process.argv);
/************************************** THIRD-PARTY IMPORTS ***************************************/
const { expect } = require('chai');
const sinon = require('sinon');
const mocha = require('mocha');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
/************************************ IMPORT FILE TO BE TESTED ************************************/
const server_process_1 = require("./server-process");
/********************************************* TESTS **********************************************/
describe('launchServer', function () {
    it('exists', function () {
        expect(server_process_1.launchServer).to.exist;
    });
    it('is a function', function () {
        expect(server_process_1.launchServer).to.be.a('function');
    });
});
// Restore original process.argv
process.argv = Object.assign({}, oldProcArgs);
//# sourceMappingURL=server-process.spec.js.map