import type { NextConfig } from "next";
import path from "node:path";

// Базовые заголовки безопасности. Полный CSP (как в stroivizion) — перед
// выкладкой, когда станет ясно, что подключаем из внешнего (Метрика и т.п.).
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // В clod/ лежат другие проекты со своими lockfile — без этого Turbopack
  // путается, где корень.
  turbopack: {
    root: path.resolve(),
  },
  poweredByHeader: false,
  // Кружок «N» в режиме разработки перекрывал кнопку звонка на скриншотах
  // для Арслана. На живом сайте его и так нет.
  devIndicators: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
