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
docker-compose up -d    # Start all services (API, DB, pgAdmin, LocalStack)
docker-compose down     # Stop all services
docker-compose logs -f api  # View API logs
```

The Go backend uses Air for hot-reloading - changes to `.go` files automatically rebuild.

### Environment Setup
1. Copy `.env.example` to `.env` in the root directory
2. The frontend requires a `.env.local` file with:
   - `NOTION_DATABASE_ID` - Your Notion database ID
   - `NEXT_PUBLIC_API_BASE_URL` - Backend API URL

## Architecture

### Frontend Structure
- **App Router**: Uses Next.js 14 App Router pattern
- **Public Routes**: `/blog/posts`, `/blog/posts/[id]` 
- **Admin Routes**: `/admin/image`, `/admin/tag`
- **API Routes**: `/api/blog/posts`, `/api/images`
- **Content Source**: Notion as headless CMS
- **Styling**: Tailwind CSS with Typography plugin
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