# usage: cmp.py <figma_png_path> <name>   -> audit/<name>-fig.png + audit/<name>-pairN.png (Figma left | ours right, 1:1, 1000px slices)
import sys,os
from PIL import Image
ROOT=os.path.dirname(os.path.abspath(__file__))
fp,name=sys.argv[1],sys.argv[2]
f=Image.open(fp).convert('RGB')
if f.width!=375: f=f.resize((375,round(f.height*375/f.width)))
f.save(f'{ROOT}/audit/{name}-fig.png')
m=Image.open(f'{ROOT}/audit/{name}-me.png').convert('RGB')
H=max(f.height,m.height); n=0
for y in range(0,H,1000):
    o=Image.new('RGB',(760,min(1000,H-y)),(200,200,200)); o.paste(f.crop((0,y,375,min(y+1000,f.height))),(0,0)); o.paste(m.crop((0,y,375,min(y+1000,m.height))),(385,0))
    o.save(f'{ROOT}/audit/{name}-pair{n}.png'); print(f'{ROOT}/audit/{name}-pair{n}.png'); n+=1
