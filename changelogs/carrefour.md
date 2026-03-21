# Changelog

## TODO

- [x] Detectar cambios de OPW

## [1.1.0] - 21-03-2026

### Agregado

* Objeto `cache` para reusar los elementos del DOM

### Modificado

* Ahora el script mantiene el interval para detectar los precios en un nuevo producto
  * Quité la variable del interval porque no se va a usar más

## [1.0.0] - 04-01-2026

Creación del script

### Agregado

+ Función `addDiscountPrice` para calcular el precio con descuento del 15% y agregarlo abajo del
  precio original.
  * Copia los estilos del precio original
  * Usa un interval para detectar el contenedor del precio
  * Usa el locale `es-AR` para formatear el precio con separador de miles