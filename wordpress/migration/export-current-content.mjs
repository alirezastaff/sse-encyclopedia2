import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { articles } from '../../lib/articles.ts';

const sourceNotes = JSON.parse(await readFile(resolve('data/marginal-notes.json'), 'utf8'));
const payload = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  articles: articles.flatMap((article) => ['en', 'fa'].map((language) => ({
    source_id: article.slug,
    translation_group_id: article.slug,
    language,
    slug: article.slug,
    title: article.title[language],
    description: article.description[language],
    category: article.category[language],
    author: article.author,
    start_page: article.startPage,
    body: article.body[language],
  }))),
  public_notes: sourceNotes.notes.flatMap((note) => [
    {
      id: note.id,
      article_slug: note.articleSlug,
      name: note.name,
      email: note.email,
      content: note.content,
      created_at: note.createdAt,
    },
    ...note.replies.map((reply) => ({
      id: reply.id,
      parent_id: note.id,
      article_slug: note.articleSlug,
      name: reply.name,
      email: reply.email,
      content: reply.content,
      created_at: reply.createdAt,
    })),
  ]),
};

const output = resolve(process.argv[2] || 'wordpress/migration/payload.json');
await writeFile(output, JSON.stringify(payload, null, 2) + '\n', 'utf8');
console.log(`Wrote ${payload.articles.length} articles and ${payload.public_notes.length} public notes to ${output}`);
