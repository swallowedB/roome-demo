import assert from 'node:assert/strict';
import test from 'node:test';
import * as search from './search';
import * as video from './video';

test('rejects a music search without q', async () => {
  const response = await search.onRequestGet({
    request: new Request('https://demo.example/api/music/search'),
    env: {},
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'query is required' });
});

test('maps a Deezer track to the CD search result used by the app', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        data: [
          {
            id: 123,
            title: 'Demo Song',
            artist: { name: 'Demo Artist' },
            album: {
              title: 'Demo Album',
              cover_big: 'https://image.example/cover.jpg',
            },
          },
        ],
      }),
      { status: 200 },
    );

  try {
    const response = await search.onRequestGet({
      request: new Request('https://demo.example/api/music/search?q=demo'),
      env: {},
    });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), [
      {
        id: '123',
        title: 'Demo Song',
        artist: 'Demo Artist',
        album_title: 'Demo Album',
        date: '',
        imageUrl: 'https://image.example/cover.jpg',
        type: 'CD',
        genres: [],
      },
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('returns a generic error when a music provider is unavailable', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response('provider failure', { status: 503 });

  try {
    const response = await search.onRequestGet({
      request: new Request('https://demo.example/api/music/search?q=demo'),
      env: {},
    });

    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), {
      error: 'music search is unavailable',
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('returns a usable YouTube URL and duration', async () => {
  const originalFetch = globalThis.fetch;
  const responses = [
    {
      items: [
        {
          id: { videoId: 'video-1' },
          snippet: {
            title: 'Demo Song (Official Audio)',
            channelTitle: 'Demo Artist - Topic',
            description: '',
          },
        },
      ],
    },
    { items: [{ contentDetails: { duration: 'PT3M33S' } }] },
  ];
  globalThis.fetch = async () =>
    new Response(JSON.stringify(responses.shift()), { status: 200 });

  try {
    const response = await video.onRequestGet({
      request: new Request(
        'https://demo.example/api/music/video?title=Demo%20Song&artist=Demo%20Artist',
      ),
      env: { YOUTUBE_API_KEY: 'youtube-key' },
    });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      youtubeUrl: 'https://www.youtube.com/watch?v=video-1',
      duration: 213,
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
