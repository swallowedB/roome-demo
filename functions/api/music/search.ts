import {
  fetchJson,
  FunctionContext,
  getRequiredQuery,
  getSpotifyToken,
  json,
  unavailable,
} from './_shared';

type SpotifyEnv = {
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
};

type SpotifyTrack = {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: {
    name: string;
    release_date: string;
    images: Array<{ url: string }>;
  };
};

type SpotifySearch = { tracks: { items: SpotifyTrack[] } };
type SpotifyArtist = { genres?: string[] };

const getArtistGenres = async (artistId: string, token: string) => {
  const artist = await fetchJson<SpotifyArtist>(
    `https://api.spotify.com/v1/artists/${encodeURIComponent(artistId)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return artist.genres?.slice(0, 3) ?? [];
};

export const onRequestGet = async (
  context: FunctionContext<SpotifyEnv>,
): Promise<Response> => {
  const query = getRequiredQuery(context.request, 'q', 'query');
  if (query instanceof Response) return query;

  try {
    const token = await getSpotifyToken(context.env);
    const url = new URL('https://api.spotify.com/v1/search');
    url.search = new URLSearchParams({
      q: query,
      type: 'track',
      market: 'KR',
      limit: '10',
    }).toString();

    const result = await fetchJson<SpotifySearch>(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    const tracks = result.tracks.items.filter((track) =>
      /^\d{4}-\d{2}-\d{2}$/.test(track.album.release_date) &&
      Boolean(track.album.images[0]?.url),
    );
    const mapped = [];

    for (const track of tracks) {
      const artist = track.artists[0];
      if (!artist) continue;

      mapped.push({
        id: track.id,
        title: track.name || 'Unknown Title',
        artist: artist.name || 'Unknown Artist',
        album_title: track.album.name || 'Unknown Album',
        date: track.album.release_date,
        imageUrl: track.album.images[0].url,
        type: 'CD' as const,
        genres: await getArtistGenres(artist.id, token),
      });
    }

    return json(mapped);
  } catch {
    return unavailable();
  }
};
