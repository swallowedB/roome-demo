import assert from 'node:assert/strict';
import test from 'node:test';
import * as search from './search';

test('rejects an Aladin search without a keyword', async () => {
  const response = await search.onRequestGet({
    request: new Request('https://demo.example/api/aladin/search'),
    env: { ALADIN_TTB_KEY: 'aladin-key' },
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'keyword is required' });
});

test('maps Aladin results to the book fields used by the demo', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        item: [
          {
            isbn: '1234567890',
            isbn13: '9781234567890',
            title: '데모를 위한 책',
            author: '보아',
            publisher: 'RoomE',
            pubDate: '2026-09-29',
            cover: 'https://image.example/book.jpg',
            categoryId: 1,
            categoryName: '국내도서>소설>한국소설',
          },
        ],
      }),
      { status: 200 },
    );

  try {
    const response = await search.onRequestGet({
      request: new Request(
        'https://demo.example/api/aladin/search?keyword=%EB%8D%B0%EB%AA%A8',
      ),
      env: { ALADIN_TTB_KEY: 'aladin-key' },
    });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      item: [
        {
          isbn: '9781234567890',
          title: '데모를 위한 책',
          author: '보아',
          publisher: 'RoomE',
          pubDate: '2026-09-29',
          cover: 'https://image.example/book.jpg',
          categoryId: 1,
          categoryName: '국내도서>소설>한국소설',
        },
      ],
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('does not call Aladin without a server-side API key', async () => {
  const originalFetch = globalThis.fetch;
  let fetchCount = 0;
  globalThis.fetch = async () => {
    fetchCount += 1;
    return new Response('{}', { status: 200 });
  };

  try {
    const response = await search.onRequestGet({
      request: new Request(
        'https://demo.example/api/aladin/search?keyword=%EB%8D%B0%EB%AA%A8',
      ),
      env: {},
    });

    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), {
      error: 'book search is unavailable',
    });
    assert.equal(fetchCount, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
