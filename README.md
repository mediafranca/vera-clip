# Vera Clip

Vera Clip será una extensión libre para incorporar al grafo de
[Vera](https://github.com/mediafranca/vera) lo que una persona encuentra en la
web. Toda captura llega primero a la bitácora del día, conserva su procedencia y
puede reubicarse después como un subárbol sin perder identidad ni historia.

## Estado

Repositorio de especificación. Todavía no hay extensión ni endpoints
implementados.

El primer corte especificado cubre:

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

## Especificaciones

1. [`specs/capture.allium`](specs/capture.allium): qué se captura y cómo nace en
   la bitácora.
2. [`specs/delivery.allium`](specs/delivery.allium): entrega local, relay remoto,
   reintentos y ausencia de almacenamiento en VERA Conecta.
3. [`specs/authorization.allium`](specs/authorization.allium): emparejamiento,
   alcance mínimo, revocación y límites de exposición.

Validación:

```sh
allium check specs/*.allium
```

## Licencia prevista

GNU AGPLv3, coherente con Vera y VERA Conecta. Se añadirá el texto de licencia
antes del primer código distribuible.
