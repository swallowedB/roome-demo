# RoomE Demo Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep every public demo entry and deployment path on the fictional, in-memory RoomE experience, with a recoverable result for an invalid room URL.

**Architecture:** The room page route identifies the room owner by `userId`, while room mutations retain their existing `roomId` contract. A small pure route helper pins that distinction in the existing Node demo test suite. The legacy AWS deployment job becomes a secret-free verification job; Cloudflare Pages remains the sole deployment mechanism described in the repository.

**Tech Stack:** React 19, TypeScript, Vite 6, React Router 7, Node built-in test runner, GitHub Actions, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-09-05-roome-portfolio-demo-design.md`

## Global Constraints

- Use `VITE_APP_MODE=demo` as the only public-demo switch.
- Keep demo state in module memory only; refresh resets every write.
- Do not add dependencies or commit `.env`, `.dev.vars`, provider credentials, an original API URL, or cloud-deployment credentials.
- Call real music providers only through same-origin `/api/music/search` and `/api/music/video`.
- Keep the pre-existing repository-wide `pnpm type-check` and lint failures outside this demo-consistency change.
- Preserve the user-owned modification to `public/RoomE.svg` and the current uncommitted onboarding/hex-grid work.

---

### Task 1: Pin the current-user room-route contract and recover from an invalid room route

**Files:**
- Modify: `src/demo/demoEntry.ts`
- Modify: `src/demo/demoBackend.test.ts`
- Modify: `src/pages/main/MainPage.tsx`
- Modify: `src/pages/main/components/MyRoomBtn.tsx`
- Modify: `src/pages/room/RoomPage.tsx`

**Interfaces:**
- Consumes: `getCurrentRoomPath(user: { userId: number }): string` from `src/demo/demoEntry.ts`.
- Produces: a `/room/:userId` path for the current fictional user and the existing `NotFoundPage` for a nonexistent owner ID.

- [ ] **Step 1: Write the failing route-contract test**

  In `src/demo/demoBackend.test.ts`, extend the existing import and add this test:

  ```ts
  import { getCurrentRoomPath, getEntryPath } from './demoEntry';

  test('uses the owner user ID for the current-room route', () => {
    const demoUser = { roomId: 5001, userId: 101 };

    assert.equal(getCurrentRoomPath(demoUser), '/room/101');
  });
  ```

- [ ] **Step 2: Run the focused test to verify it fails**

  Run: `pnpm test:demo`

  Expected: TypeScript reports that `getCurrentRoomPath` is not exported.

- [ ] **Step 3: Add the route helper and use the owner ID at the only incorrect caller**

  In `src/demo/demoEntry.ts`, add:

  ```ts
  export const getCurrentRoomPath = (user: { userId: number }) =>
    `/room/${user.userId}`;
  ```

  In `src/pages/main/MainPage.tsx`, render the button only once `user` exists:

  ```tsx
  {user && <MyRoomBtn user={user} />}
  ```

  In `src/pages/main/components/MyRoomBtn.tsx`, accept `user: { userId: number }`, import `getCurrentRoomPath`, and navigate with `getCurrentRoomPath(user)` instead of interpolating `roomId`.

  In `src/pages/room/RoomPage.tsx`, add an unavailable-room state. At the beginning of every `userId` load, reset it together with the room data and loading state. If `roomAPI.getRoomById` rejects or returns no room, stop the loading overlay and render the existing `NotFoundPage`; leave the successful model-loaded path unchanged.

- [ ] **Step 4: Run the focused test to verify it passes**

  Run: `pnpm test:demo`

  Expected: the current-room route test and all existing demo tests pass.

- [ ] **Step 5: Commit the route fix**

  ```bash
  git add src/demo/demoEntry.ts src/demo/demoBackend.test.ts src/pages/main/MainPage.tsx src/pages/main/components/MyRoomBtn.tsx src/pages/room/RoomPage.tsx
  git commit -m "fix: keep demo room routes on user ids"
  ```

### Task 2: Keep the dormant demo theme-purchase branch on the room-ID contract

**Files:**
- Modify: `src/demo/demoBackend.ts`
- Modify: `src/demo/demoBackend.test.ts`
- Modify: `src/apis/room.ts`

**Interfaces:**
- Consumes: `roomAPI.purchaseThemes(roomId: number, themeName: string)`.
- Produces: `demoBackend.getRoomByRoomId(roomId: number)`, a clone of the fictional room selected by its `roomId`.

- [ ] **Step 1: Write the failing room-ID lookup test**

  In `src/demo/demoBackend.test.ts`, add:

  ```ts
  test('can resolve a demo room by its room ID for room mutations', () => {
    const room = demoBackend.getRoomByRoomId(5001);

    assert.equal(room.userId, 101);
    assert.equal(room.roomId, 5001);
  });
  ```

- [ ] **Step 2: Run the focused test to verify it fails**

  Run: `pnpm test:demo`

  Expected: TypeScript reports that `getRoomByRoomId` does not exist.

- [ ] **Step 3: Add the separate room-ID lookup and correct the demo branch**

  In `src/demo/demoBackend.ts`, add a private lookup that finds `rooms` by `item.roomId`, throws `new Error('demo room not found')` when absent, and returns `clone(room)`. Expose it as `getRoomByRoomId` on `demoBackend`.

  In `src/apis/room.ts`, replace the demo branch in `purchaseThemes` with:

  ```ts
  if (isDemoMode) return demoBackend.getRoomByRoomId(roomId);
  ```

  Do not change the production request or its `roomId` parameter.

- [ ] **Step 4: Run the focused test to verify it passes**

  Run: `pnpm test:demo`

  Expected: all demo tests pass, including the room-ID lookup test.

- [ ] **Step 5: Commit the identifier-boundary repair**

  ```bash
  git add src/demo/demoBackend.ts src/demo/demoBackend.test.ts src/apis/room.ts
  git commit -m "fix: separate demo room identifier lookups"
  ```

### Task 3: Retire the legacy production deployment and align public-demo documentation

**Files:**
- Modify: `.github/workflows/workflow.yml`
- Modify: `docs/superpowers/specs/2026-09-05-roome-portfolio-demo-design.md`

**Interfaces:**
- Consumes: `pnpm test:hive-spatial-index`, `pnpm test:demo`, and `pnpm build`.
- Produces: a GitHub Actions verification workflow that contains no cloud credentials, original API URLs, browser music-provider secrets, or AWS deployment steps.

- [ ] **Step 1: Replace the obsolete S3/CloudFront deploy job with a demo verification job**

  Replace `.github/workflows/workflow.yml` with this workflow:

  ```yaml
  name: Verify RoomE demo

  on:
    push:
      branches: [main]
    pull_request:

  jobs:
    verify:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v4
          with:
            version: 10
        - uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: pnpm
        - run: pnpm install --frozen-lockfile
        - run: pnpm test:hive-spatial-index
        - run: pnpm test:demo
        - run: pnpm build
          env:
            VITE_APP_MODE: demo
  ```

- [ ] **Step 2: Correct the stale entry-point statement in the demo design**

  In `docs/superpowers/specs/2026-09-05-roome-portfolio-demo-design.md`, replace the onboarding-entry statement with: `The main hive is the public entry. The former /onboarding route redirects to /.` Keep the existing description of immediate no-login entry intact.

- [ ] **Step 3: Verify the workflow and documentation contain no retired deployment contract**

  Run: `rg -n 'aws |S3|CloudFront|VITE_SPOTIFY|VITE_YOUTUBE|VITE_API_URL|onboarding page is the public entry' .github/workflows/workflow.yml docs/superpowers/specs/2026-09-05-roome-portfolio-demo-design.md`

  Expected: no matches.

- [ ] **Step 4: Run the full targeted verification**

  Run: `pnpm test:hive-spatial-index && pnpm test:demo && VITE_APP_MODE=demo pnpm build`

  Expected: all targeted tests and the demo build pass.

- [ ] **Step 5: Commit the deployment-contract cleanup**

  ```bash
  git add .github/workflows/workflow.yml docs/superpowers/specs/2026-09-05-roome-portfolio-demo-design.md
  git commit -m "chore: verify the public RoomE demo"
  ```

### Task 4: Verify the public navigation in a locally running demo

**Files:**
- Modify: none

**Interfaces:**
- Consumes: the Vite server started with `VITE_APP_MODE=demo`.
- Produces: browser evidence that the current-room control opens `/room/101`, while an invalid `/room/5001` route shows the not-found page rather than an indefinite loading overlay.

- [ ] **Step 1: Start the demo server**

  Run: `VITE_APP_MODE=demo pnpm dev -- --host 127.0.0.1`

  Expected: Vite reports a local URL.

- [ ] **Step 2: Verify the current-room route**

  Open `/`, wait for the hive, select `마이룸`, and confirm the URL is `/room/101` and the room model finishes loading.

- [ ] **Step 3: Verify invalid-route recovery**

  Open `/room/5001` directly and confirm the 404 screen appears without a persistent loading overlay.

- [ ] **Step 4: Verify excluded integrations remain excluded**

  On the main and room screens, confirm the header shows neither notifications nor housemate controls; confirm the room has no piggy bank; inspect the browser network log for no request to the original RoomE API or WebSocket URL.

## Self-Review

- **Spec coverage:** Tasks 1 and 2 make the user-ID and room-ID boundary explicit, Task 3 keeps deployment on the Cloudflare Pages contract and updates the stale entry description, and Task 4 checks the observable public path.
- **Placeholder scan:** This plan contains no unresolved placeholders or unspecified tests.
- **Type consistency:** `getCurrentRoomPath` accepts an object containing `userId`; `getRoomByRoomId` accepts only `roomId`; production request signatures remain unchanged.
