# Changelog

## [1.0.0] - 04-01-2024

Creación del script

### Agregado

- Clase `Modal` para crear y abrir un modal. Hay que crear el objeto y luego ingresar el contenido
  con el método `create(contenido)`.
- El modal se agrega al `<body>` como un descendiente directo.

### Uso

- Usar `modal.id` para asignar estilos CSS para los descendientes del contenedor del modal con ese
  id.
- Usar los métodos `modal.open()` y `modal.close()` para abrir y cerrar el modal.
- Agregar estilos CSS al bóton de cierre usando el estilo `.close`.
- Al contenido hay que asignarle la clase `.modal-content` para poder agregarle el botón de cierre al modal.
