"use client";

// ============================================================
//  «Заявка» — услуги, которые посетитель отметил на сайте.
//
//  Хранится в браузере посетителя (localStorage), на сервер не уходит.
//  Формы отправки нет (28.10 убрана совсем): панель копирует список
//  в буфер и открывает Telegram или MAX, либо звонок. Если потом
//  вернём форму заявки — она возьмёт те же items.
//
//  Сделано через useSyncExternalStore, а не через useState + useEffect:
//  все компоненты (кнопки «+», счётчик в шапке, панель) видят один и тот же
//  список и обновляются сразу, а при серверной отрисовке список пуст —
//  разметка сервера и браузера не расходится.
// ============================================================

import { useSyncExternalStore } from "react";
import type { UnitId } from "@/lib/site";

export type RequestItem = {
  serviceId: string;
  /** Объём из калькулятора (если добавлено оттуда). */
  qty?: number;
  unit?: UnitId;
  /** Ориентировочная цена из калькулятора, ₽. */
  estimate?: number;
  /** Уточнения из калькулятора: «Где: в городе», «Когда: на этой неделе». */
  details?: string[];
};

const KEY = "de:zayavka:v1";
const EMPTY: RequestItem[] = [];

let items: RequestItem[] | null = null;
const listeners = new Set<() => void>();

function load(): RequestItem[] {
  if (items) return items;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    items = Array.isArray(parsed) ? parsed.filter((x) => typeof x?.serviceId === "string") : [];
  } catch {
    // Приватный режим, запрет хранилища, битые данные — просто пустой список.
    items = [];
  }
  return items!;
}

function save(next: RequestItem[]) {
  items = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Не сохранилось — список всё равно живёт до перезагрузки страницы.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Список, изменённый в другой вкладке, подхватываем тоже.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    items = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useRequest() {
  const list = useSyncExternalStore(subscribe, load, () => EMPTY);
  return {
    items: list,
    count: list.length,
    has: (serviceId: string) => list.some((x) => x.serviceId === serviceId),
    /** Добавить или обновить (из калькулятора приходит объём — перезаписываем). */
    add: (item: RequestItem) =>
      save([...load().filter((x) => x.serviceId !== item.serviceId), item]),
    remove: (serviceId: string) => save(load().filter((x) => x.serviceId !== serviceId)),
    clear: () => save([]),
  };
}

/** Открыть панель заявки из любого места (кнопка в шапке, плашка внизу, калькулятор). */
export const OPEN_REQUEST_EVENT = "de:request:open";
export function openRequestPanel() {
  window.dispatchEvent(new Event(OPEN_REQUEST_EVENT));
}
