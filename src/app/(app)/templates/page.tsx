import { getTemplates } from "@/actions/templates";
import { TemplatesClient } from "./TemplatesClient";
import { getLang } from "@/lib/lang";

export default async function TemplatesPage() {
  const [templates, lang] = await Promise.all([getTemplates(), Promise.resolve(getLang())]);
  return <TemplatesClient initialTemplates={templates} lang={lang} />;
}
