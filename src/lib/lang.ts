import { cookies, headers } from "next/headers";

export type Lang = "es" | "en";

function detectFromBrowser(): Lang {
  try {
    const acceptLang = headers().get("accept-language") ?? "";
    // "es-419,es;q=0.9,en;q=0.8" → first tag before comma and semicolon
    const first = acceptLang.split(",")[0].split(";")[0].trim().toLowerCase();
    return first.startsWith("es") ? "es" : "en";
  } catch {
    return "en";
  }
}

export function getLang(): Lang {
  const cookie = cookies().get("lang")?.value;
  if (cookie === "es" || cookie === "en") return cookie;
  // No explicit preference yet — detect from browser
  return detectFromBrowser();
}
