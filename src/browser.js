import puppeteer from 'puppeteer';

import { browserLaunchError } from './errors.js';

export const launchBrowser = async (options = {}) => {
  try {
    return await puppeteer.launch({
      headless: true,
      ...options,
    });
  } catch (cause) {
    throw browserLaunchError(cause);
  }
};
