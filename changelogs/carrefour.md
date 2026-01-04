# Changelog

## TODO

- [ ] Detectar cambios de OPW

## [1.0.0] - 04-01-2026

Creación del script

### Agregado

+ Función `addDiscountPrice` para calcular el precio con descuento del 15% y agregarlo abajo del
  precio original.
  * Copia los estilos del precio original
  * Usa un interval para detectar el contenedor del precio
  * Usa el locale `es-AR` para formatear el precio con separador de miles