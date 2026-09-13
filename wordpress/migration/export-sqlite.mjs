import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const output = resolve(process.argv[2] || 'wordpress/migration/private-payload.json');
try {
  const [users, bookmarks, readingList, progress, groups, notes, highlights] = await Promise.all([
    prisma.user.findMany(),
    prisma.bookmark.findMany(),
    prisma.readingListItem.findMany(),
    prisma.readingProgress.findMany(),
    prisma.noteGroup.findMany(),
    prisma.articleNote.findMany(),
    prisma.textHighlight.findMany(),
  ]);
  const payload = {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    users,
    bookmarks,
    reading_list: readingList,
    progress,
    note_groups: groups,
    private_notes: notes,
    highlights,
  };
  await writeFile(output, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${users.length} users and ${notes.length} private notes to ${output}`);
} finally {
  await prisma.$disconnect();
}
