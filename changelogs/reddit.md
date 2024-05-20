# Changelog

## [1.4.0] - 19-05-2024

### Agregado

- Función `switchSubreddit` para cambiar el subreddit de una búsqueda. Atajo `Alt+R` y en menú contextual.

## [1.3.0] - 12-05-2024

### Agregado

- Función `showError` para mostrar un mensaje de error en una alerta y tirar una excepción.


## [1.2.0] - 09-05-2024

### Modificado

- Se cambió el nombre de la función `switchCommunitySortOrder` a `switchSortOrder`.
- Ahora `switchSortOrder` también cambia el orden de los resultados de la búsqueda de posts.

## [1.1.0] - 07-05-2024

### Agregado

- Función `switchCommunitySortOrder` para cambiar el orden de los posts que aparecen en la página de una comunidad.
- Atajo `Alt+N` y en menú contextual para `switchCommunitySortOrder("new")`.

## [1.0.0] - 07-05-2024

Creación del script.

### Agregado

- Función `StartCrosspost` para redirigir a la página de "crosspost" de un post hacia una comunidad determinada por la constante `COMMUNITY`, que la dejo sin definir en el repositorio.
- Atajo `Alt+C` y en menú contextual para `StartCrosspost`.
