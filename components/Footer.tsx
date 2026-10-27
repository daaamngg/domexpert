import Link from "next/link";
import { categories, site, messengers, messengerLabels, type MessengerId } from "@/lib/site";
import { messengerIcons } from "@/components/icons";

export default function Footer() {
  const links = (Object.entries(messengers) as [MessengerId, string][]).filter(([, url]) => url);

  return (
    <footer className="border-t border-border bg-surface-2">
      <div className="container-x grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-semibold text-ink">{site.name}</p>
          <p className="mt-2 text-sm text-text-dim">{site.tagline}</p>
          <p className="mt-1 text-sm text-text-dim">{site.region}</p>
        </div>

        <nav aria-label="Услуги">
          <p className="text-sm font-semibold text-ink">Услуги</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-1">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/uslugi/${c.slug}`} className="text-text hover:text-ink">{c.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold text-ink">Контакты</p>
          <a href={`tel:${site.phoneHref}`} className="mt-3 block text-lg font-semibold text-ink">{site.phone}</a>
          <p className="mt-1 text-sm text-text-dim">{site.address}</p>
          <div className="mt-4 flex gap-2">
            {links.map(([id, url]) => {
              const Icon = messengerIcons[id];
              return (
                <a key={id} href={url} target="_blank" rel="noopener noreferrer" aria-label={messengerLabels[id]} className="icon-btn border border-border">
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="container-x flex flex-wrap gap-x-5 gap-y-1 border-t border-border py-4 text-xs text-text-dim">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>{site.legalName}</span>
      </div>
    </footer>
  );
}
