export interface PostJsonOptions<TBody> {
  url: string;
  body: TBody;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export async function postJson<TResponse, TBody = unknown>({
  url,
  body,
  signal,
  headers
}: PostJsonOptions<TBody>): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(body),
    signal
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status} ${response.statusText}: ${text}`.trim());
  }

  return response.json() as Promise<TResponse>;
}
