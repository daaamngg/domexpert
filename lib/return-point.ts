"use client";

// ============================================================
//  «Откуда пришли» — блок главной, из которого человек открыл страницу услуг.
//  Кнопка «На главную» возвращает ровно к этому блоку (/#uslugi, /#raboty…).
//
//  Хранится в ПАМЯТИ вкладки (переменная модуля), а не в localStorage:
//  при переходах внутри сайта память живёт, а если человек зашёл на страницу
//  по прямой ссылке или обновил её — память пуста, и кнопка ведёт в начало
//  главной. Ровно это и нужно: «пришёл с блока → к блоку, напрямую → наверх».
// ============================================================

import { useSyncExternalStore } from "react";

let point: string | null = null;
const listeners = new Set<() => void>();

export function setReturnPoint(id: string | null) {
  point = id;
  listeners.forEach((l) => l());
}

export function useReturnPoint(): string | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => point,
    // На сервере никто никуда не кликал.
    () => null,
  );
}
