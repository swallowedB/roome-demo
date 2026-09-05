export type FunctionContext<Env> = {
  request: Request;
  env: Env;
};

type SpotifyToken = {
  value: string;
  expiresAt: number;
};

let spotifyToken: SpotifyToken | null = null;

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  });

export const getRequiredQuery = (
  request: Request,
  name: string,
  label = name,
) => {
  const value = new URL(request.url).searchParams.get(name)?.trim() ?? '';

  if (!value) return json({ error: `${label} is required` }, 400);
  if (value.length > 120) return json({ error: `${label} is too long` }, 400);

  return value;
};

export const fetchJson = async <T>(url: string, init?: RequestInit) => {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error('music provider request failed');
  return response.json() as Promise<T>;
};

export const getSpotifyToken = async (env: {
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
}) => {
  if (spotifyToken && spotifyToken.expiresAt > Date.now()) {
    return spotifyToken.value;
  }

  if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) {
    throw new Error('Spotify credentials are unavailable');
  }

  const credentials = btoa(
    `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
  );
  const result = await fetchJson<{ access_token?: string; expires_in?: number }>(
    'https://accounts.spotify.com/api/token',
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    },
  );

  if (!result.access_token) throw new Error('Spotify token is unavailable');

  spotifyToken = {
    value: result.access_token,
    expiresAt: Date.now() + Math.max((result.expires_in ?? 3600) - 60, 60) * 1000,
  };

  return spotifyToken.value;
};

export const parseDurationToSeconds = (duration: string) => {
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return 0;

  return (
    Number(match[1] ?? 0) * 3600 +
    Number(match[2] ?? 0) * 60 +
    Number(match[3] ?? 0)
  );
};

export const unavailable = () =>
  json({ error: 'music search is unavailable' }, 502);
