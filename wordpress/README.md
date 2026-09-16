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

## Production deployment: www.ssepedia.ir

This package is prepared for a standalone WordPress deployment. The production site must run WordPress 6.4+, PHP 8.1+, MySQL/MariaDB, HTTPS, and a server-side page cache. Point `www.ssepedia.ir` and `ssepedia.ir` to the host, force HTTPS, and choose one canonical host with a 301 redirect from the other.

1. Create a staging copy and a separate production database. Do not use the Docker passwords from `docker-compose.yml` in production.
2. Install WordPress, enable HTTPS, set the site URL to `https://www.ssepedia.ir`, and enable user registration only if public registration is required.
3. Install and configure Polylang Pro or WPML with `fa` and `en`, choosing the final default language and URL structure before importing content.
4. Copy `wp-content/plugins/sse-encyclopedia-core` and `wp-content/themes/sse-encyclopedia` to the production installation, activate the plugin and theme, then save Permalinks once.
5. The plugin creates the required public pages on activation: Archive, Profile, Login, Register, Country Explorer, Case Studies, Impact Calculator, and Marginal Notes. Assign translations for each page in the multilingual plugin.
6. Generate and review the normalized migration payload locally. Upload payloads through an encrypted channel only; the private payload contains password hashes and must be deleted after import.
7. Run `wp sse import /absolute/path/to/payload.json --private=/absolute/path/to/private-payload.json` on staging first. Compare article, translation, user, bookmark, note, highlight, and comment counts with the source before repeating on production. The importer matches articles by legacy slug and language, and preserves historical public notes as published content.
8. Configure a persistent object cache (Redis), full-page cache for public pages, CDN or browser caching for media/PDFs, and scheduled database/file backups. Exclude logged-in pages, REST nonce responses, and private profile data from page cache.
9. Test `/`, `/articles/`, `/country-explorer/`, `/case-studies/`, `/impact-calculator/`, `/marginal-notes/`, `/login/`, `/register/`, and `/profile/` in both languages on desktop and mobile. Confirm article actions, moderation, PDF links, map data, and report saving.
10. After launch, monitor PHP errors, REST 4xx/5xx responses, failed cron jobs, cache hit ratio, uptime, and backup restores. Keep the Next.js application available as a rollback/reference until the WordPress counts and behavior are accepted.

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
