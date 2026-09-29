export type FunctionContext<Env> = {
  request: Request;
  env: Env;
};

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
