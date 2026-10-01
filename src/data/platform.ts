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

export const tree: TreeNode[] = [];

export interface Guide {
  n: string;
  title: string;
  body: string;
}

export const guides: Guide[] = [];

export interface Metric {
  label: string;
  value?: string;
  unit?: string;
  text?: string;
  dot?: 'status' | 'tiny';
}

export const metrics: Metric[] = [
  { label: 'MICROSERVICIOS', text: 'Por completar', dot: 'tiny' },
  { label: 'SERVICIOS', text: 'Por completar', dot: 'tiny' },
  { label: 'ESTADO', text: 'Por completar', dot: 'tiny' },
  { label: 'DOCUMENTACIÓN', text: 'Por completar', dot: 'tiny' },
];

export interface InventoryItem {
  tag: string;
  title: string;
  body: string;
  badge: string;
}

export const inventory: InventoryItem[] = [];

export interface Principle {
  n: string;
  title: string;
  body: string;
}

export const principles: Principle[] = [];

export interface Service {
  tag: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}

export const services: Service[] = [];
