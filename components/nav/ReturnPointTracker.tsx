"use client";

import { useEffect } from "react";
import { setReturnPoint } from "@/lib/return-point";

/**
 * Стоит на главной. Ловит клики по ссылкам на внутренние страницы
 * (услуги и «Смотреть все услуги») и запоминает,
 * из какого блока (section[id]) ушёл человек. Один слушатель на весь документ —
 * не нужно трогать каждую ссылку в каждом блоке.
 * Ссылка вне блоков (футер) — запоминаем «ничего»: вернём в начало страницы.
 */
export default function ReturnPointTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="/uslugi/"], a[href="/raboty"]');
      if (!link) return;
      const section = link.closest("main section[id]");
      setReturnPoint(section?.id ?? null);
    };
    // capture: запоминаем раньше, чем роутер Next начнёт переход.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
