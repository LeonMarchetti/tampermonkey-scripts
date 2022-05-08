# Changelog

## [Unreleased]

- Hacer que no se active el evento normal de click en sitios como deviantart.com, tanto `e.preventDefault()` y `e.stopPropagation()` ni funcionan.

## [1.1.1] - 18-03-2022

### Agregado

- Agregué el evento "Ctrl+Shift+Click" para abrir la imagen en la misma pestaña.
- Agregué `e.stopPropagation()` para que al hacer Ctrl+Shift+Click se cambie de página automáticamente.

## [1.1.0] - 29-10-2021

### Cambiado

- Uso la función `GM_openInTab` para abrir la imagen en una nueva pestaña, en lugar del elemento `<a>`.

## [1.0.0] - 28-10-2021

- Creación de script.

### Agregado

- Completé la creación del elemento `<a>`.
