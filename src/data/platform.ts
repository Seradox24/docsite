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
  { branch: '├──', name: 'servicios/', variant: 'folder' },
  { branch: '│   └──', name: 'svc-monitoring/', tag: 'ACTIVO', tone: 'green', variant: 'child' },
  { branch: '│       └──', name: 'compose.yaml', variant: 'child' },
  { branch: '├──', name: 'documentacion/', tag: 'HTTPS', tone: 'green', variant: 'folder', highlight: true },
  { branch: '│   ├──', name: 'contenido/', variant: 'child' },
  { branch: '│   ├──', name: 'releases/', variant: 'child' },
  { branch: '│   └──', name: 'public/', note: 'enlace a versión activa', variant: 'child' },
  { branch: '├──', name: 'infraestructura/', variant: 'folder' },
  { branch: '│   ├──', name: 'nginx/', variant: 'child' },
  { branch: '│   └──', name: 'tls/', variant: 'child' },
  { branch: '├──', name: 'secretos/', tag: 'PRIVADO' },
  { branch: '├──', name: 'respaldos/' },
  { branch: '└──', name: 'operaciones/', variant: 'folder' },
];

export interface Guide {
  n: string;
  title: string;
  body: string;
}

export const guides: Guide[] = [
  { n: '01', title: 'Aplicaciones de monitoreo', body: '<code>servicios/svc-monitoring/compose.yaml</code> agrupa Uptime Kuma, Portainer y Glances. Los tres funcionan en Docker con reinicio automático <code>unless-stopped</code>.' },
  { n: '02', title: 'Sitios y documentación', body: 'Nginx sirve <code>minayao.site</code> y <code>doc.minayao.site</code> mediante HTTPS. Las compilaciones se envían por SSH a <code>documentacion/releases/</code>; <code>public/</code> apunta a la versión activa.' },
  { n: '03', title: 'Datos fuera del código', body: 'Kuma conserva <code>monitoring_uptime_kuma_data</code> y Portainer <code>monitoring_portainer_data</code>. Los volúmenes residen en <code>/var/lib/docker/volumes/</code> y se mantienen al actualizar los contenedores.' },
  { n: '04', title: 'Operación del servidor', body: 'Nginx central se configura en <code>infraestructura/nginx/sites-available/</code>. Los certificados permanecen privados en <code>infraestructura/tls/</code>. Respaldos y registros operativos quedan fuera de la documentación pública.' },
];

export interface Metric {
  label: string;
  value?: string;
  unit?: string;
  text?: string;
  dot?: 'status' | 'tiny';
}

export const metrics: Metric[] = [
  { label: 'SITIOS HTTPS', value: '02', unit: 'en LAN' },
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
  { tag: 'INFRAESTRUCTURA', title: 'Nginx central · moodlenewen', body: 'Ubuntu 26.04.1 LTS en <code>192.168.50.11</code>. Nginx 1.28.3 sirve dos dominios en la LAN; HTTP redirige a HTTPS. Certificado válido hasta el 30 de diciembre de 2026.', badge: 'ACTIVO' },
  { tag: 'DOCUMENTACIÓN', title: 'Centro de documentación', body: 'Astro compilado y publicado por SSH. <code>documentacion/public/</code> apunta a la versión activa en <code>documentacion/releases/</code>; cada publicación conserva la versión anterior.', badge: 'ACTIVO' },
  { tag: 'MONITOREO', title: 'Uptime Kuma', body: 'Monitoreo de disponibilidad. Contenedor saludable y datos persistentes conservados. Acceso LAN en <code>192.168.50.11:3001</code>.', badge: 'ACTIVO' },
  { tag: 'ADMINISTRACIÓN', title: 'Portainer', body: 'Administración de Docker mediante interfaz HTTPS en <code>192.168.50.11:9443</code>. Conserva su volumen de datos y la conexión al Docker del host.', badge: 'ACTIVO' },
  { tag: 'RECURSOS', title: 'Glances', body: 'Panel de CPU, memoria, disco y contenedores. Interfaz web disponible en <code>192.168.50.11:61208</code>.', badge: 'ACTIVO' },
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
  { tag: 'DISPONIBILIDAD', title: 'Uptime Kuma', body: 'Panel de monitoreo de disponibilidad en la LAN.', href: 'http://192.168.50.11:3001', cta: 'Abrir' },
  { tag: 'DOCKER', title: 'Portainer', body: 'Administración de contenedores mediante HTTPS.', href: 'https://192.168.50.11:9443', cta: 'Abrir' },
  { tag: 'RECURSOS', title: 'Glances', body: 'Estado de los recursos del servidor.', href: 'http://192.168.50.11:61208', cta: 'Abrir' },
];
