# Vera Clip

Vera Clip será una extensión libre para incorporar al grafo de
[Vera](https://github.com/mediafranca/vera) lo que una persona encuentra en la
web. Toda captura llega primero a la bitácora del día, conserva su procedencia y
puede reubicarse después como un subárbol sin perder identidad ni historia.

## Estado

Primer corte ejecutable en desarrollo. Ya existen compilaciones WebExtensions
para Chromium y Firefox, botón permanente del navegador, captura por menú
contextual, extracción de selección o artículo legible, previsualización y cola
local cuando Vera no responde. La extensión entrega el mismo sobre idempotente a
Vera local o al endpoint estrecho de Vera Conecta. El destino remoto se configura
desde la propia extensión y la puerta canónica `POST /captures` ya existe en Vera.

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
La distribución es directa, mediante dos paquetes —Chromium y Firefox—, sin
publicación en tiendas. El paquete Firefox deberá firmarse como unlisted por
Mozilla para instalarse en versiones estables, pero se distribuirá por medios
propios.

El prototipo autocontenido de la página pública vive en
[`site/index.html`](site/index.html). Sus descargas anticipan los nombres de la
distribución pública futura: `vera-clip-chromium.zip` y
`vera-clip-firefox.xpi`. Mientras no exista una release firmada, los artefactos
locales de desarrollo son los que genera `npm run package:all` dentro de
`dist/`; el ZIP de Firefox no sustituye al XPI firmado.

## Especificaciones

1. [`specs/capture.allium`](specs/capture.allium): qué se captura y cómo nace en
   la bitácora.
2. [`specs/delivery.allium`](specs/delivery.allium): entrega local, relay remoto,
   reintentos y ausencia de almacenamiento en VERA Conecta.
3. [`specs/authorization.allium`](specs/authorization.allium): emparejamiento,
   alcance mínimo, revocación y límites de exposición.
4. [`specs/browser-compatibility.allium`](specs/browser-compatibility.allium):
   navegadores admitidos y paridad funcional del MVP.

## Compilar y probar

La salida deliberadamente visible vive en `dist/`; `.output/` ya no se usa. Para
generar los dos árboles cargables y ejecutar todas las comprobaciones:

```sh
allium check specs/*.allium
npm ci
npm run check
```

El resultado es:

- `dist/chrome-mv3/`: extensión Chromium descomprimida;
- `dist/firefox-mv2/`: extensión Firefox/Zen descomprimida.

Para generar además los paquetes con nombres estables:

```sh
npm run package:all
```

Eso deja `dist/vera-clip-chrome.zip`, `dist/vera-clip-firefox.zip` y el paquete
de fuentes requerido por Firefox. El ZIP de Firefox aún no está firmado: no es
un XPI instalable de forma permanente en Firefox o Zen estable.

## Probar en Zen o Firefox

1. Ejecuta `npm ci && npm run build:firefox`.
2. Abre `about:debugging#/runtime/this-firefox`.
3. Pulsa **Cargar complemento temporal**.
4. Selecciona `dist/firefox-mv2/manifest.json`.

La extensión permanece cargada hasta cerrar el navegador. El botón de Vera Clip
aparece en la barra —puede estar dentro del menú de extensiones— y ofrece
**Capturar selección**, **Capturar artículo** y **Configurar destino**. El menú
contextual conserva las dos capturas.

## Configurar Vera remota

Desde **Configurar destino**, guarda:

1. la dirección de Vera Conecta;
2. el identificador público de la instalación Vera;
3. una credencial limitada al alcance `capture`.

La extensión sólo tiene autoridad de red sobre Vera local y el relay gobernado
`conecta.mediafranca.net`; una URL arbitraria se rechaza aunque use HTTPS. La
credencial queda en el almacén privado de la extensión, no en el repositorio ni
en las capturas. Vera Clip intenta primero `127.0.0.1:4173`; si esa Vera local no
responde, usa el destino remoto configurado.

Durante el desarrollo, `npm run dev` abre Chromium y `npm run dev:firefox` abre
Firefox.

## Licencia prevista

GNU AGPLv3, coherente con Vera y VERA Conecta. Se añadirá el texto de licencia
antes del primer código distribuible.
