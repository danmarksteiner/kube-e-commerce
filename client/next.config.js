// Starts whenever next.js is initialised
// Tell webpack to poll for filechanges once every 300ms
module.exports = {
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300;
    return config;
  },
};
