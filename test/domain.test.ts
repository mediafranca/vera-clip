import { describe, expect, it } from 'vitest';
import { confirmDraft, createDraft } from '../lib/domain';

describe('capture lifecycle', () => {
  it('prepares a traceable selection for preview', () => {
    const draft = createDraft({ kind: 'selection', title: 'Fuente', url: 'https://example.com', content: ' texto ' }, new Date('2026-09-09T12:00:00Z'), 'same-key');
    expect(draft).toMatchObject({ id: 'same-key', content: 'texto', status: 'preview' });
  });

  it('rejects an empty capture', () => {
    expect(() => createDraft({ kind: 'article', title: 'Fuente', url: 'https://example.com', content: '   ' })).toThrow('empty_capture');
  });

  it('moves a preview to the pending delivery state without changing identity', () => {
    const draft = createDraft({ kind: 'article', title: 'Fuente', url: 'https://example.com', content: 'Texto' }, new Date(), 'stable-key');
    expect(confirmDraft(draft)).toMatchObject({ id: 'stable-key', status: 'pending' });
  });

  it('cannot confirm the same capture twice', () => {
    const draft = createDraft({ kind: 'selection', title: 'Fuente', url: 'https://example.com', content: 'Texto' });
    expect(() => confirmDraft(confirmDraft(draft))).toThrow('capture_not_in_preview');
  });
});
