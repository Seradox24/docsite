type Source = { available: boolean; updatedAt: string | null; data: any };
type Snapshot = { generatedAt: string; staleAfterSeconds: number; sources: { kuma: Source; glances: Source }; history: { time: string; cpu: number | null; memory: number | null }[] };
const element = (id: string) => document.getElementById(id)!;
const text = (id: string, value: string) => { element(id).textContent = value; };
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const decimal = (value: unknown, digits = 1) => finite(value) ? value.toLocaleString('es-CL', { maximumFractionDigits: digits, minimumFractionDigits: digits }) : '—';
const percent = (value: unknown) => finite(value) ? `${decimal(value)} %` : '—';
const bytes = (value: unknown) => {
  if (!finite(value)) return '—';
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB']; let i = 0;
  while (value >= 1024 && i < units.length - 1) { value /= 1024; i++; }
  return `${decimal(value, i ? 1 : 0)} ${units[i]}`;
};
const date = (value: string) => new Date(value).toLocaleString('es-CL', { timeZone: 'America/Santiago', hour12: false });
const age = (value: string | null) => value && Number.isFinite(Date.parse(value)) ? Math.max(0, (Date.now() - Date.parse(value)) / 1000) : Infinity;
const make = (tag: string, content: string, className = '') => { const node = document.createElement(tag); node.textContent = content; node.className = className; return node; };
const stateLabels: Record<number, string> = { 0: 'Caído', 1: 'Funcional', 2: 'Pendiente', 3: 'Mantenimiento' };
let snapshot: Snapshot | null = null;
let connectionFailed = false;
let loading = false;

function current(source: Source) { return source.available && age(source.updatedAt) <= (snapshot?.staleAfterSeconds ?? 180); }
function card(id: string, value: unknown, detail: string) {
  text(`${id}-value`, percent(value)); text(`${id}-detail`, detail);
  const progress = element(`${id}-progress`) as HTMLProgressElement;
  if (finite(value)) { progress.value = Math.max(0, Math.min(100, value)); progress.setAttribute('aria-valuetext', percent(value)); }
  else { progress.removeAttribute('value'); progress.setAttribute('aria-valuetext', 'Sin datos'); }
}
function freshness() {
  if (!snapshot) return;
  const stale = connectionFailed || age(snapshot.generatedAt) > snapshot.staleAfterSeconds;
  const missing = ['kuma', 'glances'].filter(name => !current(snapshot!.sources[name as 'kuma' | 'glances']));
  const warning = element('warning');
  warning.hidden = !stale && !missing.length;
  text('freshness', stale ? 'Datos desactualizados' : missing.length ? 'Datos parciales' : 'Datos actualizados');
  element('freshness').style.color = stale || missing.length ? '#966320' : '#087f68';
  warning.textContent = stale ? 'No se ha podido obtener una muestra reciente. Se conservan las últimas lecturas; no representan el estado actual.' : `Sin datos actuales de ${missing.join(' y ')}. Sus últimas lecturas se muestran como referencia.`;
  for (const [name, label] of [['glances', 'Glances'], ['kuma', 'Kuma']] as const) {
    const source = snapshot.sources[name];
    text(`${name}-status`, `${label} · ${current(source) && !stale ? 'actualizado' : 'sin datos actuales'}${source.updatedAt ? ' · ' + date(source.updatedAt) : ''}`);
  }
  // Never present cached green service indicators as a live healthy state.
  const serviceCurrent = !stale && current(snapshot.sources.kuma);
  document.querySelectorAll<HTMLElement>('[data-monitor-status]').forEach(node => {
    const status = Number(node.dataset.monitorStatus);
    node.textContent = serviceCurrent ? stateLabels[status] ?? 'Desconocido' : 'Sin datos actuales';
    node.style.color = !serviceCurrent ? '#617471' : status === 1 ? '#087f68' : status === 0 ? '#b04435' : '#966320';
  });
  if (!serviceCurrent) text('service-summary', 'Estado actual sin confirmar · se muestra la última muestra disponible.');
}

function render(data: Snapshot) {
  snapshot = data;
  text('updated', `Muestra obtenida: ${date(data.generatedAt)} · Santiago · actualización cada 60 s`);
  const resources = data.sources.glances.data;
  if (resources) {
    card('cpu', resources.cpu.total, `${decimal(resources.cpu.cpucore, 0)} núcleos · E/S ${percent(resources.cpu.iowait)}`);
    card('memory', resources.memory.percent, `${bytes(resources.memory.used)} de ${bytes(resources.memory.total)} · ${bytes(resources.memory.available)} disponibles`);
    const disk = resources.filesystems[0];
    card('disk', disk?.percent, disk ? `${bytes(disk.used)} de ${bytes(disk.size)} · ${bytes(disk.free)} libres` : 'Volumen de datos no disponible');
    card('swap', resources.swap.percent, `${bytes(resources.swap.used)} de ${bytes(resources.swap.total)}`);
    text('uptime', resources.uptime || '—');
    text('load', [resources.load.min1, resources.load.min5, resources.load.min15].map(value => decimal(value, 2)).join(' / '));
    text('processes', `${decimal(resources.processes.total, 0)} / ${decimal(resources.processes.thread, 0)}`);
    text('cpu-breakdown', [resources.cpu.user, resources.cpu.system, resources.cpu.iowait].map(percent).join(' / '));
    text('container-count', String(resources.containers.length));
    rows('network', resources.network.map(item => [item.name, `↓ ${bytes(item.receiveBytesSec)}/s · ↑ ${bytes(item.sendBytesSec)}/s`]), 'No hay interfaces disponibles.');
    rows('diskio', resources.diskio.map(item => [item.name, `Lectura ${bytes(item.readBytesSec)}/s · escritura ${bytes(item.writeBytesSec)}/s`]), 'No hay lecturas de dispositivos disponibles.');
    rows('sensors', resources.sensors.map(item => [item.label || item.type || 'Sensor', `${decimal(item.value)} ${item.unit || ''}`]), 'La máquina virtual no expone sensores de temperatura u otros sensores físicos.');
    const body = element('containers'); body.replaceChildren();
    for (const container of resources.containers) {
      const tr = document.createElement('tr');
      for (const value of [container.name, container.status === 'healthy' ? 'Saludable' : container.status === 'running' ? 'En ejecución' : container.status || 'Desconocido', percent(container.cpuPercent), bytes(container.memoryBytes)]) tr.append(make('td', value));
      body.append(tr);
    }
  }
  const services = element('services'); services.replaceChildren();
  const monitors = data.sources.kuma.data || [];
  text('service-summary', `${monitors.filter(item => item.status === 1).length} funcionales · ${monitors.filter(item => item.status === 0).length} caídos · ${monitors.length} monitores`);
  for (const monitor of monitors) {
    const article = make('article', ''); article.style.cssText = 'border:1px solid #dce5e1;border-radius:10px;background:white;padding:20px;min-width:0';
    const status = make('span', stateLabels[monitor.status] || 'Desconocido'); status.dataset.monitorStatus = String(monitor.status); status.style.cssText = 'font-size:11px;font-weight:600';
    const title = make('h3', monitor.name); title.style.cssText = 'font-size:14px;font-weight:600;margin:9px 0 16px;overflow-wrap:anywhere';
    const details = make('p', `Respuesta ${finite(monitor.responseMs) ? decimal(monitor.responseMs, 0) + ' ms' : '—'} · Disponibilidad 24 h ${percent(monitor.uptime24h)}`); details.style.cssText = 'font-size:11px;color:#617471;line-height:1.8';
    article.append(status, title, details);
    if (monitor.type === 'http' || monitor.type === 'keyword') {
      const cert = make('p', `Certificado: ${monitor.certificateValid === 1 ? 'válido' : monitor.certificateValid === 0 ? 'inválido' : 'sin datos'} · ${finite(monitor.certificateDays) ? decimal(monitor.certificateDays, 0) + ' días restantes' : 'caducidad sin datos'}`); cert.style.cssText = 'font-size:11px;color:#617471;margin-top:7px'; article.append(cert);
    }
    services.append(article);
  }
  const cutoff = Date.now() - 3600_000;
  const history = data.history.filter(point => Date.parse(point.time) >= cutoff);
  for (const key of ['cpu', 'memory'] as const) {
    const points = history.filter(point => finite(point[key])).map(point => `${Math.max(0, Math.min(600, (Date.parse(point.time) - cutoff) / 3600_000 * 600))},${140 - Math.max(0, Math.min(100, point[key]!)) * 1.3}`);
    element(`${key}-line`).setAttribute('points', points.join(' '));
  }
  text('history-note', `${history.length} muestras disponibles · historial conservado hasta 24 h.`);
  freshness();
}
function rows(id: string, items: string[][], empty: string) {
  const target = element(id); target.replaceChildren();
  if (!items.length) { target.append(make('p', empty)); return; }
  for (const [name, value] of items) {
    const row = make('div', ''); row.style.cssText = 'display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;padding:12px 0;border-bottom:1px solid #edf2ed';
    row.append(make('strong', name), make('span', value)); target.append(row);
  }
}
async function refresh() {
  if (loading) return;
  loading = true; (element('refresh') as HTMLButtonElement).disabled = true;
  try {
    const response = await fetch('/api/monitoring.json', { cache: 'no-store', signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error('HTTP');
    const data = await response.json();
    if (data.schemaVersion !== 1 || !data.sources?.kuma || !data.sources?.glances || !Array.isArray(data.history) || !Number.isFinite(Date.parse(data.generatedAt))) throw new Error('Schema');
    connectionFailed = false; render(data);
  } catch {
    connectionFailed = true;
    if (snapshot) freshness();
    else { text('freshness', 'Datos no disponibles'); text('warning', 'No se pudo conectar al monitoreo. Volveremos a intentar automáticamente.'); element('warning').hidden = false; }
  } finally { loading = false; (element('refresh') as HTMLButtonElement).disabled = false; }
}
element('refresh').addEventListener('click', refresh);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
setInterval(() => { freshness(); if (!document.hidden) refresh(); }, 30_000);
refresh();
