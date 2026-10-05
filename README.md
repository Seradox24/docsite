# Documentación del servidor actual

Proyecto Astro de `moodlenewen`, VM LAN `192.168.50.11`.
Sitio: https://doc.minayao.site. Publicación: `/srv/plataforma/documentacion/public/`.
Se conserva el diseño, los componentes y la estructura del proyecto anterior.

## Servidor legado

Respaldo previo a los cambios: `../docsite servidor legado 2026-10-01/`.
Archivo: `../docsite-servidor-legado-2026-10-01.zip`.
Incluye Git, fuentes, diagramas, configuración y dist; excluye node_modules y .astro.
Integridad comprobada por archivo con SHA-256 y CRC del ZIP.
El respaldo histórico se conserva localmente y en Git. No se publica en el sitio actual.

## Desarrollo

Requiere Node.js >= 22.12. Ejecutar `npm ci` y `npm run build`.
Inventario: `src/data/platform.ts`. Componentes: `src/components/`.
Estado detallado: `diagramas/estado-servidor-nuevo-2026-10-01.md`.
Mantener credenciales, claves y procedimientos privados fuera de `public/`.

## Publicación LAN

El workflow de GitHub ahora solo compila y conserva un artefacto. Ya no despliega
en el VPS legado. La VM recibe `dist/` por SSH desde un equipo con acceso a la LAN.
Compilar localmente no hace commit, push ni publica automáticamente.
Conservar una copia del sitio anterior en `respaldos/documentacion/` antes de publicar.

Para compilar y publicar por SSH desde este equipo:

```powershell
pwsh -File scripts/publish-lan.ps1
```

El script compila, transfiere exclusivamente `dist/` a la VM y cambia el enlace
`public` de forma atómica. Conserva la versión anterior y verifica HTTPS;
si falla la comprobación, restaura el enlace anterior. No requiere recargar
Nginx cuando solo cambia el contenido estático. La clave debe estar desbloqueada
en el agente SSH. Los cambios de código se registran con Git y se suben a `origin`;
las compilaciones no se incluyen en Git (`dist/` está ignorado).
La publicación compara SHA-256 de `dist/index.html`, del archivo transferido y
de la respuesta HTTPS servida por Nginx. Si no coinciden, restaura la versión anterior.
El único contenido enviado es `dist/`; fuentes, Git y configuraciones operativas
permanecen fuera del directorio público.

## Documentación del servidor nuevo

La página muestra únicamente servicios instalados: Nginx, documentación,
Moodle 5.2.3, Yet SQL LRS 0.9.7, Keycloak con PostgreSQL, Uptime Kuma, Portainer y Glances. El monitoreo funciona desde
tres directorios independientes: `servicios/svc-uptime-kuma/`,
`servicios/svc-portainer/` y `servicios/svc-glances/`,
con `restart: unless-stopped` y puertos publicados en `192.168.50.11`.
La configuración conservada está en `configuraciones/svc-uptime-kuma/`, `configuraciones/svc-portainer/` y
`configuraciones/svc-glances/`.
Los servicios no instalados no se presentan como aplicaciones activas.
Los accesos de monitoreo son https://kuma.minayao.site/,
https://port.minayao.site/ y https://glances.minayao.site/, con certificado
wildcard emitido por validación DNS. Sus proxies se conservan en
`configuraciones/nginx/`; se instalan fuera del contenido público de Astro.
Los registros históricos se mantienen fuera del sitio público.

La sección Organización muestra las carpetas reales: Moodle en `moodle/`,
Yet SQL LRS en `servicios/svc-lrsql/` y Keycloak en `servicios/svc-keycloak/`.
`microservicios/` permanece vacío. Hay una carpeta previa de Keycloak bajo
`servicios/svc-keycloak-pre-548954e/`, sin contenedores activos asociados.
No muestra archivos Compose ni etiquetas de estado.

## Autenticación auditada · 2 de octubre de 2026

Keycloak 26.7.5 está activo en `https://auth.minayao.site/`, con realm `educacion`.
Se verificaron las etiquetas del Compose activo: proyecto `authsom`, directorio
`/srv/plataforma/servicios/svc-keycloak/` y archivo `compose.yaml` en esa carpeta.
PostgreSQL 17 persiste en el volumen Docker `authsom_keycloak_db_data`, sin puerto
publicado al host. Ambos contenedores están saludables.
El `.env` enlaza a `/srv/plataforma/secretos/servicios/svc-keycloak.env` (0600),
ignorado por Git. No se encontraron copias de sus valores secretos en los archivos
regulares de la carpeta del servicio revisados, excluyendo `.git`.
El proxy real está en `infraestructura/nginx/sites-available/auth.minayao.site.conf`,
enlazado desde `/etc/nginx/sites-enabled/`, y dirige a `127.0.0.1:18081`.
El descubrimiento OIDC responde 200 por HTTPS y anuncia el issuer
`https://auth.minayao.site/realms/educacion`. Esto verifica la publicación del realm;
no demuestra una integración completa de inicio de sesión con otras aplicaciones.
Detalle: `diagramas/auditoria-keycloak-2026-10-02.md`.

## Página de arquitectura · Archify

Acceso: `https://doc.minayao.site/arquitectura/`. La página Astro está en
`src/pages/arquitectura/index.astro`, separada de la portada documental.
El menú y la tarjeta de arquitectura apuntan a esta página; `/arquitectura.html`
redirige a ella para conservar el acceso anterior.

La portada documental contiene solamente una miniatura estática recortada mediante
CSS y un enlace a la página de diagramas; no carga los visores Archify.
La miniatura procede de la captura verificada de la vista general.
`ArchitectureReference.astro` se usa en documentación y `ArchitectureDiagram.astro`
encapsula el visor exclusivo de la página de arquitectura. Los metadatos de los
diagramas están separados en `src/data/architecture.ts`.

Incluye cinco artefactos HTML autónomos de Archify en `public/diagramas/archify/`:
`vista-general.html`, `autenticacion.html`, `operacion-monitoreo.html`,
`moodle.html` y `lrs.html`.
Se conservan exactamente los bytes verificados del generador. Los visores permiten
explorar componentes, buscar, cambiar tema y exportar imágenes; la página ofrece
apertura independiente y descarga del HTML.

Fuente: instantánea SSH del servidor el 2 de octubre de 2026 a las 14:41 en Santiago.
Doce contenedores activos, ocho dominios HTTPS y siete volúmenes Docker montados
en los servicios activos (incluido el volumen anónimo de Redis y el volumen de
código de Moodle). PostgreSQL del LRS utiliza además un bind mount bajo
`datos/servicios/svc-lrsql/postgres/`. El inicializador de Moodle terminó con salida 0
y no se cuenta entre los contenedores activos.
En esa auditoría del 2 de octubre Kuma tenía cero monitores configurados; los diagramas conservan esa instantánea histórica.
El estado de los diagramas es manual. La página de monitoreo añadida el 5 de octubre consulta datos actuales automáticamente.

Candidatos JSON, auditoría saneada, recibos de `finalize` y capturas locales en
`D:/Servidor/.archify/architecture-servidor-actual-20261002-144134/`.
Cada diagrama pasó `validate`, `deliver`, `check` y `browser-check` con calidad
`showcase`, sin diagnósticos. También se generaron capturas y se revisaron
visualmente la vista general y los dos diagramas nuevos a 1440×900. La revisión
responsive previa de la página se conserva; esta actualización mantiene el diseño.
Los diagramas describen una auditoría de la instalación activa, no un snapshot
de código acreditado contra una revisión Git. Fuentes, auditorías privadas y
credenciales quedan fuera de `public/`; se publica únicamente `dist/`.

## Auditoría de servicios nuevos · 14:41 Santiago

Moodle: proyecto `lms-moodle` en `/srv/plataforma/moodle/`, cinco procesos activos
(web, app PHP-FPM, cron, PostgreSQL 16 y Redis 7). Versión instalada confirmada en
archivo `version.php` y en la base: 5.2.3. El proxy externo dirige a `127.0.0.1:18080`;
el Nginx del contenedor usa `app:9000`. Web pertenece a la red application; app y
cron conectan application y data, mientras PostgreSQL y Redis solo están en data.
El login HTTPS responde 200. La configuración activa de autenticación es `email`;
no se acredita integración OIDC con Keycloak ni envío de statements al LRS.
Su `.env` es un archivo regular en el proyecto, modo 0600.

LRS: proyecto `yet-lrsql` en `/srv/plataforma/servicios/svc-lrsql/`, LRS 0.9.7 y
PostgreSQL 16.15 saludables, red `yet-lrsql-internal`. Publicación HTTP de upstream
en `127.0.0.1:18082`, con TLS terminado por Nginx. `/admin/index.html` y `/xapi/about`
responden 200. `.env.prod` enlaza a `secretos/servicios/svc-lrsql.env`, modo 0600 e
ignorado por Git. Datos reales en `/srv/plataforma/datos/servicios/svc-lrsql/postgres/`.
No se probó una escritura autenticada xAPI durante esta auditoría.

La copia previa `svc-keycloak-pre-548954e/` permanece bajo `servicios/` y reutiliza
el enlace de secretos del Keycloak actual. No se modificó durante la auditoría;
según las convenciones, las copias previas corresponden a `respaldos/`.
Detalle de la revisión: `diagramas/estado-servidor-2026-10-02-1441.md`.

## Monitoreo automático · 5 de octubre de 2026

Página: https://doc.minayao.site/monitoreo/. El menú documental incluye su acceso.
Integra los nueve monitores de Kuma con CPU, RAM, swap, disco de datos, carga,
tiempo encendido, procesos, red del host, E/S de disco, sensores disponibles y
consumo por contenedor de Glances. El historial de CPU y RAM comienza con la
instalación del recolector; no se inventan datos anteriores.

El recolector Python se ejecuta cada minuto mediante systemd y publica únicamente
un JSON filtrado fuera de los releases. La página consulta cada 30 segundos y
señala muestras antiguas o fuentes no disponibles. Las credenciales se conservan
solo en el servidor, con modo 0600 y LoadCredential. No hay notificaciones externas.
Instalación, operación y límites: `scripts/monitoring/README.md`.

Para obtener red del servidor y espacio del volumen de datos, Glances ahora usa
la red del host con bind explícito a 192.168.50.11 y un montaje de solo lectura
de `/srv/plataforma/datos`. No se monta la raíz completa del host. El resto de
servicios no se reinició al aplicar este cambio.
