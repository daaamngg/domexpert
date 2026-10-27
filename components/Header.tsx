"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { nav, site, messengers, messengerLabels, type MessengerId } from "@/lib/site";
import { messengerIcons } from "@/components/icons";
import RequestButton from "@/components/request/RequestButton";

/**
 * Закреплённая шапка.
 * Телефон: на компьютере — номер и мессенджеры прямо в шапке;
 * на телефоне — только название и меню, звонок живёт в нижней панели (ContactBar).
 */
export default function Header() {
  const [open, setOpen] = useState(false);

  // Меню открыто — фон не прокручивается, Esc закрывает.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = (Object.entries(messengers) as [MessengerId, string][]).filter(([, url]) => url);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-bg">
      <div className="container-x flex h-14 items-center justify-between gap-4 lg:h-16">
        {/* Логотипа у Сергея нет. Значок-домик в зелёном квадрате убран 26.10 —
            это самая шаблонная деталь шапки (critique impeccable). Название
            шрифтом честнее, чем выдуманный знак. */}
        <Link href="/" className="font-display text-lg font-bold leading-none tracking-[-0.01em] text-ink lg:text-xl" onClick={() => setOpen(false)}>
          {site.name}
        </Link>

        <nav className="hidden items-center gap-7 text-[15px] lg:flex" aria-label="Основное меню">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-text transition-colors hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {links.map(([id, url]) => {
            const Icon = messengerIcons[id];
            return (
              <a key={id} href={url} target="_blank" rel="noopener noreferrer" aria-label={messengerLabels[id]} className="icon-btn">
                <Icon size={18} />
              </a>
            );
          })}
          <RequestButton variant="header" />
          {/* В шапке — кнопка без номера: номер текстом стоит в первом экране,
              иначе на компьютере позвонить предлагали трижды на одном экране. */}
          <a href={`tel:${site.phoneHref}`} className="btn btn-primary ml-1 h-10 px-4 text-[15px]">
            <Phone size={16} aria-hidden /> Позвонить нам
          </a>
        </div>

        <button
          type="button"
          className="icon-btn -mr-2 lg:hidden"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" className="border-t border-border bg-bg lg:hidden" aria-label="Меню">
          <ul className="container-x flex flex-col py-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="block py-3 text-lg text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="container-x border-t border-border py-4 text-sm text-text-dim">
            <a href={`tel:${site.phoneHref}`} className="text-base font-semibold text-ink">{site.phone}</a>
            <p className="mt-1">{site.region}</p>
          </div>
        </nav>
      )}
    </header>
  );
}
