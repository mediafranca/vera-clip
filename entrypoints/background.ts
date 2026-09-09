import { createDraft, type CaptureKind } from '../lib/domain';
import { savePreview } from '../lib/storage';

const items: Array<{ id: CaptureKind; title: string; contexts: browser.contextMenus.ContextType[] }> = [
  { id: 'selection', title: 'Guardar selección en Vera', contexts: ['selection'] },
  { id: 'article', title: 'Guardar artículo en Vera', contexts: ['page'] },
];

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async () => {
    await browser.contextMenus.removeAll();
    for (const item of items) browser.contextMenus.create(item);
  });

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab?.id || !tab.url || !items.some(item => item.id === info.menuItemId)) return;
    const kind = info.menuItemId as CaptureKind;
    const extracted = await browser.tabs.sendMessage(tab.id, {
      type: kind === 'selection' ? 'extract-selection' : 'extract-article',
    }) as { content?: string; title?: string };
    const draft = createDraft({
      kind,
      title: extracted.title || tab.title || tab.url,
      url: tab.url,
      content: extracted.content || info.selectionText || '',
    });
    await savePreview(draft);
    await browser.tabs.create({ url: browser.runtime.getURL('/preview.html') });
  });
});
