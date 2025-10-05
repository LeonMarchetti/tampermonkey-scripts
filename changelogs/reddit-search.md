# Changelog

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