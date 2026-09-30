# docsite

Documentación de **minayao.site**, construida con Astro, TypeScript, Tailwind CSS y React.

- Sitio: https://doc.minayao.site
- Repositorio: https://github.com/Seradox24/docsite
- Proyecto local: `D:/Servidor/documentacion/docsite Dev`
- Destino del sitio compilado: `/srv/plataforma/documentacion/public/`

## Desarrollo

Requiere Node.js >= 22.12.

```bash
npm ci
npm run dev
npm run build
npm run preview
```

`npm run build` genera `dist/` localmente. Para publicar, registra y sube los cambios:

```bash
git add .
git commit -m "Actualizar documentación"
git push origin main
```

Cada push a `main` ejecuta **Build and deploy** en GitHub Actions: instala con
`npm ci`, compila y sincroniza `dist/` por SSH. También se puede ejecutar desde
Actions → Build and deploy → Run workflow. Guardar archivos o compilar localmente
no hace commit ni push automáticamente.

## Estructura

- `src/components/`: secciones y componentes.
- `src/data/platform.ts`: contenido e inventario.
- `src/pages/index.astro`: página principal.
- `public/diagramas/archify/`: las dos versiones HTML de los diagramas.
- `public/arquitectura.html`: acceso compatible a la última versión.
- `diagramas/README.md`: procedencia y actualización de diagramas.
- `.github/workflows/deploy.yml`: compilación y publicación.
- `.github/ssh_known_hosts`: clave pública del servidor, obtenida por la conexión SSH existente.

## Configuración del despliegue

El único secret obligatorio es **SSH_PRIVATE_KEY**, con la clave privada de
publicación existente en `/root/.ssh/docsite_deploy_actions` del servidor.
Agrégalo en GitHub → Settings → Secrets and variables → Actions.
No guardes esa clave dentro del repositorio.

Los siguientes valores ya están definidos en el workflow. Si existen secrets
con estos nombres, deben coincidir con el destino designado:

| Secret opcional | Valor |
| --- | --- |
| `SSH_HOST` | `147.93.132.78` |
| `SSH_USER` | `docsite` |
| `SSH_PORT` | `22` |
| `DEPLOY_PATH` | `/srv/plataforma/documentacion/public` |

El workflow valida estos valores antes de sincronizar. Comprueba además la clave
SSH, la identidad del servidor, los archivos compilados y los permisos del destino.
Las publicaciones se ejecutan en serie para no interrumpir una sincronización activa.
`rsync` elimina del destino los archivos que ya no existen en `dist/`: esa carpeta
debe contener exclusivamente la documentación generada. No es un despliegue atómico.

El servidor requiere `rsync`, el usuario `docsite` y permisos de escritura en la
carpeta destino. Nginx sirve los archivos estáticos; no se requiere Node en el servidor.
Si cambia la clave pública del servidor, verifica el cambio por SSH y actualiza
`.github/ssh_known_hosts` antes de publicar.

## Verificación

Después del push, revisa que **Build and deploy** termine correctamente y visita:

- https://doc.minayao.site
- https://doc.minayao.site/diagramas/archify/plataforma.html
- https://doc.minayao.site/diagramas/archify/plataforma-20260929-204500.html
