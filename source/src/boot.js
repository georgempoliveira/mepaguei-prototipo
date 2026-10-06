/* ============ boot ============ */
/* telas ainda não construídas nesta etapa */
[['poupar', 'Poupar', 'poupar'], ['clareza', 'Clareza', 'clareza'], ['controle', 'Controle', 'controle'], ['faturas', 'Projeção de faturas'], ['objetivo', 'Objetivo financeiro']].forEach(([id, t, tab]) => {
  if (SCREENS[id]) return;
  screen(id, { render: () => `${statusBar()}${tab ? `<div class="ah"><p class="ttl2">${t}</p></div>` : appHeader(t)}<div class="empty" style="flex:1;justify-content:center"><span class="ico-c" style="width:56px;height:56px">${ic('hammer', 24)}</span><p class="b16 semi c-dark">Esta área entra na próxima versão do protótipo</p></div>${tab ? navbar(tab) : homeInd()}` });
});
FLOWS.sort((a, b) => (b.g === 'BlueHub') - (a.g === 'BlueHub'));
FLOWS.forEach(f => { if (f.g === 'Primeiro acesso') f.g = 'Me Paguei sem BlueHub'; });
buildMod(); fit();
if (/cmp/.test(location.hash)) document.body.classList.add('cmp');
if (window.PROTO_PUB || /participante/.test(location.hash)) document.body.classList.add('sem-painel');
reset('bhSplash', {}, 'none');
if (location.hash === '#mapa') $('#mod-sheet').hidden = innerWidth > 900;

/* botão de tela cheia — só na versão de teste, no mobile */
if (window.PROTO_PUB && matchMedia('(max-width:480px)').matches) {
  const root = document.documentElement;
  const reqFS = root.requestFullscreen || root.webkitRequestFullscreen;
  const exitFS = document.exitFullscreen || document.webkitExitFullscreen;
  const inFS = () => document.fullscreenElement || document.webkitFullscreenElement;
  const b = document.createElement('button');
  b.id = 'fs-btn'; b.type = 'button'; b.setAttribute('aria-label', 'Tela cheia');
  b.innerHTML = ic('maximize', 16) + '<span>Tela cheia</span>';
  document.body.appendChild(b);
  b.addEventListener('click', () => {
    if (!reqFS) { toast('No iPhone: toque em Compartilhar e em "Adicionar à Tela de Início" para abrir em tela cheia', 'success', 'info'); return; }
    try { (inFS() ? exitFS.call(document) : reqFS.call(root)); } catch (e) {}
  });
  const sync = () => { b.hidden = !!inFS(); };
  document.addEventListener('fullscreenchange', sync);
  document.addEventListener('webkitfullscreenchange', sync);
  /* entra em tela cheia no primeiro toque (Android; iOS ignora silenciosamente) */
  if (reqFS && !window.matchMedia('(display-mode: fullscreen)').matches && !window.navigator.standalone) {
    const once = () => { try { if (!inFS()) reqFS.call(root); } catch (e) {} };
    window.addEventListener('pointerdown', once, { once: true });
  }
  /* trava o zoom por pinça e duplo-toque (inclusive iOS, que ignora user-scalable=no) */
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(ev => document.addEventListener(ev, e => e.preventDefault()));
  document.addEventListener('touchmove', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
  let lastTap = 0;
  document.addEventListener('touchend', e => { const n = Date.now(); if (n - lastTap < 350) e.preventDefault(); lastTap = n; }, { passive: false });
}
