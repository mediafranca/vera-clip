import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    browser.runtime.onMessage.addListener(async message => {
      if (message?.type === 'extract-selection') {
        return { content: window.getSelection()?.toString() ?? '', title: document.title };
      }
      if (message?.type === 'extract-article') {
        const article = new Readability(document.cloneNode(true) as Document).parse();
        if (!article?.content) return { content: '' };
        const markdown = new TurndownService().turndown(article.content);
        return { content: markdown, title: article.title };
      }
      return undefined;
    });
  },
});
