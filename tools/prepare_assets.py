from pathlib import Path
import re,base64,struct,io
from PIL import Image
root=Path(__file__).resolve().parents[1]
s=(root/'src/index.html').read_text(encoding='utf-8')
m=re.search(r'data:image/png;base64,([A-Za-z0-9+/=]+)',s)
if not m: raise SystemExit('Missing embedded icon')
im=Image.open(io.BytesIO(base64.b64decode(m.group(1),validate=True))).convert('RGBA')
im=im.resize((256,256),Image.Resampling.LANCZOS)
out=io.BytesIO(); im.save(out,format='PNG'); data=out.getvalue()
d=root/'assets'; d.mkdir(exist_ok=True)
(d/'chuke-app-icon.png').write_bytes(data)
(d/'chuke-app-icon.ico').write_bytes(struct.pack('<HHH',0,1,1)+struct.pack('<BBBBHHII',0,0,0,0,1,32,len(data),22)+data)
