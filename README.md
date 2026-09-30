# docsite

Sitio de documentación de la plataforma **minayao.site**, construido con **Astro** (TypeScript, Tailwind CSS v4 y una isla React).

- URL: https://doc.minayao.site
- Repositorio: https://github.com/Seradox24/docsite
- Este proyecto vive **en local** (fuente) y GitHub; el servidor es solo el **destino del despliegue**
  (`/srv/plataforma/documentacion/public/`, servido por Nginx).

## Requisitos

- Node.js >= 22.12

## Desarrollo

```bash
npm install
npm run dev      # servidor local en http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/ localmente
```

## Estructura

```
src/
├── components/        # Sidebar, Topbar, Hero, Metrics, secciones, Footer
│   └── react/         # islas React (client:visible)
├── data/platform.ts   # contenido tipado (nav, inventario, servicios)
├── layouts/BaseLayout.astro
├── pages/index.astro
└── styles/global.css  # Tailwind v4 + tokens de diseño (@theme)
public/
└── arquitectura.html  # diagrama interactivo (Archify), se copia tal cual
```

## Despliegue automático (GitHub Actions)

`.github/workflows/deploy.yml` compila en cada push a `main` y publica `dist/`
en el servidor por `rsync` sobre SSH. No se instala Node en el servidor.

Secrets requeridos en GitHub (Settings → Secrets and variables → Actions):

| Secret | Descripción | Valor |
| --- | --- | --- |
| `SSH_PRIVATE_KEY` | Clave privada de deploy (GitHub → servidor) | contenido de `/root/.ssh/docsite_deploy_actions` en el servidor |
| `SSH_HOST` | IP del servidor | `147.93.132.78` |
| `SSH_USER` | Usuario de deploy en el servidor | `docsite` |
| `SSH_PORT` | Puerto SSH | `22` |
| `DEPLOY_PATH` | Carpeta destino | `/srv/plataforma/documentacion/public` |

## Despliegue manual (alternativo)

Desde local, si no se usa Actions:

```bash
npm run build
scp -r dist/* docsite@147.93.132.78:/srv/plataforma/documentacion/public/
```

## Primer push

```bash
git remote add origin https://github.com/Seradox24/docsite.git
git push -u origin main --force
```
