import {
  fetchJson,
  type FunctionContext,
  getRequiredQuery,
  json,
} from '../music/_shared';

type AladinEnv = { ALADIN_TTB_KEY?: string };

type AladinItem = {
  isbn?: string;
  isbn13?: string;
  title?: string;
  author?: string;
  publisher?: string;
  pubDate?: string;
  cover?: string;
  categoryId?: number;
  categoryName?: string;
};

type AladinSearchResponse = { item?: AladinItem[] };

export const onRequestGet = async (
  context: FunctionContext<AladinEnv>,
): Promise<Response> => {
  const keyword = getRequiredQuery(context.request, 'keyword');
  if (keyword instanceof Response) return keyword;
  if (!context.env.ALADIN_TTB_KEY) {
    return json({ error: 'book search is unavailable' }, 502);
  }

  try {
    const url = new URL('https://www.aladin.co.kr/ttb/api/ItemSearch.aspx');
    url.search = new URLSearchParams({
      ttbkey: context.env.ALADIN_TTB_KEY,
      Query: keyword,
      QueryType: 'Keyword',
      MaxResults: '10',
      start: '1',
      SearchTarget: 'Book',
      output: 'JS',
      Version: '20131101',
      Cover: 'Big',
    }).toString();

    const result = await fetchJson<AladinSearchResponse>(url.toString());
    return json({
      item: (result.item ?? []).map((book) => ({
        isbn: book.isbn13 || book.isbn || '',
        title: book.title || '',
        author: book.author || '',
        publisher: book.publisher || '',
        pubDate: book.pubDate || '',
        cover: book.cover || '',
        categoryId: book.categoryId || 0,
        categoryName: book.categoryName || '',
      })),
    });
  } catch {
    return json({ error: 'book search is unavailable' }, 502);
  }
};
