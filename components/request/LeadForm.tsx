"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";
import { categories, getService } from "@/lib/site";

/** Телефон: 11 цифр с 7/8 в начале или 10 цифр с 9 → «+7 (939) 700-12-22». null — не похоже на номер. */
function normalizePhone(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && (d[0] === "7" || d[0] === "8")) d = d.slice(1);
  if (d.length !== 10 || d[0] !== "9") return null;
  return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8)}`;
}

const NOT_SURE = "Не знаю, нужна консультация";
const COMMENT_MAX = 500;

type Errors = Partial<Record<"name" | "phone" | "service" | "consent", string>>;

/**
 * Форма заявки: имя, телефон, услуга, комментарий, согласие.
 * СЕЙЧАС ДАННЫЕ НИКУДА НЕ УХОДЯТ — после проверки показываем «Спасибо»
 * (просьба Арслана 27.10: бэкенд сделаем, когда начнём работать с Сергеем).
 *
 * services — услуги из «Заявки» (панель): тогда вместо выбора услуги
 * показываем список отмеченного. Без services — обычный выбор одной услуги.
 * details — параметры из калькулятора («Объём: 6 соток»): показываем
 * и отправляем вместе с заявкой, как в stroivizion, чтобы не спрашивать дважды.
 */
export default function LeadForm({ services, details }: { services?: string[]; details?: string[] }) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [comment, setComment] = useState("");

  const fromRequest = services?.length ? services.map((id) => getService(id)?.service.title).filter(Boolean) : null;

  function validate(fd: FormData): Errors {
    const e: Errors = {};
    const name = String(fd.get("name") ?? "").trim();
    if (name.length < 2) e.name = "Напишите, как к вам обращаться";
    if (!normalizePhone(String(fd.get("phone") ?? ""))) e.phone = "Проверьте номер: например, +7 939 700-12-22";
    if (!fromRequest && !fd.get("service")) e.service = "Выберите услугу или «Не знаю»";
    if (!fd.get("consent")) e.consent = "Нужно согласие, чтобы мы могли ответить";
    return e;
  }

  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) {
      // Фокус на первое поле с ошибкой — экранный диктор зачитает подсказку.
      const first = Object.keys(e)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const payload = {
      name: String(fd.get("name")).trim(),
      phone: normalizePhone(String(fd.get("phone")))!,
      services: fromRequest ?? [String(fd.get("service"))],
      details: details ?? [],
      comment: comment.trim(),
    };

    // TODO(бэкенд): отправка заявки. Сейчас payload никуда не уходит — сознательно.
    // Когда начнём работать с Сергеем полноценно:
    //  1. Отправлять POST на свою функцию (как в stroivizion: yandex-function/,
    //     Yandex Cloud Functions), а оттуда — в сообщения группы ВК или на почту в РФ.
    //     НЕ слать персональные данные напрямую в Telegram (152-ФЗ, с 01.07.2025).
    //  2. Добавить страницу политики обработки персональных данных и ссылку на неё
    //     в подписи у галочки согласия.
    //  3. Защита от спама (honeypot-поле + ограничение частоты на стороне функции).
    //  4. Показывать «Спасибо» только после ответа сервера, а при ошибке — текст
    //     с номером телефона, чтобы заявка не потерялась.
    void payload;

    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-surface-2 p-5" role="status">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent" aria-hidden>
          <Check size={16} strokeWidth={2.6} />
        </span>
        <p className="font-display text-xl font-semibold leading-snug text-ink">Спасибо, мы свяжемся с вами</p>
      </div>
    );
  }

  const field = "mt-1.5 block w-full rounded-lg border bg-surface px-3.5 text-[16px] text-ink placeholder:text-text-dim focus:border-coffee";
  const err = (k: keyof Errors) => (errors[k] ? "border-danger" : "border-border-strong");
  const errText = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className="mt-1 text-sm text-danger">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-4">
      <div>
        <label htmlFor={`${uid}-name`} className="text-sm font-semibold text-ink">Имя</label>
        <input
          id={`${uid}-name`} name="name" autoComplete="name" maxLength={60}
          aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-err` : undefined}
          className={`${field} h-12 ${err("name")}`}
        />
        {errText("name")}
      </div>

      <div>
        <label htmlFor={`${uid}-phone`} className="text-sm font-semibold text-ink">Телефон</label>
        <input
          id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 900 000-00-00"
          aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
          // Приводим номер к одному виду, когда человек ушёл из поля.
          onBlur={(e) => {
            const n = normalizePhone(e.currentTarget.value);
            if (n) e.currentTarget.value = n;
          }}
          className={`${field} h-12 ${err("phone")}`}
        />
        {errText("phone")}
      </div>

      {fromRequest ? (
        <div>
          <p className="text-sm font-semibold text-ink">Услуги</p>
          <p className="mt-1 text-[15px] text-text">{fromRequest.join(", ")}</p>
          {details?.length ? <p className="mt-1 text-sm text-text-dim">{details.join(", ")}</p> : null}
        </div>
      ) : (
        <div>
          <label htmlFor={`${uid}-service`} className="text-sm font-semibold text-ink">Услуга</label>
          <select
            id={`${uid}-service`} name="service" defaultValue=""
            aria-invalid={!!errors.service} aria-describedby={errors.service ? `${uid}-service-err` : undefined}
            className={`${field} h-12 ${err("service")}`}
          >
            <option value="" disabled>Выберите…</option>
            <option value={NOT_SURE}>{NOT_SURE}</option>
            {categories.map((c) => (
              <optgroup key={c.slug} label={c.title}>
                {c.services.map((s) => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
              </optgroup>
            ))}
          </select>
          {errText("service")}
        </div>
      )}

      <div>
        <label htmlFor={`${uid}-comment`} className="text-sm font-semibold text-ink">
          Комментарий <span className="font-normal text-text-dim">(необязательно)</span>
        </label>
        <textarea
          id={`${uid}-comment`} name="comment" rows={3} maxLength={COMMENT_MAX}
          value={comment} onChange={(e) => setComment(e.target.value)}
          placeholder="Например: участок 8 соток, нужно к выходным"
          className={`${field} resize-y border-border-strong py-3`}
        />
        <p className="mt-1 text-right text-xs text-text-dim">{comment.length} / {COMMENT_MAX}</p>
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-text">
          <input
            type="checkbox" name="consent"
            aria-invalid={!!errors.consent} aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--accent)]"
          />
          {/* TODO(бэкенд): ссылка на политику обработки персональных данных. */}
          Согласен на обработку персональных данных для ответа на заявку
        </label>
        {errText("consent")}
      </div>

      <button type="submit" className="btn btn-primary h-12 text-base">
        <Send size={18} aria-hidden /> Отправить заявку
      </button>
    </form>
  );
}
