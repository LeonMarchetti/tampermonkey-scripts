# Changelog

## [1.3.0] - 02-08-2025

### Agregado

- Obtener resumen de cuenta en formato CSV parseando elementos del DOM
  - **address**: Saco la dirección completa pero le saco de la primera coma en adelante
  - **notes**: Saco el texto en gris que está abajo del nombre
  - **whatsapp**: Saco el link y si empieza con `wa.me/` lo anoto como número de WhatsApp, sino como
    el enlace del sitio web

| dato             | elemento                                        |
| ---------------- | ----------------------------------------------- |
| id               | `h2`                                            |
| name             | `header :nth-child(4) > div > div > span`       |
| notes            | `header :nth-child(4) > div > div:nth-child(3)` |
| address          | `h1`                                            |
| website/whatsapp | `.x3nfvp2.x193iq5w`                             |

## [1.2.0] - 18-07-2025

### Eliminado

- Eliminé los estilos CSS

## [1.1.0] - 29-01-2025

### Agregado

- Estilos CSS para rellenar el ancho de la página de cuentas sugeridas, formando una grilla.
  También afecta las búsquedas

## [1.0.0] - 21-08-2024

Creación del script.

### Agregado

- Función `ToggleMute` para simular un click en el botón de silenciar para alternar entre silenciado o no
  de los posts con sonido.
