"use client";

import { Check, Plus } from "lucide-react";
import { useRequest } from "@/lib/request";

/** Кнопка «добавить в заявку» в строке услуги. Повторное нажатие убирает услугу. */
export default function AddToRequest({ serviceId, title }: { serviceId: string; title: string }) {
  const { has, add, remove } = useRequest();
  const added = has(serviceId);

  return (
    <button
      type="button"
      onClick={() => (added ? remove(serviceId) : add({ serviceId }))}
      aria-pressed={added}
      aria-label={added ? `Убрать «${title}» из заявки` : `Добавить «${title}» в заявку`}
      className={`inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-colors sm:px-4 ${
        added
          ? "border-accent bg-accent text-on-accent hover:bg-accent-deep"
          : "border-border-strong bg-surface text-ink hover:border-coffee hover:text-coffee"
      }`}
    >
      {added ? <Check size={17} strokeWidth={2.5} aria-hidden /> : <Plus size={17} strokeWidth={2.5} aria-hidden />}
      {/* На телефоне — только значок (строка узкая), шире — со словом. */}
      <span className="hidden sm:inline">{added ? "В заявке" : "Добавить"}</span>
    </button>
  );
}
