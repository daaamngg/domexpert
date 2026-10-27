import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getService } from "@/lib/site";
import { priceLabel } from "@/lib/format";

/**
 * Подпись к фото работы: название услуги и цена «от», ссылка на категорию.
 * Главный приём вёрстки сайта (DESIGN.md, п. 3) — фото не декорация, а «вот работа, вот цена».
 *
 * 26.10 по critique: была белая карточка с тенью, «парившая» над фото, —
 * типовой приём ИИ-шаблонов. Теперь плоская полоса, прижатая к низу фото
 * (позиционирует вызывающий: absolute inset-x-0 bottom-0). Цена тёмная,
 * не серая — это самое важное число на снимке и его читают на солнце.
 * Длинные названия переносятся, а не обрезаются «…».
 * Неизвестный id — подписи нет, фото остаётся как есть.
 */
export default function PhotoChip({ serviceId, className = "" }: { serviceId: string; className?: string }) {
  const found = getService(serviceId);
  if (!found) return null;
  const { service, category } = found;

  return (
    <Link
      href={`/uslugi/${category.slug}`}
      className={`group flex items-center gap-3 bg-surface px-4 py-3 ${className}`}
    >
      {/* Название и цена — двумя частями строки, без «·» между ними. */}
      <span className="min-w-0 flex-1 text-[15px] leading-snug text-ink">{service.title}</span>
      <span className="shrink-0 whitespace-nowrap text-[15px] font-semibold text-ink">{priceLabel(service)}</span>
      <ArrowRight size={18} className="shrink-0 text-coffee transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}
