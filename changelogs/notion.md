# Changelog

## [1.0.0] - 24-08-2025

Creación del script

### Agregado

- Función `setDateFormat` que realiza el cambio de formato de una fecha a `Día/Mes/Año` simulando
  los clics del usuario sobre el menú desplegable
  - Mapeado al atajo `Ctrl+Alt+D`
  - El elemento del botón de Formato es `[role='dialog'] :nth-child(3)>[role='button']:nth-child(1)`
  - El elemento del botón del formato `Día/Mes/Año` del segundo menú es
    `[role='menuitem']:nth-child(3)`
  - El modal de configuración abierto al hacer clic sobre la flecha se selecciona con
    `[role='dialog']` y luego se elimina por el macro