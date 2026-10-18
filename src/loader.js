import puppeteer from 'puppeteer';

import * as browser from './browser.js';
import * as constants from './constants.js';
import * as errors from './errors.js';
import * as pageExtractor from './page-extractor.js';

export default Object.freeze(
  Object.assign(Object.create(null), browser, constants, errors, {
    launchBrowser: browser.createLaunchBrowser({
      puppeteer,
      browserLaunchError: errors.browserLaunchError,
    }),

    pageExtractor: pageExtractor.createPageExtractor({
      navigationError: errors.navigationError,
      selectorTimeoutError: errors.selectorTimeoutError,
      defaultNavigationTimeout: constants.NAVIGATION_TIMEOUT,
      defaultSelectorTimeout: constants.SELECTOR_TIMEOUT,
    }),
  }),
);