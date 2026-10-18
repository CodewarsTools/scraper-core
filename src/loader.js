import * as browser from './browser.js';
import * as constants from './constants.js';
import * as errors from './errors.js';
import * as pageExtractor from './page-extractor.js';

const lib = Object.freeze(Object.assign(
  Object.create(null),
  browser,
  constants,
  errors,
  pageExtractor,
));

export default lib;