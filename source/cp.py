import sys
from PIL import Image
D='/root/.claude/projects/-home-claude/c8543b8e-0a8a-5fc9-a6ef-59940a43f08f/tool-results/'
for pair in sys.argv[1:]:
    suf,name=pair.split('=')
    import glob
    f=glob.glob(D+'mcp-Figma-blob-*'+suf+'.png')[0]
    im=Image.open(f); out='assets/'+name
    if name.endswith('.webp'): im.save(out,'WEBP',quality=82,method=6)
    else: im.save(out,optimize=True)
    print(name,im.size)
