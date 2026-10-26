# Build exercise demo assets from Everkinetic (CC BY-SA 4.0, https://github.com/everkinetic/data).
# Usage: python3 scripts/build-demos.py /path/to/everkinetic  -> public/demos/*.webp + index.json, lib/data/demos.json
import json, os, sys, re
from PIL import Image, ImageOps
src = sys.argv[1]; here = os.path.dirname(os.path.abspath(__file__)); root = os.path.dirname(here)
def bid(n): return "bi_" + re.sub(r"(^-|-$)", "", re.sub(r"[^a-z0-9]+", "-", n.lower()))
m = json.load(open(os.path.join(here, "demo-map.json")))
out = os.path.join(root, "public", "demos"); os.makedirs(out, exist_ok=True)
data = {}
for name, ek in sorted(m.items()):
    j = json.load(open(f"{src}/src/exercises/{ek}/{ek}.json"))
    frames = []
    for k, st in enumerate(["relaxation", "tension"]):
        im = Image.open(f"{src}/dist/png/{ek}-{st}.png").convert("RGBA")
        bg = Image.new("RGBA", im.size, "white"); bg.alpha_composite(im)
        g = ImageOps.grayscale(bg.convert("RGB"))
        g = ImageOps.pad(g, (max(g.size),) * 2, color=255)  # square, centred
        g = g.resize((480, 480), Image.LANCZOS)
        fn = f"{ek}-{k}.webp"; g.save(os.path.join(out, fn), "WEBP", quality=82, method=6)
        frames.append(f"/demos/{fn}")
    cap = lambda s: s[:1].upper() + s[1:]
    data[bid(name)] = {"src": ek, "title": j["title"], "frames": frames,
        "steps": [s.strip() for s in j.get("steps", []) if s.strip()],
        "primary": [cap(x) for x in j.get("primary", [])], "secondary": [cap(x) for x in j.get("secondary", [])]}
json.dump(data, open(os.path.join(root, "lib", "data", "demos.json"), "w"), indent=1, ensure_ascii=False)
json.dump(data, open(os.path.join(out, "index.json"), "w"), separators=(",", ":"), ensure_ascii=False)  # lazily fetched by the client sheet
print(len(data), "demos")
