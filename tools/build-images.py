#!/usr/bin/env python3
"""Build image tiers for the sale site from the edited exports.

Usage: python3 tools/build-images.py   (run from Sale_Website/)
"""
import re, shutil
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent / "Photos" / "2026_Sale" / "EXPORTS"
OUT = ROOT / "img"
TIERS = {"thumb": (800, "WEBP", 80), "web": (2000, "JPEG", 85)}

def slug(p: Path) -> str:
    return re.sub(r"_P\d+$", "", p.stem)

def main():
    for t in (*TIERS, "full"):
        (OUT / t).mkdir(parents=True, exist_ok=True)
    srcs = sorted(SRC.glob("[0-9][0-9]-*.jpg"))
    for p in srcs:
        name = slug(p)
        full = OUT / "full" / f"{name}.jpg"
        if not full.exists() or full.stat().st_size != p.stat().st_size:
            shutil.copy2(p, full)
        im = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
        for tier, (w, fmt, q) in TIERS.items():
            ext = "webp" if fmt == "WEBP" else "jpg"
            dst = OUT / tier / f"{name}.{ext}"
            if dst.exists():
                continue
            r = im.copy()
            r.thumbnail((w, w * 10), Image.LANCZOS)
            kw = {"quality": q}
            if fmt == "JPEG":
                kw.update(progressive=True, optimize=True)
            else:
                kw.update(method=6)
            r.save(dst, fmt, **kw)
        print("ok", name)
    # Open Graph card: 1200x630 crop of the hero, biased toward the car
    hero = ImageOps.exif_transpose(Image.open(srcs[0])).convert("RGB")
    W, H = hero.size
    ch = int(W * 630 / 1200)
    top = int((H - ch) * 0.55)
    hero.crop((0, top, W, top + ch)).resize((1200, 630), Image.LANCZOS).save(
        ROOT / "og.jpg", "JPEG", quality=85, optimize=True, progressive=True)
    print("ok og.jpg")

if __name__ == "__main__":
    main()
