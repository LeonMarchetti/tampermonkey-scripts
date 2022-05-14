# Changelog

## [Unreleased]

## [0.3.0] - 13-05-2022

## Agregado

- Moví el código del observer a su propio archivo `.js` y agregué un `@require` para que se asocie a ese archivo y poder crear clases hijas de `MutationHandler`.

## [0.2.3] - 28-09-2021

### Borrado

- * Desactivé "ElementRemover", ahora uso una regla de CSS para ocultar los elementos.

## [0.2.2] - 23-07-2021

### Agregado

- Agregué una lista de tags exceptuados para cada tag, que hacen que el botón del tag no aparezca si aparece un tag de la lista de exceptuados.

## [0.2.1] - 01-07-2021

### Agregado

- Agregué íconos SVG para algunos de los tags.
    - Los SVG se agregan en el `innerHTML` del elemento `<i>`.
    - Agregué el atributo `svg` en `this.iconList`. Si es `true` se usa el valor the `this.svgList[tag]`.
    - `this.svgList` es un objeto con los tags como nombres de atributo y el SVG como valor.

## [0.2.0] - 27-06-2021

### Arreglado

- Hice que `IconAdder` funcione en la página de un pool.

## [0.1.1] - 26-06-2021

### Agregado

- Agregué mensaje de "Única página" a `PageInfoElement`.

## [0.1.0] - 24-06-2021

- Creación del script-

###  Agregado

- Agregué las clases `PageNumberCheck` y `PageInfoElement` para mostrar el número de página.
