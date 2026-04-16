# Changelog

## [1.0.3] - 16-04-2026

### Arreglado

* Ahora obtengo las clases par el botón nuevo usando al primer elemento del contenedor; agregando
  las clases manualmente fallaba

## [1.0.2] - 29-03-2026

### Agregado

* Loggeo del nombre del script, que faltaba.

### Arreglado

* Ahora se seleccionan las vistas previas de las imágenes con `.mD_7N7b1a7ZoGbPdjYtp`, se elige la
  segunda imagen encontrada y si tiene una imagen como elemento hermano entonces se usa esa para
  mostrar sino la imagen encontrada al principio, que es cuando la imagen original está disponible.

## [1.0.1] - 23-12-2025

### Modificado

* Ahora al crear la nueva pestaña el navegador no cambia a la nueva pestaña usando la API de GM con
  `GM_openInTab`

## [1.0.0] - 13-12-2025

Creación del script

### Agregado

* Botón para abrir la imagen en la vista previa en una pestaña nueva. Se agrega a la barra de botones en la esquina superior derecha de la sección de la vista previa en la búsqueda de imágenes.
    * El diseño de la página con la que se probó el script es 150% zoom
    * Selector del contenedor de botones: `.WRx_xSx51EXkymGmPRNJ`
    * Selector de imágenes: `.d1fekHMv2WPYZzgPAV7b`
    + Usa un SVG de un ícono de dibujo