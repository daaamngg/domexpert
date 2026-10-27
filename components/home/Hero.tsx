import { Phone } from "lucide-react";
import { hero, heroImage, site } from "@/lib/site";
import { HERO_CTA_ID } from "@/lib/ids";
import SmartImage from "@/components/SmartImage";
import PhotoChip from "@/components/PhotoChip";

/**
 * Первый экран. 26.10 упрощён по critique impeccable и просьбе Арслана:
 * слоган, одна строка, одна кнопка («Позвонить нам») + номер текстом, одно фото.
 * Плашка с регионом, галочки и мессенджеры отсюда переехали ниже
 * (content.json → hero._movedNote) — в «Почему мы», «Контакты», шапку и нижнюю панель.
 *
 * Композиция на компьютере — не «текст слева по центру, фото справа»
 * (шаблон): текст прижат к НИЗУ фото, слоган крупный и задаёт строку.
 */
export default function Hero() {
  return (
    <section id="hero" className="pb-14 pt-10 sm:pt-14 lg:pb-24 lg:pt-20">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_400px] lg:items-end lg:gap-16">
        <div>
          {/* Кегль подобран так, чтобы слоган на 360–390 px шёл в 3 строки,
              а не в 4 с одиноким «привезём». Текст слогана не трогаем. */}
          <h1 className="text-[clamp(2.125rem,9.6vw,2.5rem)] font-bold leading-[1.06] tracking-[-0.015em] sm:text-[3.5rem] lg:text-[4.5rem] lg:leading-[1.02]">
            {hero.title}
          </h1>
          <p className="mt-4 max-w-[34ch] text-[17px] leading-relaxed text-text sm:text-lg lg:mt-6">{hero.subtitle}</p>

          {/* Одна кнопка и номер текстом. Номер виден сразу — людям постарше
              важно увидеть его, записать или набрать с другого телефона.
              27.10 (Арслан): на телефоне номер стоит вплотную под кнопкой,
              крупно, шрифтом заголовков и по центру её ширины — читается как
              подпись к кнопке, а не отдельная ссылка. Шире — рядом с кнопкой. */}
          <div id={HERO_CTA_ID} className="mt-7 inline-flex flex-col items-stretch sm:flex-row sm:items-center sm:gap-6 lg:mt-9">
            <a href={`tel:${site.phoneHref}`} className="btn btn-primary h-[52px] px-7 text-[17px]">
              <Phone size={18} aria-hidden /> Позвонить нам
            </a>
            <a
              href={`tel:${site.phoneHref}`}
              className="mt-1 inline-flex min-h-11 items-center justify-center whitespace-nowrap font-display text-[1.625rem] font-bold leading-none tracking-[-0.01em] text-ink tabular-nums transition-colors hover:text-coffee sm:mt-0 lg:text-[1.75rem]"
            >
              {site.phone}
            </a>
          </div>
        </div>

        {heroImage && (
          <div className="relative overflow-hidden rounded-lg">
            <SmartImage
              src={heroImage}
              alt={hero.imageAlt}
              priority
              sizes="(min-width: 1024px) 400px, 100vw"
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/10] lg:aspect-[4/5]"
            />
            <PhotoChip serviceId={hero.imageService} className="absolute inset-x-0 bottom-0" />
          </div>
        )}
      </div>
    </section>
  );
}
