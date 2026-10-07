import sys,asyncio,json
from playwright.async_api import async_playwright
# usage: shot.py out_prefix "js1" "js2" ...  each js evaluated then screenshot
async def main():
    out=sys.argv[1]; steps=sys.argv[2:]
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':375,'height':812},device_scale_factor=1)
        errs=[]
        pg.on('pageerror',lambda e: errs.append(str(e)))
        pg.on('console',lambda m: errs.append('console:'+m.text) if m.type in('error','warning') else None)
        await pg.goto('file:///home/claude/mepaguei/dist/index.html')
        await pg.wait_for_timeout(300)
        for i,s in enumerate(steps):
            if s.startswith('wait:'): await pg.wait_for_timeout(int(s[5:])); continue
            if s.startswith('click:'): await pg.click(s[6:]); await pg.wait_for_timeout(450); 
            elif s.startswith('type:'):
                sel,val=s[5:].split('=',1); await pg.click(sel); await pg.keyboard.type(val); await pg.wait_for_timeout(100)
            else:
                await pg.evaluate(s); await pg.wait_for_timeout(450)
            if not s.startswith('type:') or i==len(steps)-1:
                pass
        await pg.screenshot(path=f'{out}.png')
        print('errors:',errs[:10])
        await b.close()
asyncio.run(main())
