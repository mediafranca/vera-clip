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

## Instalar la extensión

Necesitas una copia compilada: `npm ci`, luego `npm run build` (Chromium) y
`npm run build:firefox` (Firefox/Zen). Los árboles quedan en `dist/chrome-mv3/`
y `dist/firefox-mv2/`; `npm run package:all` genera además los ZIP.

### Chrome, Edge, Brave, Opera y Vivaldi (Chromium)

1. Abre la página de extensiones: `chrome://extensions`, `edge://extensions`,
   `brave://extensions`, `opera://extensions` o `vivaldi://extensions`.
2. Activa **Modo de desarrollador**.
3. Pulsa **Cargar descomprimida** y elige la **carpeta** `dist/chrome-mv3/`
   (no el `manifest.json` ni un ZIP: estos navegadores no instalan ZIP sin
   firmar).
4. Fija el botón desde el menú de extensiones (icono de pieza de puzle).

La extensión permanece instalada entre sesiones. Tras recompilar, pulsa el
botón de recarga de su tarjeta.

### Firefox, Zen y otros derivados de Firefox

Firefox estable sólo instala de forma permanente extensiones firmadas por
Mozilla; el ZIP de `npm run package:firefox` no lo está. Hay tres caminos:

**A. Temporal (cualquier Firefox o Zen).** Dura hasta cerrar el navegador.

1. Abre `about:debugging#/runtime/this-firefox`.
2. Pulsa **Cargar complemento temporal…**.
3. Elige el archivo `dist/firefox-mv2/manifest.json`. Si el selector no te
   deja marcarlo (ocurre en Zen y en macOS), pega la ruta con `Cmd+Shift+G` o
   elige en su lugar `dist/vera-clip-firefox.zip`: este cargador también acepta
   ZIP y XPI.
4. Tras recompilar, pulsa **Recargar** en la misma tarjeta.

**B. Permanente sin firmar (Zen, Firefox Developer Edition, Nightly, ESR).**
Estas ediciones permiten desactivar la verificación de firma; Firefox estable
ignora el ajuste.

1. En `about:config` pon `xpinstall.signatures.required` en `false`.
2. Abre `about:addons`, pulsa el engranaje → **Instalar complemento desde
   archivo…** y elige `dist/vera-clip-firefox.zip`.

**C. Firmada (cualquier Firefox estable).** Sube el paquete como *unlisted* en
el portal de Mozilla para obtener un XPI firmado, e instálalo como en B. Es la
vía prevista para la distribución pública.

Para probar en un perfil aislado, `npm run dev:firefox` abre Firefox con la
extensión cargada y recarga en caliente.

### Safari

Fuera del primer corte.

### Después de instalar

El botón de Vera Clip aparece en la barra —puede estar dentro del menú de
extensiones— y ofrece **Capturar selección**, **Capturar artículo** y
**Configurar destino**. El menú contextual conserva las dos capturas.

Si al enviar la consola muestra `CORS Missing Allow Origin` hacia
`127.0.0.1:4173`, el navegador no concedió el permiso de red de la extensión:
quita la extensión y vuelve a cargarla desde una compilación reciente, y en
`about:addons` → Vera Clip → **Permisos** comprueba que el acceso a
`127.0.0.1` esté activo.

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
