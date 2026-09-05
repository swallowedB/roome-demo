import assert from 'node:assert/strict';
import test from 'node:test';
import { demoBackend } from './demoBackend';
import { getEntryPath } from './demoEntry';

test('uses the hive as the public demo entry point', () => {
  assert.equal(getEntryPath(true), '/');
  assert.equal(getEntryPath(false), '/login');
});

test('adds a CD to the current demo-session rack', () => {
  const before = demoBackend.getCdRack(101, 20, 0);
  const added = demoBackend.addCd({
    title: 'Demo Track',
    artist: 'Demo Artist',
    album: 'Demo Album',
    genres: ['pop'],
    coverUrl: '/images/roome-background-img.webp',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 213,
    releaseDate: '2024-01-01',
  });
  const after = demoBackend.getCdRack(101, 20, 0);

  assert.equal(after.totalCount, before.totalCount + 1);
  assert.equal(after.data.at(-1)?.myCdId, added.myCdId);
});

test('moves the CD rack cursor past the last item of the previous page', () => {
  const first = demoBackend.getCdRack(101, 1, 0);
  const second = demoBackend.getCdRack(101, 1, first.nextCursor);

  assert.notEqual(second.data[0]?.myCdId, first.data[0]?.myCdId);
});

test('returns the no-content status after deleting a CD template', () => {
  const result = demoBackend.deleteTemplate(101);

  assert.equal(result.status, 204);
});
