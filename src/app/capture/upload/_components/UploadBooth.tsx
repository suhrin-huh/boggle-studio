'use client';

import { useRouter } from 'next/navigation';

import { useBoothStore } from '@/store/useBoothStore';
import { useLocalPhotoSlots } from '@/hooks/useLocalPhotoSlots';
import { useUploadBooth } from '@/hooks/useUploadBooth';

import NeumorphicButton from '@/components/common/NeumorphicButton';
import PhotoGrid from './PhotoGrid';
import EmptySlot from './EmptySlot';
import FilledSlot from './FilledSlot';
import CroppingModal from './CroppingModal';

import { TOTAL_SLOTS } from '@/constants';

/**
 * 이미지 업로드 및 크롭 흐름을 관리하는 부스 컴포넌트
 */
export default function UploadBooth() {
  const router = useRouter();
  const setPhotoSlots = useBoothStore((state) => state.setPhotoSlots);

  const { localSlots, setPhotoAtIndex, isAllFilled } = useLocalPhotoSlots({
    totalSlots: TOTAL_SLOTS,
  });

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

  const handlePrint = () => {
    setPhotoSlots(localSlots as string[]);
    router.push('/theme');
  };

  return (
    <div className="w-full">
      <PhotoGrid>
        {localSlots.map((slot, index) => {
          return slot ? (
            <FilledSlot
              key={index}
              index={index}
              src={slot}
              onChangeClick={() => handleSlotClick(index)}
            />
          ) : (
            <EmptySlot key={index} index={index} onClick={() => handleSlotClick(index)} />
          );
        })}
      </PhotoGrid>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {fileToCrop && (
        <CroppingModal file={fileToCrop} onConfirm={handleModalConfirm} onCancel={closeModal} />
      )}

      <div className="mt-4 flex flex-col items-center gap-3">
        <NeumorphicButton onClick={handlePrint} disabled={!isAllFilled}>
          Choose Frame
        </NeumorphicButton>
      </div>
    </div>
  );
}
