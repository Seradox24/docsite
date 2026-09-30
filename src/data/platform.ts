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
  { branch: '├──', name: 'microservicios/', tag: 'DOCKER', variant: 'folder' },
  { branch: '├──', name: 'servicios/', tag: 'DOCKER', variant: 'folder' },
  { branch: '├──', name: 'moodle/', note: 'reservado', variant: 'muted' },
  { branch: '├──', name: 'documentacion/', tag: 'WEB', tone: 'green', variant: 'folder', highlight: true },
  { branch: '│   ├──', name: 'contenido/', variant: 'child' },
  { branch: '│   ├──', name: 'public/', variant: 'child' },
  { branch: '│   └──', name: 'docsite-dev/', variant: 'child' },
  { branch: '├──', name: 'infraestructura/' },
  { branch: '├──', name: 'datos/' },
  { branch: '├──', name: 'secretos/' },
  { branch: '├──', name: 'respaldos/' },
  { branch: '├──', name: 'operaciones/' },
  { branch: '└──', name: 'README.md', variant: 'muted' },
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
    body: '<code>microservicios/</code> para componentes independientes; <code>servicios/</code> para aplicaciones completas. Cada proyecto tendrá su propio Docker Compose.',
  },
  {
    n: '02',
    title: 'Aprendizaje y documentación',
    body: '<code>moodle/</code> reserva el despliegue del aula virtual. <code>documentacion/</code> contiene las fuentes y este sitio estático.',
  },
  {
    n: '03',
    title: 'Datos fuera del código',
    body: '<code>datos/</code> para persistencia, <code>secretos/</code> para credenciales y <code>respaldos/</code> para copias. Su contenido no se publica en este sitio.',
  },
  {
    n: '04',
    title: 'Operación del servidor',
    body: '<code>infraestructura/</code> reúne plantillas y referencias. <code>operaciones/</code> guarda scripts, inventario y procedimientos.',
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
  { label: 'SERVICIOS', value: '01', unit: 'desplegado' },
  { label: 'MOODLE', text: 'Desplegado', dot: 'tiny' },
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
    tag: 'SERVICIOS',
    title: 'Keycloak (SSO)',
    body: 'Servicio de identidad en contenedores con PostgreSQL propio y datos persistentes. Publicado en <a href="https://auth.minayao.site">auth.minayao.site</a>.',
    badge: 'ACTIVO',
  },
  {
    tag: 'MOODLE',
    title: 'Aula virtual',
    body: 'Desplegada en contenedores (web, PHP, cron, PostgreSQL y Redis) y aislada en 127.0.0.1:18080, aún sin publicación web.',
    badge: 'INTERNO',
  },
  {
    tag: 'DOCUMENTACIÓN',
    title: 'Este sitio',
    body: 'Sitio estático construido con Astro y desplegado por Nginx con HTTPS y renovación automática del certificado.',
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
    tag: 'SSO · KEYCLOAK',
    title: 'Identidad de la plataforma',
    body: 'Inicio de sesión único (SSO) con Keycloak 26.7.4 y PostgreSQL propio.',
    href: 'https://auth.minayao.site',
    cta: 'Abrir',
  },
  {
    tag: 'ARQUITECTURA',
    title: 'Diagrama interactivo del servidor',
    body: 'Nginx, sitios publicados, SSO Keycloak y el stack de Moodle en un plano interactivo.',
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
