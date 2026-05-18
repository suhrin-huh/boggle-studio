/**
 * 순수 네이티브 IndexedDB API 대신 단순한 Key-Value 저장소' 역할을 수행하기 위한 idb helper 함수
 */

import { get, set, del } from 'idb-keyval';
import { VIDEO_SLOT_KEY_PREFIX } from '@/constants/booth';

/**
 * IndexedDB에 비디오 Blob을 저장
 * @param key  - 저장할 키 (generateVideoKey로 생성)
 * @param blob - 저장할 webm Blob
 */
export const saveVideoBlob = (key: string, blob: Blob): Promise<void> => set(key, blob);

/**
 * IndexedDB에서 비디오 Blob을 불러옴
 * @param key - 조회할 키
 * @returns 저장된 Blob, 없으면 undefined
 */
export const loadVideoBlob = (key: string): Promise<Blob | undefined> => get(key);

/**
 * IndexedDB에서 비디오 Blob 삭제
 * @param key - 삭제할 키
 */
export const deleteVideoBlob = (key: string): Promise<void> => del(key);

/**
 * 슬롯 인덱스 기반의 고유 IndexedDB 키를 생성
 * slotIndex를 사용하여 고정된 배열처럼 데이터 할당 => 별도의 삭제 로직 필요 X
 * @param slotIndex - 촬영 슬롯 번호 (0-based)
 * @returns `booth-video-{slotIndex}` 형식의 키
 */
export const generateVideoKey = (slotIndex: number): string =>
  `${VIDEO_SLOT_KEY_PREFIX}-${slotIndex}`;
