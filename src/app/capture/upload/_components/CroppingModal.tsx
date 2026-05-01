'use client';

import { useEffect } from 'react';
import useCropSelection from '@/hooks/useCropSelection';

interface CroppingModalProps {
  file: File;
  onConfirm: (data: string) => void;
  onCancel: () => void;
}

/**
 * 업로드한 사진을 편집(자르기) 전용 모달 컴포넌트
 * @param file : 선택한 사진
 * @param onConfirm : 완료 버튼 클릭시 동작할 이벤트 함수
 * @param onCancel : 취소 버튼 클릭시 동작할 이벤트 함수
 */
export default function CroppingModal({ file, onConfirm, onCancel }: CroppingModalProps) {
  const { canvasRef, loadFile, confirmCrop, cropToBase64, resetCrop } = useCropSelection();

  // 모달이 열리면 전달받은 파일을 캔버스에 로드합니다.
  useEffect(() => {
    loadFile(file);
  }, [file, loadFile]);

  // 자르기 완료 로직
  const handleConfirm = () => {
    confirmCrop();
    const data = cropToBase64();
    if (data) {
      onConfirm(data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-120 flex-col gap-4 rounded-2xl bg-white p-5 shadow-2xl">
        {/* 헤더 */}
        <h2 className="text-base font-semibold">사진 자르기</h2>
        {/* 캔버스 (기존 4:3 UI 유지) */}
        <div className="aspect-4/3 overflow-hidden rounded-xl border bg-black">
          <canvas ref={canvasRef} className="block h-full w-full cursor-move touch-none" />
        </div>
        {/* 액션 버튼 */}
        <div className="flex gap-2 pt-2">
          <button onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm transition">
            취소
          </button>
          <button onClick={resetCrop} className="rounded-lg border px-4 py-2 text-sm transition">
            초기화
          </button>
          <button
            onClick={handleConfirm}
            className="ml-auto rounded-lg border px-5 py-2 text-sm font-medium transition"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}
