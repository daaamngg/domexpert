import Link from "next/link";
import { ArrowRight, Axe, BrushCleaning, Fence, Sprout, TreeDeciduous, Wrench } from "lucide-react";
import { categories, type CategoryIcon } from "@/lib/site";
import { formatRub, minPrice } from "@/lib/format";

/** «Листва, снег, покос, вывоз мусора» — через запятую, со строчной после первой.
 *  Было «Листва · Снег · Покос»: строка через точки — примета шаблона (аудит Hallmark 28.10). */
const tagLine = (tags: string[]) =>
  tags.map((t, i) => (i === 0 ? t : t.charAt(0).toLowerCase() + t.slice(1))).join(", ");

const icons: Record<CategoryIcon, typeof Axe> = {
  brush: BrushCleaning,
  sprout: Sprout,
  tree: TreeDeciduous,
  // Молоток рядом с топором («Дрова») выглядел почти так же — взят забор.
  fence: Fence,
  axe: Axe,
  wrench: Wrench,
};

/**
 * Услуги — блоки по смыслу (решение Арслана 26.10), «коробочки» как
 * в stroivizion: значок, название, подписи услуг, цена «от».
 * Блок ведёт на страницу категории со всеми связанными услугами.
 *
 * 27.10 (Арслан: «слишком узкие»): на телефоне — одна колонка широких
 * коробочек, значок слева, текст справа. По две в ряд на 390 px текст
 * шёл в столбик по 2–3 слова, а пятый блок оставался один в ряду.
 * На планшете — по две, на компьютере сетка из 6 долей: первые три блока
 * по 2 доли, последние два по 3 — ряды заполнены без «дырки».
 *
 * Значок в квадрате цвета кофе (не круг и не основной цвет), внутри —
 * настоящее содержание (подписи услуг и цена), а не абстрактная фраза.
 */
export default function CategoryGrid() {
  return (
    <section id="uslugi" className="border-t border-border py-12 lg:py-24">
      <div className="container-x">
        <h2 className="text-[2rem] font-bold leading-tight tracking-[-0.01em] lg:text-[2.75rem]">Услуги</h2>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-10 lg:grid-cols-6 lg:gap-5">
          {categories.map((c, i) => {
            const Icon = icons[c.icon];
            const from = minPrice(c.services);
            // Сетка из 6 долей на компьютере: 3 блока по 2 доли, дальше по 3.
            const span = i < 3 ? "lg:col-span-2" : "lg:col-span-3";
            // Нечётный последний блок на планшете — на всю ширину.
            const last = i === categories.length - 1 && categories.length % 2 === 1 ? "sm:col-span-2" : "";
            return (
              <li key={c.slug} className={`flex ${span} ${last}`}>
                <Link
                  href={`/uslugi/${c.slug}`}
                  className="group flex w-full items-start gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-coffee sm:p-5 lg:gap-5 lg:p-7"
                >
                  {/* Значок в квадрате цвета кофе с мягкой тенью — как в stroivizion
                      (референс Арслана 26.10), но свой цвет. */}
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-coffee text-on-accent shadow-icon lg:h-14 lg:w-14" aria-hidden>
                    <Icon size={24} strokeWidth={1.9} />
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col self-stretch">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-semibold leading-snug lg:text-2xl">{c.title}</h3>
                      <ArrowRight size={20} className="mt-1 shrink-0 text-coffee transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </div>
                    {/* Подписи услуг через точку — их видно все, а не «ещё 3».
                        flex-1 прижимает цену к низу: в ряду цены на одной линии. */}
                    <p className="mt-1 flex-1 text-[15px] leading-snug text-text-dim">{tagLine(c.tags)}</p>
                    <p className="mt-3 text-[15px] font-semibold text-ink">
                      {from === null ? <span className="font-normal text-text-dim">цена по звонку</span> : `от ${formatRub(from)}`}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
