import { describe, expect, it } from 'vitest';
import { deliverLocally, deliverRemotely } from '../lib/delivery';
import type { CaptureDraft } from '../lib/domain';
import { normalizeRemoteDelivery } from '../lib/config';

const draft: CaptureDraft = {
  id: 'stable-capture',
  kind: 'selection',
  title: 'Fuente',
  url: 'https://example.com/article',
  content: 'Texto',
  capturedAt: '2026-09-16T12:00:00.000Z',
  status: 'pending',
};

describe('capture delivery', () => {
  it('preserva el identificador de idempotencia en la ruta local', async () => {
    const calls: Array<[RequestInfo | URL, RequestInit | undefined]> = [];
    const fetcher: typeof fetch = async (input, init) => {
      calls.push([input, init]);
      return new Response(null, { status: 202 });
    };
    await expect(deliverLocally(draft, fetcher)).resolves.toBe(true);
    expect(JSON.parse(String(calls[0]?.[1]?.body))).toMatchObject({ idempotencyKey: 'stable-capture' });
  });

  it('usa el endpoint estrecho y la credencial de captura en Vera Conecta', async () => {
    const calls: Array<[RequestInfo | URL, RequestInit | undefined]> = [];
    const fetcher: typeof fetch = async (input, init) => {
      calls.push([input, init]);
      return new Response(null, { status: 202 });
    };
    await expect(deliverRemotely(draft, {
      baseUrl: 'https://conecta.mediafranca.net/',
      installationId: 'vera/uno',
      credential: 'capture-secret',
    }, fetcher)).resolves.toBe(true);

    expect(calls[0]).toEqual([
      'https://conecta.mediafranca.net/v/vera%2Funo/captures',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ authorization: 'Bearer capture-secret' }),
      }),
    ]);
    expect(JSON.parse(String(calls[0]?.[1]?.body))).toMatchObject({ idempotencyKey: 'stable-capture' });
  });
});

describe('remote destination configuration', () => {
  it('normalizes the governed relay target', () => {
    const target = normalizeRemoteDelivery({
      baseUrl: ' https://conecta.mediafranca.net/ ',
      installationId: ' vera-1 ',
      credential: ' capture-secret ',
    });
    expect(target).toEqual({
      baseUrl: 'https://conecta.mediafranca.net',
      installationId: 'vera-1',
      credential: 'capture-secret',
    });
  });

  it('rejects an insecure remote relay', () => {
    expect(() => normalizeRemoteDelivery({
      baseUrl: 'http://conecta.example', installationId: 'vera-1', credential: 'secret',
    })).toThrow('insecure_relay_url');
  });

  it('rejects an ungoverned relay even when it uses HTTPS', () => {
    expect(() => normalizeRemoteDelivery({
      baseUrl: 'https://another-relay.example', installationId: 'vera-1', credential: 'secret',
    })).toThrow('unsupported_relay_url');
  });
});
