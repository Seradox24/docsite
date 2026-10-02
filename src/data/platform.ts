export interface NavItem {
  href: string;
  index: string;
  label: string;
}

export const nav: NavItem[] = [
  { href: '#resumen', index: '01', label: 'Vista general' },
  { href: '#arquitectura', index: '02', label: 'Estructura de carpetas' },
  { href: '#actual', index: '03', label: 'Estado actual' },
  { href: '#convenciones', index: '04', label: 'Convenciones' },
  { href: '#servicios', index: '05', label: 'Servicios publicados' },
];

export interface TreeNode {
  branch: string;
  name: string;
  tag?: string;
  tone?: 'green' | 'slate';
  note?: string;
  variant?: 'folder' | 'plain' | 'muted' | 'child';
  highlight?: boolean;
}

export const tree: TreeNode[] = [
  { branch: '├──', name: 'microservicios/', variant: 'folder' },
  { branch: '├──', name: 'servicios/', variant: 'folder' },
  { branch: '│   ├──', name: 'svc-glances/', variant: 'child' },
  { branch: '│   ├──', name: 'svc-keycloak/', variant: 'child' },
  { branch: '│   ├──', name: 'svc-lrsql/', variant: 'child' },
  { branch: '│   ├──', name: 'svc-portainer/', variant: 'child' },
  { branch: '│   └──', name: 'svc-uptime-kuma/', variant: 'child' },
  { branch: '├──', name: 'moodle/', variant: 'folder' },
  { branch: '├──', name: 'documentacion/', variant: 'folder' },
  { branch: '│   ├──', name: 'contenido/', variant: 'child' },
  { branch: '│   ├──', name: 'releases/', variant: 'child' },
  { branch: '│   └──', name: 'public/', variant: 'child' },
  { branch: '├──', name: 'infraestructura/', variant: 'folder' },
  { branch: '│   ├──', name: 'docker/', variant: 'child' },
  { branch: '│   ├──', name: 'nginx/', variant: 'child' },
  { branch: '│   └──', name: 'tls/', variant: 'child' },
  { branch: '├──', name: 'datos/', variant: 'folder' },
  { branch: '├──', name: 'secretos/', variant: 'folder' },
  { branch: '├──', name: 'respaldos/', variant: 'folder' },
  { branch: '└──', name: 'operaciones/', variant: 'folder' },
];

export interface Guide {
  n: string;
  title: string;
  body: string;
}

export const guides: Guide[] = [
  { n: '01', title: 'Una carpeta por servicio', body: 'Uptime Kuma, Portainer y Glances tienen sus propios directorios en <code>servicios/</code>, cada uno con configuración Docker independiente. <code>svc-keycloak/</code> y <code>svc-lrsql/</code> son directorios vacíos; no contienen aplicaciones instaladas.' },
  { n: '02', title: 'Moodle y documentación', body: '<code>moodle/</code> existe como directorio vacío. La documentación usa <code>contenido/</code>, <code>releases/</code> y <code>public/</code>; este último es un enlace al directorio de la compilación activa.' },
  { n: '03', title: 'Datos y configuración separados', body: '<code>datos/</code>, <code>secretos/</code> y <code>respaldos/</code> siguen la organización del legado. Los datos activos de Kuma y Portainer permanecen en sus volúmenes Docker bajo <code>/var/lib/docker/volumes/</code>; no se presentan como archivos trasladados a <code>datos/</code>.' },
  { n: '04', title: 'Infraestructura y operación', body: '<code>infraestructura/</code> contiene <code>docker/</code>, <code>nginx/</code> y <code>tls/</code>. <code>operaciones/</code> reúne procedimientos, scripts y registros por servicio. El árbol muestra directorios reales; una carpeta no implica una instalación activa.' },
];

export interface Metric {
  label: string;
  value?: string;
  unit?: string;
  text?: string;
  dot?: 'status' | 'tiny';
}

export const metrics: Metric[] = [
  { label: 'SITIOS HTTPS', value: '05', unit: 'en LAN' },
  { label: 'MONITOREO', value: '03', unit: 'activos' },
  { label: 'SERVIDOR', text: 'LAN', dot: 'status' },
  { label: 'DOCUMENTACIÓN', text: 'Activa', dot: 'status' },
];

export interface InventoryItem {
  tag: string;
  title: string;
  body: string;
  badge: string;
}

export const inventory: InventoryItem[] = [
  { tag: 'INFRAESTRUCTURA', title: 'Nginx central · moodlenewen', body: 'Ubuntu 26.04.1 LTS en <code>192.168.50.11</code>. Nginx 1.28.3 sirve cinco dominios en la LAN; HTTP redirige a HTTPS. Los sitios originales conservan su certificado y el monitoreo usa un certificado wildcard <code>*.minayao.site</code> válido hasta el 31 de diciembre de 2026.', badge: 'ACTIVO' },
  { tag: 'DOCUMENTACIÓN', title: 'Centro de documentación', body: 'Astro compilado y publicado por SSH. <code>documentacion/public/</code> apunta a la versión activa en <code>documentacion/releases/</code>; cada publicación conserva la versión anterior.', badge: 'ACTIVO' },
  { tag: 'MONITOREO', title: 'Uptime Kuma', body: 'Monitoreo de disponibilidad en <code>kuma.minayao.site</code> por HTTPS. Contenedor saludable y datos persistentes conservados; Nginx dirige al puerto LAN <code>3001</code>.', badge: 'ACTIVO' },
  { tag: 'ADMINISTRACIÓN', title: 'Portainer', body: 'Administración de Docker en <code>port.minayao.site</code> por HTTPS. Nginx verifica el certificado interno del puerto <code>9443</code>. Conserva su volumen de datos y la conexión al Docker del host.', badge: 'ACTIVO' },
  { tag: 'RECURSOS', title: 'Glances', body: 'Panel de CPU, memoria, disco y contenedores en <code>glances.minayao.site</code> por HTTPS. Nginx dirige al puerto LAN <code>61208</code>.', badge: 'ACTIVO' },
];

export interface Principle {
  n: string;
  title: string;
  body: string;
}

export const principles: Principle[] = [
  {
    n: '01',
    title: 'Una carpeta por proyecto',
    body: 'Nombres en minúsculas y separados por guiones. Cada servicio incluye su README y configuración de despliegue.',
  },
  {
    n: '02',
    title: 'Persistencia independiente',
    body: 'Actualizar un contenedor no debe eliminar sus datos. Los archivos persistentes se guardan fuera del código.',
  },
  {
    n: '03',
    title: 'Solo documentación pública',
    body: 'Publicar guías y recursos en <code>public/</code>. Mantener credenciales y procedimientos privados fuera del sitio.',
  },
];

export interface Service {
  tag: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}

export const services: Service[] = [
  { tag: 'SITIO PRINCIPAL', title: 'Estamos trabajando para usted', body: 'Página de mantenimiento servida por el Nginx central.', href: 'https://minayao.site', cta: 'Abrir' },
  { tag: 'DOCUMENTACIÓN', title: 'Servidor actual · LAN', body: 'Estructura y servicios instalados en moodlenewen.', href: 'https://doc.minayao.site', cta: 'Abrir' },
  { tag: 'DISPONIBILIDAD', title: 'Uptime Kuma', body: 'Panel de monitoreo de disponibilidad en la LAN por HTTPS.', href: 'https://kuma.minayao.site', cta: 'Abrir' },
  { tag: 'DOCKER', title: 'Portainer', body: 'Administración de contenedores mediante HTTPS.', href: 'https://port.minayao.site', cta: 'Abrir' },
  { tag: 'RECURSOS', title: 'Glances', body: 'Estado de los recursos del servidor por HTTPS.', href: 'https://glances.minayao.site', cta: 'Abrir' },
];
