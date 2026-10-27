import { BookOpen } from "lucide-react";
import { guides } from "@/lib/site";

/**
 * Гайды — место под следующий этап (Сергей хочет «гайды по посадке, по
 * посадке газона и прочее»). Пока только темы с пометкой «скоро»,
 * без ссылок: вести некуда, а пустая страница доверия не добавит.
 */
export default function GuidesTeaser() {
  return (
    <section id="gaidy" className="border-t border-border py-12 lg:py-24">
      <div className="container-x">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-[2rem] font-bold leading-tight tracking-[-0.01em] lg:text-[2.75rem]">{guides.title}</h2>
          <span className="text-sm text-text-dim">{guides.subtitle}</span>
        </div>

        <ul className="mt-5 divide-y divide-border border-y border-border lg:mt-8 lg:grid lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {guides.items.map((g) => (
            <li key={g.title} className="flex items-center gap-3 py-4 lg:flex-col lg:items-start lg:gap-4 lg:px-6 lg:py-8 lg:first:pl-0">
              <BookOpen size={22} strokeWidth={1.7} className="shrink-0 text-coffee" aria-hidden />
              <p className="flex-1 font-display text-lg font-semibold leading-snug text-ink lg:text-xl">{g.title}</p>
              <span className="placeholder-tag shrink-0">скоро</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
