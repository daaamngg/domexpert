// Снимок страницы ровно на 390 px (проверка мобильной вёрстки после каждого блока).
// Headless Edge не даёт окно уже ~483 px, поэтому ширину задаём через CDP.
// Адрес — через localhost, НЕ 127.0.0.1: дев-сервер Next 16 не отдаёт свои скрипты
// на «чужой» хост (allowedDevOrigins), страница не оживает и клиентская логика не работает.
// node scripts/shot.mjs <url> <out.png> [ширина=390] [вся страница=1] [прокрутка, px — только экран]
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const [url, out, width = "390", full = "1", scrollY = "0"] = process.argv.slice(2);
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const port = 9300 + Math.floor(Math.random() * 500);
const profile = mkdtempSync(path.join(tmpdir(), "edge-cdp-"));
const edge = spawn(EDGE, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 50; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (targets.length) break; } catch {}
  await sleep(200);
}
const page = targets.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

const W = Number(width);
await send("Emulation.setDeviceMetricsOverride", { width: W, height: 844, deviceScaleFactor: 2, mobile: W < 768 });
await send("Page.enable");
await send("Page.navigate", { url });
// В режиме разработки страница «оживает» (гидратация) не сразу — ждём с запасом.
await sleep(Number(process.env.SHOT_WAIT ?? 3500));
const { result } = await send("Runtime.evaluate", { expression: "document.documentElement.scrollHeight", returnByValue: true });
const H = full === "1" ? result.result.value : 844;
// Прокрутка — чтобы снять экран в середине страницы (и проверить то,
// что появляется при прокрутке, например нижнюю панель контактов).
if (full !== "1" && Number(scrollY) > 0) {
  await send("Runtime.evaluate", { expression: `window.scrollTo(0, ${Number(scrollY)})` });
  await sleep(900);
}
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 2, mobile: W < 768 });
await sleep(800);
// SHOT_EVAL — выражение для отладки, результат печатается в консоль.
if (process.env.SHOT_EVAL) {
  const r = await send("Runtime.evaluate", { expression: process.env.SHOT_EVAL, returnByValue: true, awaitPromise: true });
  console.log("eval:", JSON.stringify(r.result.result.value ?? r.result));
}
const shot = await send("Page.captureScreenshot", { format: "png" });
writeFileSync(out, Buffer.from(shot.result.data, "base64"));
console.log(`${out}: ${W}x${H}`);
ws.close();
edge.kill();
process.exit(0);
