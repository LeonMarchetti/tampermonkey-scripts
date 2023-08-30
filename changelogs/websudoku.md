# Changelog

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