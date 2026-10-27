"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Phone, Trash2, X } from "lucide-react";
import { calcConfig, getService, messengerLabels, messengers, site } from "@/lib/site";
import { formatRub, priceLabel } from "@/lib/format";
import { OPEN_REQUEST_EVENT, useRequest, type RequestItem } from "@/lib/request";
import { MaxIcon, TelegramIcon } from "@/components/icons";
import LeadForm from "@/components/request/LeadForm";

/** «Покос травы, 6 соток — ориентировочно от 2 400 ₽» */
function lineFor(item: RequestItem): { title: string; detail: string } | null {
  const found = getService(item.serviceId);
  if (!found) return null;
  const s = found.service;
  if (item.qty && item.unit) {
    const unit = calcConfig.units[item.unit];
    const est = item.estimate ? `, ориентировочно от ${formatRub(item.estimate)}` : "";
    return { title: s.title, detail: `${item.qty} ${unit.short}${est}` };
  }
  return { title: s.title, detail: priceLabel(s) };
}

/**
 * Панель «Ваша заявка» — нативный <dialog>: Esc, фокус внутри и подложка
 * работают сами, без библиотек. Открывается событием (openRequestPanel).
 *
 * 27.10: внутри — форма заявки с отмеченными услугами (данные пока никуда
 * не уходят, см. TODO в LeadForm). Ниже запасной путь: позвонить, написать
 * в мессенджер или скопировать список.
 */
export default function RequestPanel() {
  const ref = useRef<HTMLDialogElement>(null);
  const { items, remove, clear } = useRequest();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const open = () => ref.current?.showModal();
    window.addEventListener(OPEN_REQUEST_EVENT, open);
    return () => window.removeEventListener(OPEN_REQUEST_EVENT, open);
  }, []);

  const lines = items.map((it) => ({ it, line: lineFor(it) })).filter((x) => x.line);

  async function copy() {
    const text =
      "Здравствуйте! Хочу заказать:\n" +
      lines.map(({ line }) => `— ${line!.title} (${line!.detail})`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Буфер обмена недоступен (старый браузер, запрет) — молча ничего не делаем,
      // список и так виден на экране.
    }
  }

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

            {/* Форма берёт услуги из заявки. Данные пока никуда не уходят — TODO в LeadForm. */}
            <div className="mt-4">
              <LeadForm services={items.map((it) => it.serviceId)} />
            </div>

            <p className="mt-6 text-sm text-text-dim">Или свяжитесь с нами сами: список можно скопировать в сообщение. {site.freeConsultation}.</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href={`tel:${site.phoneHref}`} className="btn btn-primary h-12 text-base">
                <Phone size={18} aria-hidden /> Позвонить нам
              </a>
              <button type="button" onClick={copy} className="btn btn-outline h-12 text-base" aria-live="polite">
                <Copy size={18} aria-hidden /> {copied ? "Скопировано" : "Скопировать список"}
              </button>
              <div className="flex gap-2">
                {messengers.telegram && (
                  <a href={messengers.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-outline h-12 flex-1 text-base">
                    <TelegramIcon size={20} /> {messengerLabels.telegram}
                  </a>
                )}
                {messengers.max && (
                  <a href={messengers.max} target="_blank" rel="noopener noreferrer" className="btn btn-outline h-12 flex-1 text-base">
                    <MaxIcon size={20} /> {messengerLabels.max}
                  </a>
                )}
              </div>
              <button type="button" onClick={clear} className="mt-1 self-center text-sm text-text-dim underline underline-offset-4 hover:text-coffee">
                Очистить заявку
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
