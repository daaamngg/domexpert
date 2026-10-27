import { calcConfig, type CalcItem, type Service } from "@/lib/site";

/** 15000 → «15 000 ₽» (неразрывные пробелы: цена не разорвётся переносом). */
export function formatRub(n: number): string {
  return `${n.toLocaleString("ru-RU")} ₽`;
}

/** Цена для строки услуги: «от 15 000 ₽» или «цена по звонку». */
export function priceLabel(s: Service): string {
  return s.priceFrom === null ? "цена по звонку" : `от ${formatRub(s.priceFrom)}`;
}

/** Самая низкая цена в категории — для плитки «от … ₽». null — ни у одной услуги цены нет. */
export function minPrice(services: Service[]): number | null {
  const prices = services.map((s) => s.priceFrom).filter((p): p is number => p !== null);
  return prices.length ? Math.min(...prices) : null;
}

/**
 * Ориентировочная цена в калькуляторе.
 * Формула из CLAUDE.md: max(минимальная цена из объявления, ставка × объём).
 * Округляем ВВЕРХ до roundTo: «от» не должно оказаться ниже расчёта.
 */
export function estimate(item: CalcItem, qty: number): number {
  const raw = Math.max(item.priceFrom, item.rate * qty);
  const step = calcConfig.roundTo || 1;
  return Math.ceil(raw / step) * step;
}
