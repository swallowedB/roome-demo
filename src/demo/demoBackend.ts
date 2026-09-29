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

export type DemoBook = {
  id: number;
  title: string;
  author: string;
  publisher: string;
  publishedDate: string;
  imageUrl: string;
  genreNames: string[];
  page: number;
};

type DemoBookReview = {
  title: string;
  quote: string;
  takeaway: string;
  motivate: string;
  topic: string;
  freeFormText: string;
  coverColor: string;
  writeDateTime: string;
};

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

type DemoRoomSeed = Pick<
  DemoRoom,
  'nickname' | 'theme' | 'topBookGenres' | 'topCdGenres'
>;

const additionalRoomSeeds: DemoRoomSeed[] = [
  { nickname: '아침의 문장', theme: 'BASIC', topBookGenres: ['에세이', '인문'], topCdGenres: ['acoustic', 'folk'] },
  { nickname: '라떼 한 잔', theme: 'BASIC', topBookGenres: ['소설', '로맨스'], topCdGenres: ['jazz', 'bossa nova'] },
  { nickname: '느린 책장', theme: 'BASIC', topBookGenres: ['역사', '사회'], topCdGenres: ['classical', 'piano'] },
  { nickname: '하루 한 곡', theme: 'BASIC', topBookGenres: ['자기계발', '경제'], topCdGenres: ['pop', 'indie'] },
  { nickname: '작은 여행', theme: 'BASIC', topBookGenres: ['여행', '사진'], topCdGenres: ['world', 'folk'] },
  { nickname: '모닝 페이지', theme: 'BASIC', topBookGenres: ['시', '에세이'], topCdGenres: ['ambient', 'piano'] },
  { nickname: '커피와 재즈', theme: 'BASIC', topBookGenres: ['예술', '디자인'], topCdGenres: ['jazz', 'soul'] },
  { nickname: '여백 수집가', theme: 'BASIC', topBookGenres: ['인문', '철학'], topCdGenres: ['minimal', 'ambient'] },
  { nickname: '별빛 독서', theme: 'BASIC', topBookGenres: ['판타지', '소설'], topCdGenres: ['dream pop', 'indie'] },
  { nickname: '기록하는 날', theme: 'BASIC', topBookGenres: ['에세이', '일상'], topCdGenres: ['lofi', 'acoustic'] },
  { nickname: '나무 그늘', theme: 'FOREST', topBookGenres: ['자연', '과학'], topCdGenres: ['folk', 'acoustic'] },
  { nickname: '초록 산책', theme: 'FOREST', topBookGenres: ['여행', '에세이'], topCdGenres: ['indie', 'folk'] },
  { nickname: '비 오는 창가', theme: 'FOREST', topBookGenres: ['시', '소설'], topCdGenres: ['jazz', 'rainy day'] },
  { nickname: '숲속 플레이리스트', theme: 'FOREST', topBookGenres: ['음악', '예술'], topCdGenres: ['ambient', 'new age'] },
  { nickname: '새벽 등산', theme: 'FOREST', topBookGenres: ['건강', '자기계발'], topCdGenres: ['rock', 'folk'] },
  { nickname: '계절의 문장', theme: 'FOREST', topBookGenres: ['에세이', '문학'], topCdGenres: ['classical', 'acoustic'] },
  { nickname: '풀잎 소리', theme: 'FOREST', topBookGenres: ['자연', '사진'], topCdGenres: ['nature', 'ambient'] },
  { nickname: '따뜻한 온기', theme: 'FOREST', topBookGenres: ['로맨스', '소설'], topCdGenres: ['r&b', 'soul'] },
  { nickname: '주말 캠퍼', theme: 'FOREST', topBookGenres: ['여행', '요리'], topCdGenres: ['country', 'folk'] },
  { nickname: '들꽃', theme: 'FOREST', topBookGenres: ['시', '인문'], topCdGenres: ['indie', 'acoustic'] },
  { nickname: '파도 일기', theme: 'MARINE', topBookGenres: ['에세이', '여행'], topCdGenres: ['city pop', 'indie'] },
  { nickname: '푸른 밤', theme: 'MARINE', topBookGenres: ['소설', '미스터리'], topCdGenres: ['electronic', 'ambient'] },
  { nickname: '해변의 책', theme: 'MARINE', topBookGenres: ['로맨스', '시'], topCdGenres: ['bossa nova', 'jazz'] },
  { nickname: '수평선', theme: 'MARINE', topBookGenres: ['과학', '우주'], topCdGenres: ['synthwave', 'electronic'] },
  { nickname: '여름 편지', theme: 'MARINE', topBookGenres: ['에세이', '일상'], topCdGenres: ['pop', 'r&b'] },
  { nickname: '산호', theme: 'MARINE', topBookGenres: ['예술', '디자인'], topCdGenres: ['house', 'disco'] },
  { nickname: '물결', theme: 'MARINE', topBookGenres: ['철학', '인문'], topCdGenres: ['lofi', 'ambient'] },
  { nickname: '항해자', theme: 'MARINE', topBookGenres: ['역사', '여행'], topCdGenres: ['rock', 'world'] },
  { nickname: '조개껍질', theme: 'MARINE', topBookGenres: ['동화', '문학'], topCdGenres: ['piano', 'classical'] },
  { nickname: '바다유리', theme: 'MARINE', topBookGenres: ['사진', '에세이'], topCdGenres: ['dream pop', 'indie'] },
];

const basicRoomSeeds = additionalRoomSeeds.filter(
  ({ theme }) => theme === 'BASIC',
);
const forestRoomSeeds = additionalRoomSeeds.filter(
  ({ theme }) => theme === 'FOREST',
);
const marineRoomSeeds = additionalRoomSeeds.filter(
  ({ theme }) => theme === 'MARINE',
);

const additionalRoomSeedsInHiveOrder = [
  forestRoomSeeds[0],
  marineRoomSeeds[0],
  forestRoomSeeds[1],
  marineRoomSeeds[1],
  ...basicRoomSeeds.slice(0, 8).flatMap((basicRoom, index) => [
    basicRoom,
    forestRoomSeeds[index + 2],
    marineRoomSeeds[index + 2],
  ]),
  basicRoomSeeds[8],
  basicRoomSeeds[9],
];

const additionalRooms: DemoRoom[] = additionalRoomSeedsInHiveOrder.map((seed, index) => ({
  roomId: 5004 + index,
  userId: 104 + index,
  createdAt: '2026-09-05T00:00:00.000Z',
  furnitures: [
    { furnitureType: 'BOOKSHELF', isVisible: true, level: 1, maxCapacity: 14 },
    { furnitureType: 'CD_RACK', isVisible: true, level: 1, maxCapacity: 14 },
  ],
  storageLimits: { maxBooks: 14, maxMusic: 14 },
  userStorage: { savedBooks: 0, savedMusic: 2, writtenMusicLogs: 0, writtenReviews: 0 },
  ...seed,
}));

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
    nickname: '보아',
    theme: 'BASIC',
    createdAt: '2026-09-05T00:00:00.000Z',
    furnitures: [
      { furnitureType: 'BOOKSHELF', isVisible: true, level: 1, maxCapacity: 14 },
      { furnitureType: 'CD_RACK', isVisible: true, level: 1, maxCapacity: 14 },
    ],
    storageLimits: { maxBooks: 14, maxMusic: 14 },
    userStorage: { savedBooks: 10, savedMusic: 10, writtenMusicLogs: 1, writtenReviews: 0 },
    topBookGenres: ['한국소설', '일본소설'],
    topCdGenres: ['indie', 'pop', 'ambient'],
  },
  {
    roomId: 5002,
    userId: 102,
    nickname: '밤산책',
    theme: 'FOREST',
    createdAt: '2026-09-05T00:00:00.000Z',
    furnitures: [
      { furnitureType: 'BOOKSHELF', isVisible: true, level: 1, maxCapacity: 14 },
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
      { furnitureType: 'BOOKSHELF', isVisible: true, level: 1, maxCapacity: 14 },
      { furnitureType: 'CD_RACK', isVisible: true, level: 1, maxCapacity: 14 },
    ],
    storageLimits: { maxBooks: 14, maxMusic: 14 },
    userStorage: { savedBooks: 0, savedMusic: 2, writtenMusicLogs: 0, writtenReviews: 0 },
    topBookGenres: [],
    topCdGenres: ['electronic', 'jazz'],
  },
  ...additionalRooms,
];

let nextCdId = 900;
let nextBookId = 900;
let nextGuestbookId = 30;
let nextCommentId = 50;

const bookcases: Record<number, DemoBook[]> = {
  101: [
    {
      id: 801,
      title: '아몬드',
      author: '손원평',
      publisher: '창비',
      publishedDate: '2017-03-31',
      imageUrl: 'https://image.aladin.co.kr/product/31893/32/cover200/k212833749_2.jpg',
      genreNames: ['한국소설'],
      page: 0,
    },
    {
      id: 802,
      title: '불편한 편의점',
      author: '김호연',
      publisher: '나무옆의자',
      publishedDate: '2021-04-20',
      imageUrl: 'https://image.aladin.co.kr/product/29045/74/cover200/k192836746_2.jpg',
      genreNames: ['한국소설'],
      page: 0,
    },
    {
      id: 803,
      title: '오늘 밤, 세계에서 이 사랑이 사라진다 해도',
      author: '이치조 미사키',
      publisher: '모모',
      publishedDate: '2021-06-21',
      imageUrl: 'https://image.aladin.co.kr/product/27407/79/cover200/s842033450_1.jpg',
      genreNames: ['일본소설'],
      page: 0,
    },
    {
      id: 804,
      title: '파친코 1',
      author: '이민진',
      publisher: '인플루엔셜',
      publishedDate: '2022-07-27',
      imageUrl: 'https://image.aladin.co.kr/product/29496/39/cover200/s382931339_2.jpg',
      genreNames: ['영미소설'],
      page: 0,
    },
    {
      id: 805,
      title: '달러구트 꿈 백화점 1',
      author: '이미예',
      publisher: '팩토리나인',
      publishedDate: '2020-07-08',
      imageUrl: 'https://image.aladin.co.kr/product/24512/70/cover200/k392630952_3.jpg',
      genreNames: ['한국판타지'],
      page: 0,
    },
    {
      id: 806,
      title: '작별하지 않는다',
      author: '한강',
      publisher: '문학동네',
      publishedDate: '2021-09-09',
      imageUrl: 'https://image.aladin.co.kr/product/27877/5/cover200/8954682154_3.jpg',
      genreNames: ['한국소설'],
      page: 0,
    },
    {
      id: 807,
      title: '채식주의자',
      author: '한강',
      publisher: '창비',
      publishedDate: '2022-03-28',
      imageUrl: 'https://image.aladin.co.kr/product/29137/2/cover200/8936434594_2.jpg',
      genreNames: ['한국소설'],
      page: 0,
    },
    {
      id: 808,
      title: '세상의 마지막 기차역',
      author: '무라세 다케시',
      publisher: '모모',
      publishedDate: '2022-05-11',
      imageUrl: 'https://image.aladin.co.kr/product/29442/51/cover200/k762837520_1.jpg',
      genreNames: ['외국판타지'],
      page: 0,
    },
    {
      id: 809,
      title: '소년이 온다',
      author: '한강',
      publisher: '창비',
      publishedDate: '2014-05-19',
      imageUrl: 'https://image.aladin.co.kr/product/4086/97/cover200/8936434128_2.jpg',
      genreNames: ['한국소설'],
      page: 0,
    },
    {
      id: 810,
      title: '어서 오세요, 휴남동 서점입니다',
      author: '황보름',
      publisher: '클레이하우스',
      publishedDate: '2022-01-17',
      imageUrl: 'https://image.aladin.co.kr/product/33783/53/cover200/k872930470_1.jpg',
      genreNames: ['한국소설'],
      page: 0,
    },
  ],
};

const bookReviews: Record<number, DemoBookReview> = {};

let cdRack: DemoCd[] = [
  {
    myCdId: 101,
    title: 'love.',
    artist: 'wave to earth',
    album: '0.1 flaws and all.',
    releaseDate: '2023-04-20',
    genres: ['indie', 'rock'],
    coverUrl: 'https://cdn-images.dzcdn.net/images/cover/693859ae241aff27a8fc9eee44e7e29c/500x500-000000-80-0-0.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=OEFs8npKaCw',
    duration: 308,
  },
  {
    myCdId: 102,
    title: 'TOMBOY',
    artist: 'Hyukoh',
    album: '23',
    releaseDate: '2017-04-24',
    genres: ['indie', 'rock'],
    coverUrl: 'https://cdn-images.dzcdn.net/images/cover/79a63cbb88b61fb811be586cf273e922/500x500-000000-80-0-0.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=VWUXzFWO8Rc',
    duration: 240,
  },
  {
    myCdId: 103,
    title: 'NAKKA (with IU)',
    artist: 'AKMU',
    album: 'NEXT EPISODE',
    releaseDate: '2021-07-26',
    genres: ['k-pop', 'electronic'],
    coverUrl: 'https://cdn-images.dzcdn.net/images/cover/9836288caa709904c5096613348e1ba9/500x500-000000-80-0-0.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=10JG5JjtQmU',
    duration: 213,
  },
  {
    myCdId: 104,
    title: 'seasons',
    artist: 'wave to earth',
    album: 'summer flows 0.02',
    releaseDate: '2020-08-04',
    genres: ['indie', 'rock'],
    coverUrl: 'https://cdn-images.dzcdn.net/images/cover/e7b1e6fc4bc81a5c04775d9587773d31/500x500-000000-80-0-0.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=aMX2JOzKoDY',
    duration: 257,
  },
  {
    myCdId: 105,
    title: 'From The Start',
    artist: 'Laufey',
    album: 'From The Start',
    releaseDate: '2023-05-11',
    genres: ['jazz', 'pop'],
    coverUrl: 'https://cdn-images.dzcdn.net/images/cover/497515366a19189203786c2315eb6609/500x500-000000-80-0-0.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=rHvQakk1zMA',
    duration: 172,
  },
  {
    myCdId: 106,
    title: 'LIMBO',
    artist: 'keshi',
    album: 'GABRIEL',
    releaseDate: '2022-03-25',
    genres: ['r&b', 'pop'],
    coverUrl: 'https://cdn-images.dzcdn.net/images/cover/5de0eec56dbe0a0670f01826aaf32f1a/500x500-000000-80-0-0.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=1i8WJ8cRWsE',
    duration: 215,
  },
  {
    myCdId: 107,
    title: 'About You',
    artist: 'The 1975',
    album: 'Being Funny In A Foreign Language',
    releaseDate: '2022-10-14',
    genres: ['alternative', 'pop'],
    coverUrl: 'https://cdn-images.dzcdn.net/images/cover/792fa7a01b6f80fe45733c6442c1781d/500x500-000000-80-0-0.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=5qq8ONq0hl8',
    duration: 326,
  },
  {
    myCdId: 108,
    title: 'Every Summertime',
    artist: 'NIKI',
    album: 'Every Summertime',
    releaseDate: '2021-08-10',
    genres: ['r&b', 'pop'],
    coverUrl: 'https://cdn-images.dzcdn.net/images/cover/e309e43a6b5460eb34326e3523cbba62/500x500-000000-80-0-0.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=EaL0kxAWMXc',
    duration: 211,
  },
  {
    myCdId: 109,
    title: 'Best Part (feat. H.E.R.)',
    artist: 'Daniel Caesar',
    album: 'H.E.R.',
    releaseDate: '2017-08-25',
    genres: ['r&b', 'soul'],
    coverUrl: 'https://cdn-images.dzcdn.net/images/cover/4dff56488d13d0b5e96d93d895c9624b/500x500-000000-80-0-0.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=75-Com9Bo_s',
    duration: 210,
  },
  {
    myCdId: 110,
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    releaseDate: '2022-04-01',
    genres: ['pop'],
    coverUrl: 'https://cdn-images.dzcdn.net/images/cover/b0e936124f59e669ddba02ebe5893f95/500x500-000000-80-0-0.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=EsY5kRIBM8Y',
    duration: 165,
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
      nickname: '보아',
      timestamp: 62,
      content: '이 부분부터 분위기가 바뀌어요.',
      createdAt: '2026-09-05T08:30:00.000Z',
    },
  ],
};

const clone = <T>(value: T): T => structuredClone(value);

const demoRankingScores = [320, 287, 254, 226, 193, 167, 141, 109, 78, 53];

const getRoom = (userId: number) => {
  const room = rooms.find((item) => item.userId === userId);
  if (!room) throw new Error('demo room not found');
  return clone(room);
};

const getRoomByRoomId = (roomId: number) => {
  const room = rooms.find((item) => item.roomId === roomId);
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
  getRoomByRoomId,

  getBookDetail(myBookId: number): DemoBook {
    const book = Object.values(bookcases)
      .flat()
      .find(({ id }) => id === myBookId);
    if (!book) throw new Error('demo book not found');
    return clone(book);
  },

  getBookReview(myBookId: number) {
    return bookReviews[myBookId] ? clone(bookReviews[myBookId]) : null;
  },

  saveBookReview(
    myBookId: number,
    review: Partial<Omit<DemoBookReview, 'writeDateTime'>>,
  ) {
    this.getBookDetail(myBookId);
    bookReviews[myBookId] = {
      title: review.title ?? '',
      quote: review.quote ?? '',
      takeaway: review.takeaway ?? '',
      motivate: review.motivate ?? '',
      topic: review.topic ?? '',
      freeFormText: review.freeFormText ?? '',
      coverColor: review.coverColor ?? 'BLUE',
      writeDateTime: new Date().toISOString(),
    };
    return clone(bookReviews[myBookId]);
  },

  deleteBookReview(myBookId: number) {
    delete bookReviews[myBookId];
    return { deleted: true };
  },

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
    return rooms.slice(0, 10).map((room, index) => ({
      rank: index + 1,
      userId: room.userId,
      nickname: room.nickname,
      profileImage: '',
      score: demoRankingScores[index],
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

  getBookCase(userId: number, size = 45, _lastBookId?: number, keyword = '') {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const books = (bookcases[userId] ?? []).filter((book) =>
      `${book.title} ${book.author} ${book.publisher}`
        .toLowerCase()
        .includes(normalizedKeyword),
    );

    return {
      myBooks: clone(books.slice(0, size)),
      count: books.length,
    };
  },

  addBook(userId: number, book: Omit<DemoBook, 'id'>) {
    const created = { id: nextBookId++, ...clone(book) };
    bookcases[userId] = [...(bookcases[userId] ?? []), created];
    return clone(created);
  },

  deleteBooks(userId: number, bookIds: number[]) {
    bookcases[userId] = (bookcases[userId] ?? []).filter(
      (book) => !bookIds.includes(book.id),
    );
    return { deletedIds: clone(bookIds) };
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
      nickname: '보아',
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
      nickname: '보아',
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
