import { createDraft, type CaptureKind } from '../lib/domain';
import { savePreview } from '../lib/storage';

const items: Array<{ id: CaptureKind; title: string; contexts: browser.contextMenus.ContextType[] }> = [
  { id: 'selection', title: 'Guardar selección en Vera', contexts: ['selection'] },
  { id: 'article', title: 'Guardar artículo en Vera', contexts: ['page'] },
];

async function prepareCapture(tab: browser.tabs.Tab, kind: CaptureKind): Promise<void> {
  if (!tab.id || !tab.url) throw new Error('active_tab_unavailable');
  const extracted = await browser.tabs.sendMessage(tab.id, {
    type: kind === 'selection' ? 'extract-selection' : 'extract-article',
  }) as { content?: string; title?: string };
  const draft = createDraft({
    kind,
    title: extracted.title || tab.title || tab.url,
    url: tab.url,
    content: extracted.content || '',
  });
  await savePreview(draft);
  await browser.tabs.create({ url: browser.runtime.getURL('/preview.html') });
}

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async () => {
    await browser.contextMenus.removeAll();
    for (const item of items) browser.contextMenus.create(item);
  });

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab?.id || !tab.url || !items.some(item => item.id === info.menuItemId)) return;
    const kind = info.menuItemId as CaptureKind;
    await prepareCapture(tab, kind);
  });

  browser.runtime.onMessage.addListener(async message => {
    if (message?.type !== 'capture-current') return undefined;
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error('active_tab_unavailable');
    await prepareCapture(tab, message.kind as CaptureKind);
    return { ok: true };
  });
});
