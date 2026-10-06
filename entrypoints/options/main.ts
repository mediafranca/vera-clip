import { normalizeLocalDelivery, normalizeRemoteDelivery } from '../../lib/config';
import {
  clearLocalDelivery,
  clearRemoteDelivery,
  getLocalDelivery,
  getRemoteDelivery,
  saveLocalDelivery,
  saveRemoteDelivery,
} from '../../lib/storage';
import './style.css';

const localForm = document.querySelector<HTMLFormElement>('#local')!;
const localAuthorization = document.querySelector<HTMLTextAreaElement>('#local-authorization')!;
const localStatus = document.querySelector<HTMLParagraphElement>('#local-status')!;
const forgetLocal = document.querySelector<HTMLButtonElement>('#forget-local')!;
const form = document.querySelector<HTMLFormElement>('#remote')!;
const baseUrl = document.querySelector<HTMLInputElement>('#base-url')!;
const installationId = document.querySelector<HTMLInputElement>('#installation-id')!;
const credential = document.querySelector<HTMLInputElement>('#credential')!;
const status = document.querySelector<HTMLParagraphElement>('#status')!;
const forget = document.querySelector<HTMLButtonElement>('#forget')!;

const storedLocal = await getLocalDelivery();
if (storedLocal) localAuthorization.value = JSON.stringify(storedLocal, null, 2);

localForm.addEventListener('submit', async event => {
  event.preventDefault();
  localStatus.textContent = '';
  try {
    const parsed = JSON.parse(localAuthorization.value) as {
      url?: unknown;
      baseUrl?: unknown;
      client?: unknown;
      credential?: unknown;
    };
    const target = normalizeLocalDelivery({
      baseUrl: String(parsed.baseUrl ?? parsed.url ?? ''),
      client: String(parsed.client ?? ''),
      credential: String(parsed.credential ?? ''),
    });
    await saveLocalDelivery(target);
    localAuthorization.value = JSON.stringify(target, null, 2);
    localStatus.textContent = 'Vera Clip puede depositar directamente en esta Vera.';
  } catch {
    localStatus.textContent = 'Pega la autorización completa entregada por Vera.';
  }
});

forgetLocal.addEventListener('click', async () => {
  await clearLocalDelivery();
  localAuthorization.value = '';
  localStatus.textContent = 'Autorización local olvidada. Revócala también en Vera si ya no la usarás.';
});

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
