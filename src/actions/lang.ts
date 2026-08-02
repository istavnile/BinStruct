"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setLang(lang: "es" | "en") {
  cookies().set("lang", lang, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  revalidatePath("/", "layout");
}
