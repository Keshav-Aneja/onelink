# Onelink

**One-stop solution for organizing and managing all your important links.**

## Problem

While browsing the web, we encounter valuable resources—blogs, documentation, articles, research papers, and more. However, browser bookmarks aren't an ideal solution. We all know the feeling: bookmarks get forgotten, and those resources we promise to "read later" disappear into a bookmark black hole.

Onelink solves this by providing a structured application where you can organize links into nested collections, subscribe to RSS feeds for updates, and quickly access everything you've saved.

## Why I Built This

I took a break from coding and wanted to get back on track while improving my development practices. I was personally struggling with link organization, so I decided to build my own solution rather than settle for existing tools.

## Features

### Link Management
- **Create Links** with automatic metadata extraction (titles, descriptions, keywords, author information)
- **Edit Links** to update names, descriptions, and metadata
- **Delete Links** with confirmation dialogs
- **Star/Favorite Links** for quick access
- **Search Links** using full-text search across all collections
- **Link Details View** displaying comprehensive metadata
- **Automatic Deduplication** using link fingerprinting
- **Open Graph Support** for rich preview images

### Collection Management
- **Nested Collections** with unlimited hierarchy depth (folders within folders)
- **Password Protection** for sensitive collections using SHA256 hashing
- **Color-Coded Collections** for visual organization
- **Collection Statistics** showing counts of links and sub-collections
- **Recursive Operations** for deleting collections with all nested content
- **Collection Descriptions** for documentation

### Smart Clipboard Integration
- **Auto-Detect URLs** from clipboard when pasting (Ctrl+V / Cmd+V)
- **Bulk Import** multiple URLs at once from clipboard text
- **Automatic Link Creation** with validation and metadata extraction
- **Visual Feedback** showing operation progress

### RSS Feed & Notifications
- **RSS/Atom Feed Detection** automatically finds feeds on websites
- **Subscribe to Links** for automatic content updates
- **Notification Center** aggregating all feed items
- **Time-Based Filtering** (last 24 hours, week, month, 3/6/12 months, 5 years)
- **YouTube Channel Support** with automatic feed detection
- **Redis Caching** (3-hour TTL) for optimized performance

### Authentication & Security
- **OAuth 2.0** integration with Google and GitHub
- **Session Management** with secure cookie-based authentication
- **Protected Routes** ensuring authorized access
- **Password-Protected Collections** with verification
- **User Profile Management**

### Data Synchronization
- **Periodic Auto-Sync** with configurable intervals
- **Visibility-Based Sync** when switching browser tabs
- **Optimized State Management** using Redux and memoized selectors
- **Real-Time Updates** across the application

### Sharing (Infrastructure)
- **Collection Sharing** with other users
- **Deep Sharing** (recursive access to nested items)
- **Shallow Sharing** (limited access to specific collection)
- **Share Management** (create, update, delete permissions)

### Web Scraping & Metadata
- **Automatic Website Scraping** using Cheerio
- **Metadata Extraction** (title, description, keywords, author)
- **RSS/Atom Feed Discovery** from HTML
- **Open Graph Image Extraction**
- **Expired Certificate Handling** for sites with HTTPS issues
- **URL Validation** and sanitization

### User Interface
- **Dark Theme** with modern, responsive design
- **Grid Layouts** optimized for different screen sizes
- **Skeleton Loaders** for smooth loading states
- **Breadcrumb Navigation** for hierarchical browsing
- **Modal Dialogs** for creating links and collections
- **Confirmation Dialogs** for destructive actions
- **Animated Mascot** component for visual appeal

### Performance & Optimization
- **Redis Caching** for RSS feed data
- **Memoized Selectors** reducing unnecessary re-renders
- **Optimized Database Queries** with proper indexing
- **O(n) Path Generation** algorithm
- **Lazy Loading** for components
- **Debounced Event Handlers**

### Testing & Quality
- **Unit Tests** using Vitest
- **TypeScript Strict Mode** for type safety
- **ESLint Configuration** for code quality
- **Monorepo Structure** with TurboRepo

## Technologies Used

### Frontend
- React 19
- TypeScript
- TailwindCSS v4
- React Router v7
- Redux Toolkit
- TanStack React Query (Redux Query)
- Vite
- Vitest

### Backend
- Express.js
- TypeScript
- PostgreSQL
- Knex.js
- Redis
- OAuth 2.0
- Cheerio (Web Scraping)
- Zod (Validation)

### Infrastructure
- Docker
- GitHub Actions (CI/CD)
- Google Cloud Platform (GCP)
- TurboRepo (Monorepo)
- Bun (Package Manager)

## Apps & Packages

- **`web`** - Vite-React application (Frontend)
- **`backend`** - Express.js server (Backend)
- **`@onelink/typescript-config`** - Shared TypeScript configuration
- **`@onelink/eslint-config`** - Shared ESLint configuration
- **`@onelink/db`** - Database configurations, migrations, and schema
- **`@onelink/entities`** - Types, interfaces, schemas, and error types
- **`@onelink/action`** - Action response wrapper utilities
- **`@onelink/scraper`** - Website scraping and metadata extraction
