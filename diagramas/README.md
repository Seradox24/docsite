# Diagramas de arquitectura

Los HTML de Archify están versionados en `public/diagramas/archify/` y Astro
los copia a `dist/diagramas/archify/` al compilar:

| Archivo | Origen local | Uso |
| --- | --- | --- |
| `plataforma.html` | `.archify/architecture-plataforma-rutas-20260930-210500/plataforma.html` | Estado observado el 30-09-2026; rutas separadas |
| `plataforma-rutas-20260930.png` | Captura de Archify a 1440×900 | Vista fija del estado observado |
| `plataforma-20260929-204500.html` | `.archify/architecture-plataforma-20260929-204500/plataforma.html` | Versión anterior |

Los orígenes son relativos a `D:/Servidor`. La versión actual se construyó con
las rutas, contenedores, redes, volúmenes y sitios Nginx consultados directamente
en el VPS; las comprobaciones están resumidas en `estado-servidor-2026-09-30.md`.
La captura es del diagrama de ese inventario, no una imagen del escritorio del VPS.
La documentación enlaza ambas versiones y
`/arquitectura.html` redirige a la última para conservar los enlaces existentes.

Para actualizar, sustituye `public/diagramas/archify/plataforma.html` por el
HTML final validado de Archify y registra el cambio en Git. Si conservas una
versión histórica adicional, agrega su enlace en `ArchitectureSection.astro`.
No guardes claves, credenciales ni información privada en los diagramas públicos.
