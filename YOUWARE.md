# YOUWARE.md

This file provides guidance to YOUWARE Agent (youware.com) when working with code in this repository.

## Project Overview

This is a mobile-first React application for learning German, specifically focused on verb conjugations and vocabulary.
- **Frontend**: React 18, TypeScript, Vite 5
- **Styling**: Tailwind CSS 3.4 (Custom "Stone" & "Brand" theme), Framer Motion (Animations)
- **State Management**: Zustand (with localStorage persistence)
- **Backend**: Cloudflare Workers + D1 Database (SQLite)
- **AI**: Google Gemini 2.5 Flash (via Youware AI SDK) for generating study content.
- **Auth**: Custom JWT-like session auth with SHA-256 hashing.

## Architecture

### Directory Structure
- `src/components/`: Reusable UI components (Glassmorphism style).
- `src/pages/`: Main route components (`StudySetList`, `StudySession`, `QuizSession`, `SetDetails`, `Login`, `Setup`).
- `src/store/`: Zustand stores (`useStudyStore` for data, `useThemeStore` for UI, `useAuthStore` for Auth).
- `src/services/`: External services (AI generation via `ai.ts`).
- `src/mock/`: Default data (`sets.ts`) used for app initialization.
- `backend/`: Cloudflare Worker code and SQL schema.

### Design System
- **Colors**: 
  - Base: `stone-50` to `stone-900` (Warm grays)
  - Brand: `brand-50` to `brand-950` (Violet/Indigo)
- **Typography**: 
  - Headings: `Playfair Display` (Serif)
  - Body: `Inter` (Sans-serif)
- **UI Patterns**: 
  - **Glassmorphism**: `.glass` and `.glass-dark` utility classes.
  - **Cards**: Rounded-2xl, soft shadows, hover lift effects.
  - **Navigation**: Bottom floating bar for mobile.

### Data Flow
1.  **Auth First**: App checks `useAuthStore` for token. If missing, shows `Login` or `Setup` (if no admin exists).
2.  **Shared Data Model**: All authenticated users can read/write ALL data. `sets` table tracks `user_id` (creator) but queries return all records.
3.  **Local First**: UI reads from Zustand store (`useStudyStore`).
4.  **Sync**: `useStudyStore` syncs with Cloudflare Backend using `Authorization: Bearer <token>`.
    - **Upsert Logic**: Backend handles updates to existing sets and inserts missing cards during sync.
    - **Full Sync**: Backend deletes and re-inserts cards during sync to ensure consistency.
    - **Manual Sync**: Users can trigger sync from Settings modal.
5.  **Persistence**: Data is stored in D1 (Backend) and localStorage (Cache).
6.  **AI Generation**: `src/services/ai.ts` uses `generateObject` with Zod schemas to create structured verb/vocabulary cards.

## Common Commands

- **Install Dependencies**: `npm install`
- **Start Dev Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Preview Build**: `npm run preview`
- **Deploy Backend**: `deploy_worker` (Use `yw_backend` tool)

## Database Schema (D1)

**Table: `users`**
- `id` (TEXT, PK): UUID
- `username` (TEXT, UNIQUE)
- `password_hash` (TEXT): SHA-256 hash
- `salt` (TEXT)
- `role` (TEXT): 'admin' | 'user'
- `created_at` (INTEGER)

**Table: `sessions`**
- `token` (TEXT, PK)
- `user_id` (TEXT, FK)
- `expires_at` (INTEGER)

**Table: `sets`**
- `id` (TEXT, PK): UUID
- `user_id` (TEXT): References `users.id` (Creator)
- `title` (TEXT)
- `description` (TEXT)
- `category` (TEXT)
- `progress` (INTEGER)
- `created_at` (INTEGER)
- `updated_at` (INTEGER)

**Table: `cards`**
- `id` (TEXT, PK): UUID
- `set_id` (TEXT, FK): References `sets.id`
- `term` (TEXT): German word/verb
- `type` (TEXT): 'verb', 'noun', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'phrase', 'other'
- `translation` (TEXT): Turkish translation
- `details` (TEXT): Extra info
- `secondary_meanings` (JSON): Array of strings
- `tenses` (JSON): Array of verb tense objects
- `examples` (JSON): Array of example objects
- `created_at` (INTEGER)

**Table: `recovery_codes`**
- `code` (TEXT, PK): User-defined password
- `user_id` (TEXT): The user ID associated with this code
- `updated_at` (INTEGER)

## Development Guidelines

1.  **Mobile First**: Always test layouts on mobile viewports (375px - 430px).
2.  **Asset Paths**: Use absolute paths `/assets/...` for static files.
3.  **Strict Types**: Maintain TypeScript strict mode.
4.  **AI Content**: Use `src/services/ai.ts` for all generation tasks.
5.  **Styling**: Use Tailwind utility classes. For complex glass effects, use the custom `.glass` class.
6.  **API Calls**: Use absolute `https://backend.youware.com/api` URL for backend calls.
7.  **Auth**: Always include `Authorization` header in API calls.
8.  **Audio Implementation**: 
    - Use `window.speechSynthesis` with robust voice selection (`de-DE`, `de_DE`, `de`).
    - **MANDATORY**: Always listen for `onvoiceschanged` to handle async voice loading on mobile.
    - **MANDATORY**: Trigger audio only on direct user interaction (click/tap) to bypass browser autoplay policies.
    - **MANDATORY**: Explicitly set `utterance.volume = 1.0`.
    - Provide visual feedback (pulsing icon) during playback.

9.  **Verb Conjugations**:
    - MUST include exactly 6 tenses: Präsens, Präteritum, Perfekt, Plusquamperfekt, Futur I, Futur II.
    - MUST include exactly 6 persons per tense: ich, du, er/sie/es, wir, ihr, sie/Sie.
    - Total 36 conjugations per verb.

10. **Data Safety**:
    - Critical actions like deletion should be guarded.
    - **Admin Only**: The "Delete Set" button is restricted to users with the 'admin' role. It is hidden for regular users to prevent accidental data loss.
    - Avoid placing destructive actions in primary navigation or list views unless properly guarded.
