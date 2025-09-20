# Changelog

## [1.0.0] - 20-09-2025

Creación del script

### Agregado

- Creación de un **dialog** para armar el título de un crosspost con los autores, personajes y el
  show de un post
    - El título del post se muestra en el elemento `<textarea>` del shadowRoot de
    `<faceplate-textarea-input>` y al crear el nuevo título se actualiza ese valor y el de
    `<faceplate-textarea-input>`
    - Muestra un preview que todavía no se actualiza con los valores del form