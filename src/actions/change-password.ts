"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw new Error("wrong_password");

  if (newPassword.length < 8) throw new Error("too_short");

  const hash = await bcrypt.hash(newPassword, 12);
  await db.user.update({ where: { id: userId }, data: { passwordHash: hash } });
}
