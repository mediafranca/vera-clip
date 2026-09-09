import { confirmDraft } from '../../lib/domain';
import { deliverLocally } from '../../lib/delivery';
import { discardPreview, getPreview, queuePending } from '../../lib/storage';
import './style.css';

const source = document.querySelector<HTMLParagraphElement>('#source')!;
const content = document.querySelector<HTMLTextAreaElement>('#content')!;
const status = document.querySelector<HTMLParagraphElement>('#status')!;
const confirm = document.querySelector<HTMLButtonElement>('#confirm')!;
const discard = document.querySelector<HTMLButtonElement>('#discard')!;
const draft = await getPreview();

if (!draft) {
  status.textContent = 'No hay una captura para revisar.';
  confirm.disabled = true;
} else {
  source.textContent = `${draft.title} · ${draft.url}`;
  content.value = draft.content;
}

discard.addEventListener('click', async () => {
  await discardPreview();
  window.close();
});

confirm.addEventListener('click', async () => {
  if (!draft) return;
  confirm.disabled = true;
  const pending = confirmDraft(draft);
  try {
    if (await deliverLocally(pending)) {
      status.textContent = 'Guardado en Vera.';
      await discardPreview();
      return;
    }
  } catch { /* Vera local no está disponible: conservar abajo. */ }
  await queuePending(pending);
  status.textContent = 'Vera no está disponible. La captura quedó pendiente en este navegador.';
});
