# Changelog

## [TODO]

- [x] Cambiar JQuery por vanilla Javascript.
- [ ] Reemplazar JQuery Toast por algo que no use JQuery.

## [1.4.0] - 08-12-2022

### Arreglado

- Ahora se puede ejecutar en videos de Reddit, como en `https://external-preview.redd.it/...`.

### Eliminado

- Eliminé la función `anyInViewport()` ya que voy a usar la función singular para controlar la aparición del toast.

### Modificado

- `getVideo()` ahora regresa el primer resultado de `getVideos()` por si el único video que aparece no tiene estilos cargados.
- Moví el código para controlar la aparición del toast a su propia función `controlToast()` para que muestre su documentación.
- En `controlToast()` volví a usar `isInViewport()` para ver si hay un video en la pantalla y asi mostrar el toast.

## [1.3.2] - 06-10-2022

### Agregado

- Función `anyInViewport()` que aplica la función `isInViewport()` a todos los videos.
- Función `getLoop()` que obtiene el valor de `video.loop` del primer video.
- Función `getVideos()` que obtiene un arreglo con todos los videos.
- Función `setLoop()` que obtiene el valor de `.loop` del primer video y establece ese atributo al valor opuesto en todos los videos.
- Función `setPlaybackRate()` que establece la velocidad de todos los videos a un valor determinado.

### Arreglado

- Nueva implementación para asegurarme que el video actual conserve la misma velocidad que el video anterior, al cambiar la velocidad de todos los elementos `<video>`.

### Eliminado

- Eliminé el mensaje por consola de cambio automático de la velocidad, ya que quité la comprobación del cambio de velocidad.

## [1.3.1] - 15-09-2022

### Modificado

- Cambié las llamadas de JQuery que faltaban a funciones del DOM.

## [1.3.0] - 13-09-2022

### Arreglado

- Con la nueva implementación de `getVideo()` el script debería poder mantener la misma velocidad entre cambios de videos tanto en modo normal como en Shorts.

### Modificado

- Cambié las referencias del elemento `<video>` para usar Javascript común.
    - Velocidad del video: `video.playbackRate`
    - Bucle: `video.loop`
    - Tiempo: `video.currentTime`
    - Estilo: `video.style`
- La función `getVideo()` ahora busca todos los elementos `<video>` y devuelve el video con atributos de estilos que debe ser el video en reproducción de la página.
- Ahora la función `isInViewport()` funciona con un elemento DOM en lugar de JQuery. Saqué el código de: [https://www.javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/](https://www.javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/)


## [1.2.2] - 30-07-2022

### Arreglado

- En la parte del interval que cambia la velocidad del video a la velocidad establecida en el script quité el código que extrae el Id de YouTube por si se utiliza el script afuera de los videos clásicos de YouTube. Ahora se cambia la velocidad cuando se navega en los shorts.

## [1.2.1] - 15-07-2022

### Arreglado

- En el intervalo se estaba tratando de modificar la velocidad del video aún si no existía ya que comprobaba si la propiedad del video `playbackRate` era distinto que `currentPlaybackRate` pero si el video no estaba entonces siempre daba distinto que `null`.

### Modificado

- Modifiqué el intervalo para que logée el cambio de velocidad de un video al valor actual de `currentPlaybackRate`.

## [1.2.0] - 27-06-2022

### Modificado

- Convertí el código para ser usado en Mozilla Firefox.
    - Agregué una constante para determinar si el navegador actual es Firefox.
    - Si el navegador es Firefox el script establece **C-n°** para cambiar la velocidad del video, sino **C-S-n°**

## [1.1.1] - 08-05-2022

### Arreglado

- Arreglé la variable `delta_t` que la escribí mal cuando estuve refactorizando.

## [1.1.0] - 08-05-2022

### Arreglado

- Hice que pueda funcionar al mover el `@require .../videos.js` atrás de los `@require` de JQuery.
