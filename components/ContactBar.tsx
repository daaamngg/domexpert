"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { site, messengers, messengerLabels } from "@/lib/site";
import { TelegramIcon, MaxIcon } from "@/components/icons";
import { HERO_CTA_ID } from "@/lib/ids";

/**
 * Нижняя панель на телефоне: «Позвонить / Telegram / MAX» всегда под пальцем.
 * На компьютере скрыта — там то же самое в шапке.
 *
 * На главной панель прячется, пока видны кнопки первого экрана: иначе на
 * первом экране было две одинаковые «Позвонить нам» подряд. Уехали кнопки
 * за край — панель выезжает снизу. На остальных страницах видна сразу.
 * Место под панель зарезервировано в body (padding-bottom в globals.css),
 * поэтому её появление ничего не сдвигает.
 */
export default function ContactBar() {
  const isHome = usePathname() === "/";
  // По умолчанию считаем кнопки первого экрана видимыми — на главной панель
  // не мелькает при загрузке. Наблюдатель сразу сообщит настоящее состояние.
  const [ctaVisible, setCtaVisible] = useState(true);

  useEffect(() => {
    if (!isHome) return;
    const cta = document.getElementById(HERO_CTA_ID);
    if (!cta) return;
    const io = new IntersectionObserver(([entry]) => setCtaVisible(entry.isIntersecting));
    io.observe(cta);
    return () => io.disconnect();
  }, [isHome]);

  const show = !isHome || !ctaVisible;

  return (
    <div
      className={`contact-bar fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      // Спрятанная панель не должна ловить Tab и читаться экранным диктором.
      inert={!show}
    >
      <div className="container-x flex items-center gap-2 py-2">
        <a href={`tel:${site.phoneHref}`} className="btn btn-primary h-12 flex-1 text-base">
          <Phone size={18} aria-hidden /> Позвонить нам
        </a>
        {messengers.telegram && (
          <a href={messengers.telegram} target="_blank" rel="noopener noreferrer" aria-label={`Написать в ${messengerLabels.telegram}`} className="btn btn-outline h-12 w-12 px-0">
            <TelegramIcon size={22} />
          </a>
        )}
        {messengers.max && (
          <a href={messengers.max} target="_blank" rel="noopener noreferrer" aria-label={`Написать в ${messengerLabels.max}`} className="btn btn-outline h-12 w-12 px-0">
            <MaxIcon size={22} />
          </a>
        )}
      </div>
    </div>
  );
}
