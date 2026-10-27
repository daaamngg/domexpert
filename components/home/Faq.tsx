import { Plus } from "lucide-react";
import { faq } from "@/lib/site";

/**
 * Частые вопросы — перед формой заявки (просьба Арслана 27.10).
 * Аккордеон на нативных <details>: открывается без JavaScript, клавиатура
 * и экранный диктор работают сами. Ответы — только факты (content.json → faq);
 * где данных нет — видимая пометка «[уточнить у Сергея]».
 */
export default function Faq() {
  return (
    <section id="voprosy" className="border-t border-border py-12 lg:py-24">
      <div className="container-x grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <h2 className="text-[2rem] font-bold leading-tight tracking-[-0.01em] lg:text-[2.75rem]">{faq.title}</h2>

        <div className="border-t border-border-strong">
          {faq.items.map((item) => (
            <details key={item.q} className="faq-item group border-b border-border-strong">
              <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-4 text-[17px] font-semibold leading-snug text-ink transition-colors hover:text-coffee">
                {item.q}
                <span className="faq-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-strong text-coffee group-open:border-coffee" aria-hidden>
                  <Plus size={17} strokeWidth={2.2} />
                </span>
              </summary>
              <p className="-mt-1 pb-5 pr-12 leading-relaxed text-text">
                {item.a}
                {item.placeholder && <span className={`placeholder-tag align-middle ${item.a ? "ml-2" : ""}`}>{faq.placeholderLabel}</span>}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
