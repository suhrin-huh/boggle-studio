'use client';

import { useEffect } from 'react';

import { useCropSelection } from '@/hooks/useCropSelection';

import NeumorphicButton from '@/components/common/NeumorphicButton';

interface CroppingModalProps {
  file: File;
  onConfirm: (data: string) => void;
  onCancel: () => void;
}

/**
 * 이미지 크롭 영역을 선택하는 전체화면 모달 컴포넌트
 * @param file - 크롭할 원본 이미지 파일
 * @param onConfirm - 크롭 확정 시 base64 데이터를 전달하는 콜백
 * @param onCancel - 크롭 취소 시 호출하는 콜백
 */
export default function CroppingModal({ file, onConfirm, onCancel }: CroppingModalProps) {
  const { canvasRef, loadFile, confirmCrop, cropToBase64 } = useCropSelection();

  useEffect(() => {
    loadFile(file);
  }, [file, loadFile]);

  const handleConfirm = () => {
    confirmCrop();
    const data = cropToBase64();
    if (data) {
      onConfirm(data);
    }
  };

  return (
    <div className="p-md fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* 앱 표면과 동일한 배경색으로 그림자 입체감을 표현하는 뉴모픽 카드 */}
      <div className="p-md gap-md flex w-5/6 max-w-110 flex-col rounded-2xl bg-gray-100">
        <p className="font-unbounded text-muted-dark text-body-md text-center font-semibold">
          EDIT PHOTO
        </p>

        {/* 인셋 그림자로 눌린 느낌의 뷰포트를 표현하는 캔버스 영역 */}
        <div className="shadow-neu-inset aspect-4/3 overflow-hidden rounded-xl bg-black/90">
          <canvas ref={canvasRef} className="block h-full w-full cursor-move touch-none" />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <NeumorphicButton onClick={onCancel}>CANCEL</NeumorphicButton>
          <NeumorphicButton onClick={handleConfirm}>SAVE</NeumorphicButton>
        </div>
      </div>
    </div>
  );
}
