import { promises as fs } from "fs";
import path from "path";
import { articles } from "@/lib/articles";

type StoredReply = {
  id: string;
  name: string;
  email?: string;
  replyEmail?: string;
  content: string;
  createdAt: string;
};

type StoredNote = {
  id: string;
  articleSlug: string;
  name: string;
  email?: string;
  content: string;
  createdAt: string;
  replies: StoredReply[];
};

type Storage = {
  notes: StoredNote[];
};

const storagePath = path.join(process.cwd(), "data", "marginal-notes.json");

async function ensureStorage() {
  const dir = path.dirname(storagePath);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(storagePath);
  } catch {
    await fs.writeFile(storagePath, JSON.stringify({ notes: [] }, null, 2), "utf8");
  }
}

async function readStorage(): Promise<Storage> {
  await ensureStorage();
  const file = await fs.readFile(storagePath, "utf8");
  return JSON.parse(file) as Storage;
}

async function writeStorage(data: Storage) {
  await fs.writeFile(storagePath, JSON.stringify(data, null, 2), "utf8");
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validArticleSlug(slug: string) {
  return articles.some((article) => article.slug === slug);
}

export async function GET() {
  const storage = await readStorage();
  const notes = storage.notes
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((note) => ({
      id: note.id,
      articleSlug: note.articleSlug,
      content: note.content,
      createdAt: note.createdAt,
      replies: note.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        replyEmail: reply.replyEmail,
        createdAt: reply.createdAt,
      })),
    }));

  return new Response(JSON.stringify({ notes }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return new Response(JSON.stringify({ error: "Invalid request payload." }), { status: 400 });
  }

  const { name, email, articleSlug, content, replyToId, replyEmail } = body as {
    name?: unknown;
    email?: unknown;
    articleSlug?: unknown;
    content?: unknown;
    replyToId?: unknown;
    replyEmail?: unknown;
  };

  if (typeof name !== "string" || !name.trim()) {
    return new Response(JSON.stringify({ error: "Name is required." }), { status: 400 });
  }

  if (typeof content !== "string" || !content.trim()) {
    return new Response(JSON.stringify({ error: "Comment content is required." }), { status: 400 });
  }

  if (typeof articleSlug !== "string" || !validArticleSlug(articleSlug)) {
    return new Response(JSON.stringify({ error: "Valid article slug is required." }), { status: 400 });
  }

  const normalizedEmail = typeof email === "string" ? email.trim() : "";
  if (normalizedEmail && !validateEmail(normalizedEmail)) {
    return new Response(JSON.stringify({ error: "Invalid email address." }), { status: 400 });
  }

  const normalizedReplyEmail = typeof replyEmail === "string" ? replyEmail.trim() : "";
  if (normalizedReplyEmail && !validateEmail(normalizedReplyEmail)) {
    return new Response(JSON.stringify({ error: "Invalid reply email address." }), { status: 400 });
  }

  const storage = await readStorage();

  if (typeof replyToId === "string" && replyToId.trim()) {
    const noteIndex = storage.notes.findIndex((note) => note.id === replyToId);
    if (noteIndex < 0) {
      return new Response(JSON.stringify({ error: "Original note not found." }), { status: 404 });
    }

    const reply = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail || undefined,
      replyEmail: normalizedReplyEmail || undefined,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    storage.notes[noteIndex].replies.push(reply);
    await writeStorage(storage);

    const updatedNote = storage.notes[noteIndex];
    return new Response(
      JSON.stringify({
        note: {
          id: updatedNote.id,
          articleSlug: updatedNote.articleSlug,
          content: updatedNote.content,
          createdAt: updatedNote.createdAt,
          replies: updatedNote.replies.map((item) => ({
            id: item.id,
            content: item.content,
            replyEmail: item.replyEmail,
            createdAt: item.createdAt,
          })),
        },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  }

  const note = {
    id: crypto.randomUUID(),
    articleSlug,
    name: name.trim(),
    email: normalizedEmail || undefined,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    replies: [],
  };

  storage.notes.unshift(note);
  await writeStorage(storage);

  return new Response(
    JSON.stringify({
      note: {
        id: note.id,
        articleSlug: note.articleSlug,
        content: note.content,
        createdAt: note.createdAt,
        replies: [],
      },
    }),
    { status: 201, headers: { "Content-Type": "application/json" } }
  );
}
