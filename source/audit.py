from playwright.sync_api import sync_playwright
import pathlib
u='file://'+str(pathlib.Path('/home/claude/mepaguei/dist/index.html'))
CHECK = """(() => {
  const out = [];
  const scr = cur; if (!scr) return [['sem tela','']];
  const R = scr.getBoundingClientRect();
  scr.querySelectorAll('img').forEach(i => { if (!i.complete || i.naturalWidth === 0) out.push(['img quebrada', i.getAttribute('src')]); });
  scr.querySelectorAll('svg').forEach(s => { if (!s.children.length) out.push(['icone vazio', (s.parentElement.getAttribute('aria-label')||s.parentElement.className||'?').toString().slice(0,30)]); });
  scr.querySelectorAll('*').forEach(e => {
    if (e.closest('svg') || e.tagName === 'svg') return;
    const st = getComputedStyle(e);
    if (st.position === 'absolute' || st.position === 'fixed' || st.display === 'none') return;
    // ignora filhos de carrossel (rolagem horizontal proposital)
    let a = e.parentElement, rolante = false;
    while (a && a !== scr) { const s2 = getComputedStyle(a); if (s2.overflowX === 'auto' || s2.overflowX === 'scroll') { rolante = true; break; } a = a.parentElement; }
    if (rolante) return;
    const b = e.getBoundingClientRect(); if (!b.width) return;
    if (b.right > R.right + 1.5 || b.left < R.left - 1.5)
      out.push(['estoura', (e.className||e.tagName).toString().slice(0,26) + ' |' + Math.round(b.left-R.left) + '..' + Math.round(b.right-R.right)]);
  });
  scr.querySelectorAll('p,span,button,h1,h2,h3').forEach(e => {
    if (e.children.length) return;
    const st = getComputedStyle(e);
    if (st.overflow === 'hidden' && e.scrollHeight > e.clientHeight + 2 && st.webkitLineClamp === 'none')
      out.push(['texto cortado', (e.textContent||'').trim().slice(0,28)]);
  });
  scr.querySelectorAll('button').forEach(b => {
    if (!((b.textContent||'').trim() || b.getAttribute('aria-label'))) out.push(['botao sem rotulo', (b.className||'').toString().slice(0,26)]);
  });
  // area de rolagem que nao rola mas tem conteudo maior
  scr.querySelectorAll('.scroll,.sheet-in,.bhd-in').forEach(e => {
    if (e.scrollHeight > e.clientHeight + 4 && getComputedStyle(e).overflowY === 'visible')
      out.push(['conteudo sem rolagem', (e.className||'').toString().slice(0,26)]);
  });
  return out;
})()"""
SEED = """(() => { S = freshState(); seedDemo();
  S.tmpM={nome:'',nasc:'',par:''}; S.tmpObj={nome:'',valorTxt:'',prazo:''};
  S.tmpVf={valorTxt:'',freq:'Semanal'}; S.tmpE={valorTxt:''}; S.tmpG={valorTxt:''};
  S.tmpSim={tipo:'Receita',valorTxt:'',nome:'',data:''}; S.tmpPb={time:'',valorTxt:''};
  S.apos={idadeTxt:'',rendaTxt:'',aporteTxt:''}; S.tmpVf.dia='Segunda-feira'; })()"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width':375,'height':812}); pg.goto(u)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.wait_for_timeout(900)
    telas = pg.evaluate("Object.keys(SCREENS)")
    todos = {}; falhou = []
    for t in telas:
        pg.evaluate(SEED)
        try: pg.evaluate(f"reset('{t}',{{}},'none')")
        except Exception as ex: falhou.append(f"{t}: {str(ex).splitlines()[0][:70]}"); continue
        pg.wait_for_timeout(200)
        try: res = pg.evaluate(CHECK)
        except Exception as ex: falhou.append(f"{t}: check {str(ex)[:50]}"); continue
        for tipo, det in res: todos.setdefault(tipo, []).append(f"{t}: {det}")
    print('telas varridas:', len(telas))
    print('ERROS JS:', errs[:8] if errs else 'nenhum')
    print('NAO RENDERIZA:', len(falhou))
    for x in falhou: print('  ', x)
    for tipo, L in sorted(todos.items(), key=lambda x: -len(x[1])):
        print(f"\n--- {tipo} ({len(L)}) ---")
        for x in L[:18]: print('  ', x)
        if len(L) > 18: print(f'   ... +{len(L)-18}')
    b.close()
