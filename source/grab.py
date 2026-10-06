import sys,glob,os
from PIL import Image
D='/root/.claude/projects/-home-claude/c8543b8e-0a8a-5fc9-a6ef-59940a43f08f/tool-results/'
prefix=sys.argv[1]; pairs=sys.argv[2:]
files=sorted(glob.glob(D+'mcp-Figma-blob-'+prefix+'*.png'))
info=[(f,Image.open(f).size) for f in files]
for p in pairs:
    name,dim=p.split('=')
    w,h=map(int,dim.split('x'))
    best=min(info,key=lambda x:abs(x[1][0]-w)+abs(x[1][1]-h))
    im=Image.open(best[0])
    out='/home/claude/mepaguei/assets/'+name
    if name.endswith('.webp'): im.save(out,'WEBP',quality=82,method=6)
    elif name.endswith('.jpg'): im.convert('RGB').save(out,'JPEG',quality=82)
    else: im.save(out,optimize=True)
    print(name, best[1], os.path.getsize(out))
