/* ============ 13 · Controle: Radar de gastos, Agenda e Assinaturas ============ */

const RCATS = { cartao: ['Cartões de crédito', 'credit-card', 'Vamos garantir que seus cartões não se tornem vilões do orçamento. Você pode adicionar até 3 cartões'], delivery: ['Delivery', 'bike', 'O gasto variável mais subestimado por muitas famílias - que tal acompanhar seus pedidos?'], transporte: ['Transporte por aplicativo', 'car', 'Aplicativos de transporte como Uber, 99 e outros. Garanta que não haverá surpresas aqui também.'], mercado: ['Mercado', 'shopping-cart', 'Dependendo do seu estilo de compras, os valores podem variar muito de mês pra mês.'] };
const RORDER = ['cartao', 'delivery', 'transporte', 'mercado'];
const pctCol = p => p >= 100 ? 'var(--danger)' : p >= 50 ? 'var(--warning)' : 'var(--success)';
const rMeta = k => k === 'cartao' ? Object.values(S.radar.metas.cartao || {}).reduce((a, v) => a + v, 0) : (S.radar.metas[k] || 0);
const rGasto = k => k === 'cartao' ? Object.values(S.radar.gastos.cartao || {}).reduce((a, v) => a + v, 0) : (S.radar.gastos[k] || 0);
const rPct = k => rMeta(k) ? Math.round(rGasto(k) / rMeta(k) * 100) : 0;
const fmtR = v => 'R$ ' + Math.round(v).toLocaleString('pt-BR');
/* Home: radar com dados reais quando ativo */
radarMini = function (empty) {
  const cats = empty || !S.radar ? [['Cartões', 'credit-card', 0], ['Delivery', 'bike', 0], ['Mercado', 'shopping-cart', 0], ['Transporte', 'car', 0]] : S.radar.cats.map(k => [k === 'transporte' ? 'Transporte' : k === 'cartao' ? 'Cartões' : RCATS[k][0], RCATS[k][1], rPct(k)]);
  return `<div class="row jb">${cats.map(([l, i, p]) => `<div class="col g1" style="align-items:center;width:64px">
    ${empty ? `<span style="width:48px;height:48px;border-radius:50%;background:var(--bg-lighter);color:#d3d3d3;display:flex;align-items:center;justify-content:center">${ic(i, 20)}</span>` : donut(Math.min(1, p / 100), 48, pctCol(p), 7, `<span style="color:var(--ty-base)">${ic(i, 16)}</span>`)}
    <span class="cap" style="color:${empty ? '#d3d3d3' : 'var(--ty-base)'}">${l}</span>${empty ? '' : `<span class="cap bold" style="color:${pctCol(p)}">${p}%</span>`}</div>`).join('')}</div>`;
};

/* ---------- aba Controle ---------- */
const SUBS0 = () => [['HBO Max', 39.9, 'tv', 20], ['Netflix', 40, 'tv', 12], ['Spotify', 21.9, 'music', 21], ['Google One', 12.9, 'cloud', 21]];
screen('controle', {
  render: (p) => {
    if (!S.flags.radarIntroSeen && !S.radar) return SCREENS.rdIntro.render(p);
    const tab = p.tab || 'radar';
    const body = tab === 'radar' ? radarBody(p) : tab === 'agenda' ? agendaBody(p) : subsBody(p);
    return `<div class="scroll gscroll ${S.flags.hide ? 'hide-v' : ''}">
      <div style="position:relative">${CURVE}<div style="position:relative">${statusBar(true)}
        <div class="row jb" style="padding:8px 20px 0"><p class="h2" style="color:#fff">Controle</p><button type="button" data-act="hideVals" aria-label="${S.flags.hide ? 'Mostrar valores' : 'Ocultar valores'}" style="width:32px;height:32px;border-radius:50%;background:var(--btn-primary);color:#fff;display:flex;align-items:center;justify-content:center">${ic(S.flags.hide ? 'eye-off' : 'eye', 18)}</button></div>
        <div class="chips" style="padding:20px 20px 0">${[['radar', 'Radar'], ['agenda', 'Agenda'], ['subs', 'Assinaturas']].map(([k, l]) => `<button type="button" class="chip glass ${k === tab ? 'on' : ''}" data-act="ktab" data-k="${k}">${l}</button>`).join('')}</div><div style="height:24px"></div></div></div>
      <div class="hbody" style="padding:24px 20px;margin-top:0">${body}</div></div>${navbar('controle')}`;
  },
  mount: (el, p) => { if (p.day) { const d = p.day; p.day = null; later(() => dayDetail(d), 300); } },
  acts: {
    ktab: (b) => { stack[stack.length - 1].p.tab = b.dataset.k; render('none'); },
    hideVals: () => { S.flags.hide = !S.flags.hide; rerender(); },
    go: () => { S.flags.radarIntroSeen = true; rerender(); },
    tabHome: () => reset('home', {}, 'back'),
    ativar: () => { S.tmpR = { cats: [], cartoes: [], metas: { cartao: {} } }; go('rdCats'); },
    editMetas: () => { S.tmpR = JSON.parse(JSON.stringify({ cats: S.radar.cats, cartoes: S.radar.cartoes, metas: S.radar.metas })); go('rdMetas', { edit: true }); },
    rcard: () => go('rdCartao'),
    revisao: () => go('rdRev'),
    miaR: () => { S.flags.miaR = true; rerender(); },
    /* agenda */
    mprev: () => { const p = stack[stack.length - 1].p; p.mo = (p.mo || 0) - 1; rerender(); },
    mnext: () => { const p = stack[stack.length - 1].p; p.mo = (p.mo || 0) + 1; rerender(); },
    dsel: (b) => dayDetail(b.dataset.d),
    agPessoas: () => go('pessoas', { agenda: true }),
    agSkip: () => { S.flags.agendaSeen = true; rerender(); },
    miaA: () => { S.flags.miaA = true; rerender(); },
    evNovo: () => eventoSheet(),
    evMenu: (b) => { const k = b.dataset.k; openSheet(`<button type="button" class="li" data-act="evEd" data-k="${k}">${ic('pencil', 20)}<span class="lt b16 c-darker">Editar</span></button><button type="button" class="li" data-act="evRm" data-k="${k}" style="color:var(--danger)">${ic('trash-2', 20)}<span class="lt b16">Excluir</span></button>`); },
    evEd: (b) => { const [t, i] = b.dataset.k.split(':'); closeOverlays(true); if (t === 'p') { S.tmpM = { ...S.user.pessoas[+i] }; go('pessoaForm', { k: +i }); } else eventoSheet(+i); },
    evRm: (b) => { const [t, i] = b.dataset.k.split(':'); if (t === 'p') S.user.pessoas.splice(+i, 1); else S.eventos.splice(+i, 1); closeOverlays(true); rerender(); toast('Evento excluído', 'error', 'trash-2'); },
    verTodos: () => { stack[stack.length - 1].p.all = !stack[stack.length - 1].p.all; rerender(); },
    /* assinaturas */
    miaS: () => { S.flags.miaS = true; rerender(); },
    subMenu: (b) => { const k = +b.dataset.k; const s = S.subs[k]; openSheet(`<div class="row g3"><span class="ico-c">${ic(s[2], 18)}</span><div><p class="h4 c-darker">${s[0]}</p><p class="b14 c-base">${fmtBRL(s[1])} por mês · vence dia ${s[3]}</p></div></div>
      <button type="button" class="li" data-act="subUse">${ic('circle-check', 20)}<span class="lt col"><span class="b16 c-darker">Ainda uso este serviço</span><span class="cap c-base">A MIA não vai mais perguntar sobre ele</span></span></button>
      <button type="button" class="li" data-act="subRm" data-k="${k}" style="color:var(--danger)">${ic('circle-x', 20)}<span class="lt col"><span class="b16">Não reconheço ou já cancelei</span><span class="cap c-base">Remover da lista de assinaturas</span></span></button>`); },
    subUse: () => { closeOverlays(true); toast('Anotado!'); },
    subRm: (b) => { const s = S.subs.splice(+b.dataset.k, 1)[0]; closeOverlays(true); rerender(); toast(`${s[0]} removido`, 'success', 'trash-2'); },
    connect: () => go('of1'),
  },
});
screen('rdIntro', {
  render: () => `${statusBar()}<div class="ah"><button type="button" class="bkb" data-act="tabHome" aria-label="Voltar">${ic('chevron-left', 24)}</button></div>
  <div class="col g4 px5" style="flex:1;padding-bottom:20px">
    <div style="position:relative;margin-bottom:14px"><div style="position:absolute;left:40px;right:40px;bottom:-14px;height:30px;border-radius:0 0 28px 28px;background:#d6ebfc"></div><div style="position:absolute;left:12px;right:12px;bottom:-6px;height:30px;border-radius:0 0 28px 28px;background:#c6e3fb"></div>
      <img src="assets/radar-intro.webp" alt="Mulher sorrindo usando o celular à mesa" style="position:relative;width:100%;height:348px;object-fit:cover;border-radius:28px"></div>
    <p class="h1 c-darker" style="margin-top:auto">Seus gastos, sob controle, sem esforço<span class="dot-blue">.</span></p>
    <p class="b14 c-dark">Defina metas e tenha controle sobre os gastos variáveis que mais surpreendem o orçamento familiar</p>
    ${btn('Começar agora', { act: 'go' })}</div>${homeInd()}`,
  acts: { go: () => { S.flags.radarIntroSeen = true; reset('controle', { tab: 'radar' }, 'none'); }, tabHome: () => reset('home', {}, 'back') },
});

function radarBody() {
  if (!S.radar) return `<div class="card col g3 center" style="align-items:center;background:var(--bg-lighter);border:0;padding:24px 16px"><span class="ico-c" style="width:48px;height:48px">${ic('radar', 24)}</span><p class="h3 c-darker">Ative seu radar</p><p class="b14 c-dark">Defina metas de gastos e <b>deixe com a Mia o trabalho duro de acompanhar tudo</b>. Você será avisado à medida que se aproximar do valor definido</p>${btn('Ativar radar de gastos', { act: 'ativar' })}</div>
    <p class="h3 c-darker">O que dá para acompanhar?</p>${RORDER.map(k => `<div class="card row g3 ais" style="border-color:var(--border-lighter)"><span class="ico-c sm">${ic(RCATS[k][1], 16)}</span><div class="col g1"><p class="b16 semi c-darker">${RCATS[k][0]}</p><p class="b14 c-dark">${RCATS[k][2]}</p></div></div>`).join('')}
    ${miaInsight('Por que só esses quatro?', 'A conveniência desses gastos <b>pode reduzir a percepção do consumo</b>, enquanto a variação torna o controle mais difícil.<br><br>O restante, eu organizo nos bastidores: <b>você não precisa classificar nada ;)</b>')}`;
  const R = S.radar; const top = R.cats.map(k => [k, rPct(k)]).sort((a, b) => b[1] - a[1])[0];
  return `<div class="col g1"><p class="h3 c-darker">Suas metas ativas</p><p class="cap c-dark">Aviso quando cada uma chegar a 25%, 50%, 75% e 100%.</p></div>
    ${R.cats.map(k => { const p = rPct(k), m = rMeta(k), g = rGasto(k); return `<div class="card col g2" style="${p >= 75 ? `border-color:${pctCol(p)}` : ''}"><div class="row jb"><p class="b16 semi c-darker">${RCATS[k][0]}</p><p class="b16 bold" style="color:${pctCol(p)}">${p}%</p></div>
      <div class="prog"><i style="width:${Math.min(100, p)}%;background:${pctCol(p)}"></i></div>
      <div class="row jb cap"><span class="c-dark money">${fmtR(g)} de ${fmtR(m)}</span><span class="${g > m ? 'c-danger' : 'c-base'} money">${g > m ? 'Excedeu ' + fmtR(g - m) : 'Economia de ' + fmtR(m - g)}</span></div>
      <p class="cap c-base">Última transação: ${g ? 'há 6 horas' : '-'}</p>
      ${k === 'cartao' ? `<button type="button" class="row jb cap semi c-primary" data-act="rcard">${pad2(R.cartoes.length)} ${R.cartoes.length === 1 ? 'cartão ativo' : 'cartões ativos'} no momento ${ic('chevron-right', 16)}</button>` : ''}</div>`; }).join('')}
    ${top && top[1] >= 75 && !S.flags.miaR ? miaBox(`${RCATS[top[0]][0]} atingiu ${top[1]}% da meta`, top[1] >= 100 ? `Opa! Você acaba de atingir ${top[1]}% da sua meta de ${RCATS[top[0]][0].toLowerCase()}. Se não quiser gastar mais que o planejado, evite novas despesas com ${RCATS[top[0]][0].toLowerCase()}.` : `${esc(firstName())}, você já gastou ${top[1]}% da sua meta de ${RCATS[top[0]][0].toLowerCase()}. Faltam ${new Date(hoje().getFullYear(), hoje().getMonth() + 1, 0).getDate() - hoje().getDate()} dias para o fim do período. Fique atento.`, 'miaR') : ''}
    ${btn('Editar metas', { v: 'o', act: 'editMetas' })}
    <div class="card col g2" style="background:var(--primary-lighter);border:0"><p class="h3 c-darker">Revisão trimestral</p><p class="b14 c-dark">Três meses se passaram desde a última vez que você definiu suas metas. Clique aqui para avaliar sua performance e, caso queira, edite suas metas</p>${btn('Fazer minha revisão', { act: 'revisao' })}</div>`;
}

/* ---------- configurar radar ---------- */
screen('rdCats', {
  cls: 'grad',
  render: (p) => { const c = S.tmpR.cats;
    return ofScreen({ title: p.edit ? 'Atualizar categorias' : 'Radar de gastos', body: `<p class="h2 c-darker" style="margin-top:-8px">O que você quer acompanhar?</p><p class="b16 c-dark">Escolha o que devemos incluir no radar:</p>
      ${miaInsight('Comece pelo que mais pesa no mês', 'Você pode acompanhar de uma a quatro categorias. Se escolher Cartões de crédito, no próximo passo definimos juntos quais faturas vamos acompanhar.')}
      ${RORDER.map(k => `<button type="button" class="card row g3" data-act="ctog" data-k="${k}" role="checkbox" aria-checked="${c.includes(k)}" style="text-align:left;${c.includes(k) ? 'border-color:var(--primary)' : ''}"><span class="ico-c sm">${ic(RCATS[k][1], 16)}</span><span class="f1 b16 semi c-darker">${k === 'cartao' ? 'Cartão de crédito' : RCATS[k][0]}</span><span class="chk ${c.includes(k) ? 'on' : ''}" style="width:auto"><span class="box" style="width:20px;height:20px;margin:0">${ic('check', 14)}</span></span></button>`).join('')}
      <p class="cap c-base">${c.length} de 4 escolhidas</p>`, foot: btn(p.edit ? 'Atualizar categorias' : 'Próximo', { next: true, act: 'next' }) }); },
  valid: () => S.tmpR.cats.length > 0,
  acts: {
    ctog: (b) => { const c = S.tmpR.cats, k = b.dataset.k; const i = c.indexOf(k); if (i >= 0) c.splice(i, 1); else c.push(k); c.sort((a, b2) => RORDER.indexOf(a) - RORDER.indexOf(b2)); rerender(); },
    next: () => { if (P().edit) { back(); return; } if (S.tmpR.cats.includes('cartao')) go('rdCards'); else go('rdMetas'); },
  },
});
screen('rdCards', {
  cls: 'grad',
  render: () => { const sel = S.tmpR.cartoes;
    return ofScreen({ title: 'Radar - Cartões', body: `<p class="h2 c-darker" style="margin-top:-8px">Quais faturas vamos acompanhar?</p><p class="b16 c-dark">Escolha até 3 cartões para acompanhar:</p>
      ${S.contas.length ? S.contas.map(id => `<button type="button" class="card row g3" data-act="ktog" data-b="${id}" role="checkbox" aria-checked="${sel.includes(id)}" style="text-align:left;${sel.includes(id) ? 'border-color:var(--primary)' : ''}${!sel.includes(id) && sel.length >= 3 ? ';opacity:.5' : ''}">${bankIc(id)}<span class="f1 col"><span class="cap c-base">Crédito · ****${String(1234 + S.contas.indexOf(id) * 1111).slice(-4)}</span><span class="b16 semi c-darker">${BANKS[id].nome}</span></span><span class="chk ${sel.includes(id) ? 'on' : ''}" style="width:auto"><span class="box" style="width:20px;height:20px;margin:0">${ic('check', 14)}</span></span></button>`).join('')
        : `<div class="card flat col g2"><p class="b14 c-dark">Para acompanhar faturas, conecte as contas dos seus cartões via Open Finance.</p></div>`}
      ${btn(ic('plus', 14) + ' Adicionar novo cartão', { v: 'o', cls: 'btn-xs auto', act: 'addc', attrs: 'style="align-self:flex-start;padding:0 14px"' })}`,
      foot: btn('Próximo', { next: true, act: 'next' }) }); },
  valid: () => S.tmpR.cartoes.length > 0,
  acts: {
    ktog: (b) => { const s = S.tmpR.cartoes, id = b.dataset.b; const i = s.indexOf(id); if (i >= 0) s.splice(i, 1); else if (s.length < 3) s.push(id); else { toast('Você pode acompanhar até 3 cartões', 'warn', 'info'); return; } rerender(); },
    addc: () => go('of2'),
    next: () => go('rdMetas'),
  },
});
screen('rdMetas', {
  cls: 'grad',
  render: (p) => { const t = S.tmpR; const mv = (path) => { const v = path.split('.').reduce((o, k) => o && o[k], t.metas); return v ? fmtBRL(v) : ''; };
    S.flags.rdIn = S.flags.rdIn || {};
    const inp = (id, path, ph) => `<div class="inp"><input id="${id}" data-mask="brl" data-path="${path}" inputmode="numeric" placeholder="${ph}" value="${esc(S.flags.rdIn[path] ?? mv(path))}"></div>`;
    const cTot = t.cartoes.reduce((a, id) => a + parseBRL(S.flags.rdIn['cartao.' + id] ?? mv('cartao.' + id)), 0);
    return ofScreen({ title: 'Radar - Metas', body: `<p class="h2 c-darker" style="margin-top:-8px">Quais serão nossas metas?</p><p class="b16 c-dark">Defina o valor limite para suas faturas e categorias</p>
      ${t.cats.map(k => `<div class="card col g3"><p class="row g3 b16 semi c-darker"><span class="ico-c sm">${ic(RCATS[k][1], 16)}</span>${k === 'cartao' ? 'Cartão de crédito' : RCATS[k][0]}</p>
        ${k === 'cartao' ? t.cartoes.map(id => `<label class="cap c-dark" for="m-${id}">****${String(1234 + S.contas.indexOf(id) * 1111).slice(-4)} | ${BANKS[id].nome} | Crédito</label>${inp('m-' + id, 'cartao.' + id, 'Adicione o valor limite da fatura')}`).join('') + `<p class="cap bold c-darker" id="ctot">Valor total: ${fmtBRL(cTot)}</p>` : inp('m-' + k, k, 'Adicione o limite mensal')}</div>`).join('')}
      ${p.edit ? `<button type="button" class="b14 semi c-primary row g1" data-act="editCats" style="align-self:flex-start">${ic('pencil', 14)} Editar categorias</button>` : ''}`,
      foot: btn(p.edit ? 'Salvar metas' : 'Ativar meu Radar', { next: true, act: 'save' }) + btn('Voltar', { v: 'o', act: 'back' }) }); },
  mount: (el, p) => { if (!p.init) { p.init = 1; S.flags.rdIn = {}; } },
  onInput: (i, el) => { if (i.dataset.path) { S.flags.rdIn[i.dataset.path] = i.value; const t = S.tmpR; const c = $('#ctot', el); if (c) c.textContent = 'Valor total: ' + fmtBRL(t.cartoes.reduce((a, id) => a + parseBRL(S.flags.rdIn['cartao.' + id] ?? (t.metas.cartao[id] ? fmtBRL(t.metas.cartao[id]) : '')), 0)); } },
  valid: () => { const t = S.tmpR; const v = path => { const raw = S.flags.rdIn && S.flags.rdIn[path]; if (raw != null) return parseBRL(raw) > 0; return !!path.split('.').reduce((o, k) => o && o[k], t.metas); }; return t.cats.every(k => k === 'cartao' ? t.cartoes.every(id => v('cartao.' + id)) : v(k)); },
  acts: {
    editCats: () => go('rdCats', { edit: true }),
    back: () => back(),
    save: () => {
      const t = S.tmpR; Object.entries(S.flags.rdIn).forEach(([path, raw]) => { const [a, b] = path.split('.'); if (b) { t.metas.cartao = t.metas.cartao || {}; t.metas.cartao[b] = parseBRL(raw); } else t.metas[a] = parseBRL(raw); });
      const edit = P().edit;
      S.radar = { cats: t.cats, cartoes: t.cartoes, metas: t.metas, gastos: edit ? S.radar.gastos : { cartao: {} }, ativo: true };
      if (edit) { reset('controle', { tab: 'radar' }, 'back'); toast('Metas atualizadas!'); return; }
      go('proc', { msg: 'Estamos armazenando suas definições...', next: 'rdOk' });
    },
  },
});
screen('rdOk', {
  cls: 'grad',
  render: () => `${CURVE}${statusBar(true)}
  <div style="position:relative;z-index:2;flex:1;min-height:0">
    <img src="assets/logo-white.png" alt="Me Paguei" width="68" height="48" style="position:absolute;left:20px;top:8px">
    <img src="assets/mia-autoriza.webp" alt="" style="position:absolute;left:50%;transform:translateX(-50%);bottom:0;height:min(340px,100%);width:auto">
    <span class="chip glass" style="position:absolute;right:20px;bottom:40px;height:30px;font-weight:400;font-size:12px;background:rgba(18,18,18,.35)">${ic('circle-dollar-sign', 16)} Radar configurado com sucesso!</span></div>
  <div class="sheet" style="background:#fff;flex:none"><div class="sheet-in" style="gap:10px;flex:none"><p class="h3 c-darker">Suas metas</p>
    ${S.radar.cats.map(k => `<div class="row jb"><span class="b14 c-dark">${RCATS[k][0]}</span><span class="b14 bold c-darker">${fmtR(rMeta(k))}</span></div>`).join('')}
    <p class="row g2 ais cap" style="background:var(--ia-bg);color:var(--ia);border-radius:8px;padding:10px">${ic('info', 16)}<span>Os gastos de hoje aparecem aqui amanhã: meu processamento roda a cada 24 horas. Não é atraso, é o ciclo.</span></p>
  </div><div class="sheet-foot" style="background:#fff">${btn('Ver meu Radar', { act: 'go' })}</div></div>${homeInd()}`,
  acts: { go: () => reset('controle', { tab: 'radar' }, 'fade') },
});
screen('rdCartao', {
  render: () => { const R = S.radar; const g = rGasto('cartao'), m = rMeta('cartao');
    return `${statusBar()}${appHeader('Cartões de crédito')}<div class="scroll px5 col g4" style="display:flex;padding-bottom:20px">
    <p class="b16 c-dark">Você utilizou <b>${fmtBRL(g)}</b> de <b>${fmtBRL(m)}</b> programados. Se o mês acabasse hoje, sua economia seria de <b>${fmtBRL(Math.max(0, m - g))}</b>.</p>
    <div class="card col g2"><p class="b14 semi c-darker">Valores atuais das faturas</p>${R.cartoes.map(id => `<div class="row jb"><span class="b14 c-dark">${BANKS[id].nome}</span><span class="b14 semi c-darker">${fmtBRL(R.gastos.cartao[id] || 0)}</span></div>`).join('')}<div class="divider"></div><div class="row jb"><span class="b14 bold c-darker">Total</span><span class="b14 bold c-darker">${fmtBRL(g)}</span></div></div>
    ${R.cartoes.map(id => { const u = R.gastos.cartao[id] || 0, mm = R.metas.cartao[id] || 0, p = mm ? Math.round(u / mm * 100) : 0; return `<div class="card col g2"><div class="row g3">${bankIc(id)}<div class="f1"><p class="b16 semi c-darker">${BANKS[id].nome}</p><p class="cap c-base">Crédito · ****${String(1234 + S.contas.indexOf(id) * 1111).slice(-4)}</p></div><span class="b14 bold" style="color:${pctCol(p)}">${p}%</span></div><div class="prog"><i style="width:${Math.min(100, p)}%;background:${pctCol(p)}"></i></div><div class="row jb cap"><span class="c-dark">Valor utilizado: ${fmtBRL(u)}</span><span class="c-dark">Meta estipulada: ${fmtBRL(mm)}</span></div><p class="cap semi ${u > mm ? 'c-danger' : 'c-success'}">${u > mm ? 'Excedeu ' + fmtBRL(u - mm) : 'Restam ' + fmtBRL(mm - u)}</p></div>`; }).join('')}</div>${homeInd()}`; },
});
screen('rdRev', {
  render: () => { const R = S.radar; const t = hoje(); const ms = [3, 2, 1].map(k => MESES[(t.getMonth() - k + 12) % 12]);
    const stats = { cartao: [3, 'Fechou dentro da meta nos 3 meses', 'var(--success)'], delivery: [1, `Estourou em ${ms[1]} e ${ms[2]}`, 'var(--danger)'], transporte: [2, `Fechou dentro da meta em ${ms[0]} e ${ms[2]}`, 'var(--warning)'] };
    return `${statusBar()}${appHeader('Revisão trimestral')}<div class="scroll px5 col g4" style="display:flex;padding-bottom:20px">
    <p class="h2 c-darker">Como foi o seu trimestre</p><p class="b14 c-dark">Como gastamos em ${cap1(ms[0])}, ${ms[1]} e ${ms[2]}. Vamos ajustar o que não faz mais sentido.</p><p class="b16 semi c-darker">Suas metas no trimestre</p>
    ${R.cats.filter(k => stats[k]).map(k => `<div class="card col g2"><div class="row jb"><p class="b16 semi c-darker">${RCATS[k][0]}</p><span class="badge" style="background:var(--bg-lighter);color:${stats[k][2]}">${stats[k][0]} de 3</span></div><p class="b14 c-dark">${stats[k][1]}</p><button type="button" class="cap semi c-primary row g1" data-act="det" data-k="${k}" style="align-self:flex-start">Ver detalhamento ${ic('chevron-right', 14)}</button></div>`).join('')}
    ${R.cats.includes('mercado') ? `<p class="cap c-dark" style="background:var(--primary-lighter);border-radius:8px;padding:10px">A categoria mercado ainda não completou três meses de atividade, continue que em breve você terá sua revisão trimestral.</p>` : ''}
    ${btn('Atualizar metas', { act: 'upd' })}</div>${homeInd()}`; },
  acts: {
    det: (b) => { const k = b.dataset.k; const m = rMeta(k); const t = hoje(); const per = [3, 2, 1].map(i => `${ddmm(new Date(t.getFullYear(), t.getMonth() - i, 5))} a ${ddmm(new Date(t.getFullYear(), t.getMonth() - i + 1, 5))}`); const vals = k === 'cartao' ? [m * .8, m * .9, m * .7] : k === 'delivery' ? [m * 1.37, m * 1.12, m] : [m * .9, m * 1.2, m * .8];
      openSheet(`<p class="h4 c-darker">Detalhamento · ${RCATS[k][0]}</p><div class="row jb"><span class="b14 c-dark">Meta atual:</span><span class="b14 bold c-darker">${fmtBRL(m)}</span></div><div class="row jb"><span class="b14 c-dark">Média trimestral:</span><span class="b14 bold c-darker">${fmtBRL(vals.reduce((a, v) => a + v, 0) / 3)}</span></div>
      <p class="b14 semi c-darker">Revisão dos últimos três meses:</p>${per.map((pp, i) => `<div class="card col g1"><div class="row jb"><span class="b14 semi c-darker">${pp}</span><span class="badge ${vals[i] > m ? 'error' : 'success'}">${vals[i] > m ? 'Estourou a meta' : 'Dentro da meta'}</span></div><p class="cap c-dark">Planejado ${fmtBRL(m)} · Valor final: ${fmtBRL(vals[i])}</p>${vals[i] > m ? `<p class="cap semi c-danger">Excedeu ${fmtBRL(vals[i] - m)}</p>` : ''}</div>`).join('')}`); },
    upd: () => { S.tmpR = JSON.parse(JSON.stringify({ cats: S.radar.cats, cartoes: S.radar.cartoes, metas: S.radar.metas })); go('rdMetas', { edit: true }); },
  },
});

/* ---------- Agenda ---------- */
S.eventos = S.eventos || [];
function feriados(y) {
  const out = [['01/01', 'Confraternização Universal'], ['21/04', 'Tiradentes'], ['01/05', 'Dia do Trabalho'], ['07/09', 'Independência do Brasil'], ['12/10', 'Nossa Senhora Aparecida'], ['02/11', 'Finados'], ['15/11', 'Proclamação da República'], ['20/11', 'Dia da Consciência Negra'], ['25/12', 'Natal']];
  const sun = (m, n) => { const d = new Date(y, m, 1); d.setDate(1 + (7 - d.getDay()) % 7 + (n - 1) * 7); return ddmm(d); };
  out.push([sun(4, 2), 'Dia das Mães'], [sun(7, 2), 'Dia dos Pais'], ['12/10', 'Dia das Crianças'], ['11/08', 'Dia do Estudante']);
  return out.map(([d, n]) => ({ d, n }));
}
function eventsOn(date) {
  const k = ddmm(date); const out = [];
  S.user.pessoas.forEach((p, i) => { if (p.nasc.slice(0, 5) === k) out.push({ t: 'aniv', n: `Aniversário de ${p.nome.split(' ')[0]}`, sub: p.par, key: 'p:' + i }); });
  (S.eventos || []).forEach((e, i) => { if (e.data === k) out.push({ t: 'ev', n: e.nome, sub: 'Evento', key: 'e:' + i }); });
  feriados(date.getFullYear()).forEach(f => { if (f.d === k) out.push({ t: 'fer', n: f.n, sub: 'Data comemorativa' }); });
  const fat = (S.ss && Object.entries(S.ss.faturas)) || (S.contas.length ? [[S.contas[0], { dia: 15 }], ...(S.contas[1] ? [[S.contas[1], { dia: 20 }]] : [])] : []);
  fat.forEach(([id, f]) => { if (date.getDate() === f.dia) out.push({ t: 'fat', n: `Vencimento fatura ${BANKS[id].curto}`, sub: 'Fatura de cartão' }); });
  return out;
}
function lancDia(date) {
  if (date >= addDays(hoje(), 0) || !S.contas.length) return [];
  const seed = date.getDate() * 7 + date.getMonth();
  const pool = [['Hortifruti Bom Preço', 'Mercado', 'Pix', 30, '09:10'], ['iFood', 'Delivery', 'Pix', 68, '12:30'], ['Uber', 'Mercado', 'cartão de crédito', 26, '20:00'], ['Livraria Cultura', 'Educação', 'cartão de crédito', 45.9, '16:40'], ['Padaria Real', 'Mercado', 'cartão de débito', 18.5, '07:45'], ['99', 'Transporte por aplicativo', 'cartão de crédito', 22.4, '18:20'], ['Farmácia Pague Menos', 'Saúde', 'cartão de crédito', 54.3, '19:05']];
  const n = seed % 4; const L = []; for (let i = 0; i < n; i++) L.push(pool[(seed + i * 3) % pool.length]);
  return L.map(x => ({ nome: x[0], cat: x[1], meio: x[2], v: x[3], h: x[4] }));
}
const DOTS = { aniv: '#d14fe0', ev: '#d14fe0', fer: '#d14fe0', fat: '#2573d0' };
function agendaBody(p) {
  if (!S.user.pessoas.length && !S.flags.agendaSeen) return `<div class="col g3"><p class="h3 c-darker">Cadastrar pessoas próximas</p><p class="b14 c-dark">Adicione familiares e amigos para lembrar datas importantes e se antecipar aos gastos com presentes e comemorações</p>${btn('Adicionar pessoas próximas', { act: 'agPessoas', icon: 'user-plus' })}</div>
    <p class="b16 semi c-darker">Por que adicionar pessoas à sua agenda?</p>
    ${[['cake', 'Lembrete de aniversários', 'Como não fazem parte das contas mensais, aniversários são fáceis de esquecer. Cadastre as datas para antecipar presentes, festas e comemorações no seu planejamento'], ['rocket', 'Conexão com Saldo Seguro', 'Ao cadastrar pessoas próximas, eu também considero essas datas quando estiverem no período da sua projeção de Saldo Seguro'], ['calendar-clock', 'Antecipação de despesas', 'Prepare seu orçamento com antecedência para festas, celebrações e compromissos ao longo do ano.'], ['gift', 'Controle de orçamentos festivos', 'Defina limites saudáveis para lembrancinhas e comemorações sem comprometer seus objetivos financeiros.']].map(([i, t, d]) => `<div class="card row g3 ais" style="border-color:var(--border-lighter)"><span class="ico-c sm">${ic(i, 16)}</span><div class="col g1"><p class="b14 semi c-darker">${t}</p><p class="b14 c-dark">${d}</p></div></div>`).join('')}
    ${btn('Pular', { v: 'o', act: 'agSkip' })}`;
  const base = hoje(); const mo = p.mo || 0; const M = new Date(base.getFullYear(), base.getMonth() + mo, 1);
  const first = M.getDay(), days = new Date(M.getFullYear(), M.getMonth() + 1, 0).getDate();
  const cells = []; for (let i = 0; i < first; i++) cells.push(''); for (let d = 1; d <= days; d++) cells.push(d);
  const monthEvents = []; for (let d = 1; d <= days; d++) { const dt = new Date(M.getFullYear(), M.getMonth(), d); eventsOn(dt).filter(e => e.t !== 'fat').forEach(e => monthEvents.push({ ...e, d: dt })); }
  const pes = S.user.pessoas.map((x, i) => ({ ...x, i })).concat((S.eventos || []).map((e, i) => ({ nome: e.nome, nasc: e.data, par: 'Evento', i, ev: true })));
  const upcoming = pes.map(x => { const m = x.nasc.match(/^(\d{2})\/(\d{2})/); let d = new Date(base.getFullYear(), +m[2] - 1, +m[1]); if (d < addDays(base, 0)) d = new Date(base.getFullYear() + 1, +m[2] - 1, +m[1]); return { ...x, d }; }).sort((a, b) => a.d - b.d);
  const shown = p.all ? upcoming : upcoming.slice(0, 2);
  return `<div class="col g1"><p class="h3 c-darker">Agenda</p><p class="cap c-dark">Faturas fechadas, eventos, feriados e aniversários no mesmo calendário.</p></div>
    <div class="card col g2"><div class="row jb"><button type="button" data-act="mprev" aria-label="Mês anterior" style="width:26px;height:26px;border-radius:50%;border:1px solid var(--primary);color:var(--primary);display:flex;align-items:center;justify-content:center">${ic('chevron-left', 14)}</button><p class="b14 bold c-darker">${cap1(MESES[M.getMonth()])} (${M.getFullYear()})</p><button type="button" data-act="mnext" aria-label="Próximo mês" style="width:26px;height:26px;border-radius:50%;border:1px solid var(--primary);color:var(--primary);display:flex;align-items:center;justify-content:center">${ic('chevron-right', 14)}</button></div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);row-gap:6px;text-align:center">${['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => `<span class="cap c-base">${d}</span>`).join('')}
        ${cells.map(d => { if (!d) return '<span></span>'; const dt = new Date(M.getFullYear(), M.getMonth(), d); const ev = eventsOn(dt); const isT = sameDay(dt, base); const kinds = [...new Set(ev.map(e => DOTS[e.t]))];
          return `<button type="button" data-act="dsel" data-d="${ddmmyyyy(dt)}" style="height:40px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border-radius:50%;${isT ? 'background:var(--primary-lighter);font-weight:700' : ''}"><span class="b14 c-darker">${d}</span><span class="row" style="gap:2px;height:6px">${kinds.map(c => `<i style="width:5px;height:5px;border-radius:50%;background:${c};display:block"></i>`).join('')}</span></button>`; }).join('')}</div>
      <div class="row g4 cap c-dark" style="padding-top:4px"><span class="row g1"><i style="width:7px;height:7px;border-radius:50%;background:#d14fe0;display:block"></i>Eventos e aniversários</span><span class="row g1"><i style="width:7px;height:7px;border-radius:50%;background:#2573d0;display:block"></i>Vencimento de fatura</span></div></div>
    <div class="col g1"><p class="h3 c-darker">Eventos e aniversários</p><p class="cap c-dark">Algumas ocasiões não se repetem todo mês, mas dá para prever quando vão acontecer e se preparar para os gastos.</p></div>
    ${btn(ic('plus', 14) + ' Adicionar novo', { v: 'o', cls: 'btn-xs auto', act: 'evNovo', attrs: 'style="align-self:flex-end;padding:0 14px"' })}
    ${monthEvents.length && !S.flags.miaA ? miaBox('Eventos se aproximando', `${esc(firstName())}, em ${MESES[M.getMonth()]} nós teremos alguns eventos importantes: ${[...new Set(monthEvents.map(e => e.n))].slice(0, 3).join(', ')}. Lembre-se de considerá-los no seu planejamento. Assim você se organiza com calma e evita surpresas ;)`, 'miaA') : ''}
    ${shown.map(x => `<div class="card row g3 ais" style="border-color:var(--border-lighter)"><span class="ico-c sm">${ic(x.ev ? 'calendar-heart' : 'user', 16)}</span><div class="f1 col g1"><p class="b16 semi c-darker">${x.ev ? esc(x.nome) : 'Aniversário de ' + esc(x.nome.split(' ')[0])}</p><p class="row g1 b14 c-dark">${ic(x.ev ? 'calendar' : 'cake', 14)} ${pad2(x.d.getDate())} de ${MESES[x.d.getMonth()]}</p><p class="row g1 b14 c-dark">${ic('users', 14)} ${esc(x.par)}</p></div><button type="button" data-act="evMenu" data-k="${x.ev ? 'e' : 'p'}:${x.i}" aria-label="Opções" style="color:var(--ty-dark)">${ic('ellipsis-vertical', 18)}</button></div>`).join('') || '<p class="b14 c-base">Nenhum evento cadastrado ainda.</p>'}
    ${upcoming.length > 2 ? btn(p.all ? 'Ver menos' : `Ver todos (${upcoming.length})`, { act: 'verTodos' }) : ''}
    <p class="b16 semi c-darker">Feriados e datas especiais</p>${feriados(M.getFullYear()).filter(f => +f.d.slice(3) === M.getMonth() + 1).map(f => `<div class="row jb"><span class="b14 c-dark">${f.n}</span><span class="cap c-base">${f.d}/${M.getFullYear()}</span></div>`).join('') || '<p class="b14 c-base">Nenhuma data comemorativa neste mês.</p>'}`;
}
function dayDetail(ds) {
  const d = parseData(ds); const ev = eventsOn(d); const L = lancDia(d); const tot = L.reduce((a, x) => a + x.v, 0);
  const byCat = {}; L.forEach(x => byCat[x.cat] = (byCat[x.cat] || 0) + x.v);
  S.flags.dayL = L; S.flags.dayD = ds;
  openSheet(`<p class="h4 c-primary">${cap1(DIAS[d.getDay()]).replace('-feira', '')}, ${pad2(d.getDate())} de ${MESES[d.getMonth()]}</p><p class="b14 c-dark">Veja o que acontece neste dia: eventos, aniversários, feriados e faturas fechadas.</p>
    ${ev.length ? `<p class="b14 semi c-primary">Eventos do dia</p>${ev.map(e => `<div class="card row g3"><span class="ico-c sm" style="${e.t === 'fat' ? '' : 'background:#fbeafd;color:#b23cc4'}">${ic(e.t === 'fat' ? 'credit-card' : e.t === 'aniv' ? 'cake' : e.t === 'fer' ? 'flag' : 'calendar-heart', 16)}</span><div class="f1"><p class="b14 semi c-darker">${esc(e.n)}</p><p class="cap c-base">${esc(e.sub)}</p></div></div>`).join('')}` : ''}
    <div class="card col g2"><p class="row g2 b16 semi c-darker"><span class="ico-c sm">${ic('coins', 16)}</span>Lançamentos do dia</p>
      ${L.length ? `<div class="card flat col g1"><p class="b14 bold c-darker">Como o dia se dividiu</p>${Object.entries(byCat).map(([c, v]) => `<div class="row jb cap"><span class="c-dark">${c}</span><b class="c-darker">${fmtBRL(v)}</b></div>`).join('')}</div>
        <p class="b14 c-dark">Toque em um lançamento para corrigir a categoria. Eles chegam aqui com um dia de atraso.</p>
        ${L.map((x, i) => `<button type="button" class="li" data-act="lEdit" data-k="${i}"><span class="lt col"><span class="b14 bold c-darker">${x.nome}</span><span class="cap c-base">${x.cat} - ${x.meio}</span></span><span class="col" style="align-items:flex-end"><span class="b14 bold c-darker">${fmtBRL(x.v)}</span><span class="cap c-base">${x.h}</span></span>${ic('chevron-right', 16, 'c-base')}</button>`).join('')}
        <p class="cap c-base">Total do dia: ${fmtBRL(tot)} em ${L.length} ${L.length === 1 ? 'lançamento' : 'lançamentos'}.</p>`
      : `<div class="empty" style="padding:12px"><span class="ico-c" style="background:var(--bg-lighter);color:var(--ty-base)">${ic('calendar-clock', 18)}</span><p class="b14 semi c-darker">Aguardando movimentação</p><p class="cap c-base">${d >= addDays(hoje(), 0) ? 'Os lançamentos deste dia aparecem aqui no dia seguinte.' : S.contas.length ? 'Nenhum lançamento registrado.' : 'Conecte suas contas para ver os lançamentos do dia.'}</p></div>`}</div>`,
    { foot: btn('Fechar', { act: 'dlgClose' }) });
}
Object.assign(GLOBAL_ACTS, {
  lEdit: (b) => { const x = S.flags.dayL[+b.dataset.k]; S.tmpL = { nome: x.nome, cat: x.cat }; closeOverlays(true);
    sheetForm(`<p class="h4 c-darker">Editar lançamento</p><p class="b14 c-dark">Se a categoria não estiver certa, corrija aqui. Assim a MIA aprende e classifica melhor os próximos lançamentos. Se a mudança envolver uma categoria do Radar, ele atualiza em até 24 horas.</p>
      <div class="card flat"><p class="b14 bold c-darker">${x.nome}</p><p class="cap c-dark">${fmtBRL(x.v)} · ${S.flags.dayD.slice(0, 5)} às ${x.h} · ${x.meio} · classificado como ${x.cat}</p></div>
      ${field({ id: 'ln', label: 'Como você quer chamar?', ph: x.nome, bind: 'tmpL.nome' })}${selectField({ id: 'lc', label: 'Categoria', bind: 'tmpL.cat', options: ['Mercado', 'Delivery', 'Transporte por aplicativo', 'Educação', 'Saúde', 'Lazer', 'Moradia', 'Outros'] })}`,
      btn('Salvar edição', { act: 'lSave', cls: 'js-next' }) + btn('Cancelar', { v: 'o', act: 'dlgClose' }), () => S.tmpL.nome.trim() && S.tmpL.cat);
    S.flags.lOld = x; },
  lSave: () => { const x = S.flags.lOld; const t = S.tmpL; x.nome = t.nome; const old = x.cat; x.cat = t.cat; closeOverlays(true); if (old !== t.cat) toast(`Recebemos sua correção. Em até 24 horas o Radar passa a contar ${fmtBRL(x.v)} em ${t.cat}.`, 'success', 'circle-check'); else toast('Lançamento atualizado'); },
});
function eventoSheet(i) {
  const e = i != null ? S.eventos[i] : null;
  S.tmpEvA = e ? { ...e } : { nome: '', data: '' };
  sheetForm(`<p class="h4 c-darker">${e ? 'Editar evento' : 'Novo evento'}</p><p class="b14 c-dark">Viagens, aniversário de casamento, formaturas: datas que não se repetem todo mês, mas que dá para prever.</p>
    ${field({ id: 'an', label: 'Nome do evento', ph: 'ex: Viagem em família', bind: 'tmpEvA.nome' })}${field({ id: 'ad', label: 'Dia e mês', ph: 'dd/mm', bind: 'tmpEvA.data', mask: 'data' })}`,
    btn('Salvar', { act: 'evASave', cls: 'js-next' }) + btn('Cancelar', { v: 'o', act: 'dlgClose' }), () => S.tmpEvA.nome.trim() && /^\d{2}\/\d{2}/.test(S.tmpEvA.data));
  S.flags.evAi = i;
}
GLOBAL_ACTS.evASave = () => { const t = S.tmpEvA; const ev = { nome: t.nome.trim(), data: t.data.slice(0, 5) }; S.eventos = S.eventos || []; if (S.flags.evAi != null) S.eventos[S.flags.evAi] = ev; else S.eventos.push(ev); closeOverlays(true); rerender(); toast('Evento salvo'); };
/* pessoas próximas a partir da Agenda */
(function () {
  const d = SCREENS.pessoas; const r0 = d.render; const done0 = d.acts.done;
  d.render = (p, t) => { let h = r0(p, t); if (p.agenda) h = h.replace(/<span class="step">[^<]*<\/span>/, '<span class="step"></span>').replace('>Pular<', '>Agora não<'); return h; };
  d.acts.done = () => { if (P().agenda) { S.flags.agendaSeen = true; if (S.user.pessoas.length) go('agOk'); else reset('controle', { tab: 'agenda' }, 'back'); return; } done0(); };
})();
screen('agOk', {
  cls: 'grad',
  render: () => `${CURVE}${statusBar(true)}<div style="position:relative;z-index:2;flex:1;min-height:0"><img src="assets/logo-white.png" alt="Me Paguei" width="68" height="48" style="position:absolute;left:20px;top:8px"><img src="assets/mia-celebra.webp" alt="" style="position:absolute;right:20px;bottom:0;height:min(300px,100%);width:auto"><span class="chip glass" style="position:absolute;left:20px;bottom:30px;height:30px;font-weight:400;font-size:12px;background:rgba(18,18,18,.35)">${ic('users', 16)} Pessoas cadastradas</span></div>
  <div class="sheet" style="background:#fff;flex:none"><div class="sheet-in" style="gap:12px;flex:none"><p class="h1 c-darker">Agenda configurada com sucesso!</p><p class="b16 c-dark">Pode parecer simples, mas datas especiais costumam ficar fora das contas que fazemos de cabeça para o mês seguinte, e o gasto acontece de qualquer jeito. Agora eu acompanho essas datas com você, aviso com antecedência e ajudo a incluí-las no seu planejamento ;)</p></div><div class="sheet-foot" style="background:#fff">${btn('Ver minha agenda', { act: 'go' })}</div></div>${homeInd()}`,
  acts: { go: () => reset('controle', { tab: 'agenda' }, 'fade') },
});

/* ---------- Assinaturas ---------- */
function subsBody() {
  if (!S.contas.length) return `<div class="col g1"><p class="h3 c-darker">Central de Assinaturas</p><p class="cap c-dark">Certifique-se de que usa todos os serviços contratados</p></div><div class="empty"><span class="ico-c" style="width:52px;height:52px">${ic('repeat', 24)}</span><p class="b16 semi c-darker">Nenhuma assinatura encontrada</p><p class="b14 c-base">Assim que identificarmos uma assinatura ou recorrência, a Mia vai organizar tudo por aqui.</p><p class="cap c-dark">Para encontrar suas assinaturas organizadas, certifique-se de que suas contas estão conectadas</p>${btn('Conectar contas agora', { act: 'connect', cls: 'auto' })}</div>`;
  S.subs = S.subs || SUBS0(); const tot = S.subs.reduce((a, s) => a + s[1], 0);
  return `<div class="col g1"><p class="h3 c-darker">Central de Assinaturas</p><p class="cap c-dark">Certifique-se de que você usa todos os serviços contratados.</p></div>
    ${S.flags.miaS ? '' : miaBox(`Suas ${S.subs.length} recorrências somam ${fmtBRL(tot)} por mês`, `Você possui ${fmtR(tot * 12)} em cobranças anuais. Confira a lista completa dos serviços abaixo.`, 'miaS')}
    <div class="card col" style="padding:0;overflow:hidden"><p class="b14 semi c-base" style="padding:14px 16px 4px">Assinaturas atuais</p><div class="col" style="padding:0 16px">${S.subs.map((s, k) => `<div class="li"><span class="ico-c sm">${ic(s[2], 16)}</span><span class="lt col"><span class="b16 semi c-darker">${s[0]}</span><span class="cap c-base">Vencimento: dia ${s[3]}</span></span><span class="col" style="align-items:flex-end"><span class="b14 bold c-darker money">${fmtBRL(s[1])}</span><span class="cap c-base">por mês</span></span><button type="button" data-act="subMenu" data-k="${k}" aria-label="Opções de ${s[0]}" style="color:var(--ty-dark)">${ic('ellipsis-vertical', 18)}</button></div>`).join('')}</div>
      <div class="row jb" style="background:var(--primary-lighter);padding:14px 16px"><span class="b14 semi c-dark">Valor total:</span><span class="b14 bold c-darker money">${fmtBRL(tot)}</span></div></div>`;
}

/* exemplo (conta em uso) */
const seedDemo2 = seedDemo;
seedDemo = function () {
  seedDemo2();
  S.radar = { cats: ['cartao', 'delivery', 'transporte', 'mercado'], cartoes: S.contas.slice(0, 3), metas: { cartao: Object.fromEntries(S.contas.slice(0, 3).map((id, k) => [id, [800, 200, 100][k]])), delivery: 380, transporte: 200, mercado: 620 }, gastos: { cartao: Object.fromEntries(S.contas.slice(0, 3).map((id, k) => [id, [50, 60, 110][k]])), delivery: 285, transporte: 40, mercado: 248 }, ativo: true };
  S.flags.radarIntroSeen = true; S.flags.agendaSeen = true; S.subs = null;
};
flowEntry('Controle', 'Radar · primeiro acesso', () => { if (!S.contas.length) seedDemo(); S.radar = null; S.flags.radarIntroSeen = false; reset('controle', { tab: 'radar' }); });
flowEntry('Controle', 'Radar com metas', () => { seedDemo(); reset('controle', { tab: 'radar' }); });
flowEntry('Controle', 'Agenda', () => { if (!S.contas.length) seedDemo(); S.flags.radarIntroSeen = true; reset('controle', { tab: 'agenda' }); });
flowEntry('Controle', 'Assinaturas', () => { if (!S.contas.length) seedDemo(); S.flags.radarIntroSeen = true; reset('controle', { tab: 'subs' }); });
