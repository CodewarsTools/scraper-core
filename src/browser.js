export const createLaunchBrowser = ({ puppeteer, browserLaunchError }) => {
  return async (options = {}) => {
    try {
      return await puppeteer.launch({
        headless: true,
        ...options,
      });
    } catch (cause) {
      throw browserLaunchError(cause);
    }
  };
};