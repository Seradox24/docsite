export interface NavItem {
  href: string;
  index: string;
  label: string;
}

export const serverSnapshot = {
  date: '2 de octubre de 2026',
  shortDate: '2 oct 2026',
  time: '14:41',
  httpsSites: 8,
  activeContainers: 12,
  dockerVolumes: 7,
  kumaMonitors: 0,
};

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
  { branch: '│   ├──', name: 'svc-keycloak-pre-548954e/', variant: 'child' },
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
  { n: '01', title: 'Una carpeta por servicio', body: 'Kuma, Portainer, Glances, Keycloak y Yet SQL LRS tienen proyectos independientes en <code>servicios/</code>. <code>svc-keycloak/</code> ejecuta autenticación y PostgreSQL; <code>svc-lrsql/</code> ejecuta LRS y su propia base. <code>microservicios/</code> sigue vacío.' },
  { n: '02', title: 'Moodle y documentación', body: '<code>moodle/</code> contiene Moodle 5.2.3: web, PHP-FPM, cron, PostgreSQL y Redis. El inicializador de código terminó con salida 0. La documentación usa <code>contenido/</code>, <code>releases/</code> y el enlace <code>public/</code> a la compilación activa.' },
  { n: '03', title: 'Datos y configuración separados', body: 'Moodle, Keycloak, Kuma y Portainer usan volúmenes Docker. PostgreSQL del LRS persiste en <code>datos/servicios/svc-lrsql/postgres/</code>. Los secretos de Keycloak y LRS enlazan a <code>secretos/servicios/</code>; el <code>.env</code> de Moodle permanece en su proyecto, con modo 600.' },
  { n: '04', title: 'Infraestructura y operación', body: '<code>infraestructura/</code> contiene Docker, Nginx y TLS; <code>operaciones/</code> reúne procedimientos. Existe una copia previa en <code>servicios/svc-keycloak-pre-548954e/</code>, sin contenedores activos asociados. No se trasladó durante la auditoría; las copias previas corresponden a <code>respaldos/</code>.' },
];

export interface Metric {
  label: string;
  value?: string;
  unit?: string;
  text?: string;
  dot?: 'status' | 'tiny';
}

export const metrics: Metric[] = [
  { label: 'SITIOS HTTPS', value: String(serverSnapshot.httpsSites).padStart(2, '0'), unit: 'en LAN' },
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
  { tag: 'INFRAESTRUCTURA', title: 'Nginx central · moodlenewen', body: 'Servidor LAN <code>192.168.50.11</code> con ocho dominios HTTPS y doce contenedores en ejecución. Nginx publica documentación, sitio principal, Moodle, LRS, autenticación y monitoreo. El inicializador de código de Moodle está finalizado correctamente, fuera del conteo activo.', badge: 'ACTIVO' },
  { tag: 'DOCUMENTACIÓN', title: 'Centro de documentación', body: 'Astro compilado y publicado por SSH. <code>documentacion/public/</code> apunta a la versión activa en <code>documentacion/releases/</code>; cada publicación conserva la versión anterior.', badge: 'ACTIVO' },
  { tag: 'AUTENTICACIÓN', title: 'Keycloak · auth', body: 'Keycloak 26.7.5 y PostgreSQL 17 están saludables en <code>servicios/svc-keycloak/</code>, proyecto Docker <code>authsom</code>. Nginx publica <code>auth.minayao.site</code> hacia <code>127.0.0.1:18081</code>. El realm <code>educacion</code> responde por OpenID Connect; PostgreSQL persiste en <code>authsom_keycloak_db_data</code> sin exponer su puerto al host.', badge: 'ACTIVO' },
  { tag: 'APRENDIZAJE', title: 'Moodle 5.2.3', body: '<code>moodle.minayao.site</code> responde por HTTPS; Nginx dirige a <code>127.0.0.1:18080</code>. Proyecto <code>lms-moodle</code> en <code>moodle/</code>: web, PHP-FPM, cron, PostgreSQL 16 y Redis 7. Código, archivos y base usan volúmenes Docker. Autenticación habilitada: correo; SSO con Keycloak aún no acreditado.', badge: 'ACTIVO' },
  { tag: 'REGISTROS xAPI', title: 'Yet SQL LRS 0.9.7', body: '<code>lrs.minayao.site</code> publica LRS mediante <code>127.0.0.1:18082</code>. Proyecto <code>yet-lrsql</code> en <code>servicios/svc-lrsql/</code>, con PostgreSQL 16.15 y datos en <code>datos/servicios/svc-lrsql/postgres/</code>. Interfaz administrativa y <code>/xapi/about</code> responden 200 por HTTPS.', badge: 'ACTIVO' },
  { tag: 'MONITOREO', title: 'Uptime Kuma', body: 'Panel de disponibilidad en <code>kuma.minayao.site</code> por HTTPS. Nueve monitores configurados el 5 de octubre de 2026. Sus comprobaciones se muestran automáticamente en <a href="/monitoreo/">Monitoreo del servidor</a>.', badge: 'ACTIVO' },
  { tag: 'ADMINISTRACIÓN', title: 'Portainer', body: 'Administración de Docker en <code>port.minayao.site</code> por HTTPS. Nginx verifica el certificado interno del puerto <code>9443</code>. Conserva su volumen de datos y la conexión al Docker del host.', badge: 'ACTIVO' },
  { tag: 'RECURSOS', title: 'Glances', body: 'Panel de CPU, memoria, disco y contenedores en <code>glances.minayao.site</code> por HTTPS. Desde el 5 de octubre de 2026 sus métricas, incluida la red del host y el volumen de datos, alimentan la página de <a href="/monitoreo/">Monitoreo del servidor</a>.', badge: 'ACTIVO' },
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
  { tag: 'APRENDIZAJE', title: 'Moodle', body: 'Plataforma educativa 5.2.3 con PostgreSQL, sesiones Redis y cron independiente.', href: 'https://moodle.minayao.site', cta: 'Abrir Moodle' },
  { tag: 'REGISTROS xAPI', title: 'Yet SQL LRS', body: 'Servicio de registros xAPI 0.9.7, con interfaz administrativa y PostgreSQL persistente.', href: 'https://lrs.minayao.site', cta: 'Abrir LRS' },
  { tag: 'AUTENTICACIÓN', title: 'Keycloak', body: 'Gestión de identidad y acceso. Realm educacion disponible por OpenID Connect mediante HTTPS.', href: 'https://auth.minayao.site', cta: 'Abrir autenticación' },
  { tag: 'POR DEFINIR', title: 'Sitio principal', body: 'Actualmente muestra una página de mantenimiento. Su uso está por definir; podría alojar un backend en el futuro.', href: 'https://minayao.site', cta: 'Abrir sitio' },
  { tag: 'DOCUMENTACIÓN', title: 'Servidor actual · LAN', body: 'Estructura y servicios instalados en moodlenewen.', href: 'https://doc.minayao.site', cta: 'Abrir' },
  { tag: 'ARQUITECTURA', title: 'Arquitectura del servidor', body: 'Diagramas interactivos de los servicios actuales, autenticación, monitoreo y persistencia.', href: '/arquitectura/', cta: 'Ver diagramas' },
  { tag: 'DISPONIBILIDAD', title: 'Uptime Kuma', body: 'Panel de monitoreo de disponibilidad en la LAN por HTTPS.', href: 'https://kuma.minayao.site', cta: 'Abrir' },
  { tag: 'DOCKER', title: 'Portainer', body: 'Administración de contenedores mediante HTTPS.', href: 'https://port.minayao.site', cta: 'Abrir' },
  { tag: 'RECURSOS', title: 'Glances', body: 'Estado de los recursos del servidor por HTTPS.', href: 'https://glances.minayao.site', cta: 'Abrir' },
];
