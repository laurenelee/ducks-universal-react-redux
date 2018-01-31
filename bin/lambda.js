var path = require('path');
var rootDir = path.resolve(__dirname, '..');
const awsServerlessExpress = require('aws-serverless-express');
var app;
/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/webpack-isomorphic-tools'))
  .server(rootDir, function() {
    app = require('../static/dist/server');
  });

exports.handler = (event, context) => {
  while(!app){};

  var server = awsServerlessExpress.createServer(app);
  return awsServerlessExpress.proxy(server, event, context)
};