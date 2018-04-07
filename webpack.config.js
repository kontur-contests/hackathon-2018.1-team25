'use strict';

const path = require('path');

module.exports = {
    entry: {
        costructor: './src',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        jsonpFunction: 'animationConstructorJSONP',
    },
    resolve: {
        extensions: [
            '.tsx',
            '.ts',
            '.js',
        ],
    },
    module: {
        rules: [
            {
                test: /\.pcss$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            singleton: true,
                        },
                    },
                    {
                        loader: 'typings-for-css-modules-loader',
                        options: {
                            namedExport: true,
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[path]-[name]--[local]',
                            minimize: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-nested'),
                                require('postcss-cssnext'),
                                require('postcss-inline-svg')(),
                                require('cssnano')(),
                            ],
                        },
                    },
                ]
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                'es6-promise',
                                'transform-object-assign',
                                'transform-undefined-to-void',
                            ],
                        },
                    },
                    'awesome-typescript-loader',
                ]
            },
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                'es6-promise',
                                'transform-object-assign',
                                'transform-undefined-to-void',
                            ],
                        },
                    },
                ],
            },
        ]
    },
};
