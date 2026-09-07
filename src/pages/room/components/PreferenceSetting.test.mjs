import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const preferenceProps = {
  storageData: {
    maxBooks: 14,
    maxMusic: 14,
    savedBooks: 2,
    savedMusic: 3,
    writtenMusicLogs: 1,
    writtenReviews: 1,
  },
  onFurnitureToggle: () => {},
  bookshelfLevel: 1,
  cdRackLevel: 1,
  furnitures: [
    { furnitureType: 'BOOKSHELF', isVisible: false, level: 1, maxCapacity: 14 },
    { furnitureType: 'CD_RACK', isVisible: true, level: 1, maxCapacity: 14 },
  ],
  bookGenres: ['에세이'],
  cdGenres: ['indie'],
  onClose: () => {},
};

test('renders the book card in demo room furniture settings', async () => {
  const server = await createServer({
    appType: 'custom',
    server: { middlewareMode: true },
  });

  try {
    const { default: PreferenceSetting } = await server.ssrLoadModule(
      '/src/pages/room/components/PreferenceSetting.tsx',
    );
    const markup = renderToStaticMarkup(
      createElement(PreferenceSetting, preferenceProps),
    );

    assert.match(markup, /음악/);
    assert.match(markup, /도서/);
  } finally {
    await server.close();
  }
});
