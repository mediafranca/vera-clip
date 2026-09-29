import { normalizeRemoteDelivery } from '../../lib/config';
import { clearRemoteDelivery, getRemoteDelivery, saveRemoteDelivery } from '../../lib/storage';
import './style.css';

const form = document.querySelector<HTMLFormElement>('#remote')!;
const baseUrl = document.querySelector<HTMLInputElement>('#base-url')!;
const installationId = document.querySelector<HTMLInputElement>('#installation-id')!;
const credential = document.querySelector<HTMLInputElement>('#credential')!;
const status = document.querySelector<HTMLParagraphElement>('#status')!;
const forget = document.querySelector<HTMLButtonElement>('#forget')!;

const stored = await getRemoteDelivery();
if (stored) {
  baseUrl.value = stored.baseUrl;
  installationId.value = stored.installationId;
  credential.value = stored.credential;
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  status.textContent = '';
  try {
    const target = normalizeRemoteDelivery({
      baseUrl: baseUrl.value,
      installationId: installationId.value,
      credential: credential.value,
    });
    await saveRemoteDelivery(target);
    status.textContent = 'Destino guardado.';
  } catch (error) {
    status.textContent = 'Revisa la dirección, la instalación y la credencial.';
  }
});

forget.addEventListener('click', async () => {
  await clearRemoteDelivery();
  installationId.value = '';
  credential.value = '';
  status.textContent = 'Destino olvidado.';
});
