import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const DEMO_EMAIL = "demo@binstruct.com";
const DEMO_PASSWORD = "demo1234";

async function main() {
  console.log("🌱 Seeding database...");

  let user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (!user) {
    const workspace = await prisma.workspace.create({ data: { name: "Demo Workspace" } });
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
    user = await prisma.user.create({
      data: { name: "Demo", email: DEMO_EMAIL, passwordHash, workspaceId: workspace.id, role: "admin" },
    });
    console.log(`✅ Demo user created — ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  } else {
    console.log(`✅ Demo user already exists — ${DEMO_EMAIL}`);
  }

  // Workspaces start empty — presets live in code (src/lib/preset-templates.ts)
  if (user.workspaceId) {
    const deleted = await prisma.template.deleteMany({ where: { workspaceId: user.workspaceId } });
    if (deleted.count > 0) {
      console.log(`🗑  Cleared ${deleted.count} pre-existing template(s) from demo workspace`);
    }
  }

  console.log("\n🎉 Seed complete! Workspace starts empty — templates are created via the picker.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
