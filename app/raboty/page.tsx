import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import { allWorks, categories, site, works } from "@/lib/site";
import { priceLabel } from "@/lib/format";
import BackToHome from "@/components/nav/BackToHome";
import SmartImage from "@/components/SmartImage";

export const metadata: Metadata = {
  title: "Наши работы",
  description: "Фото работ: уборка участков, огород и газон, деревья и земля, демонтаж и заборы, дрова.",
};

/**
 * Все фото работ (кнопка «Смотреть все проекты» с главной).
 * Сгруппированы по блокам услуг — так проще найти «свою» работу, чем в общей
 * ленте из 18 снимков. Фото и подпись — из услуги; повторы одного снимка убраны.
 * Пометка «пример» одна на странице, а не на каждом фото: пока Сергей
 * не подтвердил снимки, но 18 одинаковых меток только шумят.
 */
export default function WorksPage() {
  const all = allWorks();
  const groups = categories
    .map((c) => ({ category: c, items: all.filter((w) => w.category.slug === c.slug) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="container-x py-5 lg:py-8">
      <BackToHome />

      <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">{works.title}</h1>
      <p className="mt-2 flex flex-wrap items-center gap-2 text-text-dim">
        {works.note} <span className="placeholder-tag">{works.exampleLabel}</span>
      </p>

      {groups.map(({ category, items }) => (
        <section key={category.slug} className="mt-9 lg:mt-12">
          <h2 className="text-2xl font-semibold leading-tight">
            <Link href={`/uslugi/${category.slug}`} className="transition-colors hover:text-coffee">
              {category.title}
            </Link>
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
            {items.map(({ service }) => (
              <li key={service.id}>
                <Link href={`/uslugi/${category.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden rounded-lg">
                    <SmartImage
                      src={service.image!}
                      alt={service.title}
                      sizes="(min-width: 1024px) 280px, 50vw"
                      className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  </div>
                  <p className="mt-2 text-[15px] font-semibold leading-snug text-ink transition-colors group-hover:text-coffee">
                    {service.title}
                  </p>
                  <p className="text-sm text-text-dim">{priceLabel(service)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <a href={`tel:${site.phoneHref}`} className="btn btn-primary h-12 text-base">
          <Phone size={18} aria-hidden /> Позвонить нам
        </a>
        <p className="text-sm text-text-dim">{site.freeConsultation}. Цену фиксируем после звонка.</p>
      </div>
    </div>
  );
}
