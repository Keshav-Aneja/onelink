Excellent — I have a comprehensive picture of the entire codebase. Here are my
10 feature recommendations, grounded in what actually exists today and where the
product should go.

---

## 10 Feature Recommendations for OneLink

---

### 1. **Smart Tags with AI-Assisted Auto-Tagging**

**What's missing:** Collections are the only organizational axis. You have rich
metadata extraction (keywords, OG data, Dublin Core, JSON-LD) already scraped —
but it goes nowhere after storage.

**Proposal:** Add a lightweight tagging layer. When a link is saved,
auto-suggest tags derived from the already-extracted `keywords`, `author`, and
`site_description` fields. Let users confirm/dismiss suggestions. Tags become a
second filter axis alongside collections.

**Why it matters:** Nested collections work for deliberate organization but fail
for "I saved this somewhere" retrieval. Tags solve the cross-collection
discovery problem without disrupting the hierarchy.

**Effort:** Medium. DB migration for a `link_tags` junction table, update the
existing scraper metadata flow, add tag filter to `LinksContent`.

---

### 2. **Broken Link Health Monitor**

**What's missing:** Once a link is saved, there's zero feedback if it goes dead.
No `last_checked`, no `status_code` field anywhere in the schema.

**Proposal:** A background job (can run in the Express server on a cron, or as a
separate worker) that periodically HEADs all links and marks them with a status
— alive, redirected (with new URL), or dead. Surface dead links prominently with
a "Broken Links" section in the sidebar, similar to "Favourites."

**Why it matters:** A bookmark manager's core promise is "find it later." Dead
links silently break that promise. This is table-stakes for a professional tool.

**Effort:** Medium. Add `status`, `redirect_url`, `last_checked_at` columns to
`links`. Write a health-check service. Add UI indicator on
`LinkCard`/`LinkListItem`.

---

### 3. **Browser Extension — One-Click Save with Collection Picker**

**What's missing:** The extension (`popup.tsx`) currently manages sessions and
configuration but has **no save-current-page functionality**. There's no
integration with the backend API from the extension.

**Proposal:** The primary action in the extension popup should be a single large
"Save This Page" button that shows the current tab's favicon + title, then lets
you pick a collection from a searchable dropdown of your existing collections.
One click to save, optional metadata edit inline.

**Why it matters:** This is the fundamental loop of a bookmark manager — the
extension is the primary entry point for new users. Right now it doesn't do the
core job. This is the highest-priority fix.

**Effort:** High. Requires calling the OneLink API from the extension (auth
token management, `POST /links`), fetching user collections, and building the
picker UI. The `@onelink/action` package already has API wrappers — extend them
to work in extension context.

---

### 4. **Link Reading Mode / Cached Snapshots**

**What's missing:** No archiving. You fetch metadata at save-time but never
cache page content.

**Proposal:** When a link is saved, optionally store a lightweight text snapshot
(via the existing Cheerio scraper — it already fetches full HTML). Expose a
"Read" mode that renders the cleaned article text inside OneLink, similar to
Pocket's reader. This also serves as an archive if the original goes down.

**Why it matters:** Combines the broken link problem (item 2) with the core
reading use case. Positions OneLink against Pocket/Instapaper, not just browser
bookmarks.

**Effort:** High. Add a `snapshot` text field (or store in object storage like
GCS). Modify scraper to extract article body (could use `@mozilla/readability`).
Build a clean reader UI component.

---

### 5. **Import / Export (Browser Bookmarks, CSV, Raindrop)**

**What's missing:** No import or export of any kind. Zero migration path in or
out.

**Proposal:**

- **Import**: Browser bookmark HTML file (the standard Netscape format all
  browsers export), CSV, and Raindrop.io JSON.
- **Export**: Same formats, plus a clean JSON schema for full data portability.

The collection hierarchy maps cleanly to bookmark folders. Link metadata you've
already stored (title, URL, favicon) covers everything needed.

**Why it matters:** Every new user has existing bookmarks. Without import,
onboarding friction is fatal. Without export, power users won't trust the
platform with their data.

**Effort:** Medium. Parse Netscape HTML with a simple DOM traversal (you already
use Cheerio). Write a bulk-insert endpoint. Export is a simple serialization of
existing data.

---

### 6. **Collection "Smart Filters" / Saved Searches**

**What's missing:** Search (`GET /links/search`) exists but results are
ephemeral — there's no way to save a search as a persistent virtual collection.

**Proposal:** Let users save a query (e.g., "all starred links tagged 'research'
added in the last 30 days") as a "Smart Collection" that appears in the sidebar
like any other collection but is dynamically populated. This is similar to
Finder Smart Folders or Gmail filters.

**Why it matters:** Power users with hundreds of links need dynamic views, not
just static organization. This also makes tags (item 1) dramatically more
useful.

**Effort:** Medium. Add a `saved_searches` table with a JSON
`filter_definition`. The query engine already handles most filter predicates —
just parameterize them.

---

### 7. **Keyboard-First Navigation & Command Palette**

**What's missing:** No keyboard shortcuts anywhere in the UI. No command
palette. Despite sophisticated UI with modals, breadcrumbs, and multiple view
modes, everything requires mouse clicks.

**Proposal:** A `Cmd+K` / `Ctrl+K` command palette that lets power users: jump
to any collection, create a link, search, toggle view mode, and navigate
breadcrumbs — all without touching the mouse. Additionally, `J/K` for navigating
link lists, `S` to star, `Enter` to open, `Del` to delete with confirmation.

**Why it matters:** The target user for a bookmark manager is a developer or
knowledge worker who lives in the keyboard. This is the single biggest UX gap
for that segment.

**Effort:** Medium. A headless `cmdk`-style component (or the `cmdk` library
itself) wired to existing Redux actions. No backend changes needed.

---

### 8. **RSS Dashboard & Feed Discovery**

**What's missing:** RSS subscription exists but is buried — you subscribe
per-link and view all updates in a flat notifications list. There's no way to
see "what feeds am I subscribed to" or manage them centrally. OPML import/export
is absent.

**Proposal:** A dedicated "Feeds" section (alongside Collections, Favourites,
Notifications) that shows:

- All subscribed feeds with last-updated time and unread count
- Feed health (last successful fetch)
- OPML import to batch-subscribe
- OPML export for portability
- Per-feed "Mark all read" action

**Why it matters:** The RSS feature is currently a hidden gem. Making it a
first-class interface turns OneLink into a legitimate Feedly/NewsBlur competitor
for the technical user base — a meaningful product differentiator.

**Effort:** Medium-High. Requires an `rss_subscriptions` table decoupled from
individual links, a feed reader state model (read/unread per item), and new
frontend sections. The scraper already works.

---

### 9. **Annotation & Notes on Links**

**What's missing:** Links have `description` (auto-extracted) but no
user-written notes. There's no way to add context like "read chapter 3 only" or
"this contradicts what we discussed."

**Proposal:** A `notes` field on each link — a simple rich-text (or even
Markdown) editor that opens in the link detail modal. Notes are searchable
(extend the existing full-text search). Optionally, allow highlights with a
browser extension content script (you already have the content script
placeholder).

**Why it matters:** The difference between a bookmark and a knowledge base entry
is annotation. This is what separates power users from casual users and creates
stickiness.

**Effort:** Low-Medium. Add `notes` text column to `links`. Add a Markdown
editor (e.g., `@uiw/react-md-editor`) to `LinkDetailsCard`. Extend the search
endpoint to include `notes` in the FTS query.

---

### 10. **Collaborative Collections with Role-Based Access**

**What's missing:** Sharing exists (both public token and user-to-user) but it's
view-only. There's no "contributor" role that lets a shared user add links. The
`Shares` table has no `role` or `permission_level` field.

**Proposal:** Add two roles to user-to-user sharing: **Viewer** (current
behavior) and **Contributor** (can add/edit links within the shared collection
but cannot delete the collection or change sharing settings). Surface this in
the `ShareModal` as a role picker.

**Why it matters:** Teams and couples sharing research collections, travel
lists, or reading lists all hit this wall immediately. Viewer-only sharing is a
demo feature; contributor sharing is a collaborative tool. This is what enables
the "team knowledge base" use case.

**Effort:** Medium. Add `role` enum (`VIEWER`, `CONTRIBUTOR`) to the `Shares`
table. Update `UserSharesService` authorization checks to allow link creation
for contributors. Update `ShareModal` and the shared collection UI.

---

## Priority Order (my take as a CTO)

| #   | Feature                    | Impact   | Effort | Do When          |
| --- | -------------------------- | -------- | ------ | ---------------- |
| 3   | Extension Save Button      | Critical | High   | Now — this is P0 |
| 5   | Import/Export              | Critical | Medium | Now — onboarding |
| 2   | Broken Link Monitor        | High     | Medium | Sprint 2         |
| 7   | Keyboard / Command Palette | High     | Medium | Sprint 2         |
| 9   | Link Annotations/Notes     | High     | Low    | Sprint 2         |
| 1   | AI-Assisted Tags           | High     | Medium | Sprint 3         |
| 8   | RSS Dashboard              | Medium   | High   | Sprint 3         |
| 10  | Collaborative Roles        | Medium   | Medium | Sprint 3         |
| 6   | Smart Collections          | Medium   | Medium | Sprint 4         |
| 4   | Reading Mode/Snapshots     | Medium   | High   | Sprint 4         |

The extension save button (#3) and import/export (#5) are not nice-to-haves —
they are the difference between a tool people try and a tool people adopt.
Everything else builds on top of a healthy user base that actually uses the
extension daily.
