# Monitoreo del servidor LAN

Configuración desplegada en `/srv/plataforma/servicios/svc-monitoring/compose.yaml`.
Proyecto Docker Compose: `monitoring`. Reinicio: `unless-stopped`.

- Uptime Kuma: http://192.168.50.11:3001
- Portainer: https://192.168.50.11:9443
- Glances: http://192.168.50.11:61208

Kuma y Portainer conservan sus volúmenes Docker existentes. No ejecutar
`down --volumes` si se quieren conservar sus datos. Las imágenes ya están
disponibles en la VM; iniciar con `docker compose up -d --pull never --no-build`.
Portainer utiliza su certificado HTTPS propio; el certificado de Nginx cubre
los dos dominios del sitio, no la IP de este panel.
