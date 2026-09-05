# RoomE Portfolio Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make RoomE deployable as a public, no-login portfolio demo whose CD search uses live Spotify and YouTube data without exposing credentials.

**Architecture:** `VITE_APP_MODE=demo` seeds a fictional user and routes the supported RoomE experience to a module-level in-memory backend.  Existing API modules remain in place and select that backend only in demo mode.  Two same-origin Cloudflare Pages Functions own the live Spotify and YouTube calls, so secrets never enter the Vite bundle.

**Tech Stack:** React 19, TypeScript, Vite 6, Zustand, Axios, Cloudflare Pages Functions, Node built-in test runner.

**Spec:** `docs/superpowers/specs/2026-09-05-roome-portfolio-demo-design.md`

## Global Constraints

- Use `VITE_APP_MODE=demo` as the only public-demo switch.
- Keep demo state in module memory only; refresh resets every write.
- Do not add dependencies or commit `.env`, `.dev.vars`, provider credentials, or an original API URL.
- Call real music providers only through same-origin `/api/music/search` and `/api/music/video`.
- Cloudflare encrypted binding names are exactly `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `YOUTUBE_API_KEY`.
- Supported public flows are onboarding, hive, room, guestbook, CD rack, CD details, CD comments, and CD templates.
- Hide original-backend-only controls from demo navigation rather than leaving a broken link.
- Report the pre-existing repository-wide type-check errors separately; do not fix unrelated source errors in this work.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `src/demo/demoMode.ts` | Reads the build-time mode and exports the fictional portfolio user. |
| `src/demo/demoBackend.ts` | Holds seeded room/rank/CD/guestbook data and demo-session CRUD functions. |
| `src/demo/demoBackend.test.ts` | Node tests for observable demo-session mutations and page responses. |
| `src/apis/{room,housemate,ranking,guestbook,point,cd}.ts` | Delegate supported calls to `demoBackend` only when demo mode is active. |
| `src/apis/{musicProxy,musicProxy.test}.ts` | Calls same-origin music Functions and proves failed responses are not treated as valid data. |
| `src/components/ProtectedRoute.tsx` | Starts demo with the fictional user instead of refreshing tokens. |
| `src/pages/onboarding/components/{CtaSection,CtaButton}.tsx` | Labels and links the public demo entry. |
| `src/components/header/{Header.tsx,menus/HiddenMenu.tsx}` | Hides notifications, mates, profile and logout behavior that needs the original service. |
| `src/components/DemoNotice.tsx` | Shows the session-only portfolio-demo notice in the protected layout. |
| `src/routes/layout/BaseLayout.tsx` | Renders the notice alongside the header in demo mode. |
| `functions/api/music/search.ts` | Maps live Spotify tracks to `CDSearchResult` data. |
| `functions/api/music/video.ts` | Finds a usable live YouTube video and maps duration to seconds. |
| `functions/api/music/_shared.ts` | Query validation, JSON responses, provider fetch, and Spotify-token cache used by both functions. |
| `functions/api/music/musicFunctions.test.ts` | Node tests for function validation, provider mapping, and generic errors. |
| `.dev.vars.example` | Documents local binding names with empty values only. |
| `.gitignore` | Ignores all local Pages secret files. |
| `README.md` | Documents local mode, Cloudflare Pages setup, bindings, and custom-domain connection. |
| `package.json` | Adds targeted demo and Functions test scripts. |

### Task 1: Create demo-session data and its executable checks

**Files:**
- Create: `src/demo/demoMode.ts`
- Create: `src/demo/demoBackend.ts`
- Create: `src/demo/demoBackend.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces `isDemoMode: boolean` and `DEMO_USER: { email; nickname; profileImage; roomId; userId }`.
- Produces `demoBackend` methods `getRoom(userId)`, `getFollowing()`, `getRanking()`, `updateRoomTheme(roomId, userId, theme)`, `toggleFurniture(roomId, userId, furnitureType)`, `getCdRack(userId, size, cursor, keyword?)`, `addCd(payload)`, `deleteCds(ids)`, `getCdInfo(id)`, `getGuestbook(roomId, page, size)`, `createGuestbook(roomId, userId, message)`, and CD comment/template methods.
- Later API modules consume only these methods in their `isDemoMode` branch.

- [ ] **Step 1: Write the failing demo-backend test**

Create `src/demo/demoBackend.test.ts` with hand-written expected values that exercise a user-visible mutation:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { demoBackend } from './demoBackend';

test('adds a CD to the current demo-session rack', () => {
  const before = demoBackend.getCdRack(101, 20, 0);
  const added = demoBackend.addCd({
    title: 'Demo Track', artist: 'Demo Artist', album: 'Demo Album',
    genres: ['pop'], coverUrl: '/images/roome-background-img.webp',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 213, releaseDate: '2024-01-01',
  });
  const after = demoBackend.getCdRack(101, 20, 0);

  assert.equal(after.totalCount, before.totalCount + 1);
  assert.equal(after.data.at(-1)?.myCdId, added.myCdId);
});
```

Add `test:demo` to `package.json` so TypeScript compiles only `src/demo/demoBackend.ts` and its Node test into `/private/tmp/roome-demo-demo-test`, then runs it with `node --test`.

- [ ] **Step 2: Run the test to verify it fails for the missing backend**

Run: `pnpm test:demo`

Expected: TypeScript reports that `./demoBackend` cannot be resolved.

- [ ] **Step 3: Implement the minimum demo backend**

Create a single module-level data owner.  Use only explicit data and array operations; do not add a database, Zustand store, or persistence layer.

```ts
let nextCdId = 900;
const cdRack: CDRackItem[] = [{
  myCdId: 101, title: 'Sunset Avenue', artist: 'RoomE Demo',
  album: 'Portfolio Sessions', releaseDate: '2024-01-01', genres: ['pop'],
  coverUrl: '/images/roome-background-img.webp',
  youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 213,
}];

const page = <T>(items: T[], size: number, cursor = 0) => {
  const start = cursor === 0 ? 0 : items.findIndex((item) => item.myCdId === cursor) + 1;
  const data = items.slice(start, start + size);
  return { data, nextCursor: start + data.length < items.length ? data.at(-1)?.myCdId ?? 0 : 0 };
};

export const demoBackend = {
  addCd(payload: PostCDInfo) {
    const cd = { myCdId: nextCdId++, ...payload };
    cdRack.push(cd);
    return { data: cd, myCdId: cd.myCdId };
  },
};
```

Keep data contracts compatible with existing callers: room calls return `RoomData`, rack calls return `CDRackInfo`, CD detail calls return `CDInfo`, and guestbook calls return `{ guestbook, pagination: { totalPages } }`.  Theme and furniture mutation methods update the matching in-memory room and return the shapes current room components consume.  CD template and comment methods must return the same shapes the existing CD components read.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `pnpm test:demo`

Expected: Node reports one passing subtest, and the test confirms the newly returned ID is present in the current in-memory rack.

- [ ] **Step 5: Add a paging regression test, then verify it**

Add this test to the same file to catch a cursor that repeats the previous item:

```ts
test('moves the CD rack cursor past the last item of the previous page', () => {
  const first = demoBackend.getCdRack(101, 1, 0);
  const second = demoBackend.getCdRack(101, 1, first.nextCursor);

  assert.notEqual(second.data[0]?.myCdId, first.data[0]?.myCdId);
});
```

Run: `pnpm test:demo`

Expected: both subtests pass.

- [ ] **Step 6: Commit the data layer**

```bash
git add package.json src/demo/demoMode.ts src/demo/demoBackend.ts src/demo/demoBackend.test.ts
git commit -m "feat: add session-only RoomE demo data"
```

### Task 2: Route the supported existing APIs to demo-session data

**Files:**
- Create: `src/apis/musicProxy.ts`
- Create: `src/apis/musicProxy.test.ts`
- Modify: `src/apis/room.ts`
- Modify: `src/apis/housemate.ts`
- Modify: `src/apis/ranking.ts`
- Modify: `src/apis/guestbook.ts`
- Modify: `src/apis/point.ts`
- Modify: `src/apis/cd.ts`

**Interfaces:**
- Consumes `isDemoMode` and the Task 1 `demoBackend` methods.
- Produces unchanged public API function signatures for all existing pages.
- Task 3 relies on `searchSpotifyCds(query)` and `getYoutubeUrl(title, artist)` calling same-origin Functions.

- [ ] **Step 1: Write a failing boundary test for the real music endpoint helper**

Create `src/apis/musicProxy.test.ts` with this import and test:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { requestMusic } from './musicProxy';

test('rejects a failed same-origin music response', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response('{"error":"unavailable"}', { status: 503 });

  await assert.rejects(() => requestMusic('/api/music/search?q=demo'), /music request failed/);
  globalThis.fetch = originalFetch;
});
```

The production change that makes this fail is removing the non-2xx response guard, which would cause an unavailable provider to appear as valid empty data.

Extend `test:demo` so it compiles the demo backend, music helper, and both Node tests into `/private/tmp/roome-demo-demo-test`, then runs both compiled files with `node --test`.

- [ ] **Step 2: Run the test to verify it fails because the helper is missing**

Run: `pnpm test:demo`

Expected: TypeScript reports that `requestMusic` is not exported or its module cannot be resolved.

- [ ] **Step 3: Implement the narrow API branches and music client**

At the beginning of each supported API method, use the shared condition and return the matching `demoBackend` result:

```ts
if (isDemoMode) return demoBackend.getRoom(userId);
```

Do not route an unsupported original API through the demo backend.  Instead, remove its public demo navigation in Task 3.

Create `src/apis/musicProxy.ts` using native `fetch`:

```ts
export async function requestMusic<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error('music request failed');
  return response.json() as Promise<T>;
}
```

Replace the browser-side Spotify client-credentials flow and direct YouTube calls in `src/apis/cd.ts` with:

```ts
export const searchSpotifyCds = (query: string) =>
  requestMusic<CDSearchResult[]>(`/api/music/search?q=${encodeURIComponent(query)}`);

export const getYoutubeUrl = (title: string, artist: string) =>
  requestMusic<{ youtubeUrl: string; duration: number }>(
    `/api/music/video?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`,
  );
```

Retain Axios only for the non-demo original-backend branches.  Delete `VITE_SPOTIFY_ID`, `VITE_SPOTIFY_SECRET_KEY`, `VITE_YOUTUBE_KEY`, `getSpotifyToken`, and browser-side provider requests.

- [ ] **Step 4: Run focused tests and build**

Run: `pnpm test:demo && pnpm build`

Expected: demo tests pass and Vite writes the `dist` directory successfully.

- [ ] **Step 5: Commit the API routing layer**

```bash
git add src/apis/room.ts src/apis/housemate.ts src/apis/ranking.ts src/apis/guestbook.ts src/apis/point.ts src/apis/cd.ts src/apis/musicProxy.ts src/apis/musicProxy.test.ts src/demo/demoBackend.test.ts package.json
git commit -m "feat: route portfolio flows to demo session data"
```

### Task 3: Make the public demo enterable and remove broken service navigation

**Files:**
- Create: `src/components/DemoNotice.tsx`
- Modify: `src/components/ProtectedRoute.tsx`
- Modify: `src/pages/onboarding/components/CtaSection.tsx`
- Modify: `src/pages/onboarding/components/CtaButton.tsx`
- Modify: `src/routes/layout/BaseLayout.tsx`
- Modify: `src/components/header/Header.tsx`
- Modify: `src/components/header/menus/HiddenMenu.tsx`

**Interfaces:**
- Consumes `isDemoMode` and `DEMO_USER` from Task 1.
- Continues to render `<Outlet />` for authenticated original-service sessions.
- Links the onboarding CTA to `/` in demo mode and `/login` outside demo mode.

- [ ] **Step 1: Write a failing test for the demo entry selection**

Add a pure exported helper in `src/demo/demoMode.ts` to make entry behavior testable, then add this test:

```ts
test('uses the hive as the public demo entry point', () => {
  assert.equal(getEntryPath(true), '/');
  assert.equal(getEntryPath(false), '/login');
});
```

Run: `pnpm test:demo`

Expected: test fails because `getEntryPath` is not exported.

- [ ] **Step 2: Implement demo entry and safety boundaries**

Implement `getEntryPath(isDemo: boolean)` as `isDemo ? '/' : '/login'`.  In `ProtectedRoute`, set `DEMO_USER` once and render `<Outlet />` when `isDemoMode` is true; in all other modes retain the current refresh-token initialization.

Update CTA copy to say `포트폴리오 데모를 둘러보세요` and `저장한 내용은 새로고침하면 초기화됩니다.` in demo mode.  Add `DemoNotice` with the same session-only statement and render it in `BaseLayout`.

In demo mode, do not start notification polling or WebSockets, and do not render their icons.  The hidden menu retains the room link and feedback link only; replace logout with a browser reload button labelled `데모 처음부터 보기`.  Do not expose profile, bookcase, point, event, or housemate routes from the demo header.

- [ ] **Step 3: Run tests, build, and manual route check**

Run: `pnpm test:demo && pnpm build`

Then run: `VITE_APP_MODE=demo pnpm dev -- --host 127.0.0.1`, open `/onboarding`, click the CTA, and confirm `/` renders the hive without a login redirect.  Open the seeded room and CD rack, then confirm the notice remains visible and the header does not show notifications or housemates.

Expected: test and build pass; the manual path requires no original API request, cookie, or WebSocket connection.

- [ ] **Step 4: Commit the public entry work**

```bash
git add src/components/DemoNotice.tsx src/components/ProtectedRoute.tsx src/pages/onboarding/components/CtaSection.tsx src/pages/onboarding/components/CtaButton.tsx src/routes/layout/BaseLayout.tsx src/components/header/Header.tsx src/components/header/menus/HiddenMenu.tsx src/demo/demoMode.ts src/demo/demoBackend.test.ts
git commit -m "feat: make RoomE demo publicly enterable"
```

### Task 4: Add credential-safe Cloudflare music Functions

**Files:**
- Create: `functions/api/music/_shared.ts`
- Create: `functions/api/music/search.ts`
- Create: `functions/api/music/video.ts`
- Create: `functions/api/music/musicFunctions.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes encrypted Cloudflare `env` bindings `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `YOUTUBE_API_KEY`.
- Produces `onRequestGet(context)` handlers for `/api/music/search` and `/api/music/video`.
- Returns `Response` bodies containing `CDSearchResult[]` and `{ youtubeUrl: string; duration: number }` respectively.

- [ ] **Step 1: Write failing Function tests**

Create `functions/api/music/musicFunctions.test.ts` with an explicit provider response and a missing-query test:

```ts
test('rejects a Spotify search without q', async () => {
  const response = await search.onRequestGet({
    request: new Request('https://demo.example/api/music/search'),
    env: { SPOTIFY_CLIENT_ID: 'id', SPOTIFY_CLIENT_SECRET: 'secret' },
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'query is required' });
});
```

Add `test:music-functions` to compile only the three Function modules and this Node test with `lib: ["es2020", "dom"]`, then run the compiled file using `node --test`.

- [ ] **Step 2: Run the Function test to verify it fails for the missing handler**

Run: `pnpm test:music-functions`

Expected: TypeScript cannot resolve `./search`.

- [ ] **Step 3: Implement the two narrow handlers**

In `_shared.ts`, create a small context type, `json`, a maximum-length query guard, `fetchJson`, ISO-8601 duration conversion, and the module-scoped Spotify access-token cache.  Token acquisition uses the provider-required Basic Authorization header inside the Function only.

`search.ts` must request Spotify tracks with `market=KR&limit=10`, discard tracks without a full `YYYY-MM-DD` release date and an image, request the first artist's genres, and map each accepted result to:

```ts
{ id, title, artist, album_title, date, imageUrl, type: 'CD', genres }
```

`video.ts` must request YouTube `search` for the supplied title and artist, select a music video that is not a live/performance/instrumental match, request that video's `contentDetails`, and return an empty URL plus `0` for no acceptable video or duration under 30 seconds.  Both handlers return `{ error: 'music search is unavailable' }` with status `502` for failed upstream calls.

- [ ] **Step 4: Verify Function behavior, then run the complete local suite**

Run: `pnpm test:music-functions && pnpm test:demo && pnpm build`

Expected: Function tests prove missing input produces 400, Spotify data maps to the frontend shape, and upstream failure produces the generic 502 body; demo tests and Vite build pass.

- [ ] **Step 5: Commit the Functions**

```bash
git add functions/api/music/_shared.ts functions/api/music/search.ts functions/api/music/video.ts functions/api/music/musicFunctions.test.ts package.json
git commit -m "feat: proxy live music search through Pages Functions"
```

### Task 5: Record safe local and Cloudflare deployment setup

**Files:**
- Create: `.dev.vars.example`
- Modify: `.gitignore`
- Modify: `README.md`

**Interfaces:**
- Documents the exact Pages build contract and binding names from the spec.
- Contains names only; no credential values or original backend URL.

- [ ] **Step 1: Add local-secret ignore and example names**

Add this to `.gitignore`:

```gitignore
.dev.vars
.dev.vars.*
!.dev.vars.example
```

Create `.dev.vars.example` with empty values only:

```dotenv
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
YOUTUBE_API_KEY=
```

- [ ] **Step 2: Update README with exact deployment steps**

Add a `Portfolio demo deployment` section that states:

1. Create a Cloudflare Pages project from `swallowedB/roome-demo`, branch `main`.
2. Use `pnpm build` and publish `dist`.
3. Add `VITE_APP_MODE=demo` as the Pages build variable.
4. Add the three encrypted Function secrets in Pages **Settings → Variables and Secrets**.
5. Add a Pages custom subdomain before creating the DNS CNAME, such as `roome.<blog-domain>`.
6. Keep the blog's `/demos` page as the hub and link its RoomE card to that subdomain.
7. Explain that the static Pages hosting remains free-tier friendly, while Spotify and YouTube quotas still apply.

- [ ] **Step 3: Verify secret safety and production artifact**

Run: `rg -n "VITE_SPOTIFY|VITE_YOUTUBE|SPOTIFY_CLIENT_SECRET=.+|YOUTUBE_API_KEY=.+" --glob '!pnpm-lock.yaml' .`

Expected: no committed provider value; only variable names in documentation/example files and server-side `context.env` references appear.

Run: `pnpm test:music-functions && pnpm test:demo && pnpm build && git status --short`

Expected: tests and build pass, and `git status` lists only intended documentation/configuration changes before committing.

- [ ] **Step 4: Commit deployment documentation**

```bash
git add .gitignore .dev.vars.example README.md
git commit -m "docs: add RoomE demo deployment guide"
```

## Self-Review

### Spec coverage

- Public demo boundary and no original backend: Tasks 1–3.
- Immediate public onboarding entry: Task 3.
- Hive, room, CD rack/detail/comments/templates, and guestbook: Tasks 1–3.
- Real music data with no client credentials: Tasks 2 and 4.
- Session-only reset behavior and notice: Tasks 1 and 3.
- No broken unsupported navigation: Task 3.
- Cloudflare binding and custom-domain setup: Tasks 4–5.
- Automated checks, build, and known root type-check status: Tasks 1, 2, 4, and 5.

### Placeholder scan

No implementation step uses a deferred placeholder.  Seed values are explicitly fictional, and every verification command, required interface, and secret name is concrete.

### Type consistency

The frontend client receives `CDSearchResult[]` and `{ youtubeUrl, duration }`, matching the current `useSearch` and CD-add callers.  The demo backend returns existing `RoomData`, `CDRackInfo`, `CDInfo`, guestbook, comment, and template shapes, so the page hooks do not need a parallel UI data model.
