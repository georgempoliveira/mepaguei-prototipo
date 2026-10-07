# usage: pair.py out.png name1 name2 ...   -> side by side fig|me pairs
import sys
from PIL import Image, ImageDraw
out=sys.argv[1]; names=sys.argv[2:]
cols=[]
for n in names:
    a=Image.open(f'audit/{n}-fig.png'); b=Image.open(f'audit/{n}-me.png')
    if a.width!=375: a=a.resize((375,int(a.height*375/a.width)))
    if b.width!=375: b=b.resize((375,int(b.height*375/b.width)))
    cols+= [(n+' FIGMA',a),(n+' MINHA',b)]
H=max(c[1].height for c in cols)+24
W=sum(c[1].width+8 for c in cols)
o=Image.new('RGB',(W,H),(200,200,200)); d=ImageDraw.Draw(o); x=0
for t,im in cols:
    o.paste(im,(x,24)); d.text((x+4,4),t,fill=(0,0,0)); x+=im.width+8
sc=min(1, 1900/W, 1500/H)
if sc<1: o=o.resize((int(W*sc),int(H*sc)))
o.save(out); print(out,o.size)
