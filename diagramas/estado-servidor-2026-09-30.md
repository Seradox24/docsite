# Estado observado del VPS · 30 de septiembre de 2026

Fuente: inspección de solo lectura por SSH en `147.93.132.78`. Este documento
registra una instantánea; no representa un estado deseado ni monitoreo en vivo.

## Entrada pública

`/etc/nginx/sites-enabled/` enlaza los sitios `default`, `minayao.site`,
`doc.minayao.site`, `auth.minayao.site` y `moodle.minayao.site`.

| Host | Destino observado |
| --- | --- |
| `minayao.site` y `www.minayao.site` | archivos en `/var/www/html` |
| `doc.minayao.site` | archivos en `/srv/plataforma/documentacion/public` |
| `auth.minayao.site` | proxy a `127.0.0.1:18081` |
| `moodle.minayao.site` | proxy a `127.0.0.1:18080` |

Nginx termina HTTPS con certificados en `/etc/letsencrypt/live/`. El puerto
HTTP redirige a HTTPS para los sitios nombrados. Se comprobó que `nginx -t`
termina correctamente y que Nginx está activo.

## Contenedores activos

| Proyecto | Contenedores | Red / persistencia observada |
| --- | --- | --- |
| `lms-moodle` | `web`, `app`, `cron`, `db` (PostgreSQL 16), `redis` (Redis 7) | redes `lms-moodle_application` y `lms-moodle_data`; volúmenes `lms-moodle_moodle-code`, `lms-moodle_moodledata` y `lms-moodle_postgres-data` |
| `svc-keycloak` | `keycloak` (26.7.4) y `db` (PostgreSQL 16) | redes `svc-keycloak_edge` y `svc-keycloak_data`; volumen `svc-keycloak_keycloak-postgres` |

Los contenedores de PostgreSQL y Redis no publican puertos en el host. Los
servicios web de Moodle y Keycloak publican solo en `127.0.0.1`. Redis contiene
claves de sesión `moodle_session_*`; esto confirma su uso para sesiones, sin
atribuirle la caché general de Moodle.

## Carpetas observadas

En `/srv/plataforma/` existen `servicios/`, `microservicios/`, `moodle/`,
`documentacion/`, `infraestructura/`, `datos/`, `secretos/`, `respaldos/` y
`operaciones/`. `servicios/svc-keycloak/` y `moodle/` contienen despliegues
activos. En `documentacion/` están `contenido/` y `public/`; el servidor
publica la compilación de Astro desde `public/`.

La presencia de las demás carpetas no demuestra que tengan aplicaciones en
ejecución. El código fuente Astro de este repositorio no se ejecuta en el VPS.

## Alcance de la comprobación

Se consultaron `docker ps`, `docker inspect`, las configuraciones habilitadas
de Nginx y el árbol de carpetas. El diagrama muestra esa topología. No se
copiaron valores de `.env`, credenciales ni contenido de datos persistentes.
