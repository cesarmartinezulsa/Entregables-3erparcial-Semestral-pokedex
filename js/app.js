const $ = (id) => document.getElementById(id);
const fmtId = (id) => '#' + String(id).padStart(3, '0');
const capitalizar = (t) => t.charAt(0).toUpperCase() + t.slice(1);

function crearPills(types) {
  return types.map((t) =>
    `<span class="rounded-md px-2 py-0.5 text-[9px] font-semibold text-neutral-900 ring-1 ring-white/70" style="background:${COLOR_TIPO[t] || '#ddd'}">${capitalizar(t)}</span>`
  ).join('');
}

function crearTarjeta(p) {
  const fondo = p.capturado ? 'from-[#b9ecbd] to-[#3fc35c]' : 'from-[#ececec] to-[#a8a8a8]';
  const tipos = p.capturado
    ? crearPills(p.types)
    : '<span class="rounded-md bg-white/80 px-2 py-0.5 text-[9px] font-semibold text-neutral-500">???</span>';
  const card = document.createElement('button');
  card.className = 'relative flex h-44 flex-col overflow-hidden rounded-xl bg-white text-left shadow active:scale-[0.98]';
  if (p.capturado) card.dataset.abrir = p.id;
  card.innerHTML = `
    <span class="absolute right-2 top-1.5 text-[9px] text-neutral-500">${fmtId(p.id)}</span>
    <div class="flex flex-1 items-center justify-center px-2 pt-4">
      <img src="${SPRITE_URL}${p.id}.png" alt="" loading="lazy" class="h-20 w-20 object-contain ${p.capturado ? '' : 'brightness-0'}">
    </div>
    <div class="flex flex-col items-center gap-1 bg-gradient-to-b ${fondo} px-2 pb-2.5 pt-2">
      <span class="text-xs font-semibold text-white">${p.capturado ? p.name : '???'}</span>
      <div class="flex gap-1">${tipos}</div>
    </div>`;
  return card;
}

function renderizarPokedex() {
  const grid = $('pokedex-contenido');
  grid.innerHTML = '';
  POKEMON.forEach((p) => grid.appendChild(crearTarjeta(p)));
}

function mostrarEstado(estado) {
  ['contenido', 'vacio', 'cargando', 'error'].forEach((e) => {
    const el = $('pokedex-' + e);
    el.classList.toggle('hidden', e !== estado);
    if (e !== 'contenido') el.classList.toggle('flex', e === estado);
  });
  mostrarVista('pokedex');
}

function actualizarProgreso() {
  const capturados = POKEMON.filter((p) => p.capturado);
  const n = capturados.length;
  const pct = (n / TOTAL) * 100;

  $('hdr-count').textContent = `${n}/${TOTAL}`;
  $('hdr-bar').style.width = Math.max(pct, 2) + '%';
  $('prog-pct').textContent = pct.toFixed(1) + '%';
  $('prog-count').textContent = `${n}/${TOTAL} pokemon`;
  $('prog-bar').style.width = Math.max(pct, 2) + '%';
  $('prog-cap').textContent = n;
  $('prog-falta').textContent = TOTAL - n;
  $('ring').style.strokeDashoffset = 326.7 * (1 - pct / 100);

  const ultimo = capturados[capturados.length - 1];
  if (ultimo) {
    $('prog-ultimo').textContent = `${fmtId(ultimo.id)} ${ultimo.name}`;
    $('prog-ultimo-img').src = SPRITE_URL + ultimo.id + '.png';
  }
}

function abrirSheet(id) {
  const p = POKEMON.find((x) => x.id === id);
  if (!p) return;
  const stats = Object.entries(p.stats).map(([k, v]) => `
    <div class="flex items-center gap-2 text-[10px]">
      <span class="w-12 text-left text-neutral-600">${k}</span>
      <span class="w-6 text-right font-semibold text-neutral-800">${v}</span>
      <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-300"><div class="h-full rounded-full bg-dex" style="width:${Math.min(v / 150 * 100, 100)}%"></div></div>
    </div>`).join('');

  $('sheet-body').innerHTML = `
    <p class="text-[11px] text-neutral-700">${fmtId(p.id)}</p>
    <h2 class="text-xl font-extrabold text-neutral-900">${p.name}</h2>
    <img src="${SPRITE_URL}${p.id}.png" alt="${p.name}" class="mx-auto my-2 h-40 w-40 object-contain">
    <div class="grid grid-cols-2 gap-3">${p.types.map((t) =>
      `<span class="rounded-md py-1 text-xs font-semibold text-neutral-900" style="background:${COLOR_TIPO[t] || '#ddd'}">${capitalizar(t)}</span>`).join('')}</div>
    <div class="mt-5 grid grid-cols-2 gap-3 text-left">
      <div><p class="text-xs font-extrabold text-neutral-900">Height</p><p class="text-[11px] text-neutral-600">${p.height}</p></div>
      <div><p class="text-xs font-extrabold text-neutral-900">Weight</p><p class="text-[11px] text-neutral-600">${p.weight}</p></div>
    </div>
    <div class="mt-4 text-left">
      <p class="text-xs font-extrabold text-neutral-900">Abilities</p>
      <p class="text-[11px] text-neutral-600">${p.abilities.join(', ')}</p>
    </div>
    <div class="mt-4 space-y-1.5 text-left">
      <p class="text-xs font-extrabold text-neutral-900">Stats</p>${stats}
    </div>`;

  $('sheet').scrollTop = 0;
  $('sheet').classList.remove('translate-y-full', 'pointer-events-none');
  $('sheet-overlay').classList.remove('opacity-0', 'pointer-events-none');
}

function cerrarSheet() {
  $('sheet').classList.add('translate-y-full', 'pointer-events-none');
  $('sheet-overlay').classList.add('opacity-0', 'pointer-events-none');
}

let toastTimer;
function mostrarToast(tipo) {
  const m = MENSAJES[tipo];
  if (!m) return;
  $('toast-text').textContent = m.texto;
  $('toast-dot').className = `h-2.5 w-2.5 shrink-0 rounded-full ${m.color}`;
  $('toast').classList.remove('opacity-0', 'translate-y-2');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('toast').classList.add('opacity-0', 'translate-y-2'), 2800);
}

function mostrarVista(vista) {
  cerrarSheet();
  document.querySelectorAll('[data-view]').forEach((s) => s.classList.toggle('hidden', s.dataset.view !== vista));
  document.querySelectorAll('[data-nav]').forEach((b) => {
    b.classList.toggle('bg-black/30', b.dataset.nav === (vista === 'scanner' ? 'pokedex' : vista));
  });
  $('fab').classList.toggle('hidden', vista === 'scanner');
  $('header').classList.toggle('pb-10', vista === 'scanner');
  $('header').classList.toggle('pb-3', vista !== 'scanner');
  $('header-progress').classList.toggle('hidden', vista === 'scanner');
  document.querySelector('main').scrollTop = 0;
}

function iniciarEventos() {
  document.querySelectorAll('[data-nav]').forEach((b) => b.addEventListener('click', () => {
    b.dataset.nav === 'pokedex' ? mostrarEstado('contenido') : mostrarVista(b.dataset.nav);
  }));
  $('fab').addEventListener('click', () => mostrarVista('scanner'));
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-abrir]');
    if (card) return abrirSheet(Number(card.dataset.abrir));
    const t = e.target.closest('[data-toast]');
    if (t) return mostrarToast(t.dataset.toast);
    const s = e.target.closest('[data-estado]');
    if (s) return mostrarEstado(s.dataset.estado);
  });
  $('sheet-overlay').addEventListener('click', cerrarSheet);
  $('sheet-handle').addEventListener('click', cerrarSheet);
  document.addEventListener('keydown', (e) => e.key === 'Escape' && cerrarSheet());
}

renderizarPokedex();
actualizarProgreso();
iniciarEventos();
mostrarEstado('contenido');
