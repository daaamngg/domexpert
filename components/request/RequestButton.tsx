"use client";

import { ClipboardList } from "lucide-react";
import { openRequestPanel, useRequest } from "@/lib/request";

/**
 * Кнопка «Заявка» с числом услуг. Пустая заявка — кнопки нет: незачем занимать место.
 * variant="header" — в шапке на компьютере; "floating" — плашка на телефоне
 * над нижней панелью звонка.
 */
export default function RequestButton({ variant }: { variant: "header" | "floating" }) {
  const { count } = useRequest();
  if (count === 0) return null;

  if (variant === "header") {
    return (
      <button type="button" onClick={openRequestPanel} className="btn btn-outline h-10 px-4 text-[15px]">
        <ClipboardList size={17} aria-hidden /> Заявка <Count n={count} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openRequestPanel}
      className="request-fab fixed right-4 z-30 inline-flex h-11 items-center gap-2 rounded-full bg-coffee px-4 text-[15px] font-semibold text-on-accent shadow-fab lg:hidden"
    >
      <ClipboardList size={17} aria-hidden /> Заявка <Count n={count} />
    </button>
  );
}

/** Число услуг в заявке — отдельным кружком, а не «Заявка · 3». */
function Count({ n }: { n: number }) {
  return (
    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-current px-1.5 text-[13px] leading-none tabular-nums">
      {n}
    </span>
  );
}
