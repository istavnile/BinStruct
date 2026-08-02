import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const templates = [
  {
    name: "Video Production Project",
    description: "Estructura profesional para proyectos de producción audiovisual — edición, VFX, color, entrega",
    structure: {
      name: "[NOMBRE_DEL_PROYECTO]",
      type: "folder",
      children: [
        {
          name: "01_MEDIA",
          type: "folder",
          children: [
            { name: "01_VIDEO_RAW", type: "folder", children: [] },
            { name: "02_AUDIO_RAW", type: "folder", children: [] },
            { name: "03_VOICE_OVER", type: "folder", children: [] },
            { name: "04_PROXIES", type: "folder", children: [] },
            { name: "05_MUSIC", type: "folder", children: [] },
            { name: "06_SFX", type: "folder", children: [] },
            { name: "07_STOCK_IMAGES", type: "folder", children: [] },
            { name: "08_BRAND_ASSETS", type: "folder", children: [] },
          ],
        },
        {
          name: "02_PROJECT_FILES",
          type: "folder",
          children: [
            { name: "01_EDIT", type: "folder", children: [] },
            { name: "02_VFX_GFX", type: "folder", children: [] },
            { name: "03_COLOR_BACKUPS", type: "folder", children: [] },
            { name: "04_DESIGN", type: "folder", children: [] },
          ],
        },
        {
          name: "03_DOCUMENTS",
          type: "folder",
          children: [
            { name: "01_SCRIPTS", type: "folder", children: [] },
            { name: "02_BRIEFS_AND_SPECS", type: "folder", children: [] },
          ],
        },
        {
          name: "04_EXCHANGE",
          type: "folder",
          children: [
            { name: "01_XML_AAF_EDL", type: "folder", children: [] },
            { name: "02_TO_COLOR", type: "folder", children: [] },
            { name: "03_FROM_COLOR", type: "folder", children: [] },
            { name: "04_TO_VFX", type: "folder", children: [] },
            { name: "05_FROM_VFX", type: "folder", children: [] },
          ],
        },
        {
          name: "05_DELIVERY",
          type: "folder",
          children: [
            { name: "01_LOSSLESS_MASTERS", type: "folder", children: [] },
            { name: "02_COMPRESSED", type: "folder", children: [] },
          ],
        },
        {
          name: "06_FONTS",
          type: "folder",
          children: [],
        },
      ],
    },
  },
  {
    name: "Next.js App (App Router)",
    description: "Full-stack Next.js 14 project with App Router, components, and API routes",
    structure: {
      name: "my-nextjs-app",
      type: "folder",
      children: [
        {
          name: "src",
          type: "folder",
          children: [
            {
              name: "app",
              type: "folder",
              children: [
                { name: "layout.tsx", type: "file", content: "" },
                { name: "page.tsx", type: "file", content: "" },
                { name: "globals.css", type: "file", content: "" },
                {
                  name: "(dashboard)",
                  type: "folder",
                  children: [
                    { name: "layout.tsx", type: "file", content: "" },
                    { name: "page.tsx", type: "file", content: "" },
                  ],
                },
                {
                  name: "api",
                  type: "folder",
                  children: [
                    {
                      name: "auth",
                      type: "folder",
                      children: [
                        {
                          name: "[...nextauth]",
                          type: "folder",
                          children: [{ name: "route.ts", type: "file", content: "" }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "components",
              type: "folder",
              children: [
                { name: "ui", type: "folder", children: [] },
                { name: "Navbar.tsx", type: "file", content: "" },
                { name: "Footer.tsx", type: "file", content: "" },
              ],
            },
            {
              name: "lib",
              type: "folder",
              children: [
                { name: "utils.ts", type: "file", content: "" },
                { name: "db.ts", type: "file", content: "" },
                { name: "auth.ts", type: "file", content: "" },
              ],
            },
            {
              name: "hooks",
              type: "folder",
              children: [{ name: "useUser.ts", type: "file", content: "" }],
            },
            {
              name: "types",
              type: "folder",
              children: [{ name: "index.ts", type: "file", content: "" }],
            },
          ],
        },
        {
          name: "prisma",
          type: "folder",
          children: [{ name: "schema.prisma", type: "file", content: "" }],
        },
        {
          name: "public",
          type: "folder",
          children: [
            { name: "favicon.ico", type: "file", content: "" },
            { name: "logo.svg", type: "file", content: "" },
          ],
        },
        { name: ".env", type: "file", content: "" },
        { name: ".env.example", type: "file", content: "" },
        { name: ".gitignore", type: "file", content: "" },
        { name: "next.config.ts", type: "file", content: "" },
        { name: "tailwind.config.ts", type: "file", content: "" },
        { name: "tsconfig.json", type: "file", content: "" },
        { name: "package.json", type: "file", content: "" },
        { name: "README.md", type: "file", content: "" },
      ],
    },
  },
  {
    name: "Python FastAPI Service",
    description: "Clean Python API project with FastAPI, routers, models, and tests",
    structure: {
      name: "fastapi-service",
      type: "folder",
      children: [
        {
          name: "app",
          type: "folder",
          children: [
            { name: "__init__.py", type: "file", content: "" },
            { name: "main.py", type: "file", content: "" },
            {
              name: "api",
              type: "folder",
              children: [
                { name: "__init__.py", type: "file", content: "" },
                {
                  name: "v1",
                  type: "folder",
                  children: [
                    { name: "__init__.py", type: "file", content: "" },
                    {
                      name: "routers",
                      type: "folder",
                      children: [
                        { name: "__init__.py", type: "file", content: "" },
                        { name: "users.py", type: "file", content: "" },
                        { name: "items.py", type: "file", content: "" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "core",
              type: "folder",
              children: [
                { name: "config.py", type: "file", content: "" },
                { name: "security.py", type: "file", content: "" },
                { name: "deps.py", type: "file", content: "" },
              ],
            },
            {
              name: "models",
              type: "folder",
              children: [
                { name: "__init__.py", type: "file", content: "" },
                { name: "user.py", type: "file", content: "" },
              ],
            },
            {
              name: "schemas",
              type: "folder",
              children: [
                { name: "__init__.py", type: "file", content: "" },
                { name: "user.py", type: "file", content: "" },
              ],
            },
            {
              name: "services",
              type: "folder",
              children: [
                { name: "__init__.py", type: "file", content: "" },
                { name: "user_service.py", type: "file", content: "" },
              ],
            },
          ],
        },
        {
          name: "tests",
          type: "folder",
          children: [
            { name: "__init__.py", type: "file", content: "" },
            { name: "conftest.py", type: "file", content: "" },
            { name: "test_users.py", type: "file", content: "" },
          ],
        },
        { name: ".env", type: "file", content: "" },
        { name: ".gitignore", type: "file", content: "" },
        { name: "requirements.txt", type: "file", content: "" },
        { name: "Dockerfile", type: "file", content: "" },
        { name: "docker-compose.yml", type: "file", content: "" },
        { name: "README.md", type: "file", content: "" },
      ],
    },
  },
  {
    name: "Node.js REST API",
    description: "Express.js REST API with TypeScript, controllers, services, and middleware",
    structure: {
      name: "node-api",
      type: "folder",
      children: [
        {
          name: "src",
          type: "folder",
          children: [
            { name: "index.ts", type: "file", content: "" },
            { name: "app.ts", type: "file", content: "" },
            {
              name: "controllers",
              type: "folder",
              children: [
                { name: "userController.ts", type: "file", content: "" },
                { name: "authController.ts", type: "file", content: "" },
              ],
            },
            {
              name: "services",
              type: "folder",
              children: [
                { name: "userService.ts", type: "file", content: "" },
                { name: "authService.ts", type: "file", content: "" },
              ],
            },
            {
              name: "routes",
              type: "folder",
              children: [
                { name: "index.ts", type: "file", content: "" },
                { name: "userRoutes.ts", type: "file", content: "" },
                { name: "authRoutes.ts", type: "file", content: "" },
              ],
            },
            {
              name: "middleware",
              type: "folder",
              children: [
                { name: "auth.ts", type: "file", content: "" },
                { name: "errorHandler.ts", type: "file", content: "" },
                { name: "validate.ts", type: "file", content: "" },
              ],
            },
            {
              name: "models",
              type: "folder",
              children: [{ name: "User.ts", type: "file", content: "" }],
            },
            {
              name: "config",
              type: "folder",
              children: [
                { name: "database.ts", type: "file", content: "" },
                { name: "env.ts", type: "file", content: "" },
              ],
            },
            {
              name: "types",
              type: "folder",
              children: [{ name: "index.ts", type: "file", content: "" }],
            },
          ],
        },
        {
          name: "tests",
          type: "folder",
          children: [
            { name: "user.test.ts", type: "file", content: "" },
            { name: "auth.test.ts", type: "file", content: "" },
          ],
        },
        { name: ".env", type: "file", content: "" },
        { name: ".env.example", type: "file", content: "" },
        { name: ".gitignore", type: "file", content: "" },
        { name: "tsconfig.json", type: "file", content: "" },
        { name: "package.json", type: "file", content: "" },
        { name: "Dockerfile", type: "file", content: "" },
        { name: "README.md", type: "file", content: "" },
      ],
    },
  },
  {
    name: "Monorepo (Turborepo)",
    description: "Turborepo monorepo with apps and shared packages",
    structure: {
      name: "my-monorepo",
      type: "folder",
      children: [
        {
          name: "apps",
          type: "folder",
          children: [
            {
              name: "web",
              type: "folder",
              children: [
                { name: "src", type: "folder", children: [] },
                { name: "package.json", type: "file", content: "" },
                { name: "tsconfig.json", type: "file", content: "" },
              ],
            },
            {
              name: "api",
              type: "folder",
              children: [
                { name: "src", type: "folder", children: [] },
                { name: "package.json", type: "file", content: "" },
                { name: "tsconfig.json", type: "file", content: "" },
              ],
            },
          ],
        },
        {
          name: "packages",
          type: "folder",
          children: [
            {
              name: "ui",
              type: "folder",
              children: [
                { name: "src", type: "folder", children: [] },
                { name: "package.json", type: "file", content: "" },
              ],
            },
            {
              name: "config",
              type: "folder",
              children: [
                { name: "eslint-config", type: "folder", children: [] },
                { name: "tsconfig", type: "folder", children: [] },
              ],
            },
            {
              name: "utils",
              type: "folder",
              children: [
                { name: "src", type: "folder", children: [] },
                { name: "package.json", type: "file", content: "" },
              ],
            },
          ],
        },
        { name: "turbo.json", type: "file", content: "" },
        { name: "package.json", type: "file", content: "" },
        { name: ".gitignore", type: "file", content: "" },
        { name: "README.md", type: "file", content: "" },
      ],
    },
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  let workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: { name: "Default Workspace" },
    });
    console.log("✅ Created workspace:", workspace.name);
  } else {
    console.log("✅ Using existing workspace:", workspace.name);
  }

  const existingNames = templates.map((t) => t.name);
  await prisma.template.deleteMany({
    where: { name: { in: existingNames }, workspaceId: workspace.id },
  });

  for (const template of templates) {
    await prisma.template.create({
      data: {
        name: template.name,
        description: template.description,
        structure: template.structure as any,
        workspaceId: workspace.id,
      },
    });
    console.log(`✅ Created template: ${template.name}`);
  }

  console.log("\n🎉 Seed complete! Templates created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
