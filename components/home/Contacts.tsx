import { MapPin, Phone } from "lucide-react";
import { site, messengers, messengerLabels, type MessengerId } from "@/lib/site";
import { messengerIcons } from "@/components/icons";

/**
 * Контакты. Мессенджеры здесь — с подписями, а не одними значками:
 * значок MAX многие не узнают (critique). Сюда же переехали регион
 * и мессенджеры с первого экрана. Карта — ссылкой на Яндекс.Карты,
 * без встраивания: чужой скрипт на странице ради одной точки не нужен.
 */
export default function Contacts() {
  const links = (Object.entries(messengers) as [MessengerId, string][]).filter(([, url]) => url);
  const mapUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(site.address)}`;

  return (
    <section id="kontakty" className="border-t border-border py-12 lg:py-24">
      <div className="container-x grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <h2 className="text-[2rem] font-bold leading-tight tracking-[-0.01em] lg:text-[2.75rem]">Контакты</h2>

        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
          <div>
            <p className="text-sm text-text-dim">Телефон</p>
            <a href={`tel:${site.phoneHref}`} className="mt-1 block font-display text-[1.75rem] font-bold leading-tight text-ink hover:text-coffee">
              {site.phone}
            </a>
            <p className="mt-1 text-text">{site.freeConsultation}</p>
            <a href={`tel:${site.phoneHref}`} className="btn btn-primary mt-4 h-12 px-6 text-base">
              <Phone size={18} aria-hidden /> Позвонить нам
            </a>
          </div>

          <div>
            <p className="text-sm text-text-dim">Написать</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {links.map(([id, url]) => {
                const Icon = messengerIcons[id];
                return (
                  <li key={id}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline h-11 px-4 text-[15px]">
                      <Icon size={19} /> {messengerLabels[id]}
                    </a>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 text-sm text-text-dim">Адрес</p>
            <p className="mt-1 text-ink">{site.address}</p>
            <p className="text-text-dim">{site.region}</p>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[15px] font-semibold text-coffee underline decoration-wood underline-offset-4">
              <MapPin size={16} aria-hidden /> Открыть на карте
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
