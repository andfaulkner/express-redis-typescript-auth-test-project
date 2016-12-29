"use strict";
// ensure environment knows testing is occurring
process.env.mocha = true;
// Store original process.argv
const oldProcArgs = Object.assign({}, process.argv);
/************************************** THIRD-PARTY IMPORTS ***************************************/
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const mocha = require('mocha');
const inspect = require('util').inspect;
const { stderr, stdout } = require('test-console');
const chai_1 = require("chai");
const supertest = require("supertest");
const _ = require("lodash");
/************************************ IMPORT FILE TO BE TESTED ************************************/
const server_process_1 = require("./server-process");
/******************************************** HELPERS *********************************************/
const stub_console_1 = require("../../test/helpers/stub-console");
const scriptTagRegex = /<script src=['"][a-zA-Z0-9\.-]+['"]>/;
/********************************************* TESTS **********************************************/
describe('launchServer', function () {
    it('exists', function () {
        chai_1.expect(server_process_1.launchServer).to.exist;
    });
    it('is a function', function () {
        chai_1.expect(server_process_1.launchServer).to.be.a('function');
    });
    describe('# manages an Express instance', function () {
        var expressApp;
        var bootOutput;
        var blockedConsole;
        before((done) => {
            blockedConsole = stub_console_1.StubConsole(true);
            server_process_1.launchServer((app) => {
                console.log('~~ Reached callback of launchServer ~~');
                expressApp = app;
                blockedConsole.restoreConsole(done);
            });
        });
        it('runs the post-launch callback after boot via launchServer complete', function () {
            const reachedLaunchServerCbLog = blockedConsole.state.store.log[0][0];
            chai_1.expect(reachedLaunchServerCbLog).to.equal('~~ Reached callback of launchServer ~~');
        });
        it('returns an express instance', function () {
            chai_1.expect(expressApp.constructor.name).to.eql('Server');
            chai_1.expect(expressApp._events.request).to.exist;
            chai_1.expect(expressApp._events.request).to.be.a('function');
            chai_1.expect(expressApp._events.request._events).to.exist;
            chai_1.expect(expressApp._events.request._events).to.be.a('object');
            const routerStack = expressApp._events.request._router.stack;
            const hasStaticServingRoute = _.some(routerStack, (layer) => {
                const regexp = Object.assign(new RegExp(/^\/?(?=\/|$)/i), { fast_slash: true });
                return (layer.name === 'serveStatic' && _.isEqual(layer.regexp, regexp));
            });
            chai_1.expect(hasStaticServingRoute, 'should find a static dir-serving route').to.be.true;
        });
        describe('## Express instance returned by launchServer', function () {
            it('returns index.html on GET request to root path', function (done) {
                // make GET request to 'localhost:[PORT]/'
                supertest(expressApp).get('/')
                    .expect('Content-type', /text\/html/).expect(200)
                    .expect(/<html>/).expect(/<\/html>/)
                    .expect(/<head>/).expect(/<\/head>/)
                    .expect(/<body>/).expect(/<\/body>/)
                    .expect(/<div id=/).expect(/<\/div>/)
                    .expect(scriptTagRegex).expect(/<\/script>/)
                    .end(function (err, res) {
                    chai_1.expect(err).to.be.null;
                    done();
                });
            });
        });
    });
});
// Restore original process.argv
process.argv = Object.assign({}, oldProcArgs);
//# sourceMappingURL=server-process.spec.js.map