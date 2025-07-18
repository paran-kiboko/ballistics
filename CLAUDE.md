# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 Korean-first international web application serving as a prototype boilerplate. The project uses App Router with TypeScript and is designed for multi-platform deployment including React Native WebView integration.

## Development Commands

```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build  
npm run start    # Production server
npm run lint     # ESLint check
npm install      # Install dependencies
```

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components, SCSS
- **State Management**: Redux Toolkit
- **Authentication**: NextAuth.js (Google & Apple OAuth, JWT 30-day sessions)
- **Database**: Supabase (PostgreSQL)
- **Internationalization**: i18next (6 languages, Korean primary)
- **Analytics**: Firebase Analytics + Vercel Analytics

## Architecture

### App Router Structure (`/app`)
- API routes handle authentication, CRUD, and analytics
- Page-based routing with authentication protection
- Shared layouts and providers for theme/state management

### Component System
- **shadcn/ui**: Complete UI component library (50+ components)
- **Common components**: Modal system, loading states in `/components/common`
- **Theme provider**: Dark/light/system theme support

### State Management
- **Redux Toolkit** with main admin slice in `/lib/store`
- Global state: loading, user info, theme, dev mode
- Actions and reducers centralized

### Service Layer (`/service/Svc.ts`)
- Business logic centralization
- WebView communication for React Native integration
- Event logging and analytics tracking
- Error handling utilities

## Key Patterns

### Multi-Platform Support
- React Native WebView integration via message passing
- Storage synchronization across web/native platforms
- Platform-specific conditional rendering

### Korean-First Internationalization
- Primary language: Korean, auto-detection enabled
- 6 supported languages with nested translation keys
- Translation files in `/app/i18n/locales`

### Authentication Flow
- NextAuth.js with automatic Supabase user synchronization
- Route protection with redirect logic in middleware
- Session management with JWT strategy

### Analytics Integration
- Dual analytics: Firebase + Vercel for comprehensive tracking
- Custom event logging with user identification
- Element click tracking via CSS classes

## Environment Configuration

### Development Mode
Set `NEXT_PUBLIC_PRODUCT_MODE=local` for development

### Required Environment Variables
- NextAuth secret and OAuth credentials (Google, Apple)
- Supabase connection strings
- External service keys: LogSnag, Channel.io, Slack

## TypeScript Setup
- Strict mode enabled with absolute imports (`@/` prefix)
- Custom NextAuth type definitions
- Path mapping configured for clean imports

## Important Notes

- React strict mode is disabled in Next.js config
- The project includes AI integration features with OpenAI API
- Analytics events are tracked through custom service layer
- Tailwind uses custom theme variables for consistent styling