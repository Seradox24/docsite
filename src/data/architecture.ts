export interface ArchitectureDiagram {
  id: string;
  index: string;
  title: string;
  description: string;
  detail: string;
  icon: string;
}

export const architecturePreview = '/images/architecture/server-overview.png';

export const architectureDiagrams: ArchitectureDiagram[] = [
  { id: 'vista-general', index: '01', title: 'Vista general', description: 'Acceso HTTPS, certificados de Let’s Encrypt y cinco grupos al mismo nivel bajo Nginx.', detail: 'TLS termina en Nginx; certificados locales emitidos mediante DNS y renovación manual. Colores por grupo.', icon: 'architecture' },
  { id: 'autenticacion', index: '02', title: 'Autenticación e identidad', description: 'Keycloak, el realm educacion, PostgreSQL y su almacenamiento persistente.', detail: 'La base de datos queda en la red de Docker y Keycloak se publica a través de Nginx.', icon: 'keycloak' },
  { id: 'operacion-monitoreo', index: '03', title: 'Operación y monitoreo', description: 'Kuma, Portainer y Glances: sus accesos, datos y relación con Docker.', detail: 'El diagrama conserva la auditoría del 2 de octubre. Los nueve monitores configurados el 5 de octubre se consultan en la página de monitoreo.', icon: 'uptime-kuma' },
  { id: 'moodle', index: '04', title: 'Plataforma Moodle', description: 'Web, PHP-FPM, PostgreSQL, Redis y la persistencia del LMS.', detail: 'Moodle 5.2.3 y su cron están activos. Autenticación por correo; integración SSO no acreditada.', icon: 'moodle' },
  { id: 'lrs', index: '05', title: 'Registros xAPI · LRS', description: 'Yet SQL LRS, su red interna y PostgreSQL con datos en la plataforma.', detail: 'LRS 0.9.7 responde por HTTPS. No se dibuja un envío de Moodle hacia LRS sin evidencia de esa integración.', icon: 'lrs' },
];
