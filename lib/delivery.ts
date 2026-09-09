import type { CaptureDraft } from './domain';

export async function deliverLocally(draft: CaptureDraft): Promise<boolean> {
  const response = await fetch('http://127.0.0.1:4173/captures', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      kind: draft.kind,
      title: draft.title,
      url: draft.url,
      content: draft.content,
      capturedAt: draft.capturedAt,
      idempotencyKey: draft.id,
    }),
  });
  return response.ok;
}
