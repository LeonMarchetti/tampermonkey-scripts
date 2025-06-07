# Changelog

## [2.6.1] - 07-06-2025

### Arreglado

- En búsquedas multimedia al auto clickearse los posts ocultos se cambiaba de página. Agregué una
  llamada a `locator.isMediaSearch` para excluirlos

## [2.6.0] - 06-06-2025

### Agregado

- Función `dismissPostBlur` que inicia un intervalo para hacer clic en todos los post con blur.
  Usa el selector `shreddit-blur-container` y hace clic en el primer descendiente con clase
  `.blurred`.

## [2.5.0] - 10-05-2025

### Agregado

- Agregué el highlight para las fechas de ayer de color naranja
- Moví todo lo relacionado a su propia función `highlightDates`

## [2.4.4] - 10-05-2025

### Agregado

- Regla CSS para ocultar la imagen en la barra lateral derecha de los subs. Uso la regla `#right-sidebar-container img.h-auto`

## [2.4.3] - 11-03-2025

### Agregado

- `StartCrosspost` verifica si el post a repostear no es un video y devuelve error en caso contrario, debido a que no se permite hacer crosspost de un video a un subreddit privado. Se utiliza la propiedad `post-type` del elemento `shreddit-post` que puede tener los valores `video` o `link`, entre otros.

## [2.4.2] - 11-03-2025

### Modificado

- `searchNew` hace una búsqueda tipo multimedia con orden de posts por fecha.
- `searchNew` muestra el nombre del subreddit en el prompt.

## [2.4.1] - 30-01-2025

### Arreglado

- La fecha generada al principio lo hacía con el huso horario de UTC, le resté 3 horas para que use
  la hora local

## [2.4.0] - 30-01-2025

### Agregado

- Estilos para las fechas de los posts publicados en el día de la ejecución del script, que indican
  hace cuanto fueron publicados pero en el HTML se indica el timestamp y uso la fecha de hoy para
  armar la regla CSS, matcheando los elementos con `time[datetime^="${todayDate}"]`

## [2.3.3] - 29-01-2025

### Modificado

- En `searchNew` modifiqué la función para que funcione en la página principal y refactoricé para
  que haga una búsqueda multimedia

## [2.3.2] - 23-01-2025

### Modificado

- Para ocultar la barra lateral derecha uso el selector CSS que matche con el elemento HTML
  `<shreddit-app>` con el `pageType` igual a `"search_results"`

## [2.3.1] - 19-01-2025

### Modificado

- Se usan reglas CSS para ocultar la barra lateral derecha y rellenar el ancho con los contenidos
  del contenedor principal en lugar de un interval. Las reglas se aplican al elemento `<main>` y
  a `#right-sidebar-container`

### Borrado

- Función `HideMediaSidebar`, ya que no es necesario por las nuevas reglas de CSS
- El interval para `HideMediaSidebar`

## [2.3.0] - 19-01-2025

### Agregado

- Efecto de difuminado en los posts recomendados de la página principal, aplicando el CSS
  `filter: blur(5px)` en los elementos `article shreddit-post` con el atributo setteado
  `recommendation-source`

## [2.2.6] - 14-01-2025

### Modificado

- Ahora `browseGallery` navega una galería que esté debajo del cursor del mouse si no se detecta
  un post por identificador

## [2.2.5] - 14-01-2025

### Arreglado

- Ahora `browseGallery` determina correctamente el elemento `<gallery-carousel>` que va a ser
  navegado con las flechas sin navegar en todas, usando el identificador del post

## [2.2.4] - 13-01-2025

### Arreglado

- Cambió la estructura de la búsqueda tipo media, ahora el contenedor se identifica con `main` en
  lugar de `#main-content`

## [2.2.3] - 23-12-2024

### Arreglado

- La función `getPostId` que fallaba si no estaba en un post por tratar de acceder al primer match
  del regex sin comprobar primero que no sea nulo

## [2.2.2] - 22-12-2024

### Borrado

- Función `locator.isPost`, reemplazado por `locator.getPostId`

## [2.2.1] - 22-12-2024

### Modificado

- Cambié `isSubreddit` por `isSubredditHome` para identificar la página que corresponde al home de
  un subreddit

## [2.2.0] - 22-12-2024

### Agregado

- Objeto `locator` con métodos para determinar la información de la página actual y usarlos en las
  funciones

## [2.1.0] - 21-12-2024

### Agregado

- Función `browseGallery` para moverse entre las imágenes de un post con galería de imágenes usando
  las flechas

## [2.0.2] - 01-12-2024

### Modificado

- Reemplacé el código del detector de cambios de la URL por el uso de la liberería propia
  **pageChangeInterval**

## [2.0.1] - 01-12-2024

### Arreglado

- En `CleanMediaPage` cambié la query para obtener la barra inferior para que no falle cuando la
  imagen no redirige a un post, ahora busca el elemento de la imagen y devuelve el elemento hermano.

## [2.0.0] - 01-12-2024

### Agregado

- Interval para detectar el cambio de página y ejecutar las funciones para modificar la página según la ruta

## [1.9.0] - 30-11-2024

### Agregado

- Función `CleanMediaPage` para sacar los elementos innecesarios del visor de imágenes de Reddit como la barra inferior.

## [1.8.0] - 19-11-2024

### Agregado

- Función `HideMediaSidebar` para ocultar la barra lateral cuando se buscan posts en la pestaña
  "Multimedia". También tiene que editar el valor de `display` del contenedor de imágenes.

## [1.7.1] - 03-08-2024

### Modificado

- `hidePostsLikeThis` ahora apreta también el botón "Ocultar" para esconder el post.

## [1.7.0] - 24-07-2024

### Agregado

- Modificación de estilos para quitar la difuminación de las previstas en una búsqueda de posts con
  spoiler. No se puede en la lista de posts de un subreddit por estar manejado por un elemento de
  Reddit.

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
