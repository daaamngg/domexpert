// Значки мессенджеров. В lucide-react брендовых иконок нет — рисуем свои,
// упрощённые, в одну краску (currentColor), чтобы красились вместе с текстом.
import type { MessengerId } from "@/lib/site";

type P = { size?: number; className?: string };

export function TelegramIcon({ size = 20, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.4 4.2 2.9 11.3c-1.1.4-1.1 1.1-.2 1.4l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14.2c.3-1.3-.5-1.8-1.3-1.5Zm-3.3 3.3-8.6 7.8-.3 3.6-1.6-5 9.8-6.2c.5-.3.9-.1.7-.2Z" />
    </svg>
  );
}

export function MaxIcon({ size = 20, className }: P) {
  // Облачко сообщения с буквой «M» — узнаваемо и без копирования логотипа.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" />
      <path d="M8.5 15V9.5l3.5 3.5 3.5-3.5V15" />
    </svg>
  );
}

export function VkIcon({ size = 20, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.8 17.5c-5.6 0-8.8-3.8-8.9-10.2h2.8c.1 4.7 2.2 6.6 3.8 7V7.3h2.6v4c1.6-.2 3.3-2 3.8-4h2.6c-.4 2.5-2.2 4.3-3.5 5 1.3.6 3.3 2.1 4.1 5.2h-2.9c-.6-1.9-2.2-3.4-4.1-3.6v3.6h-.3Z" />
    </svg>
  );
}

export const messengerIcons: Record<MessengerId, (p: P) => React.JSX.Element> = {
  telegram: TelegramIcon,
  max: MaxIcon,
  vk: VkIcon,
};
