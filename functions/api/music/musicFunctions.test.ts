import assert from 'node:assert/strict';
import test from 'node:test';
import * as search from './search';
import * as video from './video';

const spotifyEnv = {
  SPOTIFY_CLIENT_ID: 'client-id',
  SPOTIFY_CLIENT_SECRET: 'client-secret',
};

test('rejects a Spotify search without q', async () => {
  const response = await search.onRequestGet({
    request: new Request('https://demo.example/api/music/search'),
    env: spotifyEnv,
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'query is required' });
});

test('maps a Spotify track to the CD search result used by the app', async () => {
  const originalFetch = globalThis.fetch;
  const responses = [
    { access_token: 'token', expires_in: 3600 },
    {
      tracks: {
        items: [
          {
            id: 'track-1',
            name: 'Demo Song',
            artists: [{ id: 'artist-1', name: 'Demo Artist' }],
            album: {
              name: 'Demo Album',
              release_date: '2024-01-02',
              images: [{ url: 'https://image.example/cover.jpg' }],
            },
          },
        ],
      },
    },
    { genres: ['indie', 'pop', 'rock', 'extra'] },
  ];
  globalThis.fetch = async () =>
    new Response(JSON.stringify(responses.shift()), { status: 200 });

  try {
    const response = await search.onRequestGet({
      request: new Request('https://demo.example/api/music/search?q=demo'),
      env: spotifyEnv,
    });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), [
      {
        id: 'track-1',
        title: 'Demo Song',
        artist: 'Demo Artist',
        album_title: 'Demo Album',
        date: '2024-01-02',
        imageUrl: 'https://image.example/cover.jpg',
        type: 'CD',
        genres: ['indie', 'pop', 'rock'],
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
      env: spotifyEnv,
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
