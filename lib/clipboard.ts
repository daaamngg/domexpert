/**
 * Скопировать текст в буфер обмена. true — получилось.
 *
 * Вызывать прямо в обработчике нажатия, до перехода по ссылке: браузеры
 * разрешают запись в буфер только «по действию пользователя».
 * Старые браузеры и страницы без https (просмотр с телефона по Wi-Fi через
 * http://192.168…) navigator.clipboard не дают — тогда старый способ через
 * скрытое поле и execCommand («устарел», но работает везде).
 */
export async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Запрет браузера — пробуем старый способ ниже.
    }
  }
  return legacyCopy(text);
}

function legacyCopy(text: string): boolean {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  // За экраном и 16px — чтобы iOS не прокручивала и не увеличивала страницу.
  ta.style.cssText = "position:fixed;top:0;left:-9999px;font-size:16px;opacity:0";
  // Внутрь открытого <dialog>, иначе фокус в поле за его пределами не попадёт.
  (document.querySelector("dialog[open]") ?? document.body).appendChild(ta);
  ta.select();
  ta.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}
