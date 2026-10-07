/* ============ 05 · Home, navegação, notificações, configurações ============ */

/* ---------- dados fictícios das instituições ---------- */
const BANKS = {
  nubank:   { nome: 'Nu Pagamentos S.A.', curto: 'Nubank', logo: 'bank-nubank.png', contas: [{ tipo: 'Conta Corrente', ag: '0810', cc: '99231-1', saldo: 3420.50 }, { tipo: 'Conta Poupança', ag: '0500', cc: '78845-1', saldo: 802.35 }] },
  itau:     { nome: 'Itaú Unibanco S.A.', curto: 'Itaú', logo: 'bank-itau.png', contas: [{ tipo: 'Conta Corrente', ag: '3241', cc: '10457-3', saldo: 3000.00 }] },
  bb:       { nome: 'Banco do Brasil S.A.', curto: 'Banco do Brasil', logo: 'bank-bb.png', contas: [{ tipo: 'Conta Corrente', ag: '1606', cc: '22871-0', saldo: 1250.40 }] },
  bradesco: { nome: 'Banco Bradesco S.A.', curto: 'Bradesco', logo: 'bank-bradesco.png', contas: [{ tipo: 'Conta Corrente', ag: '0921', cc: '0045712-8', saldo: 4147.15 }] },
  btg:      { nome: 'Banco BTG Pactual S.A.', curto: 'BTG', logo: 'bank-btg.png', contas: [{ tipo: 'Conta Corrente', ag: '0050', cc: '508812-4', saldo: 2310.00 }] },
  caixa:    { nome: 'Caixa Econômica Federal', curto: 'Caixa', logo: 'bank-caixa.png', contas: [{ tipo: 'Conta Poupança', ag: '1294', cc: '00031452-7', saldo: 980.10 }] },
  bmg:      { nome: 'Banco BMG S.A.', curto: 'BMG', logo: 'bank-bmg.png', contas: [{ tipo: 'Conta Corrente', ag: '0001', cc: '7730512-0', saldo: 640.00 }] },
  nordeste: { nome: 'Banco do Nordeste do Brasil S.A.', curto: 'BNB', logo: '', contas: [{ tipo: 'Conta Corrente', ag: '0012', cc: '45128-6', saldo: 1120.00 }] },
  santander:{ nome: 'Banco Santander Brasil S.A.', curto: 'Santander', logo: '', contas: [{ tipo: 'Conta Corrente', ag: '3367', cc: '01004588-1', saldo: 1890.75 }] },
  picpay:   { nome: 'Picpay Inst. de Pagamento S.A.', curto: 'PicPay', logo: '', contas: [{ tipo: 'Conta Corrente', ag: '0001', cc: '9871234-5', saldo: 215.30 }] },
};
const bankIc = (id, sm) => { const b = BANKS[id]; return `<span class="bank-ic ${sm ? 'sm' : ''}">${b.logo ? `<img src="assets/${b.logo}" alt="">` : esc(b.curto.slice(0, 2))}</span>`; };
const saldoTotal = () => S.contas.reduce((t, id) => t + BANKS[id].contas.reduce((a, c) => a + c.saldo, 0), 0);
const money = (v, cents = true) => `<span class="money">${fmtBRL(v, cents)}</span>`;
const hasPoup = () => !!(S.poup && (S.poup.vf || S.poup.placar || S.poup.troco));

/* ---------- navbar (Navbar-v3) ---------- */
const TABS = [['home', 'house', 'Início'], ['poupar', 'wallet', 'Poupar'], ['clareza', 'chart-no-axes-combined', 'Clareza'], ['controle', 'sliders-horizontal', 'Controle']];
function navbar(active) {
  return `<nav class="nav" aria-label="Menu principal">${TABS.map(([id, i, l]) => `<button type="button" class="${id === active ? 'on' : ''}" data-act="tab" data-tab="${id}" ${id === active ? 'aria-current="page"' : ''}><span class="pill">${ic(i, 20)}</span>${l}</button>`).join('')}</nav>${homeInd()}`;
}
GLOBAL_ACTS.tab = (b) => { let t = b.dataset.tab;
  /* Clareza ainda sem nenhum estudo: entra pela tela de apresentação (17790:141394) */
  if (t === 'clareza' && typeof primeiraVezClareza === 'function' && primeiraVezClareza()) t = 'clarezaIntro'; const top = stack[stack.length - 1]; if (top && top.id === t && stack.length === 1) { const sc = cur.querySelector('.scroll'); if (sc) sc.scrollTo({ top: 0, behavior: 'smooth' }); return; } reset(t, {}, 'none'); };

/* ---------- Home ---------- */
const BLUEHUB_IC = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="9" r="5"/><path d="M6 20h12"/></svg>`;
function homeHeader() {
  return `<div class="hh">
    <button type="button" class="av" data-go="perfilInfo" aria-label="Meu perfil"><img src="${fotoUser() || 'assets/avatar-user.webp'}" alt=""></button>
    <button type="button" class="f1" data-go="config" style="text-align:left;color:#fff"><p class="b14" style="line-height:18px">Olá,</p><p class="b14 bold" style="line-height:18px">${esc(firstName())}</p></button>
    <button type="button" class="hb" data-act="hideVals" aria-label="${S.flags.hide ? 'Mostrar valores' : 'Ocultar valores'}">${ic(S.flags.hide ? 'eye-off' : 'eye', 18)}</button>
    <button type="button" class="hb" data-go="notif" aria-label="Notificações" style="position:relative">${ic('bell', 18)}${S.notif && S.notif.length ? '<span style="position:absolute;top:4px;right:6px;width:7px;height:7px;border-radius:50%;background:#ff5a5a;border:1.5px solid var(--btn-primary)"></span>' : ''}</button>
    <button type="button" class="hb" data-act="bluehub" aria-label="Voltar ao Bluehub">${BLUEHUB_IC}</button>
  </div>`;
}
function setupCard() {
  const steps = [
    ['Criar perfil Me Paguei', true, ''],
    ['Conectar suas contas', S.contas.length > 0, 'of1'],
    ['Ativar Poupança Automática', hasPoup(), 'tab:poupar'],
    ['Habilitar Radar de Gastos', !!S.radar, 'tab:controle'],
  ];
  /* marca como concluída assim que o usuário visita a Projeção de Faturas */
  if (S.contas.length) steps.push(['Projeção de Faturas', !!(S.flags.fatVisto || S.faturas), 'faturas']);
  const left = steps.filter(s => !s[1]).length;
  if (!left) return '';
  return `<div class="cfg">
    <div class="row g3"><span class="ava-mia"><img src="assets/mia-avatar.webp" alt=""></span><p class="b16 semi c-dark f1" style="line-height:22px">Configure seu<br>assistente financeiro</p><img src="assets/tip.png" width="16" height="16" alt=""></div>
    <p class="cap c-base">Faltam ${left} ${left === 1 ? 'etapa' : 'etapas'} para você aproveitar todos os recursos disponíveis</p>
    <div class="col">${steps.map(([t, done, to]) => `<button type="button" class="cfg-i ${done ? 'done' : ''}" ${done ? 'disabled' : `data-act="step" data-to="${to}"`}>${ic(done ? 'circle-check' : 'circle', 16)}<span class="f1">${t}</span>${done ? '' : ic('chevron-right', 18)}</button>`).join('')}</div>
  </div>`;
}
function donut(pct, size = 72, color = 'var(--ia)', stroke = 12, inner = '') {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, d = Math.max(0, Math.min(1, pct)) * c;
  return `<div class="donut" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#d9d9d9" stroke-width="${stroke}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-dasharray="${d} ${c}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg><span>${inner}</span></div>`;
}
/* régua de meses (17191:36505) — `hi` é o mês atual, em destaque; antes dele a linha é
   cheia (realizado) e depois dela vira tracejada (projeção) */
function faturasChart(hi = 2) {
  const M = [['Ago/26', 1000], ['Set/26', 2350], ['Out/26', 1850], ['Nov/26', 950], ['Dez/26', 800]];
  const w = 84, gap = 8, H = 150, top = 46, bot = 40, max = 2600;
  const y = v => top + (1 - v / max) * (H - top - bot) + 4;
  const xs = M.map((_, i) => i * (w + gap) + w / 2);
  const W = M.length * (w + gap);
  const pts = M.map((m, i) => [xs[i], y(m[1])]);
  return `<div style="overflow-x:auto;margin:0 -16px;padding:0 16px;scrollbar-width:none"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Projeção de faturas por mês">
    ${M.map((m, i) => `<rect x="${i * (w + gap)}" y="0" width="${w}" height="${H}" rx="10" fill="${i === hi ? '#bfe0fb' : '#f1f1f3'}" ${i === hi ? 'stroke="#43a5ee"' : ''}/>
      <text x="${xs[i]}" y="26" text-anchor="middle" font-size="14" font-weight="${i === hi ? 700 : 400}" fill="${i === hi ? '#171717' : '#404040'}">${m[0]}</text>
      <text x="${xs[i]}" y="${H - 14}" text-anchor="middle" font-size="12" fill="#404040" class="money">R$ ${m[1].toLocaleString('pt-BR')}</text>`).join('')}
    <path d="M0 ${pts[0][1] + 6} L${pts.slice(0, hi + 1).map(p => `${p[0]} ${p[1]}`).join(' L')} L${pts[hi][0]} ${H - bot + 8} L0 ${H - bot + 8}Z" fill="#348352" opacity=".15"/>
    <path d="M${pts[hi][0]} ${pts[hi][1]} ${pts.slice(hi + 1).map(p => `L${p[0]} ${p[1]}`).join(' ')} L${W} ${pts[pts.length - 1][1] + 4} L${W} ${H - bot + 8} L${pts[hi][0]} ${H - bot + 8}Z" fill="#5b5fc7" opacity=".14"/>
    <polyline points="0,${pts[0][1] + 6} ${pts.slice(0, hi + 1).map(p => p.join(',')).join(' ')}" fill="none" stroke="#348352" stroke-width="2"/>
    <polyline points="${pts.slice(hi).map(p => p.join(',')).join(' ')} ${W},${pts[pts.length - 1][1] + 4}" fill="none" stroke="#1a3151" stroke-width="1.5" stroke-dasharray="4 4"/>
    ${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="${i === hi ? 5 : 4}" fill="${i < hi ? '#348352' : i === hi ? '#1a3151' : '#fff'}" stroke="${i < hi ? '#348352' : '#1a3151'}" stroke-width="2"/>`).join('')}
  </svg></div>`;
}
const RADAR_CATS = [['Cartões', 'credit-card', 20], ['Delivery', 'bike', 45], ['Mercado', 'shopping-cart', 75], ['Transporte', 'car', 100]];
const pctColor = p => p >= 100 ? '#dc2626' : p >= 70 ? 'var(--warning)' : 'var(--success)';
function radarMini(empty) {
  return `<div class="row jb">${RADAR_CATS.map(([l, i, p]) => `<div class="col g1" style="align-items:center;width:64px">
    ${empty ? `<span style="width:48px;height:48px;border-radius:50%;background:var(--bg-lighter);color:#d3d3d3;display:flex;align-items:center;justify-content:center">${ic(i, 20)}</span>` : donut(p / 100, 48, pctColor(p), 7, `<span style="color:var(--ty-base)">${ic(i, 16)}</span>`)}
    <span class="cap" style="color:${empty ? '#d3d3d3' : 'var(--ty-base)'}">${l}</span>${empty ? '' : `<span class="cap bold" style="color:${pctColor(p)}">${p}%</span>`}</div>`).join('')}</div>`;
}
function homeBody() {
  const conn = S.contas.length > 0;
  const obj = S.objetivo;
  const parts = [];
  if (conn && S.saldoSeguro && S.saldoSeguro.negativo) parts.push(`<div class="ins"><div class="row g2"><span class="ava-mia sm"><img src="assets/mia-avatar.webp" alt=""></span><span class="b14 semi c-ia">Insight da MIA</span><img src="assets/tip.png" width="14" height="14" alt=""></div>
    <p class="b14 bold c-dark">Saldo Seguro projetado negativo</p><p class="cap c-dark">${esc(firstName())}, com base na projeção feita em ${S.ss ? ddmm(S.ss.inicio) : '18/08'}, seu saldo pode ficar negativo em ${S.saldoSeguro.minDay ? ddmm(S.saldoSeguro.minDay) : '16/09'}. Quer ver quais gastos e compromissos mais influenciam esse cenário?</p>
    ${btn('Revisar projeção', { cls: 'btn-ia', act: 'step', attrs: 'data-to="tab:clareza"' })}</div>`);
  parts.push(setupCard());
  if (obj) {
    const pct = Math.min(1, poupTotal() / obj.valor);
    parts.push(`<button type="button" class="hc" data-act="step" data-to="tab:poupar" style="text-align:left"><div class="hct w100"><p>Objetivo financeiro</p>${ic('chevron-right', 18)}</div>
      <div class="row jb w100"><div class="col g1"><p class="cap c-base">Você já alcançou</p><p class="h2 c-darker num">${money(poupTotal())}</p><p class="cap c-dark">da sua meta de<br><b>${money(obj.valor)}</b></p></div>
      <div class="col g1" style="align-items:center">${donut(pct, 80, 'var(--ia)', 14, Math.round(pct * 100) + '%')}<p class="cap semi c-dark">${esc(obj.nome)}</p></div></div></button>`);
  } else {
    parts.push(`<div class="hc"><div class="col g1"><p class="b16 semi c-darker">Seu primeiro objetivo</p><p class="cap c-base">Realize seus sonhos com planejamento</p></div>
      <div class="row g3"><span style="width:44px;height:44px;border-radius:50%;background:var(--bg-lighter);color:#d3d3d3;display:flex;align-items:center;justify-content:center;flex:none">${ic('plus', 20)}</span><p class="b14 c-dark">O que você quer realizar? viagem, casa própria, novo veículo…</p></div>
      ${btn('Criar objetivo financeiro ' + ic('chevron-right', 16), { v: 'o', cls: 'btn-xs', act: 'step', attrs: 'data-to="objetivo"' })}</div>`);
  }
  /* depois de visitar a Projeção de Faturas, o card vira a régua de meses (17191:36505) */
  if (S.flags.fatVisto || S.faturas) parts.push(`<div class="hc"><button type="button" class="hct" data-act="step" data-to="faturas"><p>Projeção de faturas</p>${ic('chevron-right', 18)}</button><p class="cap c-base" style="margin-top:-8px">Faturas das contas conectadas</p>${faturasChart()}</div>`);
  else parts.push(`<div class="hc"><div class="col g1"><p class="b16 semi c-darker">Projeção de faturas</p><p class="cap c-base">Acompanhe as faturas das contas conectadas</p></div>
      <div class="row jb" style="position:relative;padding:4px 0"><span style="position:absolute;left:6px;right:6px;top:11px;border-top:1.5px dashed #d3d3d3"></span>${['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map(m => `<span class="col g1" style="align-items:center;position:relative">${ic('circle', 14, 'c-light')}<span class="cap" style="color:#d3d3d3">${m}</span></span>`).join('')}</div>
      ${btn('Conectar cartões ' + ic('chevron-right', 16), { v: 'o', cls: 'btn-xs', act: 'step', attrs: `data-to="${conn ? 'faturas' : 'of1'}"` })}</div>`);
  if (S.radar) parts.push(`<div class="hc"><button type="button" class="hct" data-act="step" data-to="tab:controle"><p>Radar de gastos</p>${ic('chevron-right', 18)}</button><p class="cap c-base" style="margin-top:-8px">Acompanhe seus gastos</p>${radarMini(false)}</div>`);
  else parts.push(`<div class="hc"><div class="col g1"><p class="b16 semi c-darker">Radar de gastos</p><p class="cap c-base">Monitore gastos variáveis e evite surpresas</p></div>${radarMini(true)}${btn('Ativar radar de gastos ' + ic('chevron-right', 16), { v: 'o', cls: 'btn-xs', act: 'step', attrs: 'data-to="tab:controle"' })}</div>`);
  if (S.saldoSeguro) parts.push(`<div class="hc"><button type="button" class="hct" data-act="step" data-to="tab:clareza"><p>Projeção de Saldo Seguro</p>${ic('chevron-right', 18)}</button><p class="cap c-base" style="margin-top:-8px">${S.ss ? periodo() : '18/08 a 16/09'}</p>
      <div class="row g4" style="padding-top:8px"><div class="stat f1"><p class="b16 semi c-dark num">${money(S.saldoSeguro.final ?? 3000.5)}</p><p class="cap c-base">Projetado em ${S.ss ? ddmm(ssFim()) : '16/09'}</p></div><div class="stat f1" style="border-color:var(--primary)"><p class="b16 semi c-dark num row g1">${money(S.saldoSeguro.min ?? (S.saldoSeguro.negativo ? -720.4 : 3200))} ${ic(S.saldoSeguro.negativo ? 'arrow-down' : 'arrow-up', 12, S.saldoSeguro.negativo ? 'c-danger' : 'c-success')}</p><p class="cap c-base">Saldo mín. projetado</p></div></div></div>`);
  else parts.push(`<div class="hc"><div class="row g3"><span class="ico-c sq sm">${ic('chart-line', 18)}</span><div class="col"><p class="b16 semi c-darker">Projeção de Saldo Seguro</p><p class="cap c-base">Quantos pagamentos podemos assumir?</p></div></div>
      <p class="b14 c-dark">Antecipe seus próximos 30 dias, esteja um passo à frente e tome decisões com mais segurança</p>
      ${btn((conn ? 'Criar projeção agora ' : 'Conectar contas agora ') + ic('chevron-right', 16), { v: 'o', cls: 'btn-xs', act: 'step', attrs: `data-to="${conn ? 'tab:clareza' : 'of1'}"` })}</div>`);
  return parts.join('');
}
screen('home', {
  render: () => {
    const conn = S.contas.length > 0;
    const hero = conn ? `<div class="hcar" id="hcar">
        <div class="gcard"><button type="button" class="gpill" data-act="banks"><span class="logos">${S.contas.slice(0, 3).map(id => BANKS[id].logo ? `<img src="assets/${BANKS[id].logo}" alt="">` : '').join('')}</span>Bancos conectados ${ic('chevron-right', 14)}</button>
          <p class="b14">Saldo consolidado</p><p class="num" style="font-size:32px;line-height:40px;font-weight:700">${money(saldoTotal())}</p><p class="cap">Última atualização em ${ddmmyyyy(new Date())}</p></div>
        <div class="gcard"><button type="button" class="gpill" data-act="step" data-to="tab:poupar"><span style="padding-left:6px">${ic('piggy-bank', 16)}</span>Poupanças ${ic('chevron-right', 14)}</button>
          <p class="b14">Total poupado automaticamente</p><p class="num" style="font-size:32px;line-height:40px;font-weight:700">${money(poupTotal())}</p><p class="cap">Última atualização em ${ddmmyyyy(new Date())}</p></div>
      </div><div class="hdots" id="hdots"><i class="on"></i><i></i></div>
      <div class="qa">${[['chart-column', 'Projeção<br>de faturas', 'faturas'], ['rocket', 'Saldo<br>seguro', 'tab:clareza'], ['wallet', 'Poupança Automática', 'tab:poupar'], ['sliders-horizontal', 'Radar de gastos', 'tab:controle']].map(([i, l, to]) => `<button type="button" data-act="step" data-to="${to}">${ic(i, 18)}<span>${l}</span></button>`).join('')}</div>`
      : `<div class="col g4 center" style="padding:28px 20px 0"><p class="b14" style="color:#f5f5f5">Sincronize seu banco via Open Finance para ter controle real do seu dinheiro.</p>
        ${btn('Conecte suas contas ' + ic('arrow-right', 18), { v: 'w', cls: 'lg', act: 'step', attrs: 'data-to="of1" style="color:var(--ty-dark)"' })}
        <p class="cap row g1 jc" style="color:#f5f5f5">${ic('lock', 12)} Conexão segura via Open Finance</p></div>`;
    return `<div class="scroll gscroll ${S.flags.hide ? 'hide-v' : ''}">
      <div style="position:relative">${CURVE.replace('class="curve"', 'class="curve" style="position:absolute;left:0;top:0;width:375px;pointer-events:none"')}
        <div style="position:relative">${statusBar(true)}${homeHeader()}${hero}</div></div>
      <div class="hbody">${homeBody()}</div></div>${navbar('home')}`;
  },
  mount: (el) => {
    const car = $('#hcar', el); if (car) car.addEventListener('scroll', () => { const i = Math.round(car.scrollLeft / 300); $$('#hdots i', el).forEach((d, k) => d.classList.toggle('on', k === i)); });
  },
  acts: {
    step: (b) => { const to = b.dataset.to;
      if ((to === 'tab:clareza' || to === 'faturas') && typeof primeiraVezClareza === 'function' && primeiraVezClareza()) { reset('clarezaIntro', {}, 'none'); return; }
      if (to.startsWith('tab:')) reset(to.slice(4), {}, 'none'); else go(to); },
    hideVals: () => { S.flags.hide = !S.flags.hide; rerender(); },
    banks: () => openSheet(`<p class="b14 c-dark">Total de instituições: ${S.contas.length}</p><div class="col">${S.contas.map(id => `<div class="li">${bankIc(id)}<span class="lt b16 semi c-darker">${BANKS[id].nome}</span></div>`).join('')}</div>`, { foot: btn('Ir para central de consentimentos', { act: 'toCentral' }) }),
    toCentral: () => { closeOverlays(true); go('central', { tab: 'def' }); },
    bluehub: () => openDialog(`<span class="ico-c" style="color:var(--primary-700)">${BLUEHUB_IC.replace('width="18" height="18"', 'width="24" height="24"')}</span><p class="h3 c-darker">Deseja voltar ao Bluehub?</p><p class="b14 c-base">Suas informações e configurações no Me Paguei continuam salvas. Você pode voltar quando quiser.</p>${btn('Continuar no Me Paguei', { act: 'dlgClose' })}${btn('Sim, voltar', { v: 'o', act: 'toBluehub', cls: '', attrs: 'style="color:var(--ty-darker);box-shadow:inset 0 0 0 1.5px var(--ty-dark)"' })}`),
    dlgClose: () => closeTopOverlay(),
    toBluehub: () => { closeOverlays(true); if (SCREENS.bhHome) reset('bhHome'); else toast('O Bluehub abre em outro aplicativo', 'success', 'info'); },
  },
});

/* ---------- notificações ---------- */
const NOTIF_SEED = () => ([
  { ic: 'trophy', t: 'Sport venceu!', h: '18:45', d: '18/07', x: 'A Bet do Bem guardou R$ 50,00 na sua poupança automaticamente', per: 'hoje' },
  { mia: true, t: 'Visão da Mia', h: '18:45', d: '19/07', x: 'Identifiquei um aumento de 32% nos seus gastos com restaurantes', per: 'hoje' },
  { ic: 'goal', t: 'Objetivo alcançado', h: '20:13', d: '19/07', x: 'Parabéns! Sua meta Viagem para Europa chegou a R$ 500', per: 'semana' },
  { ic: 'coins', t: 'Troco Inteligente', h: '20:13', d: '20/07', x: 'R$ 3,50 de troco adicionados automaticamente na sua poupança', per: 'semana' },
]);
screen('notif', {
  render: (p) => {
    const tab = p.tab || 'rec';
    if (!S.notif) S.notif = NOTIF_SEED();
    const L = S.notif.filter(n => tab === 'rec' || tab === 'mes' || (tab === 'hoje' ? n.per === 'hoje' : true));
    return `${statusBar()}${appHeader('Notificações', { acts: `<button type="button" data-go="notifCfg" aria-label="Configurações de notificação">${ic('settings', 22)}</button>` })}
    <div class="chips px5" style="padding-bottom:12px">${[['rec', 'Recentes'], ['hoje', 'Hoje'], ['sem', 'Semana'], ['mes', 'Mês']].map(([k, l]) => `<button type="button" class="chip ${k === tab ? 'on' : ''}" data-act="ntab" data-k="${k}">${l}</button>`).join('')}</div>
    <div class="scroll px5">${L.length ? `<div class="row jb" style="padding:8px 0"><p class="b14 c-base">Total de notificações: ${L.length}</p><button type="button" class="row g1 cap semi c-primary" data-act="nclear">${ic('trash-2', 14)} Limpar tudo</button></div>
      <div class="col">${L.map((n, k) => `<div class="li ais"><span class="${n.mia ? 'ava-mia' : 'ico-c'}" style="${n.mia ? '' : 'width:36px;height:36px'}">${n.mia ? '<img src="assets/mia-avatar.webp" alt="">' : ic(n.ic, 18)}</span>
        <div class="lt col g1"><div class="row jb"><p class="b14 bold c-darker">${n.t}</p><p class="cap c-base">${tab === 'sem' || tab === 'mes' ? n.d + ' • ' : ''}${n.h}</p></div><p class="b14 c-dark">${n.x}</p></div>
        <button type="button" data-act="nmenu" data-k="${S.notif.indexOf(n)}" aria-label="Opções" style="color:var(--ty-base);padding:2px">${ic('ellipsis-vertical', 18)}</button></div>`).join('')}</div>`
      : `<div class="empty" style="padding-top:80px"><span class="ico-c" style="width:56px;height:56px">${ic('bell', 26)}</span><p class="b16 semi c-dark">Nenhuma notificação por aqui</p><p class="b14 c-base">Quando a Mia tiver novidades sobre suas poupanças e gastos, elas aparecem aqui.</p></div>`}</div>${homeInd()}`;
  },
  acts: {
    ntab: (b) => { stack[stack.length - 1].p.tab = b.dataset.k; rerender(); },
    nclear: () => { S.notif = []; rerender(); toast('Notificações apagadas', 'success', 'trash-2'); },
    nmenu: (b) => { const k = +b.dataset.k; openSheet(`<p class="h4 c-darker">${S.notif[k].t}</p><button type="button" class="li" data-act="nread">${ic('check', 20)}<span class="lt b16 c-darker">Marcar como lida</span></button><button type="button" class="li" data-act="ndel" data-k="${k}" style="color:var(--danger)">${ic('trash-2', 20)}<span class="lt b16">Excluir notificação</span></button>`); },
    nread: () => { closeTopOverlay(); toast('Marcada como lida'); },
    ndel: (b) => { S.notif.splice(+b.dataset.k, 1); closeOverlays(true); rerender(); },
  },
});
screen('notifCfg', {
  render: () => { const c = S.flags.ncfg ??= { push: true, wpp: false, resumo: true, email: true, wppR: true };
    return `${statusBar()}${appHeader('Configurações')}<div class="scroll px5 col g5" style="display:flex;padding-top:8px">
    <div class="col g3"><p class="b16 semi c-darker">Canal de notificação</p><p class="b16 c-dark">Como você quer receber avisos:</p>
      <div class="card row g3"><span class="ico-c sm">${ic('smartphone', 18)}</span><div class="f1"><p class="b14 bold c-darker">Notificações Push</p><p class="b14 c-base">Via app no celular</p></div>${toggle('flags.ncfg.push', c.push)}</div>
      <div class="card row g3"><span class="ico-c sm" style="background:var(--success-bg);color:var(--success)">${ic('message-circle', 18)}</span><div class="f1"><p class="b14 bold c-darker">WhatsApp</p><p class="b14 c-base">Mensagem no WhatsApp</p></div>${toggle('flags.ncfg.wpp', c.wpp)}</div></div>
    <div class="card col g3"><div class="row jb"><p class="b16 semi c-darker">Resumo semanal</p>${toggle('flags.ncfg.resumo', c.resumo)}</div>
      <p class="b14 c-base">Um resumo completo de todas as funcionalidades: Bet do Bem, Metas, Radar, Fluxo Futuro e mais, enviado uma vez por semana nos domingos à noite.</p>
      <p class="b14 semi c-darker">Enviar via:</p><div class="row g5">${checkbox('flags.ncfg.email', 'Email', c.email).replace('class="chk', 'style="width:auto" class="chk')}${checkbox('flags.ncfg.wppR', 'Whatsapp', c.wppR).replace('class="chk', 'style="width:auto" class="chk')}</div></div>
    <div class="mt-auto" style="padding:8px 0 20px">${btn('Salvar configurações', { cls: 'lg', act: 'save' })}</div></div>${homeInd()}`; },
  acts: { save: () => { back(); toast('Configurações salvas'); } },
});

/* ---------- configurações de sistema ---------- */
function setRow(icn, t, d, to, danger) {
  return `<button type="button" class="li" ${to}><span class="ico-c sm" style="${danger ? 'background:var(--danger-bg);color:var(--danger)' : ''}">${ic(icn, 18)}</span><span class="lt col"><span class="b14 bold" style="color:${danger ? 'var(--danger)' : 'var(--ty-darker)'}">${t}</span>${d ? `<span class="cap c-base">${d}</span>` : ''}</span>${ic('chevron-right', 20, 'c-light')}</button>`;
}
screen('config', {
  render: () => `${statusBar()}${appHeader('Configurações')}<div class="scroll px5">
    <div class="card row g3" style="margin:4px 0 20px"><span style="width:56px;height:56px;border-radius:50%;overflow:hidden;flex:none"><img src="${fotoUser() || 'assets/avatar-user.webp'}" alt="" style="width:100%;height:100%;object-fit:cover"></span><div class="f1"><p class="b16 semi c-darker">${esc(S.user.nome || 'Marcelo Pimentel')}</p><p class="b14 c-base" style="overflow-wrap:anywhere">${esc(S.user.email || 'marcelopimentel@email.com')}</p></div></div>
    <p class="h3 c-darker">Conta</p><div class="col" style="margin-bottom:16px">
      ${setRow('user', 'Informações Pessoais', 'Nome, telefone, documentos', 'data-go="perfilInfo"')}
      ${setRow('landmark', 'Consentimento de contas', 'Contas e Open Finance', 'data-act="central"')}
      ${setRow('bell', 'Notificações', 'Push, e-mail e Whatsapp', 'data-go="notifCfg"')}
      ${setRow('file-text', 'Termos de Uso e Privacidade', 'Última atualização: out. 2026', 'data-go="termos"')}</div>
    <p class="h3 c-darker">Suporte</p><div class="col" style="margin-bottom:16px">
      ${setRow('circle-help', 'Central de Ajuda', 'Dúvidas frequentes e suporte', 'data-go="ajuda"')}
      ${setRow('info', 'Sobre o Me Paguei', 'Conheça nossa história', 'data-go="sobre"')}
      ${setRow('log-out', 'Sair da conta', '', 'data-act="logout"', true)}</div>
    <p class="h3 c-darker">Nossas redes</p><p class="b14 c-base" style="margin-top:4px">Acompanhe o Me Paguei nas redes sociais:</p>
    <div class="row g3" style="margin:12px 0 24px">${['instagram', 'linkedin', 'youtube'].map(n => `<span class="ico-c" aria-label="${n}">${ic(n, 20)}</span>`).join('')}</div>
    <div style="padding-bottom:20px">${btn('Voltar para Início', { act: 'home' })}</div></div>${homeInd()}`,
  acts: {
    central: () => go('central', { tab: 'def' }),
    home: () => reset('home', {}, 'back'),
    logout: () => openDialog(`<span class="ico-c" style="background:var(--danger-bg);color:var(--danger)">${ic('log-out', 22)}</span><p class="h3 c-darker">Sair da conta?</p><p class="b14 c-base">Para voltar, basta entrar com seu CPF e senha. Suas poupanças automáticas continuam funcionando.</p>${btn('Sair', { v: 'd', act: 'doLogout' })}${btn('Cancelar', { v: 'o', act: 'dlgClose' })}`),
    dlgClose: () => closeTopOverlay(),
    doLogout: () => { closeOverlays(true); reset('welcome'); },
  },
});
function infoBlock(icn, title, rows, editTo) {
  return `<div class="card col g3"><div class="row jb"><p class="row g2 b16 semi c-darker">${ic(icn, 18, 'c-primary')} ${title}</p><button type="button" class="row g1 cap semi c-primary" data-act="edit" data-to="${editTo}">${ic('pencil', 14)} Editar</button></div>
  ${rows.map(([k, v]) => `<p class="b16 c-dark"><b class="c-darker">${k}</b> ${esc(v || '—')}</p>`).join('')}</div>`;
}
screen('perfilInfo', {
  render: () => { const u = S.user;
    return `${statusBar()}${appHeader('Informações Pessoais')}<div class="scroll px5 col g4" style="display:flex;padding-bottom:20px">
    <div class="col g2" style="align-items:center"><span style="width:112px;height:112px;border-radius:50%;overflow:hidden"><img src="${fotoUser() || 'assets/avatar-user.webp'}" alt="" style="width:100%;height:100%;object-fit:cover"></span><p class="cap c-base center">Adicione uma foto para deixar o app<br>com a sua cara. (opcional)</p></div>
    ${infoBlock('user', 'Dados pessoais', [['Gênero:', u.genero || 'Masculino'], ['Data de nascimento:', u.nasc || '12/06/1986'], ['Estado civil:', u.civil || 'Casado']], 'perf1')}
    ${infoBlock('briefcase', 'Profissional', [['Profissão:', u.profissao || 'Gerente de Projetos'], ['Renda média mensal:', u.renda || 'R$ 10.000,00']], 'perf2')}
    ${infoBlock('map-pin', 'Endereço', [['CEP:', u.cep || '12345-078'], ['Rua/Logradouro:', u.rua || 'Rua Bione'], ['Número', u.numero || '123'], ['Complemento (opcional)', u.compl || 'Apto. 234, Bloco A'], ['Bairro', u.bairro || 'Bairro do Recife'], ['Cidade:', u.cidade || 'Recife'], ['Estado:', u.uf || 'PE']], 'perf3')}
    ${infoBlock('phone', 'Contato', [['Número de telefone:', u.cel || '(81) 91234-5678']], 'perf4')}
    <div class="card col g3"><div class="row jb"><p class="row g2 b16 semi c-darker">${ic('users', 18, 'c-primary')} Pessoas próximas</p><button type="button" class="row g1 cap semi c-primary" data-act="edit" data-to="pessoas">${ic('pencil', 14)} Editar</button></div>
      ${(u.pessoas.length ? u.pessoas : [{ nome: 'Marcela Pimentel', nasc: '30/06', par: 'Cônjuge' }, { nome: 'Caio Pimentel', nasc: '07/10', par: 'Filho' }, { nome: 'Marisa Santiago', nasc: '02/02', par: 'Mãe' }]).map(m => `<div class="row g3"><span class="ico-c sm" style="font-weight:700;font-size:13px">${esc(m.nome[0])}</span><div><p class="b16 semi c-darker">${esc(m.nome)}</p><p class="b16 c-dark">${esc(m.nasc.slice(0, 5))} - ${esc(m.par)}</p></div></div>`).join('')}</div>
    ${btn('Voltar', { v: 'o', act: 'back' })}</div>${homeInd()}`; },
  acts: { edit: (b) => { S.flags.editMode = true; go(b.dataset.to, { edit: true }); }, back: () => back() },
});
screen('termos', {
  render: () => `${statusBar()}${appHeader('Termos de Uso e Privacidade')}<div class="scroll px5" style="padding-bottom:20px">
    <div class="col g3 b14 c-dark" style="white-space:pre-line">${TERMOS.split('\n\n').map(par => { const [h, ...r] = par.split('\n'); return r.length && h.length < 40 ? `<div><p class="b14 bold c-darker">${esc(h)}</p><p>${esc(r.join('\n'))}</p></div>` : `<p>${esc(par)}</p>`; }).join('')}</div>
    <div style="padding-top:20px">${btn('Voltar', { v: 'o', act: 'back' })}</div></div>${homeInd()}`,
  acts: { back: () => back() },
});
const TERMOS = `Este documento estabelece as regras para o uso do aplicativo Me Paguei. Ao baixar e utilizar nossa plataforma, você concorda com os termos abaixo.

Objeto do Serviço
O Me Paguei é uma ferramenta de auxílio à gestão financeira pessoal. O aplicativo fornece funcionalidades para registro de despesas, receitas e planejamento de metas.

Responsabilidades do Usuário
Veracidade: Você é responsável pela precisão dos dados inseridos.

Segurança: A manutenção da confidencialidade de sua senha e acesso ao dispositivo é de sua inteira responsabilidade.

Uso Pessoal: O aplicativo é destinado ao uso pessoal e não comercial.

Limitação de Responsabilidade
O aplicativo é uma ferramenta de suporte. Não fornecemos consultoria financeira, jurídica ou de investimentos.

Não nos responsabilizamos por decisões financeiras tomadas com base nos dados do app ou por eventuais perdas financeiras do usuário.

Não garantimos que o serviço será 100% livre de interrupções ou erros técnicos.

Alterações nos Termos
Reservamos o direito de atualizar estes termos a qualquer momento. Notificaremos você sobre mudanças significativas através do aplicativo.

2. Política de Privacidade
Sua privacidade é nossa prioridade, especialmente tratando-se de dados financeiros.

Coleta de Dados
Coletamos informações para melhorar sua experiência:

Dados de Cadastro: Nome, e-mail e senha (se aplicável).

Dados Financeiros: Registros de transações, categorias de gastos e metas inseridas manualmente por você.

Dados de Uso: Informações técnicas sobre o dispositivo, versão do sistema operacional e logs de erros para melhorias de performance.

Uso das Informações
Os dados coletados são utilizados exclusivamente para:

Exibir seus relatórios financeiros de forma organizada.

Sincronizar seus dados entre dispositivos (caso utilize conta na nuvem).

Enviar notificações de lembretes de contas (se autorizado por você).

Compartilhamento de Dados
Não vendemos nem alugamos seus dados pessoais ou financeiros para terceiros. Os dados só poderão ser compartilhados em casos de:

Cumprimento de ordem judicial.

Uso de parceiros tecnológicos essenciais (ex: provedores de hospedagem), que seguem padrões rigorosos de segurança.

Segurança
Empregamos protocolos de segurança modernos, como criptografia de ponta a ponta e armazenamento em servidores seguros, para proteger suas informações contra acessos não autorizados.

Seus Direitos (LGPD)
Você tem o direito de:

Acessar, corrigir ou excluir seus dados a qualquer momento através das configurações do app.

Revogar o consentimento de uso de dados, o que pode impossibilitar o funcionamento de certas funcionalidades.`;

const FAQ = [
  ['Como funciona o Troco Inteligente?', 'A cada compra no cartão de crédito, o Me Paguei arredonda o valor para cima e transfere a diferença automaticamente para a sua poupança, via Pix. Exemplo: uma compra de R$ 19,90 vira R$ 20,00, e os R$ 0,10 vão para a sua reserva.\nVocê escolhe o tipo de arredondamento: centavos, múltiplo de R$ 5, múltiplo de R$ 10 ou com multiplicador (2x, 5x ou 10x) para poupar mais rápido.\nSe o saldo da sua conta ficar baixo, a função é pausada automaticamente para proteger você. E você pode ajustar ou desativar a regra quando quiser.'],
  ['O que é o Placar do Bem?'], ['O Me Paguei movimenta meu dinheiro sem eu autorizar?'], ['Conectar minhas contas via Open Finance é seguro?'],
  ['O que é o Saldo Seguro do Fluxo Futuro?'], ['O que é o Acesso Flow?'], ['Como a Mia aprende com os meus gastos?'], ['Posso pausar minha poupança automática?'],
];
screen('ajuda', {
  render: (p) => { const open = p.open ?? 0; const q = (p.q || '').toLowerCase();
    const L = FAQ.map((f, k) => [f, k]).filter(([f]) => !q || f[0].toLowerCase().includes(q) || (f[1] || '').toLowerCase().includes(q));
    return `${statusBar()}${appHeader('Ajuda')}<div class="scroll px5 col g5" style="display:flex;padding-bottom:20px">
    ${field({ id: 'faq', ph: 'Pesquisar dúvidas...', icon: 'search', value: p.q || '' })}
    <div class="col g3"><p class="b16 semi c-darker">Tópicos rápidos</p><div class="row g2" style="overflow-x:auto;scrollbar-width:none">${[['piggy-bank', 'Poupança<br>automática'], ['landmark', 'Contas e<br>Open Finance'], ['sliders-horizontal', 'Monitor'], ['shield-check', 'Segurança']].map(([i, l]) => `<div class="card col g2" style="flex:none;width:96px;padding:12px;align-items:flex-start"><span class="c-primary">${ic(i, 20)}</span><span class="b14 c-dark" style="line-height:18px">${l}</span></div>`).join('')}</div></div>
    <div class="col g2"><p class="b16 semi c-darker">Perguntas frequentes</p>${L.length ? L.map(([f, k]) => `<div class="card" style="padding:14px 16px"><button type="button" class="row jb w100 g3" data-act="faq" data-k="${k}" aria-expanded="${open === k}" style="text-align:left"><span class="b14 semi c-darker">${f[0]}</span>${ic(open === k ? 'chevron-up' : 'chevron-down', 18, 'c-base')}</button>
      ${open === k ? `<p class="b14 c-dark" style="white-space:pre-line;margin-top:8px">${f[1] ? esc(f[1]) : 'Esta resposta ainda não está disponível nesta versão de teste.'}</p>` : ''}</div>`).join('') : `<p class="b14 c-base">Nenhuma pergunta encontrada para “${esc(p.q)}”.</p>`}</div>
    <div class="card col g2" style="background:var(--primary-lighter);border-color:transparent"><p class="b16 semi c-darker">Precisa de mais ajuda?</p><p class="b14 c-dark">Se a sua dúvida ainda não foi respondida, entre em contato conosco que poderemos ajudar você.</p>
      <div class="row g3" style="margin-top:4px"><span class="ico-c sm" style="background:#fff">${ic('mail', 18)}</span><div><p class="b14 bold c-darker">Email</p><p class="cap c-base" style="user-select:all">mepaguei@empreenderdinheiro.com</p></div></div></div>
    ${btn('Voltar', { v: 'o', act: 'back' })}</div>${homeInd()}`; },
  onInput: (i) => { if (i.id === 'faq') { const p = stack[stack.length - 1].p; p.q = i.value; p.open = -1; refresh(); } },
  acts: { faq: (b) => { const p = stack[stack.length - 1].p; const k = +b.dataset.k; p.open = p.open === k ? -1 : k; rerender(); }, back: () => back() },
});
screen('sobre', {
  render: () => `${statusBar()}${appHeader('Sobre o Me Paguei')}<div class="scroll px5 col g5" style="display:flex;padding-bottom:20px">
    <div class="col g2" style="align-items:center;padding-top:8px"><img src="assets/logo-color.png" alt="Me Paguei" width="99" height="60"><span class="badge muted">v1.01.0</span><p class="cap c-base">por Empreender Dinheiro</p></div>
    <div class="col g2"><p class="h3 c-darker">A empresa</p><p class="b14 c-dark">Fundada em 2017 em Recife (PE), a Empreender Dinheiro é a primeira EdTech do Brasil dedicada à aceleração de Educadores Financeiros.</p><p class="b14 c-dark">Com um time de mais de 115 pessoas, combinamos educação, tecnologia e certificação para transformar a relação das pessoas com o dinheiro. Além da nossa plataforma SaaS para consultores, produzimos o podcast Segredos Financeiros (com média de 50 mil ouvintes mensais) e um Clube do Livro focado em finanças e negócios.</p><p class="b14 c-dark">Ao longo dessa jornada de consultorias, nos deparamos com um fato científico: apenas ensinar não basta. Na correria do dia a dia, preencher planilhas manuais gera cansaço mental e frustração, fazendo a maioria desistir no meio do caminho. Cuidar do dinheiro não deveria ser um fardo.</p></div>
    <div class="row g2">${[['2017', 'Fundação'], ['115+', 'Colaboradores'], ['50k', 'Ouvintes/mês']].map(([a, b]) => `<div class="card f1 center" style="padding:12px 8px"><p class="h3 c-primary">${a}</p><p class="cap c-base">${b}</p></div>`).join('')}</div>
    <div class="col g2"><p class="h3 c-darker">A ideia por trás do Me Paguei</p><p class="b14 c-dark">O Me Paguei nasce da missão da Empreender Dinheiro de transformar a relação das pessoas com o dinheiro. O nome vem do princípio comportamental do "pague-se primeiro", a regra de separar uma parte da renda para si antes de qualquer despesa.</p><p class="b14 c-dark">É um assistente financeiro baseado em dados compartilhados para adultos economicamente ativos que sentem que o dinheiro foge pelas mãos e precisam vencer a falta de tempo. O Me Paguei auxilia a tomar decisões, a sair da inércia e a ganhar previsibilidade através de mecanismos que automatizam o ato de poupar e analisam e antecipam a vida financeira.</p></div>
    <div class="col"><p class="b16 semi c-darker">Acesso rápido</p>${[['globe', 'Site', 'empreenderdinheiro.com.br'], ['podcast', 'Podcast Segredos Financeiros', '50 mil ouvintes/mês  - Ouça já'], ['briefcase', 'Consultoria Equity', 'Programa de consultoria patrimonial']].map(([i, t, d]) => `<div class="li"><span class="ico-c sm">${ic(i, 18)}</span><div class="lt"><p class="b14 bold c-darker">${t}</p><p class="cap c-base">${d}</p></div></div>`).join('')}</div>
    ${btn('Voltar', { v: 'o', act: 'back' })}<p class="cap c-base center">© 2026 Empreender Dinheiro · Me Paguei<br>Todos os direitos reservados</p></div>${homeInd()}`,
  acts: { back: () => back() },
});

/* modo edição das telas de perfil (vindo de Informações Pessoais) */
['perf1', 'perf2', 'perf3', 'perf4', 'pessoas'].forEach(id => {
  const d = SCREENS[id]; const r0 = d.render;
  d.render = (p, t) => { let h = r0(p, t); if (p.edit) { h = h.replace(/<span class="step">[^<]*<\/span>/, '<span class="step"></span>').replace(/data-go="perf\d"|data-act="next"|data-act="done"/, 'data-act="saveEdit"').replace(/>Continuar<|>Avançar<|>Pular</, '>Salvar alterações<'); } return h; };
  d.acts = Object.assign({}, d.acts, { saveEdit: () => { back(); toast('Alterações salvas'); } });
});

/* dados de exemplo para "conta em uso" */
function seedDemo() {
  Object.assign(S.user, { nome: S.user.nome || 'Marcelo Pimentel', email: S.user.email || 'marcelo.pimentel@gmail.com', cpf: S.user.cpf || '055.865.584-94' });
  S.perfilCompleto = true;
  S.contas = ['nubank', 'bradesco', 'itau'];
  S.origem = { bank: 'nubank', conta: 0 }; S.destino = { bank: 'itau', pix: 'marcelo.pimentel@gmail.com' }; S.saldoSeg = 300;
  S.objetivo = { nome: 'Viagem para Itália', valor: 5000, atual: 2500, prazo: '12/2026' };
  S.poup = Object.assign({ total: 2500 }, S.poup || {}, { vf: { valor: 100, freq: 'Semanal', dia: 'Segunda-feira', ativo: true, total: 1650 }, placar: { time: 'Sport', valor: 50, ativo: true, total: 850, vitorias: 17 } });
  S.radar = { cats: ['Delivery', 'Mercado', 'Transporte'], ativo: true };
  S.faturas = true;
  S.saldoSeguro = { negativo: true };
}
flowEntry('Início e conta', 'Home sem contas conectadas', () => { if (!S.user.nome) S.user.nome = 'Marcelo Pimentel'; S.contas = []; reset('home'); });
flowEntry('Início e conta', 'Home com dados (conta em uso)', () => { seedDemo(); reset('home'); });
flowEntry('Início e conta', 'Notificações', () => { reset('home'); go('notif'); });
flowEntry('Início e conta', 'Configurações', () => { reset('home'); go('config'); });
