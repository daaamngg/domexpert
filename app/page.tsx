import Hero from "@/components/home/Hero";
import WhyUs from "@/components/home/WhyUs";
import CategoryGrid from "@/components/home/CategoryGrid";
import Calculator from "@/components/home/Calculator";
import Steps from "@/components/home/Steps";
import WorksGallery from "@/components/home/WorksGallery";
import DiscountBlock from "@/components/home/DiscountBlock";
import GuidesTeaser from "@/components/home/GuidesTeaser";
import Faq from "@/components/home/Faq";
import Contacts from "@/components/home/Contacts";
import ContactCta from "@/components/home/ContactCta";
import ReturnPointTracker from "@/components/nav/ReturnPointTracker";
import { discount } from "@/lib/site";

/*
 * Главная — порядок блоков согласован (CLAUDE.md → «Структура»):
 * первый экран → почему мы → услуги → калькулятор → как мы работаем →
 * наши работы → скидка → гайды → частые вопросы → как связаться → контакты.
 * Тексты и цифры — в data/*.json.
 *
 * 28.10 перед показом Сергею (всё обратимо):
 *  - форма «Оставить заявку» (LeadSection) заменена на «Как связаться» (ContactCta);
 *    вернуть — импортировать LeadSection и поставить вместо ContactCta;
 *  - скидка скрыта: content.json → discount.hidden; вернуть — убрать hidden.
 */
export default function HomePage() {
  return (
    <>
      <ReturnPointTracker />
      <Hero />
      <WhyUs />
      <CategoryGrid />
      <Calculator />
      <Steps />
      <WorksGallery />
      {!discount.hidden && <DiscountBlock />}
      <GuidesTeaser />
      <Faq />
      <ContactCta />
      <Contacts />
    </>
  );
}
