'use client';

// hooks
import useUploadCapture from '@/hooks/useUploadCapture';

// components
import CroppingModal from './CroppingModal';
import EmptySlot from './EmptySlot';
import FilledSlot from './FilledSlot';
import PhotoGrid from './PhotoGrid';

const TOTAL_SLOTS = 4;

interface UploadCaptureProps {
  confirmedSlots: (string | null)[];
  onConfirm: (index: number, data: string) => void;
}

/**
 * 업로드 모드
 * @param confirmedSlots : 편집이 완료된 사진들
 * @param onConfirm : 완료 버튼 클릭시 동작할 이벤트 함수
 */
export default function UploadCapture({ confirmedSlots, onConfirm }: UploadCaptureProps) {
  const {
    fileInputRef,
    fileToCrop,
    handleSlotClick,
    handleFileChange,
    handleModalConfirm,
    closeModal,
  } = useUploadCapture({ onConfirm });

  // TOTAL_SLOTS에 맞게 배열 생성
  const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) => i);

  return (
    <>
      <PhotoGrid totalCount={TOTAL_SLOTS}>
        {slots.map((index) => {
          const previewData = confirmedSlots[index]; // 해당 인덱스에 데이터가 있는지 확인

          // 이미지가 확정된 슬롯 (미리보기)
          return previewData ? (
            <FilledSlot
              key={index}
              index={index}
              src={previewData}
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
    </>
  );
}
