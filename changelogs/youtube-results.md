# Changelog

## [Unreleased]

## [1.5.0] - 15-10-2022

### Agregado

- Agregué items del menú de contexto de Tampermonkey para ejecutar las funciones del script con `GM_registerMenuCommand()`.
- Agregué las funciones `changeSortOrder_fecsub` y `changeSortOrder_numvis` para ejecutar la función `changeSortOrder` con el criterio de orden respectivo con el menú y los atajos del teclado.

## [1.4.0] - 10-10-2022

### Agregado

- Función `download()` para descargar un string como archivo.

### Modificado

- Modifiqué la función `printVideos()` para construir un archivo CSV con la lista de videos y descargarlo.
    - Primero armo la lista como un arreglo de objetos con los atributos `Canal`, `ID` y `Nombre`.

### Notas

- La función `GM_download()` no funcionó.

## [1.3.1] - 29-07-2022

### Arreglado

- En `getVideoSummary()` cambié el query para buscar el elemento con el nombre del canal del video.
    - El query pasa a ser `"#upload-info.ytd-video-owner-renderer .yt-formatted-string"`.
    - Antes el query hacía coincidir con múltiples elementos con nombres de otros canales y mostraba uno que no era el del video en reproducción.

## [1.3.0] - 28-10-2021

### Cambiado

- Ahora uso `e.code` para identificar mejor las teclas para los eventos. Las letras usan `"KeyA"` y los números `"Digit1"`.

### Agregado

- Agregué la función para imprimir la lista de reproducciones en la consola, copiada de "YouTube Playlist".

## [1.1.0] - 21-09-2021

### Agregado

- Ahora el script se activa en cualquier página de YouTube, por si se inicia en un video ya que después no se activa el script si se realiza una búsqueda.

## [1.0.0] - 20-09-2021

- Creación del script

### Agregado

- Agregué las combinaciones de tecla "CTRL+ALT+1" y "CTRL+ALT+2" para cambiar el orden de las búsquedas.
