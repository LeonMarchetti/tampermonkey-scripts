# Changelog

## [1.1.0] - 25-01-2026

### Agregado

- Función `getSubredditSuggestions` para obtener sugerencias sobre subreddits en la búsqueda
  haciendo una petición a la API de Reddit
  - URL: `https://www.reddit.com/svc/shreddit/search-typeahead`, con el parámetro `query`
  - La petición devuelve un resultado en HTML donde las sugerencias se seleccionan con:
    `"div > [data-type='search-dropdown-item-label-text']"` y filtrando los resultados de subreddits
    que empiezan con `"r/"`
  - Copilot generó el contenedor con la lista de sugerencias que aparece cuando se escribe el nombre
  - Copilot agregó los listeners para las flechas de arriba y abajo para seleccionar la sugerencia
  - Al presionar Enter en una sugerencia se cambia de página inmediatamente pero se puede
    seleccionar con el mouse

## [1.0.3] - 05-10-2025

### Modificado

- Ahora al abrir el dialog se selecciona automáticamente todo el texto del input en foco con
  `.select()`

## [1.0.2] - 04-10-2025

### Arreglado

- Cuando se abría el dialog en subreddit multimedia en un post no se tomaba el parámetro de
  ordenamiento `sort`, faltaba comprobar si `getParam("sort")` era un string vacío además de `null`

## [1.0.1] - 04-10-2025

### Arreglado

- Cuando se abría el dialog en búsqueda multimedia en un post no se tomaba el parámetro de
  ordenamiento `sort`

## [1.0.0] - 04-10-2025

Creación del script

### Agregado

- Dialog para realizar una búsqueda. Se puede elegir el texto de la búsqueda, el orden de los
  resultados, el subreddit y el tipo de búsqueda
  - Muestra una vista previa de la URL de destino
  - Al abrir el dialog se rellenan los controles con valores por defecto sacados de la URL actual y
  uno de los controles enfocados según los parámetros pasados a la función
- Se distingue entre si la página es un feed o es una búsqueda, eso determina el path de la URL