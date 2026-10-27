/* eslint-disable @next/next/no-img-element --
   Сознательно <picture> + <img>, а не next/image: фото уже переведены
   в AVIF/WebP скриптом и лежат статикой (как в stroivizion). */
import { getImage, srcSet, fallbackSrc } from "@/lib/images";

type Props = {
  src: string;
  alt: string;
  /** Подсказка браузеру, какой ширины будет картинка на экране. */
  sizes?: string;
  className?: string;
  /** true — главное фото первого экрана: грузится сразу, без ленивой загрузки. */
  priority?: boolean;
};

export default function SmartImage({ src, alt, sizes = "100vw", className, priority = false }: Props) {
  const entry = getImage(src);
  const common = {
    className,
    sizes,
    loading: (priority ? "eager" : "lazy") as "eager" | "lazy",
    decoding: "async" as const,
    ...(priority ? { fetchPriority: "high" as const } : {}),
  };

  if (!entry) return <img src={src} alt={alt} {...common} />;

  return (
    // display: contents — обёртка <picture> не создаёт своего блока, и h-full
    // у картинки считается от рамки снаружи. Без этого фото в рамке 4:3
    // не дотягивало до низа, и подпись висела под снимком.
    <picture className="contents">
      <source type="image/avif" srcSet={srcSet(entry, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(entry, "webp")} sizes={sizes} />
      <img src={fallbackSrc(entry, src)} alt={alt} width={entry.width} height={entry.height} {...common} />
    </picture>
  );
}
