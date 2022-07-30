# Changelog

## [TODO]

- Cambiar JQuery por vanilla Javascript.

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
