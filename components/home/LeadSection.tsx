import { site } from "@/lib/site";
import LeadForm from "@/components/request/LeadForm";

/**
 * НЕ ПОДКЛЮЧЁН с 28.10: на главной вместо него «Как связаться» (ContactCta).
 * Оставлен, чтобы вернуть форму, когда будет бэкенд (см. app/page.tsx).
 *
 * «Оставить заявку» — форма на главной, перед контактами.
 * Данные пока никуда не уходят (TODO в LeadForm.tsx).
 */
export default function LeadSection() {
  return (
    <section id="zayavka" className="border-t border-border py-12 lg:py-24">
      <div className="container-x grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <h2 className="text-[2rem] font-bold leading-tight tracking-[-0.01em] lg:text-[2.75rem]">Оставить заявку</h2>
          <p className="mt-2 max-w-sm text-text-dim">Оставьте телефон, мы свяжемся и всё уточним. {site.freeConsultation}.</p>
        </div>
        <div className="max-w-xl">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
