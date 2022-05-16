# Changelog

## [Unreleased]

## [1.8.0] - 15-05-2022

### Agregado

- Agregué a `ChangeCollectionHandler` desde `deviantart-observer.js`, para poner todo el código de DeviantArt en un mismo script.

## [1.7.0] - 14-05-2022

### Agregado

- Agregué a `AddToCollectionHandler` y `addChooseCollectionButton()` para agregar un botón en el diálogo de la lista de colecciones para buscar la colección en lugar de usar la combinación de teclas.
    - Agregué la referencia a `mutationHandler.js`

### Cambiado

- Saqué la función `run()` de adentro de `clickCollection()` para que pueda ser utilizado por `AddCollectionHandler.handle()`.

## [1.6.1] - 13-05-2022

### Arreglado

- Cuando no se ingresaba texto, `searchCache` se setteba en `null`, ahora le asigno `""` explícitamente.
- Faltaba comprobar que el texto ingresado no esté vacío y no tratar de buscar la colección en ese caso.
- Faltaba pedirle al usuario ingresar el nombre de la colección a buscar cuando, en una página de un post, no estaba la lista de colecciones abierta.

## [1.6.0] - 20-04-2022

### Cambiado

- Cambié el atajo a "Ctrl+Shift+F".

## [1.5.0] - 17-04-2022

### Agregado

- Agregué la función "clickCollection" al menú contextual.

## [1.4.0] - 09-04-2022

### Agregado

- Ahora se guarda la búsqueda en una variable global para poder repetir la misma búsqueda.
    - Separe el ingreso del texto en su propia función.

## [1.3.0] - 23-03-2022

### Agregado

- Ahora si la lista de colecciones no está abierta cuando se ejecuta el script, se abre al simular un clic en el botón flecha "V" y se ejecuta un intervalo para esperar hasta que aparezca y ejecuta el resto del código.

## [1.2.0] - 19-03-2022

### Agregado

- Ahora en el intervalo se busca de vuelta la colección "Featured" para comprobar que la lista de colecciones esté abierta, si no está entonces termina el intervalo.
- Agregué de vuelta el desplazamiento de la pantalla al comprobar que se esté en la página de un post.

### Bug

- Descubrí que si se sale de la lista de colecciones parece que el código del interval deja de tener efecto, aunque se sigue ejecutando, y se puede ejecutar nuevamente.

## [1.1.0] - 14-03-2022

### Arreglado

- Si el texto de búsqueda aparece en otra parte de la página, la función no buscaba en la lista de colecciones. Ahora pide el elemento ancestro para filtrar.

### Borrado

- Eliminé las referencias a JQuery.
- Eliminé el desplazamiento de la pantalla principal luego de encontrar la colección. No es conveniente cuando lo uso en la pantalla de una colección o búsqueda.

## [1.0.0] - 13-03-2022

- Creación del script.

### Agregado

- Busca la colección con el nombre ingresado por el usuario en la lista de colecciones, y simula un click para asignar el post a esa colección. Si la colección no se encuentra cargada en la lista, simula el desplazamiento por el div para cargar un grupo nuevo de colecciones y busca de vuelta.

### Bugs

- Requiere que la lista de colecciones esté abierta previamente, sino no hace nada.
- No detecta si el texto ingresado no coincide con ninguna de las colecciones, causa que siga en una búsqueda sin fin.
