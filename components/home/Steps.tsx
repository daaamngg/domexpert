import { steps } from "@/lib/site";

/**
 * «Как мы работаем» — 4 шага после калькулятора (просьба Арслана 27.10).
 * Крупные цифры антиквой цвета эспрессо — единственный «декор» блока;
 * без кружков-номеров и стрелок между шагами (шаблон).
 * Телефон — строки «цифра слева, текст справа», компьютер — 4 колонки
 * с цифрой над текстом и тонкой линией сверху, как ступени.
 */
export default function Steps() {
  return (
    <section id="etapy" className="border-t border-border py-12 lg:py-24">
      <div className="container-x">
        <h2 className="text-[2rem] font-bold leading-tight tracking-[-0.01em] lg:text-[2.75rem]">{steps.title}</h2>

        <ol className="mt-6 lg:mt-10 lg:grid lg:grid-cols-4 lg:gap-8">
          {steps.items.map((s, i) => (
            <li
              key={s.title}
              className="grid grid-cols-[3.25rem_1fr] gap-x-3 border-t border-border-strong py-5 first:border-t-0 first:pt-1 lg:block lg:border-t-2 lg:border-espresso/80 lg:py-0 lg:pt-5 lg:first:border-t-2 lg:first:pt-5"
            >
              {/* Цифра — часть текста для дизайна, экранный диктор и так
                  прочтёт порядок нумерованного списка. */}
              <span aria-hidden className="font-display text-[2.75rem] font-bold leading-[0.9] text-espresso tabular-nums lg:text-[3.5rem]">
                {i + 1}
              </span>
              <div className="lg:mt-4">
                <h3 className="text-xl font-semibold leading-snug">{s.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-text-dim">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
