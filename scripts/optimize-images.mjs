#!/usr/bin/env node
/**
 * ============================================================
 *  Оптимизация фотографий (подход как в stroivizion).
 *
 *    1. Оригиналы — в photos-src/  (что на каком фото — photos-src/README.md)
 *    2. npm run images
 *    3. Готовые AVIF + WebP в нескольких ширинах — в public/photos/,
 *       карта размеров — в data/images.json (по ней сайт подбирает размер).
 *
 *  Оригиналы не меняются и на сайт не попадают.
 *  Повторный запуск пропускает готовое (--force — пересобрать всё).
 * ============================================================
 */

import { readdir, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(root, "photos-src");
const OUT_DIR = path.join(root, "public", "photos");
const MANIFEST = path.join(root, "data", "images.json");

/** Ширины под телефон (×2–×3), планшет и компьютер. «Родная» ширина оригинала
 *  добавляется всегда: увеличивать нечего, но и терять резкость тоже не надо.
 *  27.10: были [480, 960, 1440] — у 540-пиксельных фото из мессенджера
 *  получалось всего 480 и 540, а телефону с плотным экраном нужно 750–1125. */
const WIDTHS = [480, 768, 1080, 1440];
/** 27.10: качество поднято (было AVIF 50 / WebP 76). На низком качестве AVIF
 *  сглаживает мелкие детали (трава, листва, земля) — поверх и так пережатого
 *  мессенджером JPEG это давало «мыло» на первых экранах. Исходники из ВК
 *  крупные (960–1440 px), запас по весу есть. */
const FORMATS = [
  { ext: "avif", options: { quality: 64, effort: 5 } },
  { ext: "webp", options: { quality: 84 } },
];
const INPUT_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const force = process.argv.includes("--force");

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.log("Папки photos-src/ нет — положите туда оригиналы.");
    return;
  }
  const files = (await readdir(SRC_DIR)).filter((n) => INPUT_EXT.has(path.extname(n).toLowerCase()));
  if (!files.length) {
    console.log("В photos-src/ нет фотографий.");
    return;
  }
  await mkdir(OUT_DIR, { recursive: true });

  const manifest = {};
  let made = 0;

  for (const name of files.sort()) {
    const file = path.join(SRC_DIR, name);
    const slug = path.basename(name, path.extname(name));
    const meta = await sharp(file, { failOn: "none" }).metadata();
    if (!meta.width || !meta.height) {
      console.warn(`  ! ${name}: не удалось прочитать размер, пропускаю`);
      continue;
    }
    // С учётом поворота из EXIF: у фото с телефона ширина и высота могут быть переставлены.
    const rotated = (meta.orientation ?? 1) >= 5;
    const W = rotated ? meta.height : meta.width;
    const H = rotated ? meta.width : meta.height;

    const widths = WIDTHS.filter((w) => w < W);
    if (W <= 1920) widths.push(W);

    for (const w of widths) {
      for (const fmt of FORMATS) {
        const out = path.join(OUT_DIR, `${slug}-${w}.${fmt.ext}`);
        if (!force && existsSync(out)) continue;
        await sharp(file, { failOn: "none" })
          .rotate()
          .resize({ width: w, withoutEnlargement: true })
          .toFormat(fmt.ext, fmt.options)
          .toFile(out);
        made++;
      }
    }

    const widest = widths[widths.length - 1];
    manifest[`/photos/${slug}.jpg`] = {
      base: `/photos/${slug}`,
      width: widest,
      height: Math.round((H / W) * widest),
      widths,
    };
    console.log(`  ✓ ${name} (${widths.join(", ")} px)`);
  }

  await writeFile(MANIFEST, JSON.stringify({ images: manifest }, null, 2) + "\n", "utf8");
  console.log(`\nГотово: ${files.length} фото, создано файлов ${made}. Карта — data/images.json.`);
}

main().catch((e) => {
  console.error("Ошибка:", e.message);
  process.exit(1);
});
