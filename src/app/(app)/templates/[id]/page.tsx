import { getTemplate } from "@/actions/templates";
import { notFound } from "next/navigation";
import { TemplateBuilderClient } from "./TemplateBuilderClient";

export default async function TemplatePage({ params }: { params: { id: string } }) {
  const template = await getTemplate(params.id);

  if (!template) {
    notFound();
  }

  return <TemplateBuilderClient initialTemplate={template} />;
}
