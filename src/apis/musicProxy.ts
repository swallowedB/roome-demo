export async function requestMusic<T>(path: string): Promise<T> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error('music request failed');
  }

  return response.json() as Promise<T>;
}
