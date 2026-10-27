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
import LeadSection from "@/components/home/LeadSection";
import ReturnPointTracker from "@/components/nav/ReturnPointTracker";

/*
 * Главная — порядок блоков согласован (CLAUDE.md → «Структура»):
 * первый экран → почему мы → услуги → калькулятор → как мы работаем →
 * наши работы → скидка → гайды → частые вопросы → заявка → контакты.
 * Тексты и цифры — в data/*.json.
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
      <DiscountBlock />
      <GuidesTeaser />
      <Faq />
      <LeadSection />
      <Contacts />
    </>
  );
}
