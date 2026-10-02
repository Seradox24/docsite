# Servidor nuevo: base para migración gradual

Inspeccionado y preparado por SSH el 1 de octubre de 2026.
Destino: `moodle@moodlenewen`, IP `192.168.50.11`, Ubuntu 26.04.1 LTS.
Origen previsto: VPS `147.93.132.78`. Este registro es independiente del
inventario del VPS: no se han migrado aplicaciones ni cambiado DNS o tráfico.

## Limpieza realizada

Se eliminaron el despliegue anterior de Moodle, sus datos y código, PostgreSQL,
Redis, sus contenedores, imágenes, redes y volúmenes. Se eliminó la caché de
construcción Docker. Las antiguas rutas `/opt/lms` y `/var/www` fueron retiradas.
No se observaron instalaciones ni configuraciones de Nginx, Apache, PHP o Certbot
en el host. Docker y SSH permanecen disponibles.

## Estructura preparada

Basada en `src/data/platform.ts` y los registros del VPS en este repositorio.

```text
/srv/plataforma/
├── README.md
├── microservicios/
├── servicios/
│   ├── svc-keycloak/
│   ├── svc-lrsql/
│   └── svc-monitoring/
│       └── compose.yaml
├── moodle/
├── documentacion/
│   ├── contenido/
│   └── public/
├── infraestructura/
│   ├── nginx/
│   └── tls/
├── datos/
│   ├── moodle/
│   └── servicios/{svc-keycloak,svc-lrsql,svc-monitoring}/
├── secretos/
│   ├── moodle/
│   └── servicios/
├── respaldos/{moodle,svc-keycloak,svc-lrsql,svc-monitoring}/
└── operaciones/{migracion,moodle,svc-keycloak,svc-lrsql,svc-monitoring}/
```

Las carpetas de aplicaciones, datos y respaldos son reservas vacías, salvo
`svc-monitoring`. No implican instalaciones activas ni respaldos disponibles.
`infraestructura/nginx` y `tls` están reservadas; Nginx y certificados no se
instalaron. Los permisos de los directorios son `0750`, propietario y grupo
`moodle`; `secretos` y sus subdirectorios usan `0700`. Los secretos futuros
deben usar `0600` y mantenerse fuera del repositorio y de la documentación pública.
Al publicar documentación será necesario dar acceso al usuario del servidor web
de forma explícita, sin abrir toda la plataforma.

## Monitoreo conservado y desactivado

La configuración se trasladó desde `/home/moodle/monitoring` a
`/srv/plataforma/servicios/svc-monitoring/compose.yaml`. El nombre del proyecto
se fija como `monitoring` para conservar la identidad de los volúmenes existentes.
Los contenedores se recrearon sin iniciarlos; su estado es `created` y su política
de reinicio es `no`. El archivo Compose también fija `restart: "no"`.

| Servicio | Puerto reservado | Persistencia conservada |
| --- | --- | --- |
| Uptime Kuma | 3001 | `monitoring_uptime_kuma_data` |
| Portainer | 9443 HTTPS | `monitoring_portainer_data` |
| Glances | 61208 | Sin volumen de datos propio |

Los dos volúmenes continúan en `/var/lib/docker/volumes/`; no se copiaron a
`datos/servicios/svc-monitoring`. No usar `down --volumes` ni eliminar esos volúmenes
si se quiere conservar el estado del monitoreo.

Verificación: ningún contenedor en ejecución, ningún puerto de aplicaciones
escuchando; SSH continúa en el puerto 22 y el DNS local en loopback.

## Secuencia de migración

1. Inventariar en el VPS cada versión, configuración, integración y tamaño de datos.
2. Crear y verificar respaldos; registrar el procedimiento de retorno por servicio.
3. Copiar código/configuración y secretos a sus rutas correspondientes por separado.
4. Restaurar datos en destino y validar en un entorno aislado. Mantener tareas cron
   y envío de correo desactivados durante las pruebas para evitar operaciones duplicadas.
5. Migrar dependencias según el inventario, validar SSO, Moodle y LRS, y realizar
   una sincronización final de datos antes de cambiar el tráfico de cada servicio.
6. Retirar el origen solamente después de verificar la operación en destino.

Los registros históricos y el inventario público siguen describiendo el VPS.
La preparación del destino no modifica GitHub Actions, DNS ni el sitio publicado.

## Paso siguiente: instalación de Nginx central

Después de preparar la estructura se instalaron Nginx 1.28.3, Certbot 4.0.0
y el plugin `python3-certbot-nginx`. Nginx quedó habilitado y activo en el puerto
80, con respuesta temporal de preparación. La configuración está en
`/srv/plataforma/infraestructura/nginx/sites-available/00-default.conf`, enlazada
desde `/etc/nginx/sites-enabled/`; el sitio predeterminado de Ubuntu se deshabilitó.
El temporizador de renovación Certbot está habilitado. Aún no se ha emitido un
certificado ni habilitado HTTPS.

La consulta a los resolutores públicos 1.1.1.1 y 8.8.8.8 encontró `minayao.site`
apuntando a `192.168.50.11`, una IP privada. Queda pendiente confirmar el dominio
inicial y el acceso externo: IP pública con reenvío TCP 80/443, o validación DNS
para el certificado. Esta actualización sustituye la observación anterior de
ausencia de Nginx en el host; el resto de las aplicaciones sigue sin migrarse.

## Sitios LAN preparados

Se configuraron dos virtual hosts HTTP, ambos con respuesta 200 verificada:

- `minayao.site`: página genérica de Nginx en `/usr/share/nginx/html`.
- `doc.minayao.site`: copia de la documentación publicada en el VPS, en
  `/srv/plataforma/documentacion/public`. Su inventario histórico sigue describiendo
  el VPS, no aplicaciones migradas a la VM.

Las configuraciones están en `infraestructura/nginx/sites-available/`, enlazadas
desde `/etc/nginx/sites-enabled/`. La raíz de la plataforma y `documentacion`
usan `0751` para permitir recorrido al usuario web; los archivos publicados usan
`0644` y sus directorios `0755`. Las carpetas privadas permanecen restringidas.

El destino tendrá uso exclusivo en LAN. El temporizador Certbot se deshabilitó
porque la renovación debe realizarse desde un equipo con Internet mediante DNS.
HTTPS sigue pendiente: los certificados vigentes de ambos dominios en el VPS
vencen el 28 de diciembre de 2026; no se han copiado sus claves privadas al destino.

El usuario eligió emitir certificados nuevos mediante DNS. Se generaron una clave
ECDSA P-256 y un CSR con SAN `minayao.site` y `doc.minayao.site`, dentro de
`/srv/plataforma/infraestructura/tls/lan-minayao/` (root, `0700`; archivos `0600`).
La clave privada permanece exclusivamente en la VM. Emisión DNS pendiente de
publicar los registros TXT de validación; aún no hay certificado nuevo ni HTTPS.

## HTTPS nuevo habilitado

La emisión del 1 de octubre terminó correctamente con el CSR nuevo y el
autenticador manual DNS de Certbot en el VPS. No se solicitaron TXT adicionales
en esta emisión; la cuenta ACME disponía de autorizaciones válidas. No se copiaron
certificados ni claves privadas anteriores. Solo el CSR público salió de la VM y
solo el certificado público emitido se importó en ella.

Certificado SAN: `minayao.site` y `doc.minayao.site`. Vencimiento:
30 de diciembre de 2026, 18:25:05 UTC (15:25:05 en America/Santiago).
Se verificó que su clave pública coincide con la clave privada nueva local.
Almacenamiento: `/srv/plataforma/infraestructura/tls/lan-minayao/fullchain.pem`
y `privkey.pem`, propietario root, directorio `0700` y archivos `0600`.

Ambos virtual hosts tienen HTTPS en 443, TLS 1.2/1.3 y redirección HTTP a HTTPS.
Se comprobaron respuesta HTTPS 200 y verificación de cadena y nombre sin omitir
la validación TLS. La documentación publicada continúa siendo la copia del VPS.
El monitoreo sigue apagado. Este apartado sustituye los estados previos de HTTPS
pendiente.

### Renovación pendiente de automatizar

El certificado emitido con CSR no se renueva mediante `certbot renew`. Antes del
vencimiento, ejecutar otra emisión desde un equipo con Internet con el CSR
existente y `certbot certonly --manual --preferred-challenges dns --csr ...`;
publicar los TXT que solicite la CA, si los requiere. Importar únicamente el
certificado público nuevo a la VM, comprobar que corresponde a la clave local,
validar con `nginx -t` y recargar Nginx. La clave privada no necesita salir.
El temporizador Certbot de la VM permanece deshabilitado.
El directorio emisor del VPS es `/root/lan-minayao-20261001/` y contiene
solo el CSR y certificados públicos de esta emisión, sin la clave TLS de la VM.

## Documentación adaptada al destino

Antes de editar el proyecto se creó un respaldo local completo (249 archivos,
excluidas las dependencias instaladas y la caché Astro) en
`D:/Servidor/documentacion/docsite servidor legado 2026-10-01/` y un ZIP junto
a esa carpeta. Se verificaron las huellas SHA-256 por archivo y la integridad ZIP.

El proyecto activo conserva el estilo original y ahora describe la VM: dos sitios
HTTPS, tres contenedores de monitoreo apagados y Moodle/Keycloak/LRS pendientes.
El sitio anterior está archivado bajo `/legado/`, incluidos los diagramas y assets.
GitHub Actions se cambió localmente a compilación sin despliegue al VPS.
No se hicieron commit ni push.

La versión compilada se publicó en
`/srv/plataforma/documentacion/releases/20261001-actual/`; `public` es un enlace
a esa versión. La publicación anterior se conservó en
`/srv/plataforma/respaldos/documentacion/public-legado-20261001/`.
Se verificaron respuestas HTTPS 200 para la raíz y `/legado/` desde la VM.

Al finalizar, el equipo Windows todavía resolvía `doc.minayao.site` a la IP
del VPS, incluso después de limpiar su caché DNS. Una solicitud dirigida
explícitamente a `192.168.50.11` sí devolvía la nueva documentación. El DNS usado
por el equipo o la LAN debe apuntar al destino para visualizar la actualización.

## Monitoreo activado

El 1 de octubre se activaron Uptime Kuma, Portainer y Glances desde
`/srv/plataforma/servicios/svc-monitoring/compose.yaml`. Proyecto `monitoring`,
política `unless-stopped`. Puertos publicados exclusivamente en la IP LAN:
3001, 9443 HTTPS y 61208. Los volúmenes de Kuma y Portainer se conservaron.
Kuma aparece saludable; las tres interfaces responden. Portainer sirve HTTPS
con su certificado propio, independiente del certificado de los dominios Nginx.

La documentación pública muestra solo instalaciones actuales. Se retiraron las
referencias a aplicaciones por migrar y el espacio para el diagrama sin crear.
El árbol publicado presenta `servicios/svc-monitoring/` como servicio activo.
Una copia de la configuración se mantiene en `configuraciones/svc-monitoring/`
dentro del repositorio. Este registro conserva también las fases anteriores.

## Organización contrastada con el legado

Se inspeccionaron por SSH las carpetas reales del VPS y del destino. La sección
01 ahora muestra solo directorios, sin estados ni archivos. Incluye `moodle/`,
`microservicios/`, `datos/` y los espacios `svc-keycloak/` y `svc-lrsql/` que
existen vacíos. Su existencia no se presenta como una aplicación instalada.
Se añadieron los directorios del legado que faltaban: `infraestructura/docker/`,
`operaciones/runbooks/`, `operaciones/scripts/` y grupos de datos, secretos y
respaldos de microservicios.

El monitoreo se separó en tres proyectos independientes:

- `/srv/plataforma/servicios/svc-uptime-kuma/`
- `/srv/plataforma/servicios/svc-portainer/`
- `/srv/plataforma/servicios/svc-glances/`

Cada carpeta contiene su propio Compose y README. Los dos volúmenes originales
se declararon externos con nombre explícito y se conservaron. Cada servicio
tiene red independiente; nombres de contenedor, puertos LAN y reinicio automático
se mantienen. La configuración agrupada anterior se guardó en
`respaldos/servicios/monitoring-antes-separacion/` y se retiró de `servicios/`.
Los Compose actuales están en `configuraciones/` del repositorio, por servicio.
Los datos gestionados por Docker continúan en `/var/lib/docker/volumes/`;
las carpetas centrales de datos por servicio no implican una copia de esos datos.

## Auditoría de la publicación

Se compararon los ocho archivos de `dist/` con la versión publicada por Nginx:
todas las huellas SHA-256 coincidieron. El HTML actual no contiene imágenes
de arquitectura ni referencias a capturas del legado. El VPS conserva su página
histórica, que sí contiene `plataforma-moodle-20261001.png`. Una pestaña nueva
del navegador integrado seguía mostrando esa página del VPS, aunque una petición
HTTPS desde el equipo por curl llegaba a la VM y coincidía con la compilación local.

Nginx del destino ahora devuelve `X-Docsite-Server: moodlenewen` y exige revalidar
HTML mediante `Cache-Control: no-cache, max-age=0, must-revalidate`. El script
de despliegue compara SHA-256 de `dist/index.html`, el archivo transferido y
la respuesta HTTPS; restaura la publicación anterior si no coinciden.
Únicamente se transfiere el contenido de `dist/`; el repositorio, las fuentes
y las configuraciones operativas no se publican. El workflow de GitHub solo
compila; no despliega al VPS antiguo.

## 2 de octubre de 2026: monitoreo por dominios HTTPS

- Kuma: https://kuma.minayao.site/ hacia HTTP 192.168.50.11:3001.
- Portainer: https://port.minayao.site/ hacia HTTPS 192.168.50.11:9443.
- Glances: https://glances.minayao.site/ hacia HTTP 192.168.50.11:61208.
- HTTP redirige a HTTPS. Los nombres resuelven a la VM mediante el DNS comodín.
- Certificado `*.minayao.site` emitido por DNS-01; vence el 31/12/2026
  a las 11:37:20 UTC (08:37:20 en Santiago). Renovación DNS manual.
- Clave TLS generada y conservada únicamente en la VM en
  `infraestructura/tls/lan-monitoring/privkey.pem`, root y modo 600.
  La cuenta ACME se conserva fuera del repo en un directorio privado del emisor.
- Proxies independientes bajo `infraestructura/nginx/sites-available/`,
  habilitados mediante enlaces en `/etc/nginx/sites-enabled/`.
  Mapa WebSocket en `infraestructura/nginx/conf.d/lan-websocket.conf`.
- Nginx verifica el certificado interno de Portainer con `localhost` y la
  copia pública confiada en `infraestructura/tls/portainer-upstream/server.pem`.
- Verificado: TLS, HTML y recursos estáticos de las tres aplicaciones,
  Socket.IO y WebSocket 101 en Kuma, y API CPU de Glances por HTTPS.
- No se cambiaron contenedores ni volúmenes. Los sitios originales continúan activos.
