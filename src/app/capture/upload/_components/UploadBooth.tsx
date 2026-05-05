'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';
import { FRAMES } from '@/constants/booth';

// hooks
import useLocalPhotoSlots from '@/hooks/useLocalPhotoSlots';
import useUploadBooth from '@/hooks/useUploadBooth';

// components
import PhotoGrid from './PhotoGrid';
import EmptySlot from './EmptySlot';
import FilledSlot from './FilledSlot';
import CroppingModal from './CroppingModal';
import NeumorphicButton from '@/components/common/NeumorphicButton';

export default function UploadBooth() {
  const router = useRouter();
  const frameId = useBoothStore((state) => state.frameId);
  const setPhotoSlots = useBoothStore((state) => state.setPhotoSlots);

  // Zustand에서 frameId를 바탕으로 totalSlots 계산
  const totalSlots = frameId ? FRAMES[frameId].requiredPhotoCount : 4;

  const { localSlots, setPhotoAtIndex, isAllFilled } = useLocalPhotoSlots({ totalSlots });

  const handleUploadConfirm = (index: number, data: string) => {
    setPhotoAtIndex(index, data);
  };

  const {
    fileInputRef,
    fileToCrop,
    handleSlotClick,
    handleFileChange,
    handleModalConfirm,
    closeModal,
  } = useUploadBooth({ onConfirm: handleUploadConfirm });

  useEffect(() => {
    if (!frameId) {
      router.replace('/');
    }
  }, [frameId, router]);

  if (!frameId) return null;

  // 출력 버튼 이벤트 핸들러
  const handlePrint = () => {
    setPhotoSlots(localSlots as string[]);
    router.push('/result');
  };

  return (
    <div className="w-full">
      <PhotoGrid>
        {localSlots.map((slot, index) => {
          // 이미지가 확정된 슬롯 (미리보기)
          return slot ? (
            <FilledSlot
              key={index}
              index={index}
              src={slot}
              onChangeClick={() => handleSlotClick(index)}
            />
          ) : (
            // 비어있는 슬롯
            <EmptySlot key={index} index={index} onClick={() => handleSlotClick(index)} />
          );
        })}
      </PhotoGrid>

      {/* 숨겨진 파일 입력 트리거 */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 파일이 선택되면 전체화면 모달 마운트 */}
      {fileToCrop && (
        <CroppingModal file={fileToCrop} onConfirm={handleModalConfirm} onCancel={closeModal} />
      )}

      {/* 액션 버튼 */}
      <div className="mt-4 flex flex-col items-center gap-3">
        <NeumorphicButton onClick={handlePrint} disabled={!isAllFilled}>
          Create Your Print
        </NeumorphicButton>
      </div>
    </div>
  );
}
