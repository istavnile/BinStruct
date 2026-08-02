import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = headers();
    const authorization = headersList.get("authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid Bearer token" }, { status: 401 });
    }

    const token = authorization.split(" ")[1];

    // In a real application, you would hash the incoming token and compare it with the stored hash
    // For this example, we assume the token is stored as plain text or simple hash
    const apiKey = await db.apiKey.findUnique({
      where: { key: token },
    });

    if (!apiKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
    }

    const template = await db.template.findUnique({
      where: {
        id: params.id,
        workspaceId: apiKey.workspaceId,
      },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json(template.structure);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
