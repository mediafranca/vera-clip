# Corte inicial de producto

Vera Clip reduce la distancia entre encontrar algo y hacerlo parte de la
memoria. No organiza automáticamente el grafo ni decide el destino definitivo:
deposita una captura trazable en la bitácora del día y deja la ordinatio para
después.

## Navegadores del primer corte

Vera Clip se distribuye como extensión WebExtensions para Chrome, Edge y Brave
sobre Chromium, y para Firefox. Los cuatro navegadores ofrecen el mismo
recorrido esencial: capturar selección o artículo, previsualizar, confirmar,
entregar y administrar pendientes. Las diferencias de manifiesto y APIs se
resuelven en adaptadores de plataforma y no reducen esa paridad funcional.

Safari y otros navegadores WebKit quedan fuera del MVP.

## Distribución

Vera Clip no se publica en tiendas de extensiones. El proyecto entrega por
medios propios dos paquetes: uno Chromium MV3 para Chrome, Edge y Brave, y uno
Firefox. Firefox estable exige que Mozilla firme incluso las extensiones
autodistribuidas; esa firma se obtiene en el canal unlisted de AMO, sin ficha
pública ni distribución mediante su catálogo.

La página pública de Vera enlaza una página breve de Vera Clip que explica esta
decisión, ofrece instrucciones separadas para Chromium y Firefox y descarga los
artefactos de la publicación más reciente desde GitHub Releases. Los nombres de
archivo permanecen estables para que el enlace `releases/latest/download`
siempre resuelva a la versión vigente.

## Recorrido principal

1. La persona selecciona texto o pide capturar el artículo legible.
2. La extensión muestra exactamente qué contenido y procedencia enviará.
3. La persona confirma.
4. La extensión intenta primero la Vera local configurada; cuando el dispositivo
   está asociado por VERA Conecta, puede usar la ruta remota correspondiente.
5. Vera encuentra o crea la bitácora del día y añade un solo subárbol de captura.
6. La extensión confirma el destino; un reintento nunca duplica la captura.

## Forma inicial en Vera

El bloque raíz nombra la página fuente y enlaza su URL. Sus hijos distinguen el
contenido capturado de la procedencia verificable. La captura no pretende que el
texto externo sea voz de Herbert ni que la fecha de captura sea la fecha de
autoría de la fuente.

## Fuera del primer corte

- clasificación, resumen o enlazado mediante IA;
- vigilancia automática de páginas y capturas sin gesto humano;
- sincronización general del grafo;
- lectura o búsqueda del corpus desde la extensión;
- archivo fiel de páginas completas;
- captura de contenido inaccesible para la persona o prohibido por el navegador.
