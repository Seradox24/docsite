# Revisión de acceso y TLS

Se contrastaron los virtual hosts activos y los certificados servidos por SNI en la VM. TLS termina en Nginx central. Los certificados son de Let’s Encrypt: SAN para minayao.site y doc.minayao.site (vence 30 diciembre 2026), y wildcard *.minayao.site (vence 31 diciembre 2026). Se almacenan bajo infraestructura/tls/lan-minayao y lan-monitoring.

El procedimiento documentado es emisión externa mediante CSR y ACME/DNS e instalación manual en la VM. Certbot está instalado, su temporizador deshabilitado; no se acredita renovación automática. El bloque externo agrupa CA y equipo emisor para resumir el proceso administrativo; no representa un contenedor.

Los cinco grupos publicados quedan en una misma fila bajo Nginx: sitios, identidad, Moodle, LRS y monitoreo. Puntos de color identifican cada grupo; los marcos conservan el rol técnico. Portainer usa HTTPS desde Nginx en 9443 con verificación del certificado interno; los otros proxies usan HTTP. La flecha de certificados representa configuración local.

Artefacto: D:/Servidor/.archify/architecture-vista-general-tls-20261002-152500/vista-general.html. Comprobantes actuales en review-2/; capturas en visual-check-2/. Finalize showcase y sus cuatro gates correctos, capturas inspeccionadas. Publicado en release-efea75f7affe466f891d9a870c956a39; SHA256 HTTPS coincidente con el HTML validado.

Se revisó únicamente la vista general, manteniendo los demás diagramas para revisión individual.
