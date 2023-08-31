# Changelog

## TODO

- Hacer que cuando se reemplacen las celdas automáticamente y quede un solo valor se vuelva a
  recorrer el tablero para seguir borrando pistas.

## [1.6.0] - 30-08-2023

### Agregado

- Función `clearClues()` para borrar automáticamente las pistas de las celdas relacionadas cuando
  la celda seleccionada se llena con un número. Requiere que se cambie la clase CSS de la celda
  modificada para mostrar el número grande. Para ejecutarse hice que se produzca un delay al apretar
  las teclas por si se quiere ingresar pistas.

### Modificado

- En la función `test()` agregué una llamada a `console.table` para mostrar en una tabla todas las
  variables que se ingresen en un objeto.

## [1.5.1] - 30-08-2023

### Agregado

- Función `getBoxIndex()` para calcular el índice de la caja de una celda según su número fila y de
  columna.

### Arreglado

- En `makeCellsListStore()` estaba calculando mal el índice de la caja, así que hice una función
  para que se calcule igual que cuando se arme la lista de cajas.

### Borrado

- Borré la función `getBox()` del objeto store porque queda redundante.

## [1.5.0] - 29-08-2023

### Agregado

- Variable global `store` que almacena todas las combinaciones posibles de fila, columna y caja
para cada celda, con un método para devolver todas las listas combinadas para una combinación de
fila y columna. Se crea al principio del script a través de la función `makeCellsListStore()`.
- Parámetro `cell` para la función `test()`, que es alimentada a través del evento de presión de
tecla pasando el objeto `e.target`.

### Borrado

- Borré la función `getRestrictionCells()` porque ya no era necesaria.

## [1.4.2] - 26-08-2023

### Agregado

- Función `getRestrictionCells()`, que toma los números de fila y columna de una celda y devuelve
  una lista con todas las celdas de las mismas filas, columnas y caja que esta.
- Función `test()`, la voy a dejar para después poner el código de prueba. Se ejecuta al presionar
  la tecla `t`.

### Modificado

- A la función `log()` le agregué el parámetro `error` para indicar si el mensaje tiene que ser
  mostrado en el stream de errores del navegador. Según ese parámetro se usa la función
  `console.log` o `console.error`.

## [1.4.1] - 25-08-2023

### Agregado

- Agregué el docstring para las funciones `log()` y `clearRepeatedNumber()`.

## [1.4] - 25-08-2023

### Modificado

- En la función `clearRepeatedNumber()` cambié el código para juntar las listas de las celdas en la
  misma fila y columna por las llamadas a `.concat()`.
- Agregué el proceso para armar la lista de celdas de la misma caja de la celda seleccionada.

## [1.3] - 25-08-2023

### Modificado

- En la función `clearRepeatedNumber()` cambié el código para armar las listas de las celdas en la
  misma fila y columna por las llamadas a `.map()`.

## [1.2] - 25-08-2023

### Agregado

- Función `log()`, que imprime un mensaje por consola agregando el nombre del script al principio.
- Función `clearRepeatedNumber()` que borra de la celda seleccionada los valores que ya aparecen en
  la misma fila y columna. Se ejecuta al presionar una tecla numérica sobre la celda seleccionada.

### Modificado

- En el evento de presión de la tecla de pausa/resumen agrego la llamada a `e.preventDefault()` para
  que no escriba la letra `p` en la celda seleccionada.

## [1.1] - 25-08-2023

### Arreglado

- Al principio del script borré una `s` que agregué por accidente.

## [1.0] - 24-08-2023

Creación del script.

### Agregado

- Función `togglePause()`, que pausa o resume un juego al presionar la tecla `p`, simulando el clic
  al botón de pausa.