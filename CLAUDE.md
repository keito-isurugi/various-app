# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

kei-talk is a full-stack blog platform with content syndication capabilities. The project consists of:
- **Frontend**: Next.js 14 application with Notion CMS integration
- **Backend**: Go API server for image management (uses Clean Architecture)
- **Infrastructure**: Docker Compose setup with PostgreSQL, pgAdmin, and LocalStack

## Development Commands

### Frontend Development
```bash
cd frontend
npm install          # Install dependencies
npm run dev         # Start development server (http://localhost:3000)
npm run build       # Build for production
npm run test        # Run Jest tests
npm run format      # Format code with Biome
```

### Backend Development
```bash
# All backend services run via Docker Compose
docker-compose up -d    # Start all services (API, DB, pgAdmin, LocalStack, Firebase Emulator)
docker-compose down     # Stop all services
docker-compose logs -f api  # View API logs
docker-compose up firebase-emulator  # Start only Firebase Emulator for TODO app
```

The Go backend uses Air for hot-reloading - changes to `.go` files automatically rebuild.

### TODO App Development
```bash
cd frontend
npm run dev:all         # Start Next.js dev server + Firebase Emulator
npm run emulator        # Start Firebase Emulator only
```

### Environment Setup
1. Copy `.env.example` to `.env` in the root directory
2. The frontend requires a `.env.local` file with:
   - `NOTION_DATABASE_ID` - Your Notion database ID
   - `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
   - Firebase credentials (for TODO app) - see `frontend/.env.example`
   - `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` for local development

## Architecture

### Frontend Structure
- **App Router**: Uses Next.js 15 App Router pattern
- **Public Routes**: `/blog/posts`, `/blog/posts/[id]`, `/todo`, `/todo/dashboard`
- **Admin Routes**: `/admin/image`, `/admin/tag`
- **API Routes**: `/api/blog/posts`, `/api/images`
- **Content Source**: Notion as headless CMS
- **Data Storage**: Firebase Firestore (TODO app)
- **Styling**: Tailwind CSS v4 with Typography plugin
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Code Style**: Biome with tabs and double quotes

### Backend Structure
- **Clean Architecture**: domain → application → infrastructure → presentation
- **Database**: PostgreSQL with GORM ORM
- **Storage**: AWS S3 (LocalStack for local dev)
- **API Framework**: Echo v4
- **Logging**: Zap structured logging

### Key Features
1. **Blog System**:
   - Fetches content from Notion
   - Converts to markdown files
   - Auto-commits to Git
   - Publishes to Qiita and Zenn
   - Posts to Twitter/X

2. **Image Management**:
   - Upload to S3
   - Tag management
   - Many-to-many image-tag relationships

3. **TODO App** (`/todo`):
   - Task management with calendar views (month/week/day)
   - Category/tag organization
   - Progress tracking (daily/weekly/monthly)
   - Dashboard with statistics and analytics
   - CSV import/export
   - Firebase Firestore for data persistence
   - Firebase Emulator for local development

## Database
PostgreSQL migrations are in `/backend/DDL/` and auto-apply on container start:
- `000001_create_images_table.up.sql`
- `000002_create_tags_table.up.sql`  
- `000003_create_image_tags_table.up.sql`

Access pgAdmin at http://localhost:5050 with credentials from `.env`.

## Testing
- Frontend: `npm run test` (Jest with jsdom)
- Backend: No test files currently exist

## API Endpoints
- `/api/images` - Image CRUD operations
- `/api/tags` - Tag CRUD operations
- `/api/image-tags` - Image-tag relationships
- `/api/blog/posts` - Blog posts from Notion
- `/api/blog/posts/[id]` - Individual blog post

## Common Development Tasks
- **Add new API endpoint**: Create handler in `/backend/presentation/handler/`, add route in `/backend/server/router.go`
- **Add new page**: Create directory in `/frontend/src/app/`
- **Update database schema**: Add migration file to `/backend/DDL/`, restart Docker services
- **Format frontend code**: Run `npm run format` in frontend directory

## IMPORTANT: Code Quality Requirements

**CRITICAL**: After making ANY changes to frontend code (TypeScript/TSX files), you MUST:

1. **Run Biome check**:
   ```bash
   cd frontend
   npx biome check src/
   ```

2. **Fix all errors before committing**:
   - Fix linting errors reported by Biome
   - Apply safe fixes with `npx biome check --write src/`
   - Apply unsafe fixes if needed with `npx biome check --write --unsafe src/`
   - Never commit code with Biome errors

3. **Common fixes**:
   - Add `type="button"` to all `<button>` elements
   - Use `Number.isNaN()` instead of `isNaN()`
   - Wrap variables in switch cases with `{ }`
   - Add all dependencies to `useEffect` dependency arrays or use `useCallback`

This is enforced by pre-commit hooks (husky + lint-staged) and will block commits if errors exist.