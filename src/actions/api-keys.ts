"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";

function requireWorkspace(session: any) {
  const workspaceId = (session?.user as any)?.workspaceId as string | undefined;
  if (!workspaceId) throw new Error("No workspace");
  return workspaceId;
}

export async function createApiKey() {
  const session = await getServerSession(authOptions);
  const workspaceId = requireWorkspace(session);
  const key = `bs_${randomBytes(24).toString("hex")}`;
  const apiKey = await db.apiKey.create({ data: { key, workspaceId } });
  revalidatePath("/settings");
  return apiKey;
}

export async function deleteApiKey(id: string) {
  const session = await getServerSession(authOptions);
  const workspaceId = requireWorkspace(session);
  await db.apiKey.deleteMany({ where: { id, workspaceId } });
  revalidatePath("/settings");
}
