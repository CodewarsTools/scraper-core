export const createPageExtractor = ({
  navigationError,
  selectorTimeoutError,
  validateBeforeExtract,
  defaultNavigationTimeout,
  defaultSelectorTimeout,
}) => {
  return ({
    navigationTimeout = defaultNavigationTimeout,
    selectorTimeout = defaultSelectorTimeout,
} = {}) => {
    const extractText = async (page, { url, selector, beforeExtract } = {}) => {
      try {
        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: navigationTimeout,
        });
      } catch (cause) {
        throw navigationError(cause, navigationTimeout);
      }

      validateBeforeExtract(beforeExtract);

      if (beforeExtract) {
        await beforeExtract(page);
      }

      try {
        await page.waitForSelector(selector, {
          timeout: selectorTimeout,
        });
      } catch (cause) {
        if (cause?.name === 'TimeoutError') {
          throw selectorTimeoutError(cause, selectorTimeout, selector);
        }

        throw cause;
      }

      return page.$eval(selector, (element) => element.textContent);
    };

    return extractText;
  };
};