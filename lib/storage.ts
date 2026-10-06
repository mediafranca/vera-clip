import type { CaptureDraft } from './domain';
import type { LocalDelivery, RemoteDelivery } from './delivery';

const CURRENT = 'currentCapture';
const PENDING = 'pendingCaptures';
const LOCAL = 'localDelivery';
const REMOTE = 'remoteDelivery';

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

export async function getRemoteDelivery(): Promise<RemoteDelivery | undefined> {
  return (await browser.storage.local.get(REMOTE))[REMOTE] as RemoteDelivery | undefined;
}

export async function getLocalDelivery(): Promise<LocalDelivery | undefined> {
  return (await browser.storage.local.get(LOCAL))[LOCAL] as LocalDelivery | undefined;
}

export async function saveLocalDelivery(target: LocalDelivery): Promise<void> {
  await browser.storage.local.set({ [LOCAL]: target });
}

export async function clearLocalDelivery(): Promise<void> {
  await browser.storage.local.remove(LOCAL);
}

export async function saveRemoteDelivery(target: RemoteDelivery): Promise<void> {
  await browser.storage.local.set({ [REMOTE]: target });
}

export async function clearRemoteDelivery(): Promise<void> {
  await browser.storage.local.remove(REMOTE);
}
