import Link from "next/link";
import { getService, works } from "@/lib/site";
import { priceLabel } from "@/lib/format";
import SmartImage from "@/components/SmartImage";

/**
 * «Наши работы» на главной — 3 фото и кнопка на страницу со всеми работами.
 * 27.10 Арслан предложил три варианта; выбран «оставить блок, сократить до 3»:
 * настоящие фото — главное доказательство, им место на главной, а три снимка
 * не растягивают страницу на телефоне. Все остальные — на /raboty.
 *
 * Телефон: первое фото во всю ширину, два под ним в ряд. Компьютер — 3 в ряд.
 * Фото и подпись берутся из услуги (content.json → works.items = id услуг).
 * Пометка «пример» — пока Сергей не подтвердит снимки.
 */
export default function WorksGallery() {
  const list = works.items
    .map((id) => getService(id))
    .filter((x): x is NonNullable<typeof x> => Boolean(x?.service.image));

  return (
    <section id="raboty" className="border-t border-border py-12 lg:py-24">
      <div className="container-x">
        <h2 className="text-[2rem] font-bold leading-tight tracking-[-0.01em] lg:text-[2.75rem]">{works.title}</h2>

        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-5 lg:mt-10 lg:grid-cols-3 lg:gap-x-6">
          {list.map(({ service, category }, i) => (
            <li key={service.id} className={i === 0 ? "col-span-2 lg:col-span-1" : ""}>
              <Link href={`/uslugi/${category.slug}`} className="group block">
                <div className={`relative overflow-hidden rounded-lg lg:aspect-[4/5] ${i === 0 ? "aspect-[4/3]" : "aspect-square"}`}>
                  <SmartImage
                    src={service.image!}
                    alt={service.title}
                    sizes={i === 0 ? "(min-width: 1024px) 380px, 100vw" : "(min-width: 1024px) 380px, 50vw"}
                    className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                  <span className="absolute left-2 top-2 rounded-full bg-surface/90 px-2 py-0.5 text-xs text-text-dim">
                    {works.exampleLabel}
                  </span>
                </div>
                <p className="mt-2 text-[15px] font-semibold leading-snug text-ink transition-colors group-hover:text-coffee">
                  {service.title}
                </p>
                <p className="text-sm text-text-dim">{priceLabel(service)}</p>
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/raboty" className="btn btn-outline mt-7 h-12 w-full px-6 text-base sm:w-auto lg:mt-10">
          Смотреть все проекты
        </Link>
      </div>
    </section>
  );
}
