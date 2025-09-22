# Changelog

## [1.1.0] - 21-09-2025

### Agregado

- Actualización de la vista previa del título en el dialog al agregar un listener a los inputs

### Arreglado

- Agregar el listener de click al botón de cancelar para que cierre el dialog sin activar el
  resultado del título

### Modificado

- Mover código para armar el título a su propia función para usarla al generar la vista previa y al
  cerrar el dialog
- Agregar un listener a los inputs para actualizar la vista previa

## [1.0.0] - 20-09-2025

Creación del script

### Agregado

- Creación de un **dialog** para armar el título de un crosspost con los autores, personajes y el
  show de un post
    - El título del post se muestra en el elemento `<textarea>` del shadowRoot de
    `<faceplate-textarea-input>` y al crear el nuevo título se actualiza ese valor y el de
    `<faceplate-textarea-input>`
    - Muestra un preview que todavía no se actualiza con los valores del form