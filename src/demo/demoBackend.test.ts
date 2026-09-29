import assert from 'node:assert/strict';
import test from 'node:test';
import { demoBackend } from './demoBackend';
import { getCurrentRoomPath, getEntryPath } from './demoEntry';

test('uses the hive as the public demo entry point', () => {
  assert.equal(getEntryPath(true), '/');
  assert.equal(getEntryPath(false), '/login');
});

test('uses the owner user ID for the current-room route', () => {
  const demoUser = { roomId: 5001, userId: 101 };

  assert.equal(getCurrentRoomPath(demoUser), '/room/101');
});

test('can resolve a demo room by its room ID for room mutations', () => {
  const room = demoBackend.getRoomByRoomId(5001);

  assert.equal(room.userId, 101);
  assert.equal(room.roomId, 5001);
});

test('exposes 33 uniquely themed rooms in the demo hive', () => {
  const housemates = demoBackend.getFollowing().housemates;
  const allUserIds = [101, ...housemates.map(({ userId }) => userId)];
  const themes = allUserIds.map((userId) => demoBackend.getRoom(userId).theme);

  assert.equal(allUserIds.length, 33);
  assert.equal(new Set(allUserIds).size, 33);
  assert.deepEqual(
    themes.reduce<Record<string, number>>((counts, theme) => {
      counts[theme] = (counts[theme] ?? 0) + 1;
      return counts;
    }, {}),
    { BASIC: 11, FOREST: 11, MARINE: 11 },
  );
});

test('prioritizes forest and marine rooms in the first hive ring', () => {
  const firstHiveUserIds = [
    101,
    ...demoBackend.getFollowing().housemates.slice(0, 6).map(({ userId }) => userId),
  ];

  assert.deepEqual(
    firstHiveUserIds.map((userId) => demoBackend.getRoom(userId).theme),
    ['BASIC', 'FOREST', 'MARINE', 'FOREST', 'MARINE', 'FOREST', 'MARINE'],
  );
});

test('starts every demo room with both bookshelf and CD rack visible', () => {
  const userIds = [
    101,
    ...demoBackend.getFollowing().housemates.map(({ userId }) => userId),
  ];

  for (const userId of userIds) {
    assert.deepEqual(
      demoBackend
        .getRoom(userId)
        .furnitures.map(({ furnitureType, isVisible }) => ({
          furnitureType,
          isVisible,
        })),
      [
        { furnitureType: 'BOOKSHELF', isVisible: true },
        { furnitureType: 'CD_RACK', isVisible: true },
      ],
    );
  }
});

test('returns only the top ten rankings with 보아 in first place', () => {
  const ranking = demoBackend.getRanking();

  assert.equal(ranking.length, 10);
  assert.deepEqual(
    ranking.map(({ rank }) => rank),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );
  assert.equal(ranking[0]?.nickname, '보아');
  assert.equal(ranking.at(-1)?.score, 53);
  assert.equal(
    ranking.every((user, index) =>
      index === 0 ? true : ranking[index - 1]!.score > user.score,
    ),
    true,
  );
});

test('returns seeded books for the demo bookshelf', () => {
  const bookshelf = demoBackend.getBookCase(101, 45);

  assert.ok(bookshelf.count > 0);
  assert.equal(bookshelf.myBooks.length, bookshelf.count);
  assert.equal(
    bookshelf.myBooks.every(({ imageUrl }) => imageUrl.startsWith('https://')),
    true,
  );
});

test('starts the demo CD rack with curated real music metadata', () => {
  const rack = demoBackend.getCdRack(101, 20, 0);

  assert.ok(rack.totalCount >= 3);
  assert.equal(
    rack.data.every(
      ({ artist, coverUrl, youtubeUrl }) =>
        artist !== 'RoomE Demo' &&
        coverUrl.startsWith('https://') &&
        youtubeUrl.startsWith('https://www.youtube.com/watch?v='),
    ),
    true,
  );
});

test('keeps book details and reviews only in the demo runtime', () => {
  const book = demoBackend.getBookDetail(801);
  assert.equal(book.title, '아몬드');
  assert.equal(demoBackend.getBookReview(801), null);

  const review = demoBackend.saveBookReview(801, {
    title: '천천히 마음을 여는 이야기',
    quote: '마음은 눈에 보이지 않는다.',
    takeaway: '다른 사람의 감정을 더 살펴보고 싶어졌다.',
    motivate: '',
    topic: '',
    freeFormText: '',
    coverColor: 'BLUE',
  });

  assert.equal(review.title, '천천히 마음을 여는 이야기');
  assert.match(review.writeDateTime, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal(
    demoBackend.getBookReview(801)?.quote,
    '마음은 눈에 보이지 않는다.',
  );

  demoBackend.deleteBookReview(801);
  assert.equal(demoBackend.getBookReview(801), null);
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
