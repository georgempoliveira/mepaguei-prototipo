# usage: fx.py '<json from figma: [{"n":name,"w":W,"h":H,"base":[bw,bh]}...]>' [--webp]
# maps newest figma blob files by exact size; saves assets/<n>.png|.webp resized to base*2
import sys,json,glob,os
from PIL import Image
D='/root/.claude/projects/-home-claude-mepaguei-prototipo/c8543b8e-0a8a-5fc9-a6ef-59940a43f08f/tool-results/'
items=json.loads(sys.argv[1]); webp='--webp' in sys.argv
files=sorted(glob.glob(D+'mcp-Figma-blob-*.png'), key=os.path.getmtime)[-40:]
sizes={}
for f in files: sizes.setdefault(Image.open(f).size,[]).append(f)
for it in items:
    c=next((sizes[k] for k in sizes if abs(k[0]-it['w'])<=2 and abs(k[1]-it['h'])<=2),None)
    c=c or sizes.get((it['w'],it['h'])) or sizes.get((it['w']+1,it['h'])) or sizes.get((it['w']-1,it['h'])) or sizes.get((it['w'],it['h']+1)) or sizes.get((it['w'],it['h']-1))
    if not c: print('MISSING',it); continue
    im=Image.open(c[-1]); bw,bh=it['base']; im=im.resize((round(bw*2),round(bh*2)),Image.LANCZOS)
    out=f"assets/{it['n']}.{'webp' if webp or it.get('webp') else 'png'}"
    if out.endswith('webp'): im.save(out,'WEBP',quality=84,method=6)
    else: im.save(out,optimize=True)
    print(out, im.size, os.path.getsize(out)//1024,'KB')
