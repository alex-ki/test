var htmlReporter = require('nightwatch-html-reporter');

const chromedriver = require('chromedriver');

module.exports = {
  abortOnAssertionFailure: true,
  asyncHookTimeout: 360000,  // also for .perform(done)
  waitForConditionPollInterval: 500,
  waitForConditionTimeout: 30000,
  throwOnMultipleElementsReturned: false,
  unitTestsTimeout: 2000,
  customReporterCallbackTimeout: 20000,
  retryAssertionTimeout: 1000,

  after: function (cb) {
    chromedriver.stop();
    cb();
  },

  before(cb) {
    chromedriver.start();

    // fix error: (node:15138) MaxListenersExceededWarning:
    // Possible EventEmitter memory leak detected. 11 error listeners added.
    // Use emitter.setMaxListeners() to increase limit
    require("events").EventEmitter.defaultMaxListeners = 0;

    cb();
  },

  beforeEach(browser, cb) {
    cb();
  },

  afterEach(browser, cb) {
    cb();
  },

  reporter(results, cb) {
    var reporter = new htmlReporter({
      openBrowser: false,
      reportsDirectory: '.',
      reportFilename: 'report.html'
    });
    reporter.fn(results, cb);
  }
};
