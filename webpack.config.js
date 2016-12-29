const fs = require('fs');
const path = require('path');
const rootPath = require('app-root-path');
const webpack = require('webpack');

const HandlebarsPlugin = require('handlebars-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const configIndexHtml = require('./config/index-html-config');

const WebpackBuildStatusNotifier = require('./config/webpack/werbpack-complete-notifier-plugin');

const buildPath = path.join(__dirname, 'build');
const buildFilePath = (currentPath) => path.join(buildPath, currentPath);
const srcPath = path.join(__dirname, './app/client');
const srcFilePath = (currentPath) => path.join(srcPath, currentPath);

const babelrc = JSON.parse(fs.readFileSync(path.join(__dirname, './.babelrc')).toString());
var NODE_ENV = process.env.NODE_ENV  || 'development';
var LOG_LEVEL = process.env.LOG_LEVEL  || 'info';

module.exports = {
    context: __dirname,
    performance: {
        hints: "warning",
        assetFilter: function(assetFilename) {
            return !assetFilename.endsWith('vendor.js');
        },
    },
    entry: {
        main: __dirname + '/app/client/client-app-root.tsx',
        vendor: ['react', 'react-dom'],
    },

    output: {
        path: __dirname + '',
        filename: 'build/app/client/[name].js',
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            useBabel: true,
                            useCache: true,
                            cacheDirectory: '.awcache',
                            configFileName: path.join(__dirname, './app/client/tsconfig.json'),
                            babelOptions: babelrc,
                        }
                    }
                ],
            },
            {
                test: /\.((hbs)|(handlebars))$/,
                loader: 'handlebars-loader'
            },
            {
                test: /\.json/,
                loaders: 'json-loader'
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ["es2015", "stage-0", "react"]
                }
            },
        ]
    },

    plugins: [
        new ExtractTextPlugin({
            filename: '[name].scss',
            allChunks: true
        }),

        new webpack.DefinePlugin({
            NODE_ENV:  JSON.stringify(NODE_ENV),
            LOG_LEVEL: JSON.stringify(LOG_LEVEL),
            'process.env': {
                NODE_ENV:  JSON.stringify(NODE_ENV),
                LOG_LEVEL: JSON.stringify(LOG_LEVEL)
            }
        }),

        new HandlebarsPlugin({
            // path to main hbs template 
            entry: srcFilePath('index.hbs'),
            // filepath to result
            output: buildFilePath((NODE_ENV === 'development')
                        ? 'app/client/index.html'
                        : 'app/client/public/index.html'
            ),
            // data passed to main hbs template
            data: configIndexHtml
        }),

        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'] // Specify the common bundle's name.
        }),

        new WebpackBuildStatusNotifier()
    ]
};
