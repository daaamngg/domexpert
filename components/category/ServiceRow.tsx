import type { Service } from "@/lib/site";
import { priceLabel } from "@/lib/format";
import SmartImage from "@/components/SmartImage";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import AddToRequest from "@/components/request/AddToRequest";

/**
 * Строка услуги: миниатюра, название, цена и пояснение, кнопка «в заявку».
 * Строки вместо карточек — компактно на телефоне. Цена стоит под названием,
 * а не справа: справа теперь кнопка добавления (просьба Арслана 26.10).
 */
export default function ServiceRow({ service }: { service: Service }) {
  return (
    <li className="flex items-center gap-3 py-3 sm:gap-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-20">
        {service.image ? (
          <SmartImage src={service.image} alt={service.title} sizes="80px" className="h-full w-full object-cover" />
        ) : (
          <PhotoPlaceholder label="" className="h-full w-full rounded-lg" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-sans text-[15px] font-semibold leading-snug text-ink sm:text-base">{service.title}</h3>
        <p className={`mt-0.5 text-sm ${service.priceFrom === null ? "text-text-dim" : "font-semibold text-ink"}`}>{priceLabel(service)}</p>
        {service.note && <p className="text-sm text-text-dim">{service.note}</p>}
      </div>
      <AddToRequest serviceId={service.id} title={service.title} />
    </li>
  );
}
