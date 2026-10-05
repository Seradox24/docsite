# Integración de monitoreo · 5 de octubre de 2026

## Estado comprobado antes del cambio de conexión

Se instaló el recolector de Kuma y Glances, la ruta Nginx `/api/monitoring.json`
y el temporizador systemd de 60 segundos. Se verificó HTTP 200 en la página
`/monitoreo/` y en el JSON, con `Cache-Control: no-store` para los datos.
El temporizador estaba habilitado y en espera de la siguiente ejecución;
el trabajo terminaba correctamente. El historial aumentó mediante ejecuciones
automáticas y la interfaz mostró datos reales de ambas fuentes.

El proceso iniciado antes de la interrupción confirmó posteriormente la publicación
del release `/srv/plataforma/documentacion/releases/release-8512c4baf0484a85be101479c6601afb`.
Su versión anterior se conservó en releases. No se afirma una nueva comprobación
del servidor después de la instrucción del usuario de preparar la documentación
mientras revisa la conectividad.

La revisión local posterior añade navegación a monitoreo desde arquitectura y TLS,
pruebas del recolector en CI y validación del hash de la página de monitoreo en
el publicador. Estos últimos ajustes quedan preparados para la próxima publicación.

## Datos mostrados

- Nueve monitores: estado, tiempo de respuesta, disponibilidad y caducidad TLS.
- CPU y RAM, historial de la última hora, swap, carga y tiempo encendido.
- Espacio del volumen de datos, tráfico de la interfaz del host, E/S de disco.
- Conteo de procesos e hilos y consumo de los doce contenedores observados.
- Sensores: sin lecturas físicas disponibles en esta VM; no se inventan valores.

Glances usa ahora la red del host, bind explícito a 192.168.50.11 y montaje
de datos en solo lectura. No se monta la raíz completa del servidor.
El recolector filtra los datos antes de publicarlos y conserva credenciales
fuera del repositorio con modo 0600, entregadas al servicio con LoadCredential.

## Observación operativa

En la última muestra revisada, ocho monitores estaban funcionales y el sitio
principal fallaba con `getaddrinfo EAI_AGAIN minayao.site`. Una consulta DNS
desde el host también falló. La página conserva ese estado real; no lo cambia
a funcional ni trata el problema de DNS como un fallo del recolector.

## Validación y publicación pendiente

- Cinco pruebas Python: filtrado de datos privados, errores de fuentes,
  métricas vacías, disponibilidad y latencias negativas no válidas.
- Compilación Astro y revisión del navegador en escritorio y móvil.
- Aviso de datos desactualizados comprobado con muestras de prueba antiguas;
  los indicadores dejan de mostrar estado funcional.
- Archivo de publicación local: `dist/`, excluido de Git.
- Publicación al recuperar la ruta LAN: `pwsh -File scripts/publish-lan.ps1`.
  Conserva el release previo y restaura el enlace si los hashes HTTPS no coinciden.

Procedimiento del recolector: `scripts/monitoring/README.md`.
Los diagramas Archify conservan la instantánea histórica del 2 de octubre;
la página `/monitoreo/` presenta el estado que obtiene automáticamente.
