'use client';

import { useRouter } from 'next/navigation';
import { useBoothStore } from '@/store/useBoothStore';
import { FRAMES } from '@/constants/booth';

import PixelButton from '@/components/common/PixelButton';
import useLocalPhotoSlots from '@/hooks/useLocalPhotoSlots';

// hooks
import useUploadCapture from '@/hooks/useUploadCapture';

// components
import CroppingModal from './_components/CroppingModal';
import EmptySlot from './_components/EmptySlot';
import FilledSlot from './_components/FilledSlot';
import PhotoGrid from './_components/PhotoGrid';

/**
 * 업로드 모드
 */
export default function UploadPage() {
  const router = useRouter();
  const frameId = useBoothStore((state) => state.frameId);
  const setCapturedCuts = useBoothStore((state) => state.setCapturedCuts);
  const totalSlots = frameId ? FRAMES[frameId].requiredPhotoCount : 0;
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
  } = useUploadCapture({ onConfirm: handleUploadConfirm });

  // 출력 버튼 이벤트 핸들러
  const handlePrint = () => {
    setCapturedCuts(localSlots as string[]);
    router.push('/result');
  };

  return (
    <div>
      <h1>촬영</h1>
      <PhotoGrid totalCount={totalSlots}>
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
      <div>
        <PixelButton
          variant={isAllFilled ? 'primary' : 'ghost'}
          disabled={!isAllFilled}
          onClick={handlePrint}
          className="scale-110"
        >
          사진 출력하기
        </PixelButton>
      </div>
    </div>
  );
}
