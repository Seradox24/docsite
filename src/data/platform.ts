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
  { branch: '├──', name: 'microservicios/', note: 'sin contenedores observados', variant: 'folder' },
  { branch: '├──', name: 'servicios/', tag: 'DOCKER', variant: 'folder' },
  { branch: '│   ├──', name: 'svc-keycloak/', variant: 'child' },
  { branch: '│   └──', name: 'svc-lrsql/', variant: 'child', tag: 'LRS', tone: 'green' },
  { branch: '├──', name: 'moodle/', tag: 'DOCKER', variant: 'folder' },
  { branch: '├──', name: 'documentacion/', tag: 'WEB', tone: 'green', variant: 'folder', highlight: true },
  { branch: '│   ├──', name: 'contenido/', variant: 'child' },
  { branch: '│   ├──', name: 'public/', variant: 'child' },
  { branch: '├──', name: 'infraestructura/' },
  { branch: '├──', name: 'datos/' },
  { branch: '├──', name: 'secretos/' },
  { branch: '├──', name: 'respaldos/' },
  { branch: '└──', name: 'operaciones/', variant: 'folder' },
];

export interface Guide {
  n: string;
  title: string;
  body: string;
}

export const guides: Guide[] = [
  {
    n: '01',
    title: 'Aplicaciones y componentes',
    body: '<code>servicios/svc-keycloak/</code> contiene identidad y <code>servicios/svc-lrsql/</code> contiene Yet SQL LRS. Ambos usan PostgreSQL independiente. <code>microservicios/</code> no tiene contenedores observados.',
  },
  {
    n: '02',
    title: 'Aprendizaje y documentación',
    body: '<code>moodle/</code> contiene el despliegue activo del aula virtual. <code>documentacion/public/</code> contiene este sitio Astro compilado; el código fuente se mantiene fuera del servidor.',
  },
  {
    n: '03',
    title: 'Datos fuera del código',
    body: 'Moodle y Keycloak usan volúmenes Docker. Yet guarda PostgreSQL en <code>datos/servicios/svc-lrsql/postgres/</code>, secretos en <code>secretos/servicios/svc-lrsql.env</code> y respaldos en <code>respaldos/svc-lrsql/</code>. Su contenido permanece privado.',
  },
  {
    n: '04',
    title: 'Operación del servidor',
    body: '<code>infraestructura/</code> y <code>operaciones/</code> existen en la raíz de la plataforma. Los sitios HTTPS activos se configuran en <code>/etc/nginx/sites-available/</code>.',
  },
];

export interface Metric {
  label: string;
  value?: string;
  unit?: string;
  text?: string;
  dot?: 'status' | 'tiny';
}

export const metrics: Metric[] = [
  { label: 'MICROSERVICIOS', value: '00', unit: 'desplegados' },
  { label: 'SERVICIOS', value: '02', unit: 'desplegados' },
  { label: 'MOODLE', text: 'Publicado', dot: 'status' },
  { label: 'DOCUMENTACIÓN', text: 'Activa', dot: 'status' },
];

export interface InventoryItem {
  tag: string;
  title: string;
  body: string;
  badge: string;
}

export const inventory: InventoryItem[] = [
  {
    tag: 'SERVICIOS · LRS',
    title: 'Yet Analytics SQL LRS',
    body: 'SQL LRS 0.9.7 y PostgreSQL 16.15, publicados en <a href="https://lrs.minayao.site/admin">lrs.minayao.site</a>. Nginx envía a 127.0.0.1:18083; login HTTPS y escritura/lectura xAPI 1.0.3 y 2.0.0 verificados. Integración con Moodle pendiente.',
    badge: 'ACTIVO',
  },
  {
    tag: 'SERVICIOS',
    title: 'Keycloak (SSO)',
    body: 'Servicio de identidad en contenedores con PostgreSQL propio y datos persistentes. Publicado en <a href="https://auth.minayao.site">auth.minayao.site</a>.',
    badge: 'ACTIVO',
  },
  {
    tag: 'MOODLE',
    title: 'Aula virtual',
    body: 'Publicado en <a href="https://moodle.minayao.site">moodle.minayao.site</a>. Nginx del host envía a 127.0.0.1:18080; web, PHP, cron, PostgreSQL y Redis funcionan en Docker. Redis guarda sesiones.',
    badge: 'ACTIVO',
  },
  {
    tag: 'DOCUMENTACIÓN',
    title: 'Este sitio',
    body: 'Sitio estático construido con Astro, compilado en /srv/plataforma/documentacion/public y servido por Nginx en doc.minayao.site.',
    badge: 'ACTIVO',
  },
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
  {
    tag: 'LRS · YET ANALYTICS',
    title: 'Registros de aprendizaje',
    body: 'Administración de SQL LRS. Endpoint xAPI: https://lrs.minayao.site/xapi. La integración con Moodle se configura por separado.',
    href: 'https://lrs.minayao.site/admin',
    cta: 'Abrir',
  },
  {
    tag: 'SSO · KEYCLOAK',
    title: 'Identidad de la plataforma',
    body: 'Inicio de sesión único (SSO) con Keycloak 26.7.4 y PostgreSQL propio.',
    href: 'https://auth.minayao.site',
    cta: 'Abrir',
  },
  {
    tag: 'MOODLE · AULA VIRTUAL',
    title: 'Moodle',
    body: 'Aula virtual publicada por Nginx; el servicio web de Docker escucha solo en el loopback del servidor.',
    href: 'https://moodle.minayao.site',
    cta: 'Abrir',
  },
  {
    tag: 'ARQUITECTURA',
    title: 'Diagrama interactivo del servidor',
    body: 'Nginx, sitios publicados, Keycloak, Moodle y Yet SQL LRS con sus bases independientes en un plano interactivo.',
    href: '/diagramas/archify/plataforma.html',
    cta: 'Ver diagrama',
  },
  {
    tag: 'CÓDIGO · DOCSITE',
    title: 'Repositorio del sitio',
    body: 'Proyecto Astro con compilación y despliegue automático mediante GitHub Actions.',
    href: 'https://github.com/Seradox24/docsite',
    cta: 'GitHub',
  },
];
