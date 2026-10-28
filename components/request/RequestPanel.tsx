"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Phone, Trash2, X } from "lucide-react";
import { calcConfig, getService, messengerLabels, messengers, site } from "@/lib/site";
import { formatRub, priceLabel } from "@/lib/format";
import { OPEN_REQUEST_EVENT, useRequest, type RequestItem } from "@/lib/request";
import { copyText } from "@/lib/clipboard";
import { MaxIcon, TelegramIcon } from "@/components/icons";

/** «Покос травы, 6 соток — ориентировочно от 2 400 ₽» */
function lineFor(item: RequestItem): { title: string; detail: string; short: string } | null {
  const found = getService(item.serviceId);
  if (!found) return null;
  const s = found.service;
  if (item.qty && item.unit) {
    const unit = calcConfig.units[item.unit];
    const est = item.estimate ? `, ориентировочно от ${formatRub(item.estimate)}` : "";
    // «В Самаре» → «в Самаре»: внутри скобок со строчной, имена собственные не трогаем.
    const extra = (item.details ?? []).map((d) => `, ${d.charAt(0).toLowerCase()}${d.slice(1)}`).join("");
    // short — для сообщения в мессенджер: объём и уточнения, без цены
    // (цена ориентировочная, точную называет Сергей после разговора).
    return { title: s.title, detail: `${item.qty} ${unit.short}${extra}${est}`, short: `${s.title} (${item.qty} ${unit.short}${extra})` };
  }
  return { title: s.title, detail: priceLabel(s), short: s.title };
}

type Copied = "ok" | "fail" | null;

/**
 * Панель «Ваша заявка» — нативный <dialog>: Esc, фокус внутри и подложка
 * работают сами, без библиотек. Открывается событием (openRequestPanel).
 *
 * 28.10: формы с именем и телефоном больше нет — сайт ничего не отправляет
 * на сервер. Вместо неё три кнопки: Telegram и MAX копируют в буфер
 * «Здравствуйте! Интересуют услуги: …» и открывают чат (вставить и отправить
 * человек может сам), «Позвонить» открывает звонок, а панель со списком
 * остаётся на экране — по нему удобно диктовать.
 * Форма лежит в components/request/LeadForm.tsx, вернуть — см. там.
 */
export default function RequestPanel() {
  const ref = useRef<HTMLDialogElement>(null);
  const { items, remove, clear } = useRequest();
  const [copied, setCopied] = useState<Copied>(null);

  useEffect(() => {
    const dialog = ref.current;
    // Уже открыта — повторный showModal() бросил бы ошибку.
    const open = () => {
      if (dialog && !dialog.open) dialog.showModal();
    };
    // Подсказку «скопировано» прячем при закрытии: в следующий раз список может быть другим.
    const reset = () => setCopied(null);
    window.addEventListener(OPEN_REQUEST_EVENT, open);
    dialog?.addEventListener("close", reset);
    return () => {
      window.removeEventListener(OPEN_REQUEST_EVENT, open);
      dialog?.removeEventListener("close", reset);
    };
  }, []);

  const lines = items.map((it) => ({ it, line: lineFor(it) })).filter((x) => x.line);
  const message = `Здравствуйте! Интересуют услуги: ${lines.map(({ line }) => line!.short).join(", ")}`;

  // Обработчик НЕ отменяет переход по ссылке: копирование запускается
  // в момент нажатия (так браузер его разрешает), а чат открывается как
  // обычная ссылка — без window.open, который блокируют на телефонах.
  function copyMessage() {
    copyText(message).then((ok) => setCopied(ok ? "ok" : "fail"));
  }

  const chats = [
    { id: "telegram", url: messengers.telegram, Icon: TelegramIcon },
    { id: "max", url: messengers.max, Icon: MaxIcon },
  ] as const;

  return (
    <dialog
      ref={ref}
      aria-labelledby="request-title"
      // Клик по подложке закрывает панель (сама <dialog> так не умеет).
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="request-dialog m-0 mt-auto w-full max-w-none bg-surface p-0 text-text sm:m-auto sm:max-w-md sm:rounded-xl"
    >
      <div className="max-h-[85dvh] overflow-y-auto p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="request-title" className="text-2xl font-bold">Ваша заявка</h2>
          <button type="button" onClick={() => ref.current?.close()} aria-label="Закрыть" className="icon-btn -mr-2 -mt-1">
            <X size={22} />
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="mt-3 text-text-dim">Пока пусто. Отметьте услуги кнопкой «+» на страницах услуг или в калькуляторе.</p>
        ) : (
          <>
            <ul className="mt-3 divide-y divide-border">
              {lines.map(({ it, line }) => (
                <li key={it.serviceId} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug text-ink">{line!.title}</p>
                    <p className="text-sm text-text-dim">{line!.detail}</p>
                  </div>
                  <button type="button" onClick={() => remove(it.serviceId)} aria-label={`Убрать «${line!.title}»`} className="icon-btn shrink-0 text-text-dim">
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-sm text-text-dim">
              Напишите нам: список услуг скопируется в сообщение. Или позвоните. {site.freeConsultation}.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {chats.map(({ id, url, Icon }) =>
                url ? (
                  <a key={id} href={url} target="_blank" rel="noopener noreferrer" onClick={copyMessage} className="btn btn-primary h-12 text-base">
                    <Icon size={20} /> Написать в {messengerLabels[id]}
                  </a>
                ) : null,
              )}
              <a href={`tel:${site.phoneHref}`} className="btn btn-outline h-12 text-base">
                <Phone size={18} aria-hidden /> Позвонить
              </a>

              {/* Подсказка после копирования. Живая область — диктор зачитает её сам. */}
              <p role="status" className="min-h-6 text-center text-sm">
                {copied === "ok" && (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                    <Check size={16} strokeWidth={2.6} className="text-coffee" aria-hidden /> Текст скопирован, вставьте его в чат
                  </span>
                )}
                {copied === "fail" && <span className="text-text">Не удалось скопировать, перечислите услуги в чате сами</span>}
              </p>

              <button type="button" onClick={clear} className="self-center text-sm text-text-dim underline underline-offset-4 hover:text-coffee">
                Очистить заявку
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
