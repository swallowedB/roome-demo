import axiosInstance from './axiosInstance';
import { demoBackend } from '@/demo/demoBackend';
import { isDemoMode } from '@/demo/demoMode';
import { requestMusic } from './musicProxy';

const API_URL = 'api';

// ------------------------------  SPOTIFY & YOUTUBE 검색  API ------------------------------
export const getYoutubeUrl = async (trackTitle: string, artistName: string) => {
  return requestMusic<{ youtubeUrl: string; duration: number }>(
    `/api/music/video?title=${encodeURIComponent(trackTitle)}&artist=${encodeURIComponent(
      artistName,
    )}`,
  );
};

/**
 *
 * @param searchQuery 입력된 값
 * @returns
 */
export const searchSpotifyCds = async (
  searchQuery: string,
): Promise<SearchItemType[]> => {
  if (!searchQuery.trim()) return [];

  return requestMusic<CDSearchResult[]>(
    `/api/music/search?q=${encodeURIComponent(searchQuery)}`,
  );
};

// -------------------- cd API ------------------------
/**
 *
 * @param targetUserId 조회 대상 id
 * @param size  페이지 크기
 * @param cursor 마지막으로 조회한 Cd id (첫 페이지 조회 시 제외)
 *
 * @returns cd 목록
 *
 *
 */
export const getCdRack = async (
  targetUserId: number,
  size?: number,
  cursor?: number,
) => {
  if (isDemoMode) return demoBackend.getCdRack(targetUserId, size, cursor);

  const url = cursor
    ? `/${API_URL}/my-cd?targetUserId=${targetUserId}&size=${
        size || 14
      }&cursor=${cursor}`
    : `/${API_URL}/my-cd?targetUserId=${targetUserId}&size=${size || 14}`;

  const response = await axiosInstance.get(url);

  return response.data;
};

/**
 *
 * @param targetUserId  조회 대상 id
 * @param keyword 키워드
 * @param size  페이지 크기
 * @param cursor 마지막으로 조회한 Cd id (첫 페이지 조회 시 제외)
 * @returns
 */
export const getCdRackSearch = async (
  targetUserId: number,
  keyword: string,
  size?: number,
  cursor?: number,
) => {
  if (isDemoMode) {
    return demoBackend.getCdRack(targetUserId, size, cursor, keyword);
  }

  const url = cursor
    ? `/${API_URL}/my-cd?targetUserId=${targetUserId}&size=${
        size || 14
      }&keyword=${keyword}&cursor=${cursor}`
    : `/${API_URL}/my-cd?targetUserId=${targetUserId}&size=${
        size || 14
      }&keyword=${keyword}`;

  const response = await axiosInstance.get(url);

  return response.data;
};

/**
 *
 * @param myCdId 사용자의 고유cdId
 * @param targetUserId 조회대상 id
 * @returns
 */
export const getCdInfo = async (myCdId: number, targetUserId: number) => {
  if (isDemoMode) return demoBackend.getCdInfo(myCdId);

  const response = await axiosInstance(
    `/${API_URL}/my-cd/${myCdId}?targetUserId=${targetUserId}`,
  );
  return response.data;
};

/**
 * @param cdData 추가할 cd 정보
 * @returns 추가한 cd 상세정보
 */
export const addCdToMyRack = async (cdData: PostCDInfo) => {
  if (isDemoMode) return demoBackend.addCd(cdData);

  const response = await axiosInstance.post(`/${API_URL}/my-cd`, cdData);
  return response.data;
};

/**
 * CD 삭제 API
 * @param myCdIds 삭제할 CD ID 목록 (쉼표로 구분된 문자열)
 * @returns
 */
export const deleteCdsFromMyRack = async (myCdIds: number[]) => {
  if (isDemoMode) return demoBackend.deleteCds(myCdIds);

  const response = await axiosInstance.delete(
    `/${API_URL}/my-cd?myCdIds=${myCdIds}`,
  );
  return response.data;
};

//  ------------- cd 템플릿 CRUD ------------

/**
 * 
 * @param myCdId 특정 cd에대한 사용자 고유ID
 * @returns 

 */
export const getCdTemplate = async (myCdId: number) => {
  if (isDemoMode) return demoBackend.getTemplate(myCdId);

  const response = await axiosInstance.get(
    `/${API_URL}/my-cd/${myCdId}/template`,
  );
  return response.data;
};

/**
 *
 * @param myCdId 특정 cd에대한 사용자 고유ID
 * @param contents 템플릿에 담긴 4가지 댓글 내용들
 * @returns
 */
export const addCdTemplate = async (
  myCdId: number,
  contents: {
    comment1: string;
    comment2: string;
    comment3: string;
    comment4: string;
  },
) => {
  if (isDemoMode) return demoBackend.saveTemplate(myCdId, contents);

  const response = await axiosInstance.post(
    `/${API_URL}/my-cd/${myCdId}/template`,
    contents,
  );
  return response.data;
};

/**
 *
 * @param myCdId 특정 cd에대한 사용자 고유ID
 * @param contents 템플릿에 담긴 4가지 댓글 내용들
 * @returns
 */
export const updateTemplate = async (
  myCdId: number,
  contents: {
    comment1: string;
    comment2: string;
    comment3: string;
    comment4: string;
  },
) => {
  if (isDemoMode) return demoBackend.saveTemplate(myCdId, contents);

  const response = await axiosInstance.patch(
    `/${API_URL}/my-cd/${myCdId}/template`,
    contents,
  );
  return response.data;
};

export const deleteTemplate = async (myCdId: number) => {
  if (isDemoMode) return demoBackend.deleteTemplate(myCdId);

  const response = await axiosInstance.delete(
    `/${API_URL}/my-cd/${myCdId}/template`,
  );
  return response;
};

// ------------------------cd 댓글 API--------------------------

export const addCdComment = async (
  myCdId: number,
  commentInfo: CdCommentPost,
) => {
  if (isDemoMode) return demoBackend.addComment(myCdId, commentInfo);

  const response = await axiosInstance.post(
    `/${API_URL}/my-cd/${myCdId}/comments`,
    commentInfo,
  );

  return response.data;
};

export const getCdComment = async (
  myCdId: number,
  page?: number,
  size?: number,
  keyword?: string,
) => {
  if (isDemoMode) return demoBackend.getComments(myCdId, page, size, keyword);

  const response = await axiosInstance.get(
    keyword
      ? `/${API_URL}/my-cd/${myCdId}/comments?page=${page}&size=${size}&keyword=${keyword}`
      : `/${API_URL}/my-cd/${myCdId}/comments?page=${page}&size=${size}`,
  );
  return response.data;
};

export const getCdCommentAll = async (myCdId: number) => {
  if (isDemoMode) return demoBackend.getAllComments(myCdId);

  const response = await axiosInstance.get(
    `/${API_URL}/my-cd/${myCdId}/comments/all`,
  );
  return response.data;
};

export const deleteCdComment = async (myCdId: number, commentId: number) => {
  if (isDemoMode) return demoBackend.deleteComment(myCdId, commentId);

  const response = await axiosInstance.delete(
    `/${API_URL}/my-cd/${myCdId}/comments/${commentId}`,
  );
  return response;
};

// ------------ CD  레벨 업그레이드 -----------------

/**
 * CD 업그레이드
 * @param roomId 방 ID
 * @returns
 */

export const upgradeCdLevel = async (roomId: number) => {
  if (isDemoMode) return { roomId, upgraded: false };

  const response = await axiosInstance.patch(
    `/${API_URL}/rooms/${roomId}/furniture/cd-rack/upgrade`,
  );
  return response.data;
};
