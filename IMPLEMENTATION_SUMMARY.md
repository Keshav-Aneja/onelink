# RSS Feed Cron Job Implementation Summary

## Overview
Implemented an in-process cron job that automatically fetches and caches RSS feeds every 30 minutes, running inside the same Node.js server process (no separate worker needed).

## What Was Built

### 1. New Database Table: `rss_feed_cache`
**Migration:** `packages/db/src/migrations/20260516300001_rss_feed_cache.ts`

Stores cached RSS feed items with:
- `id` (uuid PK)
- `subscription_id` (FK → rss_subscriptions, CASCADE)
- `owner_id` (FK → users, CASCADE)
- `item_hash` (text, unique per subscription)
- `title`, `link`, `published_date`, `fetched_at`
- Indexes on `owner_id`, `subscription_id`, `published_date`
- Unique constraint on `(subscription_id, item_hash)` to prevent duplicates

The table stores items up to 90 days old; older items are pruned on each cron run.

### 2. Repository Methods Added
**File:** `apps/backend/src/infrastructure/repositories/rss-subscriptions.repository.ts`

- `getAllSubscriptions()` — fetches all subscriptions across all users (for cron)
- `upsertCacheItems(items)` — bulk upsert cache rows, ignoring duplicates
- `pruneCache(maxDays = 90)` — deletes rows with `published_date < now - maxDays`
- `getCachedItems(owner_id, sinceDays, feedId?)` — reads cached items filtered by date window and optional feed

### 3. Feeds Service Enhancements
**File:** `apps/backend/src/infrastructure/services/feeds.service.ts`

**Modified `getFeedItems()`:**
- Now tries reading from `rss_feed_cache` first
- If cache hit, returns immediately (fast)
- On cache miss (or empty cache), falls back to live scraping and auto-populates cache
- Filters by `sinceDays` (7/30/90 days) at read time — no `window` column needed

**New `refreshAllFeeds()` method:**
- Called by the cron job every 30 minutes
- Fetches 90 days of items for all subscriptions across all users
- Upserts results into `rss_feed_cache`
- Prunes stale rows (older than 90 days)
- Cleans up old read items (older than 90 days)

### 4. In-Process Cron Loader
**File:** `apps/backend/src/loaders/cron.loader.ts` (NEW)

- Registers a `node-cron` schedule to run every 30 minutes (`*/30 * * * *`)
- Runs once immediately on server startup
- Logs all activity: `[cron] Starting RSS feed refresh...`, `[cron] RSS feed refresh complete.`
- Logs errors to logger on failure

### 5. Loader Wiring
**File:** `apps/backend/src/loaders/index.ts`

- Added import for `cronLoader`
- Called `cronLoader()` after Express loader to initialize the cron job
- Non-blocking (cron runs in background)

### 6. Dependencies
**File:** `apps/backend/package.json`

- Added `node-cron` ^3.0.3 to dependencies
- Added `@types/node-cron` ^3.0.11 to devDependencies

## How It Works

### On Server Startup
1. Express server starts
2. All loaders run (logger, redis, express)
3. Cron loader initializes
4. **Cron job fires immediately** — fetches all feeds, populates cache
5. Cron scheduled to run again in 30 minutes

### Every 30 Minutes
1. Cron fires
2. Fetches 90 days of items for all subscriptions
3. Upserts into `rss_feed_cache` (duplicates ignored)
4. Prunes items older than 90 days
5. Cleans up read items older than 90 days

### When User Opens Feeds Page
1. Frontend calls `/feeds/items` with `sinceDays` (7/30/90)
2. Backend `getFeedItems()` queries `rss_feed_cache` with date filter
3. Cache hit → returns immediately (fast)
4. If no cache rows, falls back to live scrape and populates cache

## Stale Data Handling

### Time Windows (No Table Duplication)
- **7-day view:** `published_date >= now - 7 days`
- **30-day view:** `published_date >= now - 30 days`
- **3-month view:** `published_date >= now - 90 days`

All filters happen at query time; single table stores all items ≤ 90 days old.

### Pruning Strategy
- Each cron tick calls `pruneCache(90)`
- Deletes rows where `published_date < now - 90 days`
- Never stores stale data; only fresh items in cache

## Files Modified/Created

| Action | Path | Purpose |
|---|---|---|
| CREATE | `packages/db/src/migrations/20260516300001_rss_feed_cache.ts` | New cache table |
| CREATE | `apps/backend/src/loaders/cron.loader.ts` | Cron scheduler |
| MODIFY | `apps/backend/src/loaders/index.ts` | Wire up cron |
| MODIFY | `apps/backend/src/infrastructure/repositories/rss-subscriptions.repository.ts` | Add 4 cache methods |
| MODIFY | `apps/backend/src/infrastructure/services/feeds.service.ts` | Cache-first reads, `refreshAllFeeds()` |
| MODIFY | `apps/backend/package.json` | Add `node-cron` dependency |

## Next Steps

1. **Run migrations:**
   ```bash
   cd packages/db
   bun run knex migrate:latest --knexfile ./src/knexfile.cjs
   ```

2. **Install dependencies:**
   ```bash
   cd apps/backend
   bun install
   ```

3. **Start backend:**
   ```bash
   bun run dev
   ```

4. **Verify:**
   - Check logs for `[cron] RSS cron job registered (every 30 minutes).`
   - Check logs for `[cron] Starting RSS feed refresh...` and `[cron] RSS feed refresh complete.`
   - Query database: `SELECT COUNT(*) FROM rss_feed_cache;` — should have rows
   - Open frontend Feeds page — should load from cache (fast, no live scraping)

## Benefits

✅ **Always-fresh feeds** — updated every 30 minutes, not just on user request
✅ **Improved UX** — feeds load instantly from cache (no user wait time)
✅ **No external workers** — runs in same Node.js process
✅ **Automatic cleanup** — stale data pruned on every cron tick
✅ **Graceful fallback** — if cache is empty, live scrape still works
✅ **User isolation** — each user's cache is separate (via `owner_id`)
