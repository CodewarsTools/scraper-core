import { navigationError, selectorTimeoutError } from './errors.js';

import { NAVIGATION_TIMEOUT, SELECTOR_TIMEOUT } from './constants.js';

export const pageExtractor = ({
  navigationTimeout = NAVIGATION_TIMEOUT,
  selectorTimeout = SELECTOR_TIMEOUT,
} = {}) => {
  const extractText = async (page, { url, selector, beforeExtract }) => {
    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: navigationTimeout,
      });
    } catch (cause) {
      throw navigationError(cause, navigationTimeout);
    }

    if (beforeExtract) {
      await beforeExtract(page);
    }

    try {
      await page.waitForSelector(selector, {
        timeout: selectorTimeout,
      });
    } catch (cause) {
      if (cause?.name === 'TimeoutError') {
        throw selectorTimeoutError(cause, selectorTimeout);
      }

      throw cause;
    }

    return page.$eval(selector, (element) => element.textContent);
  };

  return extractText;
};
