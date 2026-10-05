# Auditoría de Keycloak · 2 de octubre de 2026

Servidor inspeccionado por SSH: `moodlenewen`, `192.168.50.11`.
Resultado: ubicación conforme con la organización documentada; no fue necesario
trasladar archivos ni modificar la instalación.

| Componente | Evidencia observada |
| --- | --- |
| Proyecto | Docker Compose `authsom` |
| Directorio activo | `/srv/plataforma/servicios/svc-keycloak/` |
| Compose activo | `/srv/plataforma/servicios/svc-keycloak/compose.yaml` |
| Keycloak | `authsom-keycloak-1`, `quay.io/keycloak/keycloak:26.7.5`, running/healthy |
| Base de datos | `authsom-db-1`, `postgres:17-alpine`, running/healthy |
| Datos PostgreSQL | Volumen `authsom_keycloak_db_data`, montado en `/var/lib/postgresql/data` |
| Directorio central de datos | `datos/servicios/svc-keycloak/` existe vacío; no contiene una copia del volumen |
| Importación del realm | `servicios/svc-keycloak/keycloak/educacion-realm.json`, montado en solo lectura |
| Secretos | `.env` enlaza a `secretos/servicios/svc-keycloak.env`, modo 0600; ignorado por Git |
| Procedimiento | `operaciones/svc-keycloak/procedimiento-instalacion.md`, modo 0640 |
| Proxy | `infraestructura/nginx/sites-available/auth.minayao.site.conf`, enlazado en `sites-enabled` |
| Puerto del servicio | `127.0.0.1:18081` → contenedor 8080; PostgreSQL sin puerto publicado |
| TLS | Certificado wildcard de `infraestructura/tls/lan-monitoring/`; validación TLS satisfactoria |

No se encontraron valores de las variables PASSWORD/SECRET del `.env` en los
archivos regulares inspeccionados dentro del servicio. Se excluyeron el enlace
`.env` y el directorio `.git`; no se afirma una auditoría del historial Git.

## Verificación funcional

- `https://auth.minayao.site/`: 302.
- `https://auth.minayao.site/admin/`: 302.
- `https://auth.minayao.site/realms/educacion/.well-known/openid-configuration`: 200.
- Issuer anunciado: `https://auth.minayao.site/realms/educacion`.
- Realm de importación habilitado: `educacion`.
- Clientes declarados en el archivo de importación: `moodle`, `flutter-desktop`,
  `web-login` y `lrs-bridge`. Su declaración no verifica su integración efectiva.

No se alteraron contenedores, datos ni credenciales. Esta auditoría sustituye la
descripción anterior de `svc-keycloak/` como carpeta vacía en la documentación
actual; los registros del 1 de octubre se conservan como historial.
