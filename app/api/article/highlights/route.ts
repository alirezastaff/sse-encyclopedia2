import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const highlights = await prisma.textHighlight.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
  });

  return new Response(JSON.stringify({ highlights }), { status: 200 });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await request.json();
  const { articleSlug, sectionId, text, note } = body as { articleSlug: string; sectionId?: string; text: string; note?: string };
  if (!articleSlug || !text) {
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const highlight = await prisma.textHighlight.create({
    data: {
      userId: user.id,
      articleSlug,
      sectionId,
      text,
      note,
    },
  });

  return new Response(JSON.stringify({ highlight }), { status: 201 });
}
