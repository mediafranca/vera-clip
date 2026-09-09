import type { CaptureDraft } from './domain';

const CURRENT = 'currentCapture';
const PENDING = 'pendingCaptures';

export async function savePreview(draft: CaptureDraft): Promise<void> {
  await browser.storage.local.set({ [CURRENT]: draft });
}

export async function getPreview(): Promise<CaptureDraft | undefined> {
  return (await browser.storage.local.get(CURRENT))[CURRENT] as CaptureDraft | undefined;
}

export async function discardPreview(): Promise<void> {
  await browser.storage.local.remove(CURRENT);
}

export async function queuePending(draft: CaptureDraft): Promise<void> {
  const stored = await browser.storage.local.get(PENDING);
  const pending = (stored[PENDING] as CaptureDraft[] | undefined) ?? [];
  const unique = pending.filter(item => item.id !== draft.id);
  await browser.storage.local.set({ [PENDING]: [...unique, draft] });
  await discardPreview();
}
