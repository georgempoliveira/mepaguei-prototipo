# usage: full.py name 'js;;js' [--top]  -> audit/<name>-me.png  (375 wide; full scroll height unless --top)
import os
ROOT=os.path.dirname(os.path.abspath(__file__))
import sys,asyncio,os
ROOT=os.path.dirname(os.path.abspath(__file__))
from playwright.async_api import async_playwright
name,js=sys.argv[1],sys.argv[2]; top='--top' in sys.argv
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':375,'height':812})
        errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
        await pg.goto('file://'+ROOT+'/dist/index.html#cmp'); await pg.wait_for_timeout(250)
        for step in js.split(';;'):
            if step.startswith('wait'): await pg.wait_for_timeout(int(step[4:])); continue
            await pg.evaluate(step); await pg.wait_for_timeout(450)
        if not top:
            h=await pg.evaluate("(()=>{const s=[...document.querySelectorAll('#viewport .scr:last-child .scroll, #viewport .scr:last-child .sheet-in')];const sc=s.sort((a,b)=>b.scrollHeight-a.scrollHeight)[0];if(!sc)return 812;return 812+sc.scrollHeight-sc.clientHeight})()")
            if h>812:
                await pg.set_viewport_size({'width':375,'height':h}); await pg.wait_for_timeout(300)
        await pg.screenshot(path=f'{ROOT}/audit/{name}-me.png')
        if errs: print(name,'ERR',errs)
        await b.close()
asyncio.run(main())
