# Diagramas de arquitectura

Los HTML de Archify están versionados en `public/diagramas/archify/` y Astro
los copia a `dist/diagramas/archify/` al compilar:

| Archivo | Origen local | Uso |
| --- | --- | --- |
| `plataforma.html` | `.archify/architecture-plataforma-20260929-213000/plataforma.html` | Última versión |
| `plataforma-20260929-204500.html` | `.archify/architecture-plataforma-20260929-204500/plataforma.html` | Versión anterior |

Los orígenes son relativos a `D:/Servidor`. Los HTML se incorporaron sin
modificar su contenido. La documentación enlaza ambas versiones y
`/arquitectura.html` redirige a la última para conservar los enlaces existentes.

Para actualizar, sustituye `public/diagramas/archify/plataforma.html` por el
HTML final validado de Archify y registra el cambio en Git. Si conservas una
versión histórica adicional, agrega su enlace en `ArchitectureSection.astro`.
No guardes claves, credenciales ni información privada en los diagramas públicos.
