import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const rawEmail = String(body.email ?? "").trim();
  const username = String(body.username ?? "").trim();
  const name = String(body.name ?? "").trim();
  const password = String(body.password ?? "").trim();

  const email = rawEmail
    ? rawEmail.toLowerCase()
    : username
    ? `${username.toLowerCase().replace(/[^a-z0-9]/g, "") || "user"}@example.com`
    : "";

  if (!email || !password) {
    return new Response(JSON.stringify({ message: "Username or email and password are required." }), { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return new Response(JSON.stringify({ message: "A user already exists with this email." }), { status: 409 });
  }

  const passwordHash = await hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name: name || username || undefined,
      passwordHash,
    },
  });

  return new Response(JSON.stringify({ success: true }), { status: 201 });
}
