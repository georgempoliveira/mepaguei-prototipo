# usage: fig.py suffix=name ...  copy figma screenshot by suffix into audit/name-fig.png
import sys,glob
from PIL import Image
D='/root/.claude/projects/-home-claude/c8543b8e-0a8a-5fc9-a6ef-59940a43f08f/tool-results/'
for pr in sys.argv[1:]:
    suf,name=pr.split('=')
    f=glob.glob(D+'mcp-Figma-blob-*'+suf+'.png')[0]
    Image.open(f).convert('RGB').save(f'audit/{name}-fig.png')
