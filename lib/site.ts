// ============================================================
//  Тонкий загрузчик данных. РЕДАКТИРОВАТЬ ДАННЫЕ НУЖНО В /data:
//    data/contacts.json — контакты и данные компании
//    data/services.json — категории и услуги с ценами
//    data/pricing.json  — калькулятор: ставки (демо) и единицы
//    data/content.json  — тексты главной
//  Здесь только типы и вспомогательные функции — цифр и текстов нет.
// ============================================================

import contactsData from "@/data/contacts.json";
import servicesData from "@/data/services.json";
import pricingData from "@/data/pricing.json";
import contentData from "@/data/content.json";

/* ---------- Компания и контакты ---------- */

export const site = contactsData;

export type MessengerId = "telegram" | "max" | "vk";

/** Пустая ссылка = кнопка не показывается. Правится в data/contacts.json. */
export const messengers = contactsData.messengers as Partial<Record<MessengerId, string>>;

export const messengerLabels: Record<MessengerId, string> = {
  telegram: "Telegram",
  max: "MAX",
  vk: "ВКонтакте",
};

/* ---------- Навигация ---------- */

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Услуги", href: "/#uslugi" },
  { label: "Калькулятор", href: "/#kalkulyator" },
  { label: "Наши работы", href: "/#raboty" },
  { label: "Заявка", href: "/#zayavka" },
  { label: "Контакты", href: "/#kontakty" },
];

/* ---------- Услуги ---------- */

export type CategoryIcon = "brush" | "sprout" | "tree" | "fence" | "axe" | "wrench";

export type Service = {
  id: string;
  title: string;
  /** null — цены в объявлениях нет, на сайте «цена по звонку». */
  priceFrom: number | null;
  /** Пояснение под ценой: «Зависит от объёма». */
  note?: string;
  /** Миниатюра в строке услуги; пусто — заглушка. */
  image?: string;
  /** Единица цены не подтверждена — показываем цену без единицы. */
  unitPending?: boolean;
};

export type Category = {
  slug: string;
  title: string;
  icon: CategoryIcon;
  /** Короткие подписи услуг на плитке главной: «Листва · Снег · Покос». */
  tags: string[];
  /** Одна строка о блоке (страница категории, футер). */
  short: string;
  /** Вступление на странице категории. */
  intro: string;
  /** Пусто — заглушка «Фото скоро». */
  image: string;
  services: Service[];
  /** Подробности списком «название — значение» (сейчас только у дров). */
  details?: { label: string; value: string }[];
};

type Hideable<T> = T & { hidden?: boolean };

/** Категории и услуги, видимые на сайте. hidden: true в services.json —
 *  скрыто до ответа Сергея, но не удалено (27.10: нет в его группе ВК). */
export const categories: Category[] = (servicesData.categories as Hideable<Category>[])
  .filter((c) => !c.hidden)
  .map((c) => ({ ...c, services: (c.services as Hideable<Service>[]).filter((s) => !s.hidden) }));

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getService(id: string): { service: Service; category: Category } | undefined {
  for (const category of categories) {
    const service = category.services.find((s) => s.id === id);
    if (service) return { service, category };
  }
  return undefined;
}

/** Услуга категории, чьё фото стоит на обложке категории, — для подписи к фото.
 *  Нет такой — подписи нет (честнее, чем подписать фото чужой услугой). */
export function coverService(c: Category): Service | undefined {
  return c.image ? c.services.find((s) => s.image === c.image) : undefined;
}

/* ---------- Калькулятор ---------- */

export type UnitId = "sotka" | "meter";
export type Unit = {
  label: string;
  short: string;
  /** Вопрос шага «объём»: «Площадь участка», «Длина забора». */
  question: string;
  min: number;
  max: number;
  step: number;
  default: number;
  /** Быстрый выбор частых значений. */
  presets: number[];
};

export type CalcItem = {
  serviceId: string;
  unit: UnitId;
  /** Ставка за единицу — ДЕМО, см. data/pricing.json → _status. */
  rate: number;
  title: string;
  /** Короткая подпись на кнопке выбора; нет — берётся title. */
  label: string;
  categorySlug: string;
  /** Минимальная цена из объявления: результат не может быть ниже. */
  priceFrom: number;
};

/** Позиции калькулятора с подставленными названием и минимальной ценой из services.json.
 *  Услуги без цены или с неизвестным id сюда не попадают — считать не от чего. */
export const calcItems: CalcItem[] = (pricingData.items as { serviceId: string; label?: string; unit: UnitId; rate: number }[])
  .map((item) => {
    const found = getService(item.serviceId);
    if (!found || found.service.priceFrom === null) return null;
    return {
      ...item,
      title: found.service.title,
      label: item.label ?? found.service.title,
      categorySlug: found.category.slug,
      priceFrom: found.service.priceFrom,
    };
  })
  .filter((x): x is CalcItem => x !== null);

export const calcConfig = {
  demo: pricingData.demo,
  demoNote: pricingData.demoNote,
  roundTo: pricingData.roundTo,
  units: pricingData.units as Record<UnitId, Unit>,
  invite: pricingData.invite,
  /** Шаг «Детали»: на цену не влияют, уходят в заявку. */
  details: pricingData.details as Record<"where" | "when", { label: string; options: string[] }>,
};

/* ---------- Тексты главной ---------- */

export type WhyIcon = "truck" | "lock" | "shield" | "wallet" | "users" | "message" | "pin" | "clock";
export type WhyItem = { icon: WhyIcon; title: string; text?: string; placeholder?: boolean; hidden?: boolean };

export const hero = contentData.hero;
/** Фото первого экрана — фото той услуги, что подписана на нём (content.json → hero.imageService). */
export const heroImage = getService(hero.imageService)?.service.image;
export const whyUs = contentData.whyUs as { title: string; items: WhyItem[] };
export const steps = contentData.steps as { title: string; items: { title: string; text: string }[] };
export const works = contentData.works as { title: string; exampleLabel: string; note: string; items: string[] };
export const discount = contentData.discount;
export const guides = contentData.guides;
export type FaqItem = { q: string; a: string; placeholder?: boolean };
export const faq = contentData.faq as { title: string; placeholderLabel: string; items: FaqItem[] };

/** Все фото работ для страницы /raboty: по одному на услугу, без повторов
 *  одного и того же снимка. Фото и подпись — из услуги, как везде. */
export function allWorks() {
  const seen = new Set<string>();
  return categories.flatMap((category) =>
    category.services
      .filter((s) => s.image && !seen.has(s.image) && seen.add(s.image))
      .map((service) => ({ service, category })),
  );
}
