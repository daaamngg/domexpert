import { Phone } from "lucide-react";
import { contactCta, messengerLabels, messengers, site, type MessengerId } from "@/lib/site";
import { messengerIcons } from "@/components/icons";

/**
 * «Как связаться» — короткий блок перед «Контактами».
 * 28.10 заменил форму «Оставить заявку»: сайт ничего не отправляет на сервер,
 * только звонок и мессенджеры. Прежний блок — components/home/LeadSection.tsx
 * (не подключён), вернуть — в app/page.tsx поставить <LeadSection /> вместо этого.
 */
export default function ContactCta() {
  const links = (Object.entries(messengers) as [MessengerId, string][]).filter(([, url]) => url);

  return (
    <section id="svyaz" className="border-t border-border py-12 lg:py-24">
      <div className="container-x grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <h2 className="text-[2rem] font-bold leading-tight tracking-[-0.01em] lg:text-[2.75rem]">{contactCta.title}</h2>
          <p className="mt-2 max-w-sm text-text-dim">{contactCta.text}</p>
        </div>

        {/* Телефон — главной кнопкой во всю ширину, мессенджеры — рядом с подписями
            (значок MAX без подписи многие не узнают). На 390 px три в ряд не влезают
            с подписями — переносятся по два. */}
        <div className="grid max-w-xl gap-2 sm:grid-cols-2">
          <a href={`tel:${site.phoneHref}`} className="btn btn-primary h-12 text-base sm:col-span-2">
            <Phone size={18} aria-hidden /> Позвонить {site.phone}
          </a>
          {links.map(([id, url]) => {
            const Icon = messengerIcons[id];
            return (
              <a key={id} href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline h-12 text-base">
                <Icon size={20} /> {messengerLabels[id]}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
