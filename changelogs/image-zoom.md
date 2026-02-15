# Changelog

## [2.0.0] - 15-02-2026

### Modificado

- Nueva versión: hecho con Chat GPT
- Animación suave
- Modificación del tamaño de la imagen usando `.style.width` para actualizar el layout y el
  scrolling correctamente en lugar de `transform`
- Se arregla el bug que no permite scrollear hacia el tope de una imagen después de aumentar el
  zoom

## [1.7.0] - 16-07-2022

### Agregado

- Agregué estilos para el body y la imagen para cuando el zoom de la imágen sea incrementando, para hacer que la imagen se centre horizontalmente cuando se reduce el zoom.

### Cambiado

- La comprobación de cuál navegador se está usando ahora se hace a través de la variable string `browser` que toma el valor `"firefox"` o `"chrome"`.
- Ahora los estilos según navegador se determinan al principio y usan el mismo nombre.
    - En este caso se quitaron los estilos particulares porque ahora no son necesarios.

## [1.6.1] - 02-07-2022

### Arreglado

- Cuando se determinaba si una imagen era reducida por el navegador, en el caso de Firefox tuve que cambiar la condición para comprobar los nombres de clases de la imagen en el caso de que Firefox le metiera otras clases, ahora uso `img.classList.contains()`.

### Cambiado

- Uso la función `GM_addStyle` para agregar los estilos necesarios con notación CSS.
- Si una imagen es zoomeable ahora hago las tranformaciones sobre el elemento `<body>`.
- Al usar `fillHeight()` o `fillWidth()` llamo a una función `removeTransform()` para quitar las transformaciones.
- Armé una clase CSS para la imagen de acuerdo al navegador actual.

## [1.6.0] - 30-06-2022

### Cambiado

- Modifiqué el código para usarlo en Firefox (constantes `isChrome` y `isFirefox`).
- Arreglé la comprobación de si la imágen es reducida por el navegador (constante `isZoomable`).
- Ahora `fillHeight()` no funciona en imágenes que son reducidas por el navegador.

### Notas

- Comprobar si la imagen es más grande que la pantalla:
    - **Chrome**: `["zoom-in", "zoom-out"].includes(img.style.cursor)`
    - **Firefox**: `["shrinkToFit", "overflowingVertical"].includes(img.className)`
- El script tarda en modificar la imagen, sin importar el valor de `@run-at`.

### TODO

- Falta arreglar la modificación del zoom con `transform()`.

## [1.5.0] - 07-05-2022

### Agregado

- Comprueba si la página tiene la estructura correcta y si no la tiene no se ejecuta nada.
- Comprueba si la imagen es más grande que la pantalla del navegador si este le asigna el cursor con la lupa para agrandar y reducir.

### Cambiado

- En los métodos `fillHeight()` y `fillWidth`

### Borrado

- Borré el uso de JQuery ya que no lo podía hacer funcionar.

## [1.4.1] - 23-01-2022

### Bug

- Probé de arreglar el zoom en imágenes que no son encojidos por el navegador.
    - Uso "position: fixed; bottom: auto" en la imagen.

## [1.4.0] - 20-11-2021

### Arreglado

- Cambié el JQuery para comprobar que solo halla un elemento `<img>` como hijo de `<body>`: `$("body > img")`.

## [1.3.0] - 28-08-2021

### Agregado

- Deshabilito el fondo que Firefox le da a las imágenes transparentes.

## [1.2.0] - 29-05-2021

### Arreglado

- Cambié el evento "keyup" por "keydown", porque `fillWidth()` se activaba después de cerrar una pestaña con "Ctrl+W".

## [1.1.0] - 19-05-2021

### Arreglado

- Arreglé los comandos para cambiar el tamaño de la imagen.
    - Uso `document.body.style.MozTransform` para transformar la imagen.

## [1.0.0] - 20-04-2021

- Creación del script.

### Borrado

- Deshabilito "llenarAltura" al inicio del script.

### Bug

- En Firefox, a las imágenes que son más grande que la pantalla cuando se usa "llenarAltura" ocurre que:
    - La imagen toma la altura de la pantalla y no permite cambiar la escala.
    - Hacer zoom con la ruedita del mouse cambia el ancho pero no la altura.
