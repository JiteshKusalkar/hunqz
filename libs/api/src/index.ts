export async function getJson<T>(path: string, options: { baseUrl?: string } = {}): Promise<T> {
  const url = options.baseUrl ? new URL(path, options.baseUrl).toString() : path;

  const response = await fetch(url, {
    headers: { accept: 'application/json' },
    // Avoid stale cached JSON during local development and when image URLs change.
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}
