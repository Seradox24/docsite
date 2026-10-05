# Arquitectura actual · 2 de octubre de 2026

Página: https://doc.minayao.site/arquitectura/

## Diagramas publicados

1. Vista general: navegador LAN → Nginx central → sitios estáticos,
   autenticación y operación/monitoreo.
2. Autenticación: navegador → Nginx auth → Keycloak → PostgreSQL → volumen.
   Red `authsom_default`; el puerto 5432 no se publica en el host.
3. Operación: proxy por dominio → Kuma, Portainer y Glances; volúmenes de Kuma y
   Portainer; API Docker para administración y consulta desde los paneles.

## Estado contrastado

- Servidor `moodlenewen`, `192.168.50.11`, auditado por SSH a las 10:54 de Santiago.
- Activos: `authsom-keycloak-1`, `authsom-db-1`, `uptime-kuma`, `portainer`, `glances`.
- Dominios: `minayao.site`, `doc.minayao.site`, `auth.minayao.site`,
  `kuma.minayao.site`, `port.minayao.site`, `glances.minayao.site`.
- Nginx y documentación estática se ejecutan en el host, fuera de Docker.
- Persistencia: `authsom_keycloak_db_data`, `monitoring_uptime_kuma_data`,
  `monitoring_portainer_data`.
- Kuma: cero monitores en la tabla `monitor`, leída en modo solo lectura.
- Reservas vacías: `/srv/plataforma/moodle/`, `/srv/plataforma/microservicios/`,
  `/srv/plataforma/servicios/svc-lrsql/`.
- El sitio principal muestra mantenimiento; su próximo uso sigue por definir.

## Validación

Los tres candidatos Archify pasaron los cuatro gates de `finalize`, perfil
`showcase`, con cero diagnósticos. Las capturas claras de 1440×900 fueron
inspeccionadas visualmente. La página Astro compila y se revisó su diseño en
navegador a 1280 px y 390 px; los enlaces y visores se comprobaron.

Fuentes saneadas y recibos locales: `D:/Servidor/.archify/architecture-servidor-actual-20261002-105427/`.
Los HTML de `public/diagramas/archify/` coinciden por SHA-256 con los artefactos
validados. No se publican archivos de credenciales, variables de entorno ni
recibos con rutas locales. La instantánea no acredita una integración SSO
completa ni proporciona monitoreo en tiempo real.
