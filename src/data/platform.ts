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
  { branch: '├──', name: 'microservicios/', note: 'reservado', variant: 'folder' },
  { branch: '├──', name: 'servicios/', variant: 'folder' },
  { branch: '│   ├──', name: 'svc-keycloak/', tag: 'PENDIENTE', variant: 'child' },
  { branch: '│   ├──', name: 'svc-lrsql/', tag: 'PENDIENTE', variant: 'child' },
  { branch: '│   └──', name: 'svc-monitoring/', tag: 'APAGADO', variant: 'child' },
  { branch: '├──', name: 'moodle/', tag: 'PENDIENTE', variant: 'folder' },
  { branch: '├──', name: 'documentacion/', tag: 'HTTPS', tone: 'green', variant: 'folder', highlight: true },
  { branch: '│   ├──', name: 'contenido/', variant: 'child' },
  { branch: '│   └──', name: 'public/', variant: 'child' },
  { branch: '├──', name: 'infraestructura/', variant: 'folder' },
  { branch: '│   ├──', name: 'nginx/', variant: 'child' },
  { branch: '│   └──', name: 'tls/', variant: 'child' },
  { branch: '├──', name: 'datos/' },
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
  { n: '01', title: 'Una base para migrar paso a paso', body: '<code>moodle/</code>, <code>servicios/svc-keycloak/</code> y <code>servicios/svc-lrsql/</code> son carpetas preparadas. Las aplicaciones del VPS aún no se han migrado.' },
  { n: '02', title: 'Entrada central con Nginx', body: '<code>minayao.site</code> muestra la página de mantenimiento y <code>doc.minayao.site</code> sirve esta documentación. Configuraciones en <code>infraestructura/nginx/sites-available/</code>, enlazadas desde <code>/etc/nginx/sites-enabled/</code>.' },
  { n: '03', title: 'Monitoreo conservado y apagado', body: '<code>servicios/svc-monitoring/compose.yaml</code> conserva Uptime Kuma, Portainer y Glances. Proyecto <code>monitoring</code>, política <code>restart: no</code>. Los dos volúmenes de datos siguen en Docker.' },
  { n: '04', title: 'Persistencia y operación privadas', body: '<code>datos/</code>, <code>secretos/</code>, <code>respaldos/</code> y <code>operaciones/</code> separan el estado del código. Las carpetas de las aplicaciones pendientes están vacías; los secretos no se publican.' },
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
  { label: 'MONITOREO', value: '03', unit: 'apagados' },
  { label: 'MIGRACIÓN', text: 'Preparada', dot: 'tiny' },
  { label: 'DOCUMENTACIÓN', text: 'Activa', dot: 'status' },
];

export interface InventoryItem {
  tag: string;
  title: string;
  body: string;
  badge: string;
}

export const inventory: InventoryItem[] = [
  { tag: 'INFRAESTRUCTURA', title: 'Nginx central · moodlenewen', body: 'Ubuntu 26.04.1 LTS en <code>192.168.50.11</code>. Nginx 1.28.3 sirve dos dominios en la LAN; HTTP redirige a HTTPS. Certificado nuevo válido hasta el 30 de diciembre de 2026.', badge: 'ACTIVO' },
  { tag: 'DOCUMENTACIÓN', title: 'Centro de documentación actual', body: 'Astro compilado en <code>/srv/plataforma/documentacion/public/</code>. El inventario del VPS se conserva como <a href="/legado/">servidor legado</a>.', badge: 'ACTIVO' },
  { tag: 'MONITOREO', title: 'Uptime Kuma · Portainer · Glances', body: 'Tres contenedores creados y sin ejecutar; arranque automático deshabilitado. Puertos reservados: 3001, 9443 HTTPS y 61208. Datos de Kuma y Portainer conservados en sus volúmenes Docker.', badge: 'APAGADO' },
  { tag: 'MIGRACIÓN', title: 'Moodle · Keycloak · Yet SQL LRS', body: 'Rutas preparadas para recibir las aplicaciones. No hay contenedores, bases restauradas ni datos importados de estos servicios en la VM nueva.', badge: 'PENDIENTE' },
  { tag: 'TLS', title: 'Renovación desde un equipo con Internet', body: 'Clave privada nueva conservada exclusivamente en la VM. La renovación usa CSR y validación DNS desde un equipo externo; todavía no está automatizada.', badge: 'PENDIENTE' },
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
  { tag: 'SITIO PRINCIPAL', title: 'Estamos trabajando para usted', body: 'Página de mantenimiento servida por el Nginx central de la VM.', href: 'https://minayao.site', cta: 'Abrir' },
  { tag: 'DOCUMENTACIÓN', title: 'Servidor actual · LAN', body: 'Estructura, estado observado y próximos pasos de la migración a moodlenewen.', href: 'https://doc.minayao.site', cta: 'Abrir' },
  { tag: 'HISTÓRICO', title: 'Servidor legado · VPS', body: 'Instantánea conservada del sitio anterior, con Moodle, Keycloak y LRS. Describe el origen de la migración.', href: '/legado/', cta: 'Consultar' },
];
