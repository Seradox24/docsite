# Monitoreo por HTTPS en la LAN

Configuraciones activadas el 2 de octubre de 2026, después de emitir y comprobar
el certificado wildcard. Los tres dominios responden por HTTPS en la VM.

| Dominio | Destino en la VM |
| --- | --- |
| kuma.minayao.site | HTTP 192.168.50.11:3001 |
| port.minayao.site | HTTPS 192.168.50.11:9443 |
| glances.minayao.site | HTTP 192.168.50.11:61208 |

Los tres nombres deben resolver a 192.168.50.11, mediante registros A explícitos
o el registro DNS comodín existente.
La VM solo es accesible desde la LAN o una red con ruta hacia ella.

El mapa WebSocket se conserva en `infraestructura/nginx/conf.d/` y se enlaza
desde `/etc/nginx/conf.d/`. Cada sitio se conserva en
`infraestructura/nginx/sites-available/` y se enlaza desde `/etc/nginx/sites-enabled/`.
Ejecutar `nginx -t` antes de recargar. Si falla, retirar únicamente los nuevos enlaces.

La clave TLS de monitoreo se genera y permanece en la VM en
`infraestructura/tls/lan-monitoring/`, con directorio 700 y archivos 600 para root.
La emisión se realiza desde un equipo con Internet usando únicamente el CSR público.
El certificado emitido es `*.minayao.site`: cubre los tres servicios y futuros
subdominios de un nivel. Requiere un único TXT en `_acme-challenge.minayao.site`.
Ese TXT es un desafío temporal; el valor cambia en futuras renovaciones.
Los dos sitios originales conservan su certificado vigente.
El certificado wildcard vence el 31 de diciembre de 2026 a las 11:37:20 UTC
(08:37:20 en Santiago). No hay renovación automática DNS configurada.
`scripts/acme-dns-csr.py` conserva el estado y la clave de cuenta ACME fuera del repo,
en un directorio privado del equipo emisor. No subir esos archivos a Git ni a `dist/`.
Los desafíos TXT se validan en el DNS autoritativo antes de completar la emisión.
La renovación usa el mismo procedimiento DNS; no depende del VPS legado.

Portainer conserva su puerto 9443. Nginx verifica su certificado interno con el
nombre `localhost` y una copia pública del certificado del propio contenedor en
`infraestructura/tls/portainer-upstream/server.pem`. Si Portainer cambia ese certificado,
hay que actualizar esa copia y verificarla antes de recargar Nginx.

Estas configuraciones operativas nunca se publican como contenido del sitio Astro.
