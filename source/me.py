# usage: me.py name:H:js [name:H:js ...]   (js may contain ':'; split on first two)
import sys,asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for arg in sys.argv[1:]:
            name,h,js=arg.split('|',2)
            pg=await b.new_page(viewport={'width':375,'height':int(h)})
            errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
            await pg.goto('file:///home/claude/mepaguei/dist/index.html#cmp'); await pg.wait_for_timeout(250)
            for step in js.split(';;'):
                if step.startswith('wait'): await pg.wait_for_timeout(int(step[4:])); continue
                await pg.evaluate(step); await pg.wait_for_timeout(450)
            await pg.screenshot(path=f'audit/{name}-me.png')
            if errs: print(name,'ERR',errs)
            await pg.close()
        await b.close()
asyncio.run(main())
