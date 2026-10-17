import test from 'node:test';
import assert from 'node:assert/strict';

import { pageExtractor } from '../src/index.js';

test('extracts text from a page', async () => {
  const page = {
    goto: async () => {},
    waitForSelector: async () => {},
    $eval: async (selector, callback) =>
      callback({ textContent: 'Hello, world!' }),
  };

  const extractText = pageExtractor();

  const result = await extractText(page, {
    url: 'https://example.com',
    selector: 'h1',
  });

  assert.equal(result, 'Hello, world!');
});
