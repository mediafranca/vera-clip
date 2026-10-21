import type { LocalDelivery, RemoteDelivery } from './delivery';

const GOVERNED_RELAY = 'https://conecta.mediafranca.net';

export function normalizeLocalDelivery(input: LocalDelivery): LocalDelivery {
  const baseUrl = input.baseUrl.trim();
  const client = input.client.trim();
  const credential = input.credential.trim();
  let parsed: URL;
  try { parsed = new URL(baseUrl); }
  catch { throw new Error('invalid_local_url'); }
  const loopback = parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost';
  if (parsed.protocol !== 'https:' && !(loopback && parsed.protocol === 'http:')) {
    throw new Error('insecure_vera_url');
  }
  if (parsed.origin === GOVERNED_RELAY) throw new Error('relay_is_not_vera');
  if (parsed.pathname !== '/' || parsed.search !== '' || parsed.hash !== '') {
    throw new Error('invalid_vera_origin');
  }
  if (client === '') throw new Error('missing_client');
  if (credential === '') throw new Error('missing_credential');
  return { baseUrl: parsed.origin, client, credential };
}

export function normalizeRemoteDelivery(input: RemoteDelivery): RemoteDelivery {
  const baseUrl = input.baseUrl.trim().replace(/\/$/, '');
  const installationId = input.installationId.trim();
  const credential = input.credential.trim();
  let parsed: URL;
  try { parsed = new URL(baseUrl); }
  catch { throw new Error('invalid_relay_url'); }
  if (parsed.protocol !== 'https:' && parsed.hostname !== '127.0.0.1' && parsed.hostname !== 'localhost') {
    throw new Error('insecure_relay_url');
  }
  const localDevelopment = parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost';
  if (!localDevelopment && parsed.origin !== GOVERNED_RELAY) throw new Error('unsupported_relay_url');
  if (installationId === '') throw new Error('missing_installation');
  if (credential === '') throw new Error('missing_credential');
  return { baseUrl, installationId, credential };
}
