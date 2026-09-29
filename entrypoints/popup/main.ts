import './style.css';

const status = document.querySelector<HTMLParagraphElement>('#status')!;

async function capture(kind: 'selection' | 'article'): Promise<void> {
  status.textContent = 'Preparando…';
  try {
    await browser.runtime.sendMessage({ type: 'capture-current', kind });
    window.close();
  } catch (error) {
    status.textContent = error instanceof Error && error.message.includes('empty_capture')
      ? 'No hay texto seleccionado.'
      : 'Esta página no se puede capturar.';
  }
}

document.querySelector<HTMLButtonElement>('#selection')!.addEventListener('click', () => void capture('selection'));
document.querySelector<HTMLButtonElement>('#article')!.addEventListener('click', () => void capture('article'));
document.querySelector<HTMLButtonElement>('#settings')!.addEventListener('click', () => void browser.runtime.openOptionsPage());
