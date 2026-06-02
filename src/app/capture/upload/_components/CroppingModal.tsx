'use client';

import { useEffect } from 'react';
import { useCropSelection } from '@/hooks/useCropSelection';
import NeumorphicButton from '@/components/common/NeumorphicButton';

interface CroppingModalProps {
  file: File;
  onConfirm: (data: string) => void;
  onCancel: () => void;
}

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
      {/* 뉴모픽 모달 카드 — 앱 표면과 동일한 배경색으로 그림자 입체감 표현 */}
      <div className="p-md gap-md flex w-5/6 max-w-110 flex-col rounded-2xl bg-gray-100">
        {/* 헤더 */}
        <p className="font-unbounded text-muted-dark text-body-md text-center font-semibold">
          EDIT PHOTO
        </p>

        {/* 캔버스 영역 — 인셋 그림자로 눌린 느낌의 뷰포트 표현 */}
        <div className="shadow-neu-inset aspect-4/3 overflow-hidden rounded-xl bg-black/90">
          <canvas ref={canvasRef} className="block h-full w-full cursor-move touch-none" />
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <NeumorphicButton onClick={onCancel}>CANCEL</NeumorphicButton>
          <NeumorphicButton onClick={handleConfirm}>SAVE</NeumorphicButton>
        </div>
      </div>
    </div>
  );
}
