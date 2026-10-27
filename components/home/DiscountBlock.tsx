import { Phone } from "lucide-react";
import { discount, site } from "@/lib/site";

/**
 * Скидка новым клиентам — в виде бирки: прошивка пунктиром по краю
 * и «дырочка» в углу.
 * 27.10 была тёмной (эспрессо с древесной текстурой); 28.10 Арслан:
 * «в скидках этот цвет убрать» — цвет дерева переехал в шапку калькулятора,
 * а бирка стала светлой. Без сигнальных лент и штампов
 * (отвергнуто 25.10: «слишком кричаще»).
 * Размер и условия НЕ подтверждены — текст прежний: «уточняйте по телефону».
 */
export default function DiscountBlock() {
  return (
    <section id="skidka" className="py-8 lg:py-12">
      <div className="container-x">
        {/* Одна бирка: прошивка — пунктирная обводка внутрь (outline-offset
            со знаком минус), а не вторая рамка-карточка внутри первой
            (аудит Hallmark 28.10: «карточка в карточке»). */}
        <div className="relative flex flex-col gap-5 rounded-xl border border-border bg-surface px-7 pb-8 pt-9 outline-1 -outline-offset-9 outline-coffee/35 outline-dashed sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-11 lg:px-14">
          {/* «Дырочка» бирки — кружок цвета фона страницы с ободком. */}
          <span aria-hidden className="absolute right-5 top-5 h-4 w-4 rounded-full bg-bg ring-[3px] ring-coffee/30 sm:right-6 sm:top-1/2 sm:-translate-y-1/2" />

          <div className="pr-8 sm:pr-14">
            <h2 className="text-[1.875rem] font-bold leading-[1.1] lg:text-[2.5rem]">{discount.title}</h2>
            <p className="mt-2.5 flex flex-wrap items-center gap-2 text-[17px] text-text">
              {discount.text}
              {discount.placeholder && <span className="placeholder-tag">уточняется</span>}
            </p>
          </div>

          <a href={`tel:${site.phoneHref}`} className="btn btn-primary h-12 shrink-0 px-6 text-base sm:mr-12">
            <Phone size={18} aria-hidden /> Узнать скидку
          </a>
        </div>
      </div>
    </section>
  );
}
