# Source inventory captured during migration

- `lib/articles.ts` currently exports one article record, so the content exporter produces two posts, one English and one Persian.
- The workspace contains 13 MDX files per language, but the inspected MDX files are empty and are not currently the runtime content source.
- `data/marginal-notes.json` currently contains two public notes and one reply.
- `prisma/dev.db` currently contains one user, one bookmark, one reading-list item, one progress record, seven private notes, zero highlights, zero note groups, zero OAuth accounts, and zero sessions.
- The Next.js lint command currently reports two errors in existing files (`app/login/page.tsx` and `app/profile/page.tsx`) plus warnings. No existing files were changed by the WordPress implementation.
