"use client";

import { useEffect, useRef, useState } from "react";
import { Calculator as CalcIcon, Check, Info, Minus, Phone, Plus, RotateCcw } from "lucide-react";
import { calcConfig, calcItems, categories, site, type CalcItem } from "@/lib/site";
import { estimate, formatRub } from "@/lib/format";
import { openRequestPanel, useRequest } from "@/lib/request";

const STEPS = ["Работа", "Объём", "Детали", "Цена"] as const;

/** Ограничить объём рамками единицы и шагом (сотки — целые, метры — по 5). */
function clampQty(item: CalcItem, raw: number): number {
  const u = calcConfig.units[item.unit];
  if (!Number.isFinite(raw) || raw <= 0) return u.default;
  const stepped = Math.round(raw / u.step) * u.step;
  return Math.min(u.max, Math.max(u.min, stepped));
}

/** Работы калькулятора по блокам услуг — в том же порядке, что на главной. */
const groups = categories
  .map((c) => ({ slug: c.slug, title: c.title, items: calcItems.filter((x) => x.categorySlug === c.slug) }))
  .filter((g) => g.items.length > 0);

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Калькулятор. 27.10 (Арслан): структура — как в stroivizion
 * (что делаем → размер → уточнения → расчёт со списком параметров
 * и кнопка звонка; 28.10 форма «Получить точный расчёт» убрана — сайт
 * ничего не отправляет, параметры уходят в «Заявку» и оттуда в мессенджер),
 * а подача своя:
 *  - на главной свёрнут: однотонный кофейный блок-приглашение,
 *    по кнопке раскрывается на месте (.reveal в globals.css). Не отдельная
 *    страница: на телефоне не нужно грузить её и потом возвращаться;
 *  - по одному вопросу на экран вместо формы со всеми полями сразу;
 *    выбор работы и деталей — одним нажатием, без кнопки «Дальше»;
 *  - итог — «смета» строками с точками-выносками и крупной суммой цвета
 *    эспрессо, а не карточка с подложкой.
 *
 * Формула (CLAUDE.md): max(цена «от» из объявления, ставка × объём),
 * округление вверх — lib/format.ts → estimate().
 * СТАВКИ — ПРИМЕР (data/pricing.json → _status), поэтому пометка видна всегда.
 *
 * Поле объёма хранит строку, а не число: иначе при стирании «6» поле
 * мгновенно превращалось бы обратно в число, и набрать «12» было бы нельзя.
 */
export default function Calculator() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [itemId, setItemId] = useState<string | null>(null);
  const [qtyText, setQtyText] = useState("");
  const [where, setWhere] = useState<string | null>(null);
  const [when, setWhen] = useState<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { add, items } = useRequest();

  // После раскрытия и каждого шага: фокус на вопрос (диктор прочтёт его),
  // и если верх калькулятора за экраном — плавно подвести к нему.
  // На телефоне без этого новый шаг мог оказаться выше видимой области.
  useEffect(() => {
    if (!open) return;
    headingRef.current?.focus({ preventScroll: true });
    const top = bodyRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 64 || top > window.innerHeight * 0.6) {
      bodyRef.current?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
    }
  }, [open, step]);

  const item = calcItems.find((x) => x.serviceId === itemId) ?? null;
  const unit = item ? calcConfig.units[item.unit] : null;
  const qty = item ? clampQty(item, Number(qtyText.replace(",", "."))) : 0;
  const total = item ? estimate(item, qty) : 0;
  const minApplies = item ? item.rate * qty < item.priceFrom : false;
  const stored = item ? items.find((x) => x.serviceId === item.serviceId) : undefined;
  // Уточнения шага 3 («В Самаре», «Как можно скорее») — вместе с объёмом
  // уходят в «Заявку» и в текст сообщения.
  const details = [where, when].filter((x): x is string => !!x);
  const sameDetails = (stored?.details ?? []).join("|") === details.join("|");
  // Добавлено, но объём с тех пор поменяли — предлагаем обновить, а не «в заявке».
  const stale = stored && (stored.qty !== qty || stored.estimate !== total || !sameDetails);

  function pick(next: CalcItem) {
    // Другая единица (сотки ↔ метры) или первый выбор — значение по умолчанию.
    if (!item || next.unit !== item.unit) setQtyText(String(calcConfig.units[next.unit].default));
    setItemId(next.serviceId);
    setStep(1);
  }
  const setQty = (n: number) => item && setQtyText(String(clampQty(item, n)));
  const restart = () => setStep(0);

  const question = [
    "Что нужно сделать?",
    unit ? `${unit.question}, ${unit.label}` : "",
    "Где и когда?",
    "Примерный расчёт",
  ][step];

  return (
    <section id="kalkulyator" className="border-t border-border py-12 lg:py-24">
      <div className="container-x">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {/* Приглашение — однотонный кофе, в цвет кнопки «Заявка»
              (28.10 Арслан: «однотонный цвет, а не дерево»; до этого кофе
              с волокнами .wood-plank, ещё раньше светлый дуб).
              Светлый текст на кофе 7.6, приглушённый 7.0. Кнопка светлая:
              графитовая на кофе почти сливается (контраст краёв 2.1).
              Лаконично: заголовок, строка, кнопка — без списка шагов. */}
          <div className="bg-coffee">
            <div className="flex flex-col gap-4 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-10 lg:py-9">
              <div>
                <h2 className="text-[2rem] font-bold leading-tight tracking-[-0.01em] text-on-accent lg:text-[2.75rem]">{calcConfig.invite.title}</h2>
                <p className="mt-1.5 max-w-xl text-[17px] text-on-dark">{calcConfig.invite.text}</p>
              </div>
              {!open && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-expanded={open}
                  aria-controls="calc-body"
                  className="btn h-[52px] w-full shrink-0 bg-surface px-7 text-[17px] text-ink hover:bg-bg sm:w-auto"
                >
                  <CalcIcon size={19} aria-hidden /> {calcConfig.invite.button}
                </button>
              )}
            </div>
          </div>

          <div className="reveal" data-open={open} inert={!open}>
            <div>
              <div id="calc-body" ref={bodyRef} className="mx-auto max-w-3xl px-4 pb-6 pt-5 sm:px-7 sm:pb-8 lg:pt-8">
                {/* Ход расчёта: «Шаг 2 из 4: объём» и полоска из 4 частей. */}
                <div className="flex min-h-10 items-center justify-between gap-3 text-[15px]">
                  <p className="text-text-dim">
                    Шаг {step + 1} из {STEPS.length}: <span className="font-semibold text-ink">{STEPS[step].toLowerCase()}</span>
                  </p>
                  {step > 0 && (
                    <button type="button" onClick={() => setStep(step - 1)} className="inline-flex h-10 items-center px-1 font-semibold text-coffee underline-offset-4 hover:text-ink hover:underline">
                      Назад
                    </button>
                  )}
                </div>
                <div className="mt-1 grid grid-cols-4 gap-1.5" aria-hidden>
                  {STEPS.map((s, i) => (
                    <span key={s} className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-wood" : "bg-border-strong"}`} />
                  ))}
                </div>

                <h3 ref={headingRef} tabIndex={-1} id="calc-question" className="mt-6 text-2xl font-semibold leading-snug outline-none">
                  {question}
                </h3>

                {/* 1. Работа — одно нажатие выбирает и ведёт дальше. */}
                {step === 0 &&
                  groups.map((g) => (
                    <div key={g.slug} className="mt-5">
                      <p className="text-sm font-semibold text-coffee">{g.title}</p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {g.items.map((x) => {
                          const active = x.serviceId === itemId;
                          return (
                            <button
                              key={x.serviceId}
                              type="button"
                              aria-pressed={active}
                              onClick={() => pick(x)}
                              className={`flex min-h-[52px] w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors active:translate-y-px ${
                                active
                                  ? "border-espresso bg-espresso text-on-dark"
                                  : "border-border-strong bg-surface text-ink hover:border-coffee"
                              }`}
                            >
                              <span className="font-semibold leading-snug">{x.label}</span>
                              <span className={`shrink-0 text-sm ${active ? "text-on-dark-dim" : "text-text-dim"}`}>от {formatRub(x.priceFrom)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                {/* 2. Объём — крупное число между «−» и «+», ниже частые значения. */}
                {step === 1 && item && unit && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-border-strong bg-bg p-2">
                      <button type="button" onClick={() => setQty(qty - unit.step)} disabled={qty <= unit.min} aria-label="Меньше" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border-strong bg-surface text-ink transition-colors hover:border-coffee disabled:opacity-40">
                        <Minus size={20} />
                      </button>
                      <label className="flex min-w-0 items-baseline justify-center gap-2">
                        <input
                          inputMode="numeric"
                          aria-labelledby="calc-question"
                          value={qtyText}
                          onChange={(e) => setQtyText(e.target.value.replace(/[^\d.,]/g, ""))}
                          onBlur={() => setQtyText(String(qty))}
                          className="w-[4.5ch] min-w-0 bg-transparent text-center font-display text-[2.75rem] font-bold leading-none text-espresso tabular-nums outline-none"
                        />
                        <span className="text-text-dim">{unit.short}</span>
                      </label>
                      <button type="button" onClick={() => setQty(qty + unit.step)} disabled={qty >= unit.max} aria-label="Больше" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border-strong bg-surface text-ink transition-colors hover:border-coffee disabled:opacity-40">
                        <Plus size={20} />
                      </button>
                    </div>
                    {/* Частые значения — одним рядом равной ширины (на 390 px 6 штук влезают). */}
                    <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${unit.presets.length}, minmax(0, 1fr))` }}>
                      {unit.presets.map((p) => (
                        <button
                          key={p}
                          type="button"
                          aria-pressed={qty === p}
                          onClick={() => setQty(p)}
                          className={`h-11 rounded-md border text-[15px] font-semibold tabular-nums transition-colors active:translate-y-px ${
                            qty === p ? "border-espresso bg-espresso text-on-dark" : "border-border-strong bg-surface text-ink hover:border-coffee"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <p className="mt-4 text-[15px] text-text-dim" aria-live="polite">
                      {item.title}: ориентировочно <span className="font-semibold text-ink">от {formatRub(total)}</span>
                    </p>
                    <button type="button" onClick={() => setStep(2)} className="btn btn-primary mt-5 h-12 w-full px-7 text-base sm:w-auto">
                      Дальше
                    </button>
                  </div>
                )}

                {/* 3. Детали — на цену не влияют, уходят в заявку. */}
                {step === 2 && (
                  <div className="mt-2">
                    <p className="text-[15px] text-text-dim">Необязательно, на цену не влияет.</p>
                    {(["where", "when"] as const).map((key) => {
                      const q = calcConfig.details[key];
                      const value = key === "where" ? where : when;
                      const set = key === "where" ? setWhere : setWhen;
                      return (
                        <fieldset key={key} className="mt-5">
                          <legend className="text-sm font-semibold text-coffee">{q.label}</legend>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {q.options.map((o) => (
                              <button
                                key={o}
                                type="button"
                                aria-pressed={value === o}
                                // Повторное нажатие снимает выбор.
                                onClick={() => set(value === o ? null : o)}
                                className={`inline-flex min-h-11 items-center gap-1.5 rounded-md border px-4 text-[15px] font-medium transition-colors active:translate-y-px ${
                                  value === o ? "border-espresso bg-espresso text-on-dark" : "border-border-strong bg-surface text-ink hover:border-coffee"
                                }`}
                              >
                                {value === o && <Check size={16} aria-hidden />} {o}
                              </button>
                            ))}
                          </div>
                        </fieldset>
                      );
                    })}
                    <button type="button" onClick={() => setStep(3)} className="btn btn-primary mt-6 h-12 w-full px-7 text-base sm:w-auto">
                      Показать цену
                    </button>
                  </div>
                )}

                {/* 4. Итог — «смета»: строки с точками-выносками, сумма крупно. */}
                {step === 3 && item && unit && (
                  <div className="mt-4" aria-live="polite">
                    <dl className="text-[15px]">
                      {[
                        ["Работа", item.title],
                        ["Объём", `${qty} ${unit.short}`],
                        ...(where ? [[calcConfig.details.where.label, where]] : []),
                        ...(when ? [[calcConfig.details.when.label, when]] : []),
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-baseline gap-2 py-1.5">
                          <dt className="shrink-0 text-text-dim">{k}</dt>
                          <span aria-hidden className="min-w-4 flex-1 translate-y-[-0.25em] border-b border-dotted border-border-strong" />
                          <dd className="max-w-[65%] text-right font-medium text-ink">{v}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-t-2 border-espresso pt-4">
                      <p className="text-text-dim">ориентировочно</p>
                      <p className="font-display text-[2.5rem] font-bold leading-none text-espresso tabular-nums">от {formatRub(total)}</p>
                    </div>
                    <p className="mt-2 text-right text-sm text-text-dim">
                      {minApplies ? `Минимальный заказ: ${formatRub(item.priceFrom)}` : `${formatRub(item.rate)} × ${qty} ${unit.short}`}
                    </p>
                    {/* Пометка о примере — строкой со значком, а не плашкой внутри
                        карточки (аудит Hallmark: «карточка в карточке»). */}
                    <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-text">
                      <Info size={17} className="mt-0.5 shrink-0 text-coffee" aria-hidden />
                      {calcConfig.demoNote}
                    </p>

                    <a href={`tel:${site.phoneHref}`} className="btn btn-primary mt-5 h-12 w-full px-7 text-base sm:w-auto">
                      <Phone size={18} aria-hidden /> Уточнить точную цену
                    </a>

                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
                      {stored && !stale ? (
                        <button type="button" onClick={openRequestPanel} className="inline-flex h-10 items-center gap-1.5 font-semibold text-coffee hover:text-ink">
                          <Check size={17} aria-hidden /> Открыть заявку
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => add({ serviceId: item.serviceId, qty, unit: item.unit, estimate: total, details })}
                          className="inline-flex h-10 items-center gap-1.5 font-semibold text-coffee hover:text-ink"
                        >
                          <Plus size={17} aria-hidden /> {stale ? "Обновить в заявке" : "Добавить в заявку"}
                        </button>
                      )}
                      <button type="button" onClick={restart} className="inline-flex h-10 items-center gap-1.5 font-semibold text-text-dim hover:text-ink">
                        <RotateCcw size={16} aria-hidden /> Другая работа
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* 28.10: мелкая строка под калькулятором — видна и у свёрнутого. */}
        <p className="mt-3 text-sm text-text-dim">{calcConfig.footNote}</p>
      </div>
    </section>
  );
}
