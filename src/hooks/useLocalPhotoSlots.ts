import { useState, useEffect } from 'react';

interface UseLocalPhotoSlotsProps {
  totalSlots: number;
}

/**사진을 임시로 저장하기 위한 통합 로컬 상태 훅
 * @param totalSlots : 선택된 프레임에 필요한 사진의 수
 * @returns localSlots, setPhotoAtIndex, addNextPhoto, isAllFilled,
 */
export default function useLocalPhotoSlots({ totalSlots }: UseLocalPhotoSlotsProps) {
  const [localSlots, setLocalSlots] = useState<(string | null)[]>([]);

  useEffect(() => {
    const initSlot = Array(totalSlots).fill(null);
    setLocalSlots(initSlot);
  }, [totalSlots]);

  // 순서대로 사진이 추가되는 함수(촬영하기 모드)
  const addNextPhoto = (photoData: string) => {
    setLocalSlots((prev) => {
      const newSlots = [...prev];
      // 앞에서부터 빈칸(null)인 첫 번째 인덱스를 찾음
      const nextEmptyIndex = newSlots.findIndex((slot) => slot === null);

      if (nextEmptyIndex !== -1) {
        newSlots[nextEmptyIndex] = photoData;
      }
      return newSlots;
    });
  };

  // 특정 인덱스에 사진 추가 함수
  const setPhotoAtIndex = (index: number, photoData: string) => {
    setLocalSlots((prev) => {
      const newSlots = [...prev];
      newSlots[index] = photoData;
      return newSlots;
    });
  };

  // 모든 slot에 사진 데이터 저장되어있는지 확인
  const isAllFilled = localSlots.every((slot) => slot !== null);

  return {
    localSlots,
    setPhotoAtIndex,
    addNextPhoto,
    isAllFilled,
  };
}
