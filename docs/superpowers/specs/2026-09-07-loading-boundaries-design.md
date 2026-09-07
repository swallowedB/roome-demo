# Demo loading-boundaries design

## Goal

Show a loading indicator only when route code or 3D scene work exceeds a short delay, while making the hive usable after its first three visible rooms load.

## Decisions

- Keep the root page shell eager; lazy-load the heavy `HiveRooms` scene and every non-root page route with React's built-in `lazy` and `Suspense`.
- Do not add a dependency. Reuse React Suspense and the existing loading artwork.
- Add a 250ms delay before a loading indicator appears. A fast demo-session initialization therefore does not flash a full-screen loader.
- Preserve full-page loading for delayed route chunks, but use an absolute scene overlay inside the main hive and room pages so their surrounding shell remains in place.
- Treat the hive as ready after the first three initial visible room models load. Remaining rooms continue rendering and preloading without blocking interaction.
- Remove the room page's fixed 300ms post-load delay.

## Boundaries

- `ProtectedRoute` retains its authentication behavior. Only its presentation changes from immediate full-screen loading to delayed loading.
- `RoomPage` still waits for room data and its model before declaring its scene ready.
- A direct visit to `/` still renders the main page immediately; only the 3D hive module becomes a deferred chunk.

## Verification

- A server-rendered demo route must not contain the full loading UI during the short initialization phase.
- The hive readiness helper must accept three loaded rooms and reject fewer than three when at least three rooms are initially visible.
- The production demo build must emit more than one JavaScript chunk and succeed.
- Browser verification: opening the main page and a room must avoid a loading flash on fast local loads; their respective indicators may appear only when work remains pending past 250ms.
