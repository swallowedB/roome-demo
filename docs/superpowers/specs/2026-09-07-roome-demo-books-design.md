# RoomE Public Demo Books Design

## Goal

Add a complete, public demo book experience: visitors can search real Aladin book metadata and cover images, place selected books on the fictional user's bookshelf, and create, edit, or delete reviews without calling the original RoomE backend.

## Product Boundary

The public demo remains a standalone client hosted by Cloudflare Pages. Aladin is used only for search metadata: title, author, publisher, publication date, cover URL, and categories. The demo never requests book text or a visitor's personal Aladin data.

The search request is made by a Cloudflare Pages Function. The Aladin TTB key is an encrypted Cloudflare secret and is never sent to the browser, committed to the repository, or named with a `VITE_` prefix. Bookshelf contents and reviews belong to the existing module-memory demo backend, reset on refresh, and never call the original RoomE backend.

## Experience

1. The fictional current user's room starts with a visible bookshelf containing seeded books. The preference panel displays both the music rack and bookshelf controls.
2. Selecting the bookshelf opens `/bookcase/:userId` in demo mode. The existing shelf, add-book modal, list, deletion controls, and review screens remain the UI.
3. A book search calls `GET /api/books/search?q=<query>` on the same origin. Results use live Aladin metadata and covers.
4. Selecting a result adds it to the in-memory bookshelf. The shelf and list update immediately, and the room's displayed book count reflects the stored demo value the next time it is loaded.
5. Opening a book supports review creation, modification, and deletion. Seeded reviews demonstrate the reader view; all review writes reset on refresh.
6. Demo shelves never report capacity exhaustion. The existing bookshelf upgrade action returns a harmless demo result.
7. The existing demo remains unchanged for OAuth, payments, notifications, points, profiles, events, and WebSockets.

## Architecture

### Aladin Pages Function

Create `functions/api/books/search.ts`. It accepts only `GET`, takes a required `q` query parameter, rejects blank or over-120-character values using the existing `getRequiredQuery` helper, and reads `ALADIN_TTB_KEY` from `context.env`.

It calls Aladin `ItemSearch.aspx` with `Query`, `QueryType=Keyword`, `SearchTarget=Book`, `MaxResults=10`, `Cover=Big`, `output=js`, and the required TTB key. It returns `{ item: [...] }` so the existing `useSearch('BOOK')` mapping continues to work unchanged. Each returned item includes `isbn`, `title`, `author`, `publisher`, `pubDate`, `cover`, `categoryId`, and `categoryName`. A missing key, invalid provider response, or upstream failure returns only `{ error: 'book search is unavailable' }` with status 502.

The new Function reuses `FunctionContext`, `fetchJson`, `getRequiredQuery`, and `json` from `functions/api/music/_shared.ts`; it does not duplicate credentials or browser-facing secrets. A dedicated `functions/api/books/booksFunctions.test.ts` covers missing query, correct Aladin request/response mapping, and generic unavailable handling.

### Frontend API Boundary

Add a small `requestBooks` fetch helper beside `requestMusic`. In demo mode, `bookAPI.searchAladinBooks` calls `/api/books/search?q=<encoded query>` through that helper. Outside demo mode it keeps the existing original-service request.

In demo mode, every book operation used by existing screens routes to `demoBackend`: shelf list, add/delete, book detail, get/add/update/delete review, and bookshelf upgrade. Its production branch and signatures stay unchanged.

The bookcase and book/review routes are no longer wrapped in `ServiceOnly` in demo mode. Other service-only routes retain their redirect.

### In-Memory Book State

Extend `src/demo/demoBackend.ts` with explicit TypeScript-only demo book and review records. Seed the current user (`userId: 101`) with two book records and one review. Store a monotonically increasing in-memory book ID for added Aladin results.

Expose these methods, all using cloned return values:

- `getBookcase(userId, pageSize, lastBookId?, keyword?)`
- `addBook(book, userId)`
- `deleteBooks(userId, myBookIds)`
- `getBookDetail(myBookId)`
- `getBookReview(myBookId)`
- `saveBookReview(myBookId, review)`
- `deleteBookReview(myBookId)`
- `upgradeBookshelf(roomId)`

The current room seed has `BOOKSHELF.isVisible: true`, `savedBooks: 2`, `writtenReviews: 1`, and book genres matching its seeded records. The bookshelf remains configurable through the existing `toggleFurniture` method.

## UI Changes

- `PreferenceSetting` always renders the existing book card; remove its demo-only condition.
- `Router` permits `/bookcase/:userId`, `/book/:bookId`, and `/book/:bookId/user/:userId` for demo users.
- No new book UI components are introduced. Existing `BookCasePage`, `SearchModal`, `DataList`, `BookPage`, and review editor/viewer consume the augmented API contract unchanged.

## Deployment and Documentation

- Add `ALADIN_TTB_KEY=` to `.dev.vars.example`.
- Add `ALADIN_TTB_KEY` to the Cloudflare Pages Secrets table in `README.md` and state that live book searches, like music searches, require Pages Functions after deployment.
- Update `docs/superpowers/specs/2026-09-05-roome-portfolio-demo-design.md`: books and bookcase move from excluded flows to preserved flows, while their data-reset rule remains unchanged.
- Extend the provider-Functions test command to compile and run the books Function test alongside the existing music Function test.

## Verification

1. `pnpm test:demo` proves seeded book retrieval, add/delete behavior, and review CRUD against the module-memory backend.
2. The provider Function tests prove missing-query validation, Aladin mapping, and generic provider errors without real network requests.
3. `pnpm test:hive-spatial-index`, `pnpm test:demo`, the provider-Functions test, and `VITE_APP_MODE=demo pnpm build` pass.
4. In a deployed Pages environment with `ALADIN_TTB_KEY` set, searching a Korean title displays live cover metadata, adding it appears on the shelf, and review writes persist until refresh only.

## Constraints

- No new dependency.
- No original RoomE backend request, OAuth request, WebSocket connection, or payment flow in demo mode.
- No API key in the Vite bundle, repository, or client-side environment variable.
- Preserve the user's existing uncommitted onboarding, hex-grid, SVG, and prior demo-consistency changes.
