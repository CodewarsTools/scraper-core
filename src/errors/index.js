import SCRAPER_ERRORS from './data/catalog.json' with { type: 'json' };
import NETWORK_ERROR_PATTERNS from './data/network-patterns.json' with {
  type: 'json',
};
import SYSTEM_ERRORS from './data/system.json' with { type: 'json' };
import WARNINGS from './data/warning.json' with { type: 'json' };

export {
  SCRAPER_ERRORS,
  NETWORK_ERROR_PATTERNS,
  SYSTEM_ERRORS,
  WARNINGS,
};

export * from './factory.js';