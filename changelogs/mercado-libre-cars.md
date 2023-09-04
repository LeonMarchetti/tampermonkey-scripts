# Changelog

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