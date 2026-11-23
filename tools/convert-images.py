"""Конвертация исходных фото клиента в WebP для лендинга.

Оригиналы в папке Клиенты не изменяются: файлы только читаются.
Запуск: python tools/convert-images.py
"""

import json
import os

from PIL import Image

SRC = r"D:\учеба\PVL\Клиенты\СтеклоПак Торг\assets"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DST = os.path.join(ROOT, "public", "img")
MANIFEST = os.path.join(ROOT, "tools", "img-manifest.json")

# (исходник, имя на выходе, максимальная ширина, качество, кроп (left, top, right, bottom) или None)
JOBS = [
    ("01_balcony_glazing.jpg", "hero-balcony.webp", 1400, 84, (160, 18, 1140, 518)),
    ("10_production_line.jpg", "production-line.webp", 1400, 84, None),
    ("02_glazed_entrance.jpg", "work-entrance.webp", 900, 80, None),
    ("06_installation.jpg", "work-installation.webp", 900, 80, None),
    ("05_facade_windows.jpg", "work-facade.webp", 900, 80, (120, 60, 1180, 620)),
    ("04_patio_door.jpg", "work-patio.webp", 900, 80, (140, 220, 790, 1130)),
    ("09_window_exterior.jpg", "work-detail.webp", 900, 80, None),
    ("03_house_windows.jpg", "work-house.webp", 900, 80, None),
]


def main():
    os.makedirs(DST, exist_ok=True)
    manifest = {}
    for src_name, out_name, max_w, quality, crop in JOBS:
        src_path = os.path.join(SRC, src_name)
        img = Image.open(src_path)
        if crop:
            img = img.crop(crop)
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGB")
        w, h = img.size
        if w > max_w:
            new_h = round(h * max_w / w)
            img = img.resize((max_w, new_h), Image.LANCZOS)
        out_path = os.path.join(DST, out_name)
        # держим вес под 180 КБ: снижаем качество, если файл тяжелее
        q = quality
        while True:
            img.save(out_path, "WEBP", quality=q, method=6)
            size_kb = os.path.getsize(out_path) / 1024
            if size_kb <= 175 or q <= 62:
                break
            q -= 4
        manifest[out_name] = {
            "width": img.size[0],
            "height": img.size[1],
            "source": src_name,
            "bytes": os.path.getsize(out_path),
            "quality": q,
        }
        print(f"{out_name:24s} {img.size[0]}x{img.size[1]}  {size_kb:6.1f} KB  q={q}")
    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
