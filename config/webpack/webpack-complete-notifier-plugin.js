"use strict";
const _ = require('lodash');

class WebpackBuildCompleteNotifier {
    apply(compiler) {
        compiler.plugin("done", (stats) => {
            const pkg = require('../../package.json');
            const notifier = require('node-notifier');
            const time = ((stats.endTime - stats.startTime) / 1000).toFixed(2);
            const errMsg = (_.get(stats, 'compilation.errors.length') === 0)
                ? 'Build complete with no errors!'
                : `Build failed: ${stats.compilation.errors.length} errors in ${time}s`
            notifier.notify({
                title: pkg.name,
                message: `Webpack is done!\n${errMsg}`,
                contentImage: null,
                wait: false,
                sound: false,
            });
            console.log('\n', errMsg, '\n');
        })
    }
}

module.exports = WebpackBuildCompleteNotifier;
