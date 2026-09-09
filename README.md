# Vera Clip

Vera Clip será una extensión libre para incorporar al grafo de
[Vera](https://github.com/mediafranca/vera) lo que una persona encuentra en la
web. Toda captura llega primero a la bitácora del día, conserva su procedencia y
puede reubicarse después como un subárbol sin perder identidad ni historia.

## Estado

Primer corte ejecutable en desarrollo. Ya existen compilaciones WebExtensions
para Chromium y Firefox, captura por menú contextual, extracción de selección o
artículo legible, previsualización y cola local cuando Vera no responde. El
endpoint `/captures`, la autorización y la entrega mediante Vera Conecta aún no
están implementados extremo a extremo.

El primer corte especificado cubre:

- extensiones WebExtensions para Chrome, Edge y Brave sobre Chromium, y para
  Firefox;
- selección de texto y artículo legible;
- previsualización antes de enviar;
- entrega directa a Vera local o remota mediante
  [VERA Conecta](https://github.com/mediafranca/vera-conecta);
- cola privada en el dispositivo cuando Vera no está disponible;
- credencial revocable con alcance exclusivo de captura;
- creación atómica e idempotente del subárbol en la bitácora del día.

Archivar una página completa como copia fiel queda fuera del MVP y se conserva
como pregunta de diseño: no debe confundirse una nota legible con una custodia
forense de recursos, scripts y versiones.

Safari y otros navegadores WebKit quedan fuera del primer corte.

## Especificaciones

1. [`specs/capture.allium`](specs/capture.allium): qué se captura y cómo nace en
   la bitácora.
2. [`specs/delivery.allium`](specs/delivery.allium): entrega local, relay remoto,
   reintentos y ausencia de almacenamiento en VERA Conecta.
3. [`specs/authorization.allium`](specs/authorization.allium): emparejamiento,
   alcance mínimo, revocación y límites de exposición.
4. [`specs/browser-compatibility.allium`](specs/browser-compatibility.allium):
   navegadores admitidos y paridad funcional del MVP.

Validación:

```sh
allium check specs/*.allium
npm install
npm run check
```

Durante el desarrollo, `npm run dev` abre el destino Chromium y
`npm run dev:firefox` abre Firefox. Las compilaciones de producción se generan
con `npm run build` y `npm run build:firefox`.

## Licencia prevista

GNU AGPLv3, coherente con Vera y VERA Conecta. Se añadirá el texto de licencia
antes del primer código distribuible.
