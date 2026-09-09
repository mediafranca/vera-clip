export type CaptureKind = 'selection' | 'article';
export type CaptureStatus = 'preview' | 'pending' | 'accepted';

export interface CaptureDraft {
  id: string;
  kind: CaptureKind;
  title: string;
  url: string;
  content: string;
  capturedAt: string;
  status: CaptureStatus;
}

export function createDraft(
  input: Omit<CaptureDraft, 'id' | 'capturedAt' | 'status'>,
  now = new Date(),
  id: string = crypto.randomUUID(),
): CaptureDraft {
  const content = input.content.trim();
  if (!content) throw new Error('empty_capture');
  return { ...input, content, id, capturedAt: now.toISOString(), status: 'preview' };
}

export function confirmDraft(draft: CaptureDraft): CaptureDraft {
  if (draft.status !== 'preview') throw new Error('capture_not_in_preview');
  return { ...draft, status: 'pending' };
}
