import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const notes = await prisma.articleNote.findMany({
    where: { user: { email: session.user.email } },
    include: { group: true },
    orderBy: { updatedAt: "desc" },
  });

  return new Response(JSON.stringify({ notes }), { status: 200 });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await request.json();
  const { articleSlug, content, groupId } = body as { articleSlug: string; content: string; groupId?: string };
  if (!articleSlug || typeof content !== "string") {
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const note = await prisma.articleNote.create({
    data: {
      userId: user.id,
      articleSlug,
      content,
      groupId,
    },
  });

  return new Response(JSON.stringify({ note }), { status: 201 });
}
