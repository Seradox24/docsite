# Diagramas de arquitectura

Los HTML de Archify están versionados en `public/diagramas/archify/` y Astro
los copia a `dist/diagramas/archify/` al compilar:

| Archivo | Origen local | Uso |
| --- | --- | --- |
| `plataforma.html` | `.archify/architecture-moodle-marco-20261001-110000/plataforma.html` | Actualizado el 01-10-2026; incluye Yet y PostgreSQL independiente |
| `plataforma-moodle-20261001.png` | Captura Archify a 2048×1320, tema claro | Vista actual con Yet |
| `plataforma-20260930.html` | Diagrama anterior archivado | Estado anterior a la instalación del LRS |
| `plataforma-rutas-20260930.png` | Captura de Archify a 1440×900 | Vista fija del estado observado |
| `plataforma-20260929-204500.html` | `.archify/architecture-plataforma-20260929-204500/plataforma.html` | Versión anterior |

Los orígenes son relativos a `D:/Servidor`. La versión actual se construyó con
las rutas, contenedores, redes, volúmenes y sitios Nginx consultados directamente
en el VPS; las comprobaciones están resumidas en `estado-servidor-2026-09-30.md`
y `estado-servidor-2026-10-01.md`.
La captura es del diagrama de ese inventario, no una imagen del escritorio del VPS.
La documentación enlaza ambas versiones y
`/arquitectura.html` redirige a la última para conservar los enlaces existentes.

Para actualizar, sustituye `public/diagramas/archify/plataforma.html` por el
HTML final validado de Archify y registra el cambio en Git. Si conservas una
versión histórica adicional, agrega su enlace en `ArchitectureSection.astro`.
No guardes claves, credenciales ni información privada en los diagramas públicos.

## Validación del diagrama con Yet

Tipo `architecture`, calidad `showcase`, generado con Archify 3.0.1.
`finalize`: validate, deliver, check y browser-check correctos, sin errores
ni advertencias de validación. Capturas claras y oscuras inspeccionadas.
Disposición descendente: usuarios, Nginx, servicios y bases propias. Etiquetas Docker uniformes.
No se dibuja una integración activa Moodle → Yet porque todavía está pendiente.

- Candidato: `diagramas/plataforma-20261001.json`.
- Evidencia fijada al commit `f5815b2daa2c79bddceaea092267e84878e30ef3` de docsite.
- SHA-256 de especificación: `dd7e3ad5ae9c25721f3dac5beb23789f70298e2f376e534f21e2f8acb051ee1b`.
- SHA-256 de HTML: `9768d704b8c0635b7d4087572ee6d70fbcccd23b7c9ec263717532325bcefc45`.
- Recibo local: `.archify/architecture-moodle-marco-20261001-110000/plataforma.finalize.json`.
- Capturas y revisión: `.archify/architecture-moodle-marco-20261001-110000/visual-check/`.
