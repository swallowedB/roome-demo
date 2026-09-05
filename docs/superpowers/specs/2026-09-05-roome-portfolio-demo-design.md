# RoomE Portfolio Demo Design

## Goal

Publish RoomE as a public portfolio demo under the existing blog domain while preserving a real music-search experience without exposing any provider secrets.

## Product boundary

This repository is the standalone `roome-demo` repository.  It remains separate from the blog repository: the blog's future `/demos` page links to this deployment, and RoomE is served from a dedicated subdomain such as `roome.<blog-domain>`.

The public demo is not the original production service.  It must never call the original RoomE backend, require OAuth, use payments, or open a WebSocket connection.  A visitor can enter immediately and interact with seeded data.  Changes are kept in browser memory only and reset on refresh.

## Experience to preserve

1. The onboarding page is the public entry.  Its CTA starts the demo without social login.
2. The main hive, the seeded user's room, room theme/furniture controls, the CD rack, CD details, CD comments/templates, and the guestbook are usable against demo-session data.
3. Adding a CD searches the real Spotify catalog, then obtains the matching YouTube URL and duration from the real YouTube Data API.  The selected CD is added to the in-memory rack for that browser session.
4. A visible, non-intrusive notice explains that this is a portfolio demo and that changes reset on refresh.

## Experience to exclude

1. OAuth login/logout, refresh tokens, original API URLs, payments, and WebSockets do not run in demo mode.
2. Notifications, housemate management, profile editing, books/bookcase, points, events, and any original-backend-only navigation are hidden from the public demo entry points.
3. The demo does not persist user-created data or impersonate a real user.

## Architecture

### Frontend

`VITE_APP_MODE=demo` selects the public-demo behavior.  In that mode, `ProtectedRoute` seeds a fictional RoomE user and permits protected screens without authentication.  Small API branches delegate only the displayed flows to a single module-level in-memory demo backend.  The existing production API functions remain the path when the mode is not `demo`.

The frontend calls two same-origin endpoints only for real music metadata:

- `GET /api/music/search?q=<query>` returns Spotify track results in the existing `CDSearchResult` shape.
- `GET /api/music/video?title=<title>&artist=<artist>` returns `{ youtubeUrl, duration }`.

The frontend contains neither Spotify nor YouTube credentials.  It uses `fetch`, validates an unsuccessful response, and retains the current search UI and CD mapper.

### Cloudflare Pages Functions

Cloudflare Pages serves the Vite static output and the two `functions/api/music/*.ts` endpoints from the same origin.  Provider credentials are read only from Cloudflare encrypted bindings:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `YOUTUBE_API_KEY`

The functions validate required query parameters, constrain input length, request provider APIs directly, return only the response data used by the UI, and return a generic failure response without provider error details.  A module-scoped Spotify token cache is sufficient for this portfolio demo; it is an opportunistic performance optimization, not persistent storage.

## Data and state rules

- Use explicitly fictional seed names and data.
- Keep demo state in module memory, not `localStorage`, cookies, a database, or a hosted backend.
- Seed enough room, rank, CD, guestbook, comment, and template data to avoid empty or failing pages in the supported path.
- New CD, comment, template, guestbook, theme, and furniture changes are observable during the open session and disappear after refresh.
- The demo racks never report capacity exhaustion; upgrade actions are no-ops that return a successful demo response.

## Deployment contract

- Build command: `pnpm build`
- Build-time environment variable: `VITE_APP_MODE=demo`
- Output directory: `dist`
- Pages Functions directory: repository-root `functions`
- No `.env`, `.dev.vars`, credential, or original service URL may be committed.
- `.dev.vars.example` may list binding names with blank values; `.dev.vars*` is ignored.

## Verification contract

1. Targeted tests prove the in-memory backend's observable CRUD and paging behavior, and Pages Function input/error behavior with mocked provider `fetch`.
2. `pnpm test:demo` and `pnpm build` must pass before commit.
3. The repository-wide `pnpm type-check` is currently known to fail with pre-existing source errors reproduced from the original repository; it is reported separately and is not broadened into this demo conversion.
