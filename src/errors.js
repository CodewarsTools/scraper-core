export const ERROR_CODES = Object.freeze(
  Object.assign(Object.create(null), {
    NETWORK_ERROR: 'NETWORK_ERROR',
    NAVIGATION_TIMEOUT: 'NAVIGATION_TIMEOUT',
    NAVIGATION_FAILED: 'NAVIGATION_FAILED',
    SELECTOR_TIMEOUT: 'SELECTOR_TIMEOUT',
    BROWSER_LAUNCH_FAILED: 'BROWSER_LAUNCH_FAILED',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  }),
);

const NETWORK_ERROR_PATTERNS = Object.freeze([
  'net::ERR_NAME_NOT_RESOLVED',
  'net::ERR_INTERNET_DISCONNECTED',
  'net::ERR_NETWORK_CHANGED',
  'net::ERR_ADDRESS_UNREACHABLE',
  'net::ERR_CONNECTION_REFUSED',
  'net::ERR_CONNECTION_RESET',
  'net::ERR_CONNECTION_TIMED_OUT',
]);

export class ScraperError extends Error {
  constructor({ code, message, cause } = {}) {
    super(message, { cause });

    this.name = 'ScraperError';
    this.code = code;
  }
}

export const scraperError = (options) => new ScraperError(options);

const isNetworkError = (error) => {
  const message = `${error?.message ?? error}`;
  const causeMessage = error?.cause?.message ?? '';

  return NETWORK_ERROR_PATTERNS.some(
    (pattern) => message.includes(pattern) || causeMessage.includes(pattern),
  );
};

const networkError = (cause) =>
  scraperError({
    code: ERROR_CODES.NETWORK_ERROR,
    message: `Network error: ${cause?.message ?? cause}`,
    cause,
  });

const navigationTimeoutError = (cause, timeout) =>
  scraperError({
    code: ERROR_CODES.NAVIGATION_TIMEOUT,
    message: `Navigation timed out after ${timeout} ms`,
    cause,
  });

const navigationFailedError = (cause) =>
  scraperError({
    code: ERROR_CODES.NAVIGATION_FAILED,
    message: 'Failed to navigate to the page',
    cause,
  });

export const navigationError = (cause, timeout) => {
  if (cause?.name === 'TimeoutError') {
    return navigationTimeoutError(cause, timeout);
  }

  if (isNetworkError(cause)) {
    return networkError(cause);
  }

  return navigationFailedError(cause);
};

export const selectorTimeoutError = (cause, timeout, selector) =>
  scraperError({
    code: ERROR_CODES.SELECTOR_TIMEOUT,
    message: `Selector "${selector}" was not found after ${timeout} ms`,
    cause,
  });

export const browserLaunchError = (cause) =>
  scraperError({
    code: ERROR_CODES.BROWSER_LAUNCH_FAILED,
    message: 'Failed to launch the browser',
    cause,
  });

export const errorResult = (error) => {
  if (error instanceof ScraperError) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  if (isNetworkError(error)) {
    return {
      code: ERROR_CODES.NETWORK_ERROR,
      message: `Network error: ${error?.message ?? error}`,
    };
  }

  return {
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: error instanceof Error ? error.message : String(error),
  };
};
