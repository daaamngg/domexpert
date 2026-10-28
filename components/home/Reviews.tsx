import { Camera } from "lucide-react";
import { reviews } from "@/lib/site";

/**
 * «Отзывы клиентов» — место под отзывы (28.10 Арслан: вместо «Как мы работаем»).
 * Настоящих отзывов и фото к ним пока нет, а выдумывать нельзя (CLAUDE.md),
 * поэтому пустые карточки: рамка пунктиром, место под фото и серые строки
 * вместо текста. Без «мерцания», как у загрузки, чтобы страница не казалась
 * недогруженной. Пустые карточки — украшение, диктору хватает строки текста.
 *
 * Телефон — компактные строки (фото слева), компьютер — 3 колонки.
 * Когда Сергей пришлёт отзывы: имя, район, текст, фото работы вместо слотов.
 */
export default function Reviews() {
  return (
    <section id="otzyvy" className="border-t border-border py-12 lg:py-24">
      <div className="container-x">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-[2rem] font-bold leading-tight tracking-[-0.01em] lg:text-[2.75rem]">{reviews.title}</h2>
          <span className="shrink-0 text-sm text-text-dim">{reviews.subtitle}</span>
        </div>
        <p className="mt-2 max-w-xl text-text-dim">{reviews.text}</p>

        <ul aria-hidden className="mt-5 grid gap-3 lg:mt-8 lg:grid-cols-3 lg:gap-6">
          {Array.from({ length: reviews.slots }, (_, i) => (
            <li key={i} className="flex gap-4 rounded-lg border border-dashed border-border-strong bg-surface p-3 lg:flex-col lg:p-5">
              <div className="flex size-[72px] shrink-0 items-center justify-center rounded-md bg-surface-2 text-coffee lg:aspect-[4/3] lg:size-auto lg:w-full">
                <Camera size={22} strokeWidth={1.7} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                <span className="h-2.5 w-full rounded-full bg-surface-2" />
                <span className="h-2.5 w-11/12 rounded-full bg-surface-2" />
                <span className="h-2.5 w-3/5 rounded-full bg-surface-2" />
                <span className="mt-1.5 h-2.5 w-1/3 rounded-full bg-border-strong" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
