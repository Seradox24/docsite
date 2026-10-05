# Estado del servidor · 2 de octubre de 2026 · 14:41 Santiago

Auditoría de solo lectura por SSH en `moodlenewen`, `192.168.50.11`.

| Proyecto | Carpeta activa | Componentes en ejecución |
| --- | --- | --- |
| lms-moodle | `/srv/plataforma/moodle/` | web, app PHP-FPM, cron, PostgreSQL 16, Redis 7 |
| yet-lrsql | `/srv/plataforma/servicios/svc-lrsql/` | Yet SQL LRS 0.9.7, PostgreSQL 16.15 |
| authsom | `/srv/plataforma/servicios/svc-keycloak/` | Keycloak 26.7.5, PostgreSQL 17 |
| svc-uptime-kuma | `/srv/plataforma/servicios/svc-uptime-kuma/` | Uptime Kuma |
| svc-portainer | `/srv/plataforma/servicios/svc-portainer/` | Portainer |
| svc-glances | `/srv/plataforma/servicios/svc-glances/` | Glances |

Total: 12 contenedores en ejecución. `lms-moodle-code-init-1` está finalizado,
salida 0; no es un servicio fallido. Web, app, las tres bases PostgreSQL, Redis,
LRS, Keycloak y Kuma tienen healthcheck saludable. Cron, Portainer y Glances
están running sin healthcheck definido.

## Publicación y persistencia

| Dominio | Destino real | Respuesta HTTPS |
| --- | --- | --- |
| doc.minayao.site | documentación estática | 200 |
| minayao.site | página de mantenimiento | 200 |
| moodle.minayao.site | HTTP 127.0.0.1:18080 | 303; login 200 |
| lrs.minayao.site | HTTP 127.0.0.1:18082 | 302; admin y xapi/about 200 |
| auth.minayao.site | HTTP 127.0.0.1:18081 | 302; descubrimiento OIDC 200 |
| kuma.minayao.site | HTTP 192.168.50.11:3001 | 302 |
| port.minayao.site | HTTPS 192.168.50.11:9443 | 200 |
| glances.minayao.site | HTTP 192.168.50.11:61208 | 200 |

Las peticiones se realizaron contra Nginx local con validación TLS de cadena y
nombre, sin omitir la validación. No prueban una integración funcional entre apps.

Siete volúmenes Docker distintos están montados en contenedores activos:
Keycloak DB, Kuma, Portainer, Moodle DB, Moodle code, Moodledata y Redis (anónimo).
La base del LRS usa un bind mount adicional en
`/srv/plataforma/datos/servicios/svc-lrsql/postgres/`.

Moodle 5.2.3 (Build: 20260914) se confirmó en código y base. El frontend Nginx del
contenedor dirige a `app:9000`; la app usa `db` y `redis`. La clase de sesiones
es `\core\session\redis`. Autenticación habilitada: `email`. No se afirma SSO con
Keycloak ni integración xAPI hacia el LRS. Kuma sigue con cero monitores en su base.

## Organización y secretos

Moodle y LRS están en las carpetas previstas. `.env.prod` del LRS y `.env` de
Keycloak enlazan a `secretos/servicios/`, modo 0600. Moodle conserva `.env` regular
en su proyecto, también 0600. No se copiaron valores a los diagramas ni al sitio.

`microservicios/` está vacío. Existe `servicios/svc-keycloak-pre-548954e/`, sin un
Compose activo asociado y con enlace al secreto del Keycloak actual. Su ubicación
no sigue la separación de respaldos; no se movió ni eliminó durante esta tarea.

## Diagramas

Cinco diagramas de arquitectura en `/arquitectura/`, con Archify: vista general,
autenticación, operación/monitoreo, Moodle y LRS. La portada contiene solo el
enlace y una miniatura estática de la vista general, recortada con CSS.

Candidatos, auditorías saneadas y recibos locales:
`D:/Servidor/.archify/architecture-servidor-actual-20261002-144134/`.
Los cinco pasaron validate, deliver, check y browser-check en calidad showcase.
Se inspeccionaron capturas claras de vista general, Moodle y LRS a 1440×900.
