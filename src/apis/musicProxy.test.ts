import assert from 'node:assert/strict';
import test from 'node:test';
import { requestMusic } from './musicProxy';

test('rejects a failed same-origin music response', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response('{"error":"unavailable"}', { status: 503 });

  try {
    await assert.rejects(
      () => requestMusic('/api/music/search?q=demo'),
      /music request failed/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
