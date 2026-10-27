"use client";

import Link from "next/link";
import { House } from "lucide-react";
import { useReturnPoint } from "@/lib/return-point";

/**
 * Кнопка «На главную» на внутренних страницах.
 * Пришёл с блока главной → возвращает к этому блоку (/#uslugi и т.п.);
 * зашёл напрямую или обновил страницу → в начало главной (lib/return-point.ts).
 * Обычная ссылка, не history.back(): работает и у того, кто пришёл из поиска,
 * а кнопка «назад» браузера остаётся сама по себе.
 */
export default function BackToHome() {
  const from = useReturnPoint();
  return (
    <Link
      href={from ? `/#${from}` : "/"}
      className="btn btn-outline h-10 gap-1.5 px-4 text-[15px]"
    >
      <House size={17} aria-hidden /> На главную
    </Link>
  );
}
