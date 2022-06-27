# Changelog

## [TODO]

- Cambiar JQuery por vanilla Javascript.

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
