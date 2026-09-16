import type { CaptureDraft } from './domain';

export interface RemoteDelivery {
  baseUrl: string;
  installationId: string;
  credential: string;
}

type Fetcher = typeof fetch;

function envelope(draft: CaptureDraft): Record<string, string> {
  return {
    kind: draft.kind,
    title: draft.title,
    url: draft.url,
    content: draft.content,
    capturedAt: draft.capturedAt,
    idempotencyKey: draft.id,
  };
}

export async function deliverLocally(draft: CaptureDraft, fetcher: Fetcher = fetch): Promise<boolean> {
  const response = await fetcher('http://127.0.0.1:4173/captures', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(envelope(draft)),
  });
  return response.ok;
}

export async function deliverRemotely(
  draft: CaptureDraft,
  target: RemoteDelivery,
  fetcher: Fetcher = fetch,
): Promise<boolean> {
  const baseUrl = target.baseUrl.replace(/\/$/, '');
  const response = await fetcher(
    `${baseUrl}/v/${encodeURIComponent(target.installationId)}/captures`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${target.credential}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(envelope(draft)),
    },
  );
  return response.ok;
}
