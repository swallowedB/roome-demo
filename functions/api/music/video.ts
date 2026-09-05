import {
  fetchJson,
  FunctionContext,
  getRequiredQuery,
  json,
  parseDurationToSeconds,
  unavailable,
} from './_shared';

type YouTubeEnv = { YOUTUBE_API_KEY?: string };

type SearchResponse = {
  items?: Array<{
    id?: { videoId?: string };
    snippet?: {
      title?: string;
      channelTitle?: string;
      description?: string;
    };
  }>;
};

type VideoResponse = {
  items?: Array<{ contentDetails?: { duration?: string } }>;
};

const normalize = (value: string) =>
  value.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();

const isUsableMusicVideo = (
  item: NonNullable<SearchResponse['items']>[number],
  trackTitle: string,
  artistName: string,
) => {
  const title = normalize(item.snippet?.title ?? '');
  const channel = normalize(item.snippet?.channelTitle ?? '');
  const description = normalize(item.snippet?.description ?? '');
  const hasBadKeyword = [
    'instrumental',
    'no vocals',
    'karaoke',
    'backing track',
    'live',
    'performance',
  ].some((keyword) => title.includes(keyword) || description.includes(keyword));

  if (hasBadKeyword) return false;

  return (
    title.includes('official audio') ||
    title.includes('lyrics') ||
    channel.includes('topic') ||
    channel.includes('vevo') ||
    (title.includes(normalize(trackTitle)) &&
      channel.includes(normalize(artistName)))
  );
};

export const onRequestGet = async (
  context: FunctionContext<YouTubeEnv>,
): Promise<Response> => {
  const title = getRequiredQuery(context.request, 'title');
  if (title instanceof Response) return title;
  const artist = getRequiredQuery(context.request, 'artist');
  if (artist instanceof Response) return artist;

  if (!context.env.YOUTUBE_API_KEY) return unavailable();

  try {
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.search = new URLSearchParams({
      part: 'snippet',
      q: `${title} ${artist} "official audio" OR "lyrics"`,
      type: 'video',
      videoCategoryId: '10',
      maxResults: '10',
      key: context.env.YOUTUBE_API_KEY,
    }).toString();

    const search = await fetchJson<SearchResponse>(searchUrl.toString());
    const selected = search.items?.find((item) =>
      isUsableMusicVideo(item, title, artist),
    );
    const videoId = selected?.id?.videoId;

    if (!videoId) return json({ youtubeUrl: '', duration: 0 });

    const detailsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    detailsUrl.search = new URLSearchParams({
      part: 'contentDetails',
      id: videoId,
      key: context.env.YOUTUBE_API_KEY,
    }).toString();

    const details = await fetchJson<VideoResponse>(detailsUrl.toString());
    const duration = parseDurationToSeconds(
      details.items?.[0]?.contentDetails?.duration ?? 'PT0S',
    );

    return duration >= 30
      ? json({
          youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
          duration,
        })
      : json({ youtubeUrl: '', duration: 0 });
  } catch {
    return unavailable();
  }
};
