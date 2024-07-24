# Changelog

## [1.8.1] - 24-07-2024

### Modificado

- Ahora `AddToQueue` recibe el elemento que representa al video a agregar a la cola como parámetro,
  permitiendo que se use un selector distinto correspondiente a la página de YouTube:
  - `ytd-video-renderer:hover` para la página de búsqueda.
  - `ytd-rich-item-renderer:hover` para el feed de suscripciones de usuario.

## [1.8.0] - 24-07-2024

### Agregado

- Función `AddToQueue` para agregar un video de la lista de suscripciones a la cola, apretando la
  tecla `H`.

## [1.7.2] - 31-01-2024

### Arreglado

- En `changeToVideo()` cambié la expresión regular a `[^/]*$` porque extraía mal el ID de video cuando éste tenía símbolos como los guiones.

### Eliminado

- La referencia al archivo en disco.

## [1.7.1] - 21-11-2023

### Agregado

- Función `downloadPlaylistVideoList()`, para armar el archivo en formato CSV y descargarlo.

### Arreglado

- En `getVideosList()`, había un error al obtener el ID de los videos de la playlist, ya que el
  script tambien recoge las sugerencias que aparecen debajo de la lista que no pertenecen al
  playlist y por lo tanto no coincidia el regex anterior. Ahora uso la API de `UrlSearchParams` para
  obtener el parámetro `v` de cada elemento y ahora uso la query
  `ytd-playlist-video-renderer.ytd-playlist-video-list-renderer` para obtener la lista de elementos
  de la playlist.

### Modificado

- A la función `getVideosList()` le dejé solo el código para armar la lista de objetos con los datos
  de los videos y dejar la descarga en otro lado.

## [1.7.0] - 09-09-2023

### Agregado

- Función `changeToVideo()` para redirigir desde un video de Shorts a una página común. Para usar
  desde el menú contextual de Tampermonkey.

## [1.6.0] - 07-09-2023

### Agregado

- Agregué código para detectar si se está en la página principal de Youtube se mueva automáticamente
  a la página de suscripciones. Esto es porque Youtube dejó de mostrar recomendaciones de videos si
  no se activa el historial de reproducciones.

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
