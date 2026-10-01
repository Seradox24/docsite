# Actualización del servidor — 1 de octubre de 2026

Yet Analytics SQL LRS 0.9.7 con PostgreSQL 16.15 instalado en
`/srv/plataforma/servicios/svc-lrsql/`.

- Administración: https://lrs.minayao.site/admin.
- API: https://lrs.minayao.site/xapi.
- Proxy Nginx: `127.0.0.1:18083`; PostgreSQL no publica puertos.
- Datos: `/srv/plataforma/datos/servicios/svc-lrsql/postgres/`.
- Secretos privados: `/srv/plataforma/secretos/servicios/svc-lrsql.env`.
- Respaldos: `/srv/plataforma/respaldos/svc-lrsql/`.
- Logs: `/srv/plataforma/operaciones/svc-lrsql/`.

PostgreSQL y SQL LRS saludables. Login HTTPS, CORS, POST/GET xAPI 1.0.3 y
2.0.0 y rechazo sin credenciales verificados durante la instalación.
Renovación TLS simulada con recarga Nginx correcta. Primer dump generado;
restauración aislada y respaldo externo automatizado pendientes.
Moodle y Keycloak continuaron saludables; integración con el LRS pendiente.

[Registro completo y correcciones del repositorio Yet](https://github.com/Seradox24/Yet/blob/main/docs/installation-2026-10-01.md).

Los diagramas y capturas del 30 de septiembre se conservan como históricos.
Esta actualización no contiene contraseñas, claves API ni datos de aprendizaje.
