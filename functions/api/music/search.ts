import {
  fetchJson,
  FunctionContext,
  getRequiredQuery,
  json,
  unavailable,
} from './_shared';

type DeezerTrack = {
  id: number;
  title: string;
  artist: { name: string };
  album: {
    title: string;
    cover_big: string;
  };
};

type DeezerSearch = { data?: DeezerTrack[] };

export const onRequestGet = async (
  context: FunctionContext<Record<string, never>>,
): Promise<Response> => {
  const query = getRequiredQuery(context.request, 'q', 'query');
  if (query instanceof Response) return query;

  try {
    const url = new URL('https://api.deezer.com/search');
    url.search = new URLSearchParams({
      q: query,
      limit: '10',
    }).toString();

    const result = await fetchJson<DeezerSearch>(url.toString());
    return json(
      (result.data ?? [])
        .filter((track) => Boolean(track.album.cover_big))
        .map((track) => ({
          id: String(track.id),
          title: track.title || 'Unknown Title',
          artist: track.artist.name || 'Unknown Artist',
          album_title: track.album.title || 'Unknown Album',
          date: '',
          imageUrl: track.album.cover_big,
          type: 'CD' as const,
          genres: [],
        })),
    );
  } catch {
    return unavailable();
  }
};
