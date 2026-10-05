# Monitoreo automático de documentación

La página `/monitoreo/` lee `/api/monitoring.json` cada 30 segundos; el recolector actualiza ese JSON cada 60 segundos. Astro sigue siendo estático. Nginx sirve el JSON desde una ruta externa a los releases, con `Cache-Control: no-store`.

## Fuentes y privacidad

- Kuma: `/metrics` autenticado por HTTPS. Se extraen solo identificador, nombre y tipo de monitor, estado, latencia, disponibilidad de 24 h y certificado. No se publica el contenido completo de métricas.
- Glances: `/api/4/all` desde la LAN. Publica CPU, RAM, swap, volumen de datos, carga, tiempo encendido, conteos de procesos, red, E/S de disco, sensores disponibles y consumo por contenedor. Se excluyen argumentos de procesos, comandos de contenedores, usuarios, variables, IDs internos, IPs y respuestas completas.
- Glances comparte la red del host, escucha únicamente en `192.168.50.11` y monta `/srv/plataforma/datos` en `/host/datos` de solo lectura. Esta ruta permite medir el espacio del volumen de datos sin montar todo el sistema del host. Solo se recrea el contenedor de Glances para aplicar el Compose.
- La fuente privada usa las credenciales existentes de Kuma; no se genera una clave nueva ni se expone la contraseña en JavaScript. Migrar a una clave específica para métricas cuando se configure esa credencial en Kuma.

## Archivos del servidor

| Ruta | Función |
| --- | --- |
| `/srv/plataforma/servicios/svc-docsite-monitor/collect.py` | Recolector Python sin dependencias adicionales |
| `/usr/local/lib/docsite-monitor/collect.py` | Copia ejecutable accesible al usuario del servicio; no amplía permisos en las carpetas privadas de la plataforma |
| `/srv/plataforma/secretos/servicios/svc-docsite-monitor.json` | Configuración privada, root:root 0600; nunca en el repositorio |
| `/var/lib/docsite-monitor/state/snapshot.json` | Estado privado e historial de hasta 24 h, 0600 |
| `/var/lib/docsite-monitor/public/status.json` | JSON filtrado para la página, 0644 |
| `/etc/systemd/system/docsite-monitor.service` | Trabajo con usuario sin login y credenciales efímeras vía LoadCredential |
| `/etc/systemd/system/docsite-monitor.timer` | Programación cada minuto |

Estructura del archivo privado (solo ejemplo, completar en el servidor):

```json
{"kuma":{"url":"https://kuma.minayao.site/metrics","username":"admin","password":"VALOR_PRIVADO"},"glancesUrl":"http://192.168.50.11:61208/api/4/all"}
```

Dentro del bloque HTTPS de `doc.minayao.site`:

```nginx
location = /api/monitoring.json {
    alias /var/lib/docsite-monitor/public/status.json;
    default_type application/json;
    add_header Cache-Control "no-store" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Docsite-Server moodlenewen always;
}
```

El JSON está pensado para los visitantes de la documentación. No da acceso administrativo ni publica la API completa de Glances o Kuma. Los datos operativos seleccionados serán visibles a quienes accedan a esa documentación.

## Validación y operación

```sh
python3 scripts/monitoring/test_collect.py
systemd-analyze verify /etc/systemd/system/docsite-monitor.service /etc/systemd/system/docsite-monitor.timer
systemctl start docsite-monitor.service
systemctl enable --now docsite-monitor.timer
systemctl status docsite-monitor.timer
journalctl -u docsite-monitor.service --since today
nginx -t
curl --fail https://doc.minayao.site/api/monitoring.json
```

Después de modificar Nginx, validar antes de recargar. Conservar los archivos previos en `respaldos/monitoreo/`. Publicar la página con `scripts/publish-lan.ps1`, que conserva el release previo y compara los hashes del HTML servido.

Si una fuente falla, el recolector preserva sus últimos datos con `available=false` y conserva su fecha anterior. Si pasan 180 segundos o falla la consulta del navegador, la página muestra datos desactualizados y deja de marcar servicios en verde. Nunca sustituye fallos por ceros ni por estado funcional. El historial mostrado es la última hora; los archivos guardan hasta 24 h. Las tasas de red y E/S son promedios entre actualizaciones de Glances.

La VM no expone sensores físicos en la consulta inicial: la página informa que no están disponibles. El porcentaje inicial de Kuma representa únicamente su historial existente. Al estar Kuma, el recolector y la documentación en el mismo servidor, esto no sustituye un monitor externo para detectar una caída completa del host.
