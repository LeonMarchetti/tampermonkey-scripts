# Changelog

## [1.2.0] - 08-05-2024

### Agregado

- Función `checkMangaPage` que comprueba si se está en una página de un Manga y devuelve el arreglo
  de match de regex con el índice de la página.
- Función `openImage` para abrir la imagen de una página.
- Atajo `Ctrl+Alt+I` y en menú contextual para `openImage.`

## [1.1.0] - 08-05-2024

### Agregado

- Atajo de teclado `Ctrl+Alt+T` y en menú contextual para `togglePageHeight`.
- La función `setFullPageHeight` recibe un booleano y agrega el CSS para cambiar la altura de las
  páginas o elimina el bloque.

### Borrado

- Referencia a la librería de JQuery porque no se usaba.

### Modificado

- Ahora la función `checkMangaChapterPage` permite no lanzar una excepción y devolver un booleano.
- La función ahora se llama `togglePageHeight` y comprueba el valor de `active` para activar la
  función `setFullPageHeight`.


## [1.0.0] - 08-05-2024

- Creación del script.

### Agregado

- Función `checkMangaChapterPage` para comprobar si se está en un capítulo de un manga y tirar una
  excepción si no.
- Función `setPageHeight` para cambiar la altura de las páginas a la altura del navegador.
- Función `resetHeight` para volver a atrás el cambio en la altura de las páginas.