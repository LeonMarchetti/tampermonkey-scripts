# Changelog

## [1.6.1] - 23-07-2024

### Agregado

- Función `hideCommentSubthread` para ocultar los comentarios hijos de un comentario padre en la
  página de un post.

### Modificado

- El listener para la tecla `H` ahora usa la función `HideCommand` para ver si se está en la página
  principal o en la página de un post y ejecutar `hidePostsLikeThis` o `hideCommentSubthread`
  respectivamente.

## [1.6.0] - 18-07-2024

### Agregado

- Al presionar la tecla "H" con el cursor sobre un post del feed de inicio de Reddit se da la orden
  al sitio de no seguir mostrando posts del mismo subreddit.

## [1.5.4] - 15-07-2024

### Agregado

- Agregué la búsqueda de posts por orden de "nuevos".

## [1.5.3] - 25-06-2024

### Modificado

- Ahora en `StartSwitchSubreddit` pongo el nombre del subreddit actual como valor por defecto del prompt para cambiar el nombre.
- Ahora no tira error al presionar en "Cancelar".

## [1.5.2] - 06-06-2024

### Modificado

- Ahora el regex de `StartCrosspost` detecta si se está en un post publicado bajo un usuario.

## [1.5.1] - 25-05-2024

### Arreglado

- Ahora se puede ordernar las búsquedas sin indicar el subreddit. Uso las APIs de URL y
  UrlSearchParams.

## [1.5.0] - 20-05-2024

### Agregado

- Función `selectCrosspostTarget` para configurar el nombre de la comunidad a la que hacer
  crosspost y guardarla en storage con la API de GM, reemplazando la constante glolba `COMMUNITY`.

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
