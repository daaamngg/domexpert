import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { categories, coverService, getCategory, site } from "@/lib/site";
import PhotoChip from "@/components/PhotoChip";
import BackToHome from "@/components/nav/BackToHome";
import SmartImage from "@/components/SmartImage";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import CategoryTabs from "@/components/category/CategoryTabs";
import ServiceRow from "@/components/category/ServiceRow";

// Все категории собираются заранее в статические страницы.
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) return {};
  return { title: c.title, description: c.intro };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();
  const cover = coverService(c);

  return (
    <div className="container-x py-5 lg:py-8">
      <BackToHome />

      {/* Фото + короткое вступление */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2 lg:items-center lg:gap-10">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg lg:order-2">
          {c.image ? (
            <SmartImage src={c.image} alt={c.title} priority sizes="(min-width: 1024px) 560px, 100vw" className="h-full w-full object-cover" />
          ) : (
            <PhotoPlaceholder className="h-full w-full rounded-lg" />
          )}
          {cover && <PhotoChip serviceId={cover.id} className="absolute inset-x-0 bottom-0" />}
        </div>
        <div>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{c.title}</h1>
          <p className="mt-3 max-w-xl leading-relaxed text-text">{c.intro}</p>
        </div>
      </div>

      <div className="mt-6">
        <CategoryTabs items={categories} current={c.slug} />
      </div>

      {/* h2 между h1 и строками-h3: без него структура заголовков прыгала
          через уровень (детектор impeccable, skipped-heading). */}
      <h2 className="mt-8 text-xl font-semibold">Услуги и цены</h2>
      <ul className="mt-2 divide-y divide-border">
        {c.services.map((s) => (
          <ServiceRow key={s.id} service={s} />
        ))}
      </ul>

      {c.details && (
        <dl className="mt-6 divide-y divide-border rounded-lg bg-surface-2 px-4">
          {c.details.map((d) => (
            <div key={d.label} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="text-sm font-semibold text-ink">{d.label}</dt>
              <dd className="text-sm text-text">{d.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <a href={`tel:${site.phoneHref}`} className="btn btn-primary h-12 text-base">
          <Phone size={18} /> Позвонить нам
        </a>
        <p className="text-sm text-text-dim">{site.freeConsultation}. Цену фиксируем после звонка.</p>
      </div>
    </div>
  );
}
