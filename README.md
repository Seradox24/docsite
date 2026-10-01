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
Uptime Kuma, Portainer y Glances. El monitoreo funciona desde
tres directorios independientes: `servicios/svc-uptime-kuma/`,
`servicios/svc-portainer/` y `servicios/svc-glances/`,
con `restart: unless-stopped` y puertos publicados en `192.168.50.11`.
La configuración conservada está en `configuraciones/svc-uptime-kuma/`, `configuraciones/svc-portainer/` y
`configuraciones/svc-glances/`.
Los servicios no instalados y la imagen de arquitectura no se publican.
Los registros históricos se mantienen fuera del sitio público.

La sección Organización muestra las carpetas reales, incluidas las reservas vacías
de Moodle, Keycloak y Yet. No muestra archivos Compose ni etiquetas de estado.
