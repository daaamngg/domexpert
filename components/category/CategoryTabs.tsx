"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Category } from "@/lib/site";

/**
 * Лента-переключатель категорий (горизонтальный скролл на телефоне).
 * Текущая категория прокручивается в середину ленты — иначе на «Подборе
 * персонала» активная вкладка оказывалась бы за правым краем экрана.
 */
export default function CategoryTabs({ items, current }: { items: Pick<Category, "slug" | "title">[]; current: string }) {
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [current]);

  return (
    <nav aria-label="Категории услуг" className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-2">
        {items.map((c) => {
          const active = c.slug === current;
          return (
            <li key={c.slug}>
              <Link
                ref={active ? activeRef : undefined}
                href={`/uslugi/${c.slug}`}
                scroll={false}
                aria-current={active ? "page" : undefined}
                className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
                  active
                    ? "border-accent bg-accent text-on-accent"
                    : "border-border-strong bg-surface text-ink hover:border-coffee hover:text-coffee"
                }`}
              >
                {c.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
