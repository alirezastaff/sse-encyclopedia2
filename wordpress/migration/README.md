# Migration tools

`export-current-content.mjs` is read-only. It imports the current `articles` array and public marginal notes, then writes the normalized JSON consumed by the WordPress plugin.

Run it from the repository root with a Node version that supports TypeScript type stripping:

```bash
node --experimental-strip-types wordpress/migration/export-current-content.mjs wordpress/migration/payload.json
```

`export-sqlite.mjs` exports users and private interaction records from the existing Prisma database. Use an absolute SQLite URL because Prisma resolves relative file URLs from the generated client context:

```bash
DATABASE_URL=file:/workspaces/sse-encyclopedia/prisma/dev.db node wordpress/migration/export-sqlite.mjs wordpress/migration/private-payload.json
```

The private payload contains password hashes and must never be committed or uploaded. It is ignored by this directory's `.gitignore`.

Then, on a WordPress staging site with WP-CLI:

```bash
wp plugin activate sse-encyclopedia-core
wp sse import /absolute/path/to/payload.json
wp sse import /absolute/path/to/payload.json --private=/absolute/path/to/private-payload.json
```

The import is designed to be repeatable. Existing articles are matched by slug and public notes by `_sse_legacy_comment_id`. It does not delete WordPress content. The private phase maps legacy user IDs to WordPress user IDs and imports bookmarks, reading list, progress, and private notes after the SQLite backup has been reviewed.

## Normalized payload

Each article contains `source_id`, `translation_group_id`, `language`, `slug`, `title`, `description`, `category`, `author`, `start_page`, and a `body` array. Public notes contain `id`, `article_slug`, `name`, `email`, `content`, `created_at`, and optional `parent_id`.
