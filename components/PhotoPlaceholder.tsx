import { ImageIcon } from "lucide-react";

/** Место под фото, которого пока нет. Подпись видна — Сергей сразу понимает, что сюда нужно фото. */
export default function PhotoPlaceholder({ label = "Фото скоро", className = "" }: { label?: string; className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 border border-dashed border-border-strong bg-surface-2 text-center text-xs text-text-dim ${className}`}
    >
      <ImageIcon size={20} strokeWidth={1.6} aria-hidden />
      <span>{label}</span>
    </div>
  );
}
