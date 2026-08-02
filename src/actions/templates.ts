"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function getTemplates() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const workspaceId = (session.user as any).workspaceId;

  return db.template.findMany({
    where: { workspaceId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getTemplate(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const workspaceId = (session.user as any).workspaceId;

  return db.template.findUnique({
    where: { id, workspaceId },
  });
}

export async function createTemplate(name: string, description: string, structure: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const workspaceId = (session.user as any).workspaceId;

  const template = await db.template.create({
    data: {
      name,
      description,
      structure: structure as Prisma.InputJsonValue,
      workspaceId,
    },
  });

  revalidatePath("/templates");
  return template;
}

export async function updateTemplate(id: string, name: string, description: string, structure: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const workspaceId = (session.user as any).workspaceId;

  const template = await db.template.update({
    where: { id, workspaceId },
    data: {
      name,
      description,
      structure: structure as Prisma.InputJsonValue,
    },
  });

  revalidatePath("/templates");
  revalidatePath(`/templates/${id}`);
  return template;
}

export async function duplicateTemplate(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const workspaceId = (session.user as any).workspaceId;

  const original = await db.template.findUnique({ where: { id, workspaceId } });
  if (!original) throw new Error("Not found");

  const copy = await db.template.create({
    data: {
      name: `${original.name} (copia)`,
      description: original.description,
      structure: original.structure as Prisma.InputJsonValue,
      workspaceId,
    },
  });

  revalidatePath("/templates");
  return copy;
}

export async function deleteTemplate(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const workspaceId = (session.user as any).workspaceId;

  await db.template.delete({
    where: { id, workspaceId },
  });

  revalidatePath("/templates");
}
