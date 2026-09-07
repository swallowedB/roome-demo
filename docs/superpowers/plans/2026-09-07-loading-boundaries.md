# Loading Boundaries Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce unnecessary first-render blocking by code-splitting deferred pages and showing loading UI only for route or scene work that exceeds 250ms.

**Architecture:** React `lazy` and `Suspense` split the non-root routes, while `MainPage` splits only its 3D hive. A delayed wrapper around the existing loading artwork prevents fast operations from flashing a loader. The hive remains interactive after three initially visible models load; other models keep loading in the background.

**Tech Stack:** React 19, React Router 7, Vite 6, React Three Fiber, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-07-loading-boundaries-design.md`

## Global Constraints

- Add no dependencies.
- Keep demo authentication and all existing route paths intact.
- Use a 250ms loading-indicator delay.
- Do not commit because this shared checkout has unrelated user changes.

---

### Task 1: Delay full-page loading without changing authentication

**Files:**
- Modify: `src/components/Loading.tsx`
- Modify: `src/components/ProtectedRoute.tsx`
- Test: `src/components/ProtectedRoute.test.mjs`

**Interfaces:**
- Produces: `DelayedLoading({ delay?: number; overlay?: boolean })`, a component that renders `Loading` after the supplied delay.
- Consumes: `Loading` in protected-route and scene boundaries without altering their data-loading state.

- [x] **Step 1: Write the failing demo-route rendering test**

```js
assert.doesNotMatch(markup, /alt="loading"/);
```

- [x] **Step 2: Run the test to verify it fails because `ProtectedRoute` renders `Loading` immediately**

Run: `VITE_APP_MODE=demo node --test src/components/ProtectedRoute.test.mjs`

- [x] **Step 3: Add `DelayedLoading` and make `Loading` support an absolute overlay**

```tsx
export function DelayedLoading({ delay = 250, overlay = false }) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);
  return isVisible ? <Loading overlay={overlay} /> : null;
}
```

- [x] **Step 4: Replace the protected-route immediate loader with `DelayedLoading` and rerun the test**

Run: `VITE_APP_MODE=demo node --test src/components/ProtectedRoute.test.mjs`

### Task 2: Stop blocking the hive on every initially visible room

**Files:**
- Modify: `src/pages/main/hooks/useHiveLoading.ts`
- Modify: `src/pages/main/components/HiveRooms.tsx`
- Test: `src/pages/main/hooks/useHiveLoading.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `hasInitialHiveSceneLoaded(initialRoomIds, loadedRoomIds)`, returning true after the first `min(3, initialRoomIds.length)` IDs have loaded.
- Consumes: existing `onLoadingComplete` without changing its public callback signature.

- [x] **Step 1: Write failing helper tests for the three-room readiness threshold**

```ts
assert.equal(hasInitialHiveSceneLoaded(['a', 'b', 'c', 'd'], new Set(['a', 'b', 'c'])), true);
assert.equal(hasInitialHiveSceneLoaded(['a', 'b', 'c', 'd'], new Set(['a', 'b'])), false);
```

- [x] **Step 2: Run the hive test command and verify it fails because the helper is absent**

Run: `pnpm test:hive-spatial-index`

- [x] **Step 3: Implement the helper and use it inside `useHiveLoading`**

```ts
const requiredRoomIds = initialRoomIds.slice(0, Math.min(3, initialRoomIds.length));
return requiredRoomIds.length > 0 && requiredRoomIds.every((id) => loadedRoomIds.has(id));
```

- [x] **Step 4: Replace the hive's immediate `Loading` with `DelayedLoading overlay` and rerun tests**

Run: `pnpm test:hive-spatial-index`

### Task 3: Split deferred pages and the main 3D hive

**Files:**
- Modify: `src/routes/Router.tsx`
- Modify: `src/pages/main/MainPage.tsx`
- Modify: `src/pages/room/RoomPage.tsx`

**Interfaces:**
- Consumes: `DelayedLoading` as the Suspense fallback and as the room-model loading presentation.
- Produces: one eager root shell plus deferred route and hive chunks with unchanged URLs.

- [x] **Step 1: Convert all non-root page imports in `Router.tsx` to `lazy(() => import(...))`**

```tsx
const RoomPage = lazy(() => import('@pages/room/RoomPage'));
```

- [x] **Step 2: Wrap the route tree in `Suspense` with a delayed full-page fallback**

```tsx
<Suspense fallback={<DelayedLoading />}><Routes>{/* existing routes */}</Routes></Suspense>
```

- [x] **Step 3: Lazy-load `HiveRooms` in `MainPage` and use a delayed scene overlay as its fallback**

```tsx
<Suspense fallback={<DelayedLoading overlay />}><HiveRooms {...props} /></Suspense>
```

- [x] **Step 4: Replace RoomPage's immediate loader and fixed 300ms timeout with a delayed scene overlay and direct ready callback**

```tsx
const handleModelLoaded = () => setIsModelLoading(false);
```

### Task 4: Verify production behavior and chunk boundaries

**Files:**
- Verify only: modified files above

- [x] **Step 1: Run focused loading and hive tests**

Run: `VITE_APP_MODE=demo node --test src/components/ProtectedRoute.test.mjs && pnpm test:hive-spatial-index`

- [x] **Step 2: Build the demo production bundle**

Run: `VITE_APP_MODE=demo pnpm build`

- [x] **Step 3: Confirm multiple JavaScript chunks are emitted and use the local browser to verify main and room loading states**

Expected: the fast local path has no loading flash; the main scene becomes usable after three visible room models load.
