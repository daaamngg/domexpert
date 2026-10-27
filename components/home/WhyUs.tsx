import { Clock, Lock, MapPin, MessageCircle, ShieldCheck, Truck, Users, Wallet } from "lucide-react";
import { whyUs, type WhyIcon } from "@/lib/site";

const icons: Record<WhyIcon, typeof Truck> = {
  truck: Truck,
  lock: Lock,
  shield: ShieldCheck,
  wallet: Wallet,
  users: Users,
  message: MessageCircle,
  pin: MapPin,
  clock: Clock,
};

/**
 * «Почему мы» — список фактов строками на светлом фоне, с тонкими линиями.
 * 27.10 по просьбе Арслана: вернули светлое оформление (графитовая полоса
 * не нужна), оставили 4 самых сильных пункта (остальные — hidden в данных),
 * значки сохранили — цветом кофе, без коробок и кругов.
 * На компьютере — заголовок слева, факты справа 2×2.
 */
export default function WhyUs() {
  const items = whyUs.items.filter((x) => !x.hidden);

  return (
    <section id="pochemu-my" className="border-t border-border py-12 lg:py-24">
      <div className="container-x grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <h2 className="text-[2rem] font-bold leading-tight tracking-[-0.01em] lg:text-[2.75rem]">{whyUs.title}</h2>

        <ul className="grid sm:grid-cols-2 sm:gap-x-10">
          {items.map((item) => {
            const Icon = icons[item.icon];
            return (
              <li key={item.title} className="flex gap-3.5 border-b border-border py-4 first:pt-0 sm:py-5 sm:[&:nth-child(2)]:pt-0">
                <Icon size={24} strokeWidth={1.7} className="mt-0.5 shrink-0 text-coffee" aria-hidden />
                <div>
                  <p className="font-display text-lg font-semibold leading-snug text-ink sm:text-xl">
                    {item.title}
                    {/* Заглушка видна, но не кричит: Сергей сразу поймёт, что сюда нужна цифра. */}
                    {item.placeholder && <span className="placeholder-tag ml-2 align-middle font-sans">уточняется</span>}
                  </p>
                  {item.text && <p className="mt-0.5 text-[15px] leading-normal text-text-dim sm:mt-1 sm:leading-relaxed">{item.text}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
