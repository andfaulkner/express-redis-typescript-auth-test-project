// ensure environment knows testing is occurring
process.env.mocha = true;

// Store original process.argv
const oldProcArgs = Object.assign({}, process.argv);

/************************************** THIRD-PARTY IMPORTS ***************************************/
const fs = require('fs');
const path = require('path');

const sinon = require('sinon');
const mocha = require('mocha');
const { stderr, stdout } = require('test-console');

import { inspect } from 'util';

import { expect } from 'chai';
import * as supertest from 'supertest';

import * as _ from 'lodash';
import { Express } from 'express';

/************************************ IMPORT FILE TO BE TESTED ************************************/
import { launchServer } from './server-process';

/******************************************** HELPERS *********************************************/
import { StubConsole, blockErrorOutput } from '../../test/helpers/stub-console';

const scriptTagRegex = /<script src=['"][a-zA-Z0-9\.-]+['"]>/;

/********************************************* TESTS **********************************************/
describe('launchServer', function() {
    it('exists', function() {
        expect(launchServer).to.exist;
    });

    it('is a function', function() {
        expect(launchServer).to.be.a('function');
    });

    describe('# manages an Express instance', function() {
        var expressApp;
        var bootOutput;
        var blockedConsole;

        before((done: Function) => {
            blockedConsole = StubConsole(true);
            launchServer((app) => {
                console.log('~~ Reached callback of launchServer ~~');
                expressApp = app;
                blockedConsole.restoreConsole(done);
            });
        });

        it('runs the post-launch callback after boot via launchServer complete', function() {
            const reachedLaunchServerCbLog = blockedConsole.state.store.log[0][0];
            expect(reachedLaunchServerCbLog).to.equal('~~ Reached callback of launchServer ~~');
        });

        it('returns an express instance', function() {
            expect(expressApp.constructor.name).to.eql('Server');
            expect(expressApp._events.request).to.exist;
            expect(expressApp._events.request).to.be.a('function');
            expect(expressApp._events.request._events).to.exist;
            expect(expressApp._events.request._events).to.be.a('object');

            const routerStack = expressApp._events.request._router.stack;
            const hasStaticServingRoute = _.some(routerStack,
                (layer: { regexp: Object, name: string }) => {
                    const regexp = Object.assign(
                        new RegExp(/^\/?(?=\/|$)/i),
                        { fast_slash: true }
                    );
                    return (layer.name === 'serveStatic' && _.isEqual(layer.regexp, regexp));
                });
            expect(hasStaticServingRoute, 'should find a static dir-serving route').to.be.true;
        });

        describe('## Express instance returned by launchServer', function() {
            it('returns index.html on GET request to root path', function(done: Function) {

                // make GET request to 'localhost:[PORT]/'
                (supertest(expressApp) as any).get('/')

                    // ensure response was successful
                    .expect('Content-type', /text\/html/).expect(200)

                    // ensure body contains text indicating index.html
                    .expect(/<html>/)      .expect(/<\/html>/)
                    .expect(/<head>/)      .expect(/<\/head>/)
                    .expect(/<body>/)      .expect(/<\/body>/)
                    .expect(/<div id=/)    .expect(/<\/div>/)
                    .expect(scriptTagRegex).expect(/<\/script>/)

                    // ensure all expectations were met
                    .end(function(err: Error | null, res) {
                        expect(err).to.be.null;
                        done();
                    });
            });
        });
    });
});

// Restore original process.argv
process.argv = Object.assign({}, oldProcArgs);
