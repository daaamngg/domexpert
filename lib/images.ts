// ============================================================
//  Подключение оптимизированных фото (как в stroivizion).
//
//  `npm run images` берёт оригиналы из photos-src/, делает AVIF и WebP
//  в нескольких ширинах и записывает карту в data/images.json.
//  Фото нет в карте — показываем как есть, без вариантов. Ничего не ломается.
// ============================================================

import imagesData from "@/data/images.json";

export type ImageEntry = {
  /** Размеры самого широкого варианта — чтобы страница не «прыгала» при загрузке. */
  width: number;
  height: number;
  /** Готовые ширины, напр. [480, 540] */
  widths: number[];
  /** Базовое имя без ширины и расширения, напр. /photos/gazon */
  base: string;
};

const manifest = (imagesData as { images: Record<string, ImageEntry> }).images;

export function getImage(src: string | undefined): ImageEntry | null {
  if (!src) return null;
  return manifest[src] ?? null;
}

/** Строка srcset для одного формата: "/photos/gazon-480.avif 480w, ..." */
export function srcSet(entry: ImageEntry, ext: "avif" | "webp"): string {
  return entry.widths.map((w) => `${entry.base}-${w}.${ext} ${w}w`).join(", ");
}

/** Самый крупный готовый вариант — запасной src для <img>. */
export function fallbackSrc(entry: ImageEntry, original: string): string {
  const widest = entry.widths[entry.widths.length - 1];
  return widest ? `${entry.base}-${widest}.webp` : original;
}
