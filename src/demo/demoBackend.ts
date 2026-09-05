type ThemeName = 'BASIC' | 'FOREST' | 'MARINE';

type DemoFurniture = {
  furnitureType: 'BOOKSHELF' | 'CD_RACK';
  isVisible: boolean;
  level: number;
  maxCapacity: number;
};

type DemoRoom = {
  roomId: number;
  nickname: string;
  userId: number;
  theme: ThemeName;
  createdAt: string;
  furnitures: DemoFurniture[];
  storageLimits: { maxBooks: number; maxMusic: number };
  userStorage: {
    savedBooks: number;
    savedMusic: number;
    writtenMusicLogs: number;
    writtenReviews: number;
  };
  topBookGenres: string[];
  topCdGenres: string[];
};

export type DemoCd = {
  myCdId: number;
  title: string;
  artist: string;
  album: string;
  releaseDate: string;
  genres: string[];
  coverUrl: string;
  youtubeUrl: string;
  duration: number;
};

export type DemoCdPayload = Omit<DemoCd, 'myCdId'>;

type DemoGuestbook = {
  guestbookId: number;
  userId: number;
  nickname: string;
  profileImage: string;
  message: string;
  createdAt: string;
};

type DemoComment = {
  id: number;
  myCdId: number;
  userId: number;
  nickname: string;
  timestamp: number;
  content: string;
  createdAt: string;
};

export type DemoTemplate = {
  comment1: string | null;
  comment2: string | null;
  comment3: string | null;
  comment4: string | null;
};

const rooms: DemoRoom[] = [
  {
    roomId: 5001,
    userId: 101,
    nickname: '포트폴리오 방문자',
    theme: 'BASIC',
    createdAt: '2026-09-05T00:00:00.000Z',
    furnitures: [
      { furnitureType: 'BOOKSHELF', isVisible: false, level: 1, maxCapacity: 14 },
      { furnitureType: 'CD_RACK', isVisible: true, level: 1, maxCapacity: 14 },
    ],
    storageLimits: { maxBooks: 14, maxMusic: 14 },
    userStorage: { savedBooks: 0, savedMusic: 3, writtenMusicLogs: 1, writtenReviews: 0 },
    topBookGenres: [],
    topCdGenres: ['indie', 'pop', 'ambient'],
  },
  {
    roomId: 5002,
    userId: 102,
    nickname: '밤산책',
    theme: 'FOREST',
    createdAt: '2026-09-05T00:00:00.000Z',
    furnitures: [
      { furnitureType: 'BOOKSHELF', isVisible: false, level: 1, maxCapacity: 14 },
      { furnitureType: 'CD_RACK', isVisible: true, level: 1, maxCapacity: 14 },
    ],
    storageLimits: { maxBooks: 14, maxMusic: 14 },
    userStorage: { savedBooks: 0, savedMusic: 2, writtenMusicLogs: 0, writtenReviews: 0 },
    topBookGenres: [],
    topCdGenres: ['r&b', 'soul'],
  },
  {
    roomId: 5003,
    userId: 103,
    nickname: '푸른파도',
    theme: 'MARINE',
    createdAt: '2026-09-05T00:00:00.000Z',
    furnitures: [
      { furnitureType: 'BOOKSHELF', isVisible: false, level: 1, maxCapacity: 14 },
      { furnitureType: 'CD_RACK', isVisible: true, level: 1, maxCapacity: 14 },
    ],
    storageLimits: { maxBooks: 14, maxMusic: 14 },
    userStorage: { savedBooks: 0, savedMusic: 2, writtenMusicLogs: 0, writtenReviews: 0 },
    topBookGenres: [],
    topCdGenres: ['electronic', 'jazz'],
  },
];

let nextCdId = 900;
let nextGuestbookId = 30;
let nextCommentId = 50;

let cdRack: DemoCd[] = [
  {
    myCdId: 101,
    title: 'Sunset Avenue',
    artist: 'RoomE Demo',
    album: 'Portfolio Sessions',
    releaseDate: '2024-01-01',
    genres: ['indie', 'pop'],
    coverUrl: '/images/roome-background-img.webp',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 213,
  },
  {
    myCdId: 102,
    title: 'Blue Hour',
    artist: 'RoomE Demo',
    album: 'Portfolio Sessions',
    releaseDate: '2024-04-08',
    genres: ['ambient', 'electronic'],
    coverUrl: '/images/roome-background-img.webp',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 187,
  },
  {
    myCdId: 103,
    title: 'First Light',
    artist: 'RoomE Demo',
    album: 'Portfolio Sessions',
    releaseDate: '2024-08-19',
    genres: ['jazz', 'soul'],
    coverUrl: '/images/roome-background-img.webp',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 241,
  },
];

const guestbooks: Record<number, DemoGuestbook[]> = {
  101: [
    {
      guestbookId: 1,
      userId: 102,
      nickname: '밤산책',
      profileImage: '',
      message: '음악을 고르며 머무는 경험이 인상적이에요.',
      createdAt: '2026-09-04T12:00:00.000Z',
    },
  ],
};

const templates: Record<number, DemoTemplate> = {
  101: {
    comment1: '해 질 무렵 산책하다 발견한 곡이에요.',
    comment2: '후렴으로 넘어가는 순간의 리듬을 좋아해요.',
    comment3: '조용히 정리되는 기분이에요.',
    comment4: '창가에 앉아 쉬고 싶을 때 들어요.',
  },
};

const comments: Record<number, DemoComment[]> = {
  101: [
    {
      id: 1,
      myCdId: 101,
      userId: 101,
      nickname: '포트폴리오 방문자',
      timestamp: 62,
      content: '이 부분부터 분위기가 바뀌어요.',
      createdAt: '2026-09-05T08:30:00.000Z',
    },
  ],
};

const clone = <T>(value: T): T => structuredClone(value);

const getRoom = (userId: number) => {
  const room = rooms.find((item) => item.userId === userId);
  if (!room) throw new Error('demo room not found');
  return clone(room);
};

const getPage = <T extends { myCdId: number }>(
  items: T[],
  size: number,
  cursor = 0,
) => {
  const start = cursor === 0 ? 0 : Math.max(items.findIndex((item) => item.myCdId === cursor) + 1, 0);
  const data = items.slice(start, start + size);
  const nextCursor = start + data.length < items.length ? data.at(-1)?.myCdId ?? 0 : 0;

  return { data: clone(data), nextCursor };
};

export const demoBackend = {
  getRoom,

  getFollowing() {
    return {
      housemates: rooms.slice(1).map(({ userId, nickname }) => ({
        userId,
        nickname,
        profileImage: '',
        bio: '',
        status: 'ONLINE' as const,
      })),
      hasNext: false,
      nextCursor: 0,
    };
  },

  getRanking() {
    return rooms.map((room, index) => ({
      rank: index + 1,
      userId: room.userId,
      nickname: room.nickname,
      profileImage: '',
      score: 320 - index * 40,
      topRank: index < 3,
    }));
  },

  updateRoomTheme(roomId: number, userId: number, themeName: ThemeName) {
    const room = rooms.find((item) => item.roomId === roomId && item.userId === userId);
    if (!room) throw new Error('demo room not found');
    room.theme = themeName;
    return clone(room);
  },

  toggleFurniture(roomId: number, userId: number, furnitureType: DemoFurniture['furnitureType']) {
    const room = rooms.find((item) => item.roomId === roomId && item.userId === userId);
    const furniture = room?.furnitures.find((item) => item.furnitureType === furnitureType);
    if (!furniture) throw new Error('demo furniture not found');
    furniture.isVisible = !furniture.isVisible;
    return { furniture: clone(furniture) };
  },

  getUnlockThemes() {
    return ['BASIC', 'FOREST', 'MARINE'];
  },

  getCdRack(userId: number, size = 14, cursor = 0, keyword = '') {
    if (userId !== 101) return { data: [], nextCursor: 0, totalCount: 0, firstMyCdId: 0, lastMyCdId: 0 };

    const normalizedKeyword = keyword.trim().toLowerCase();
    const items = normalizedKeyword
      ? cdRack.filter((cd) => `${cd.title} ${cd.artist} ${cd.album}`.toLowerCase().includes(normalizedKeyword))
      : cdRack;
    const page = getPage(items, size, cursor);

    return {
      ...page,
      totalCount: items.length,
      firstMyCdId: items[0]?.myCdId ?? 0,
      lastMyCdId: items.at(-1)?.myCdId ?? 0,
    };
  },

  getCdInfo(myCdId: number) {
    const cd = cdRack.find((item) => item.myCdId === myCdId);
    if (!cd) throw new Error('demo CD not found');
    return clone(cd);
  },

  addCd(payload: DemoCdPayload) {
    const cd = { myCdId: nextCdId++, ...clone(payload) };
    cdRack.push(cd);
    return { data: clone(cd), myCdId: cd.myCdId };
  },

  deleteCds(myCdIds: number[]) {
    cdRack = cdRack.filter((cd) => !myCdIds.includes(cd.myCdId));
    return { deletedIds: clone(myCdIds) };
  },

  getTemplate(myCdId: number) {
    return clone(templates[myCdId] ?? { comment1: null, comment2: null, comment3: null, comment4: null });
  },

  saveTemplate(myCdId: number, template: DemoTemplate) {
    templates[myCdId] = clone(template);
    return clone(templates[myCdId]);
  },

  deleteTemplate(myCdId: number) {
    delete templates[myCdId];
    return { status: 204 };
  },

  getComments(myCdId: number, page = 1, size = 5, keyword = '') {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const items = (comments[myCdId] ?? []).filter((comment) =>
      comment.content.toLowerCase().includes(normalizedKeyword),
    );
    const start = Math.max(page - 1, 0) * size;

    return {
      data: clone(items.slice(start, start + size)),
      totalPages: Math.max(1, Math.ceil(items.length / size)),
    };
  },

  getAllComments(myCdId: number) {
    return clone(comments[myCdId] ?? []);
  },

  addComment(myCdId: number, comment: Pick<DemoComment, 'timestamp' | 'content'>) {
    const created: DemoComment = {
      id: nextCommentId++,
      myCdId,
      userId: 101,
      nickname: '포트폴리오 방문자',
      timestamp: comment.timestamp,
      content: comment.content,
      createdAt: new Date().toISOString(),
    };
    comments[myCdId] = [...(comments[myCdId] ?? []), created];
    return clone(created);
  },

  deleteComment(myCdId: number, commentId: number) {
    comments[myCdId] = (comments[myCdId] ?? []).filter((comment) => comment.id !== commentId);
    return { deleted: true };
  },

  getGuestbook(ownerId: number, page = 1, size = 2) {
    const items = guestbooks[ownerId] ?? [];
    const start = Math.max(page - 1, 0) * size;
    return {
      guestbook: clone(items.slice(start, start + size)),
      pagination: { totalPages: Math.max(1, Math.ceil(items.length / size)) },
    };
  },

  createGuestbook(ownerId: number, userId: number, message: string) {
    const created: DemoGuestbook = {
      guestbookId: nextGuestbookId++,
      userId,
      nickname: '포트폴리오 방문자',
      profileImage: '',
      message,
      createdAt: new Date().toISOString(),
    };
    guestbooks[ownerId] = [created, ...(guestbooks[ownerId] ?? [])];
    return this.getGuestbook(ownerId, 1, 2);
  },

  deleteGuestbook(guestbookId: number, ownerId: number) {
    guestbooks[ownerId] = (guestbooks[ownerId] ?? []).filter((item) => item.guestbookId !== guestbookId);
    return { deleted: true };
  },

  getPointBalance() {
    return { balance: 1720 };
  },
};
