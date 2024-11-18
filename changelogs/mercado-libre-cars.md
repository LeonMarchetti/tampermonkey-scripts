# Changelog

## [1.0.2] - 18-11-2024

### Agregado

- Ahora `swapCurrency` alterna entre pesos y dólares

## [1.0.1] - 02-02-2024

### Agregado

- Agregué el listener de teclado para activar el script con Ctrl+E, y un item en el menú de contexto.
- Agregué la dirección `listado.mercadolibre.com.ar`.

### Arreglado

- Arreglé la selección de los `<span>` a modificar, porque usaba los índices incorrectos.

## [1.0.0] - 03-09-2023

Creación del script

### Agregado

- Función `getDollarValue()` que obtiene el valor del dólar al hacer una llamada a la API de
  ambito.com. Recibe un callback para ejecutar una función cuando la petición obtiene una
  respuesta.
- Función `swapCurrency()` que detecta si se encontró un valor en pesos al verificar el elemento
  hijo con el símbolo de la moneda y cambia el símbolo y coloca el valor transformado en dólares.
- Función `startSwapCurrency()` que ejecuta la función `swapCurrency()` para cada elemento `<span>`
  con el valor de un auto.