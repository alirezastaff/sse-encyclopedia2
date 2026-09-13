import { readFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const source = JSON.parse(await readFile("data/marginal-notes.json", "utf8"));
let imported = 0;

try {
  for (const note of source.notes ?? []) {
    const post = await prisma.marginalPost.upsert({
      where: { id: note.id },
      update: {},
      create: {
        id: note.id,
        articleSlug: note.articleSlug,
        content: note.content,
        kind: "comment",
        status: "published",
        guestName: note.name,
        guestEmail: note.email || "legacy@example.invalid",
        emailVerified: Boolean(note.email),
        publishedAt: new Date(note.createdAt),
        createdAt: new Date(note.createdAt),
      },
    });
    for (const reply of note.replies ?? []) {
      await prisma.marginalReply.upsert({
        where: { id: reply.id },
        update: {},
        create: {
          id: reply.id,
          postId: post.id,
          content: reply.content,
          guestName: reply.name,
          guestEmail: reply.email || "legacy@example.invalid",
          emailVerified: Boolean(reply.email),
          status: "published",
          publishedAt: new Date(reply.createdAt),
          createdAt: new Date(reply.createdAt),
        },
      });
    }
    imported += 1;
  }
  console.log(`Imported ${imported} marginal note threads.`);
} finally {
  await prisma.$disconnect();
}
