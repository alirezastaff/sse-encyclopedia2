# WordPress migration workspace

This directory is intentionally isolated from the existing Next.js application. It contains the proposed production WordPress theme and plugin, while `app/`, `lib/`, `content/`, `data/`, and `prisma/` remain untouched as the migration source and rollback reference.

## Current implementation

- Custom post type: `sse_article`
- Taxonomies: `sse_category`, `sse_part`, `sse_topic`
- Custom tables for bookmarks, reading list, reading progress, private notes, note groups, highlights, and migration logs
- REST namespace: `/wp-json/sse/v1/`
- Bilingual-ready theme with RTL/LTR support and preserved article URLs through the `articles` rewrite base
- Public notes and replies through native WordPress comments

## Required staging setup

1. Create a clean WordPress staging site with MySQL/MariaDB.
2. Install Polylang Pro or WPML and configure English/Persian before importing content.
3. Activate the plugin and theme.
4. Import content and data only after creating a database backup.
5. Compare article counts, user counts, and interaction counts against the existing SQLite/JSON source.

No existing Next.js file is removed or overwritten by this workspace.

## Local Codespace staging

Start the local WordPress and MariaDB containers from the repository root:

```bash
docker compose -f wordpress/docker-compose.yml up -d
```

Open the site at `http://localhost:8080/` and the dashboard at `http://localhost:8080/wp-admin/`.

The development administrator created for this staging installation is:

```text
Username: admin
Password: SseDevAdmin2026!
```

Stop the containers without deleting data with:

```bash
docker compose -f wordpress/docker-compose.yml down
```

The database and WordPress files are stored in Docker volumes. Do not use `down -v` unless you intentionally want to reset the staging installation.
