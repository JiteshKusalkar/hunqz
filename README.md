# Hunqz Monorepo

A small Nx monorepo that delivers the same profile-image experience through two frontend applications backed by a shared internal API layer.

## Overview

This repository contains:

- **`apps/api-server`** — an Express API that hides the upstream Hunqz endpoints and exposes only simplified internal routes.
- **`apps/web-next`** — a Next.js SSR app that renders the profile gallery on the server.
- **`apps/web-react`** — a React SPA that renders the same profile gallery on the client.
- **`libs/api`** — a shared fetch helper for typed JSON requests.
- **`libs/app-types`** — shared TypeScript models for raw upstream data and app-level data.
- **`libs/ui`** — a reusable UI library containing the shared `ProfileCard` component.

The current implementation fetches the profile for **`msescortplus`** through the internal API and displays images in both frontend apps.

## Architecture

### Internal API abstraction

The repository intentionally avoids calling the upstream Hunqz API directly from the frontend apps.

Instead, the frontend apps talk to the local Express server:

- `GET /profiles/:profileName`
- `GET /images/:token`
- `GET /health`

This gives the app a clean abstraction boundary:

- upstream URLs stay hidden from the browser
- data mapping is centralized on the server
- image URLs are normalized before reaching the frontend
- backend-side error handling is easier to control

### Shared code

The monorepo uses shared libraries to reduce duplication:

- **shared types** in `libs/app-types`
- **shared API helper** in `libs/api`
- **shared card UI** in `libs/ui`

### Rendering split

- **Next.js app** demonstrates server-side rendering
- **React app** demonstrates client-side rendering with React Query

## Tech stack

- **Nx** for monorepo orchestration
- **TypeScript** for type safety
- **Next.js** for SSR frontend
- **React + Vite** for SPA frontend
- **Express** for internal API routes
- **Tailwind CSS** for styling
- **React Query** in the SPA for data fetching and caching
- **Vitest + Supertest + MSW** for testing and network mocking
- **Husky + Commitlint + lint-staged** for repo hygiene

## Project structure

```text
apps/
  api-server/     Express internal API
  web-next/       Next.js SSR app
  web-react/      React SPA

libs/
  api/            shared fetch helper
  app-types/      shared domain and raw API types
  ui/             shared UI components
```

## Implemented features

### API server

- Express server with CORS support
- Health endpoint: `GET /health`
- Profile endpoint: `GET /profiles/:profileName`
- Image proxy endpoint: `GET /images/:token`
- Centralized custom error class and error handler
- Mapping from raw upstream payloads into app-friendly types
- Cache headers set on image responses

### Next.js app (`apps/web-next`)

- Server-rendered page using App Router
- Fetches the profile from the internal API
- Shared gallery UI using the shared `ProfileCard`
- Graceful fallback UI when profile loading fails

### React app (`apps/web-react`)

- Client-rendered SPA
- Uses React Query for profile fetching
- Shared gallery UI using the shared `ProfileCard`
- Loading and error states at the page level

### Shared libraries

- Shared profile types for both frontend and backend usage
- Shared fetch utility with typed responses
- Shared presentational card component used by both apps

### Testing

- API tests cover:
  - `/health`
  - `/profiles/:name`
  - `/images/:token`
- MSW is used to mock the upstream Hunqz profile API and image CDN

## Environment variables

Copy `.env.example` to `.env` and fill in the values.

```env
PORT=
API_PUBLIC_URL=
HUNQZ_API_BASE_URL=
HUNQZ_IMAGE_CDN_BASE_URL=
CORS_ORIGINS=
VITE_API_BASE_URL=
```

### Meaning of variables

- `PORT` — port for the Express API server
- `API_PUBLIC_URL` — public base URL of the API server used to generate image/profile URLs
- `HUNQZ_API_BASE_URL` — upstream Hunqz API base URL
- `HUNQZ_IMAGE_CDN_BASE_URL` — upstream image CDN base URL
- `CORS_ORIGINS` — comma-separated allowed frontend origins
- `VITE_API_BASE_URL` — API base URL used by the React SPA

## Local development

### Install dependencies

```bash
pnpm install
```

### Run everything

```bash
pnpm dev
```

This starts:

- API server
- Next.js app
- React app

### Run individual apps

```bash
pnpm dev:api
pnpm dev:next
pnpm dev:react
```

## Quality commands

```bash
pnpm lint
pnpm test
pnpm build
pnpm verify
```

## API contract

### `GET /health`

Returns:

```json
{ "status": "ok" }
```

```

### `GET /images/:token`

Proxies the image from the upstream CDN and returns binary image data with cache headers.

## Design decisions

### Why an internal API layer?

The internal API layer keeps the browser isolated from the upstream Hunqz service. That improves maintainability and gives a safer place to:

- map raw response shapes
- hide upstream implementation details
- standardize errors
- centralize image URL generation

### Why shared types?

Both the API and frontend apps consume the same data contract. Shared types reduce drift and make refactoring safer.

### Why a shared UI library?

Using a shared `ProfileCard` ensures both apps present the gallery consistently and reduces duplicated markup and styling.

## Current limitations

- The profile is currently hardcoded to `msescortplus` in both frontend apps
- The API currently proxies a single token-based image route without size variants
- The React app is a single page and does not yet use client-side routing
- Image rendering uses a plain `<img>` tag without fallback support
- Next.js error handling is done inline rather than through route-level error boundaries

## Suggested improvements

These are strong next steps that would improve architecture, resilience, and UX:

### 1. Introduce Jotai for lightweight shared client state

Jotai could be useful in the app layer for UI state such as:

- selected profile
- gallery filters
- active image index
- global error or toast state

It should live in the app layer, not inside the pure type package. `libs/app-types` should stay focused on type definitions only.

### 2. Add Shadcn UI components

Shadcn would improve consistency and speed up UI enhancements for:

- cards
- alerts
- skeleton loaders
- buttons
- dialogs
- empty/error states

A good approach would be to keep reusable primitives in `libs/ui` and compose them inside both apps.

### 3. Replace plain `<img>` with an image component that supports fallback

Right now `ProfileCard` uses a native `<img>`. A better option would be an image component with fallback behavior so broken image URLs degrade gracefully.

Potential benefits:

- better UX when image loading fails
- placeholder initials or fallback artwork
- easier loading-state handling

### 4. Add error boundaries

Error boundaries would make both apps more resilient.

Recommended areas:

- route-level error boundary in Next.js using `error.tsx`
- React error boundary around gallery/content sections in `web-react`
- optional retry affordance for recoverable failures

### 5. Add routing to `web-react`

The React app is currently a single-page view. Adding routing would make the SPA feel more complete.

Possible routes:

- `/` — landing page or profile search
- `/profiles/:profileName` — gallery page
- `/about` or `/health-check` — optional supporting routes

This would also make the React app closer in capability to the Next.js app.

## Future Scope

- **Use of Jotai for State Management**
  - Introduce Jotai for efficient and scalable state management at the application level
  - Keep `app-types` strictly for type definitions and avoid mixing state logic

- **Adoption of ShadCN UI**
  - Integrate ShadCN components for a consistent and accessible design system
  - Replace custom UI components with standardized ones

- **Image Component with Fallback Support**
  - Implement a reusable Image component with fallback handling
  - Display a placeholder (e.g., initials or default avatar) when image loading fails

- **Error Boundaries**
  - Add React Error Boundaries to catch runtime errors
  - Prevent full application crashes and show fallback UI

- **Improved Routing in `web-react`**
  - Introduce structured routing using libraries like `react-router-dom`
  - Support nested and dynamic routes for better scalability

```
