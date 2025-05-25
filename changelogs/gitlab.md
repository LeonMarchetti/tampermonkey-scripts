# Changelog

## [1.1.0] - 25-05-2025

### Arreglado

- `GetIssueTitle` ahora funciona en los issues que aparecen en la barra lateral (drawer) de la nueva
  versión de Gitlab. Comprueba si existe el elemento `aside.gl-drawer` y de ahí se obtiene el ID del
  issue y el enlace, los demás datos se obtienen de la misma forma en ambos casos.

## [1.0.0] - 19-10-2024

Creación del script

### Agregado

- Función `GetIssueTitle` para obtener un string con el título del issue, el repositorio y el
  número en formato Markdown.