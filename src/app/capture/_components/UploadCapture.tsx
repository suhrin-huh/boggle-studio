'use client';

import React, { useState, useRef } from 'react';
import CroppingModal from './CroppingModal'; // 경로에 맞게 수정해주세요

const TOTAL_SLOTS = 4;

interface UploadCaptureProps {
  confirmedSlots: (string | null)[];
  onConfirm: (index: number, data: string) => void;
  onRemove?: (index: number) => void; // 부모에서 슬롯 초기화(삭제) 함수를 받으면 좋습니다.
}

/**
 *
 * @param confirmedSlots : 편집이 완료된 사진들
 * @param onConfirm : 완료 버튼 클릭시 동작할 이벤트 함수
 * @returns
 */
export default function UploadCapture({ confirmedSlots, onConfirm, onRemove }: UploadCaptureProps) {
  // 단일 input으로 4개의 슬롯 업로드를 관리
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모달 제어 상태
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [fileToCrop, setFileToCrop] = useState<File | null>(null);

  // 슬롯 클릭 시 (파일 선택창 열기)
  const handleSlotClick = (index: number) => {
    setEditingIndex(index);
    fileInputRef.current?.click();
  };

  // 파일 선택 시 (모달 열기)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || editingIndex === null) return;

    setFileToCrop(file);

    // 동일한 파일을 지웠다가 다시 올릴 수 있도록 input 초기화
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleModalConfirm = (data: string) => {
    if (editingIndex !== null) {
      onConfirm(editingIndex, data);
    }
    closeModal();
  };

  const closeModal = () => {
    setEditingIndex(null);
    setFileToCrop(null);
  };

  // 0, 1, 2, 3 배열 생성
  const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) => i);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-gray-700">사진 업로드 (총 {TOTAL_SLOTS}장)</h2>
      </div>

      {/* 숨겨진 파일 입력 트리거 */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 2x2 슬롯 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        {slots.map((index) => {
          const previewData = confirmedSlots[index]; // 해당 인덱스에 데이터가 있는지 확인

          // 이미지가 확정된 슬롯 (미리보기)
          if (previewData) {
            return (
              <div
                key={index}
                className="group relative aspect-4/3 overflow-hidden rounded-xl border border-gray-200 bg-gray-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewData}
                  alt={`슬롯 ${index + 1}`}
                  className="h-full w-full object-cover opacity-90 transition group-hover:opacity-50"
                />

                {/* 호버 시 나타나는 수정/삭제 오버레이 */}
                <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleSlotClick(index)}
                    className="rounded-lg bg-white/20 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition hover:bg-white/40"
                  >
                    변경
                  </button>
                </div>
              </div>
            );
          }

          // 2. 비어있는 슬롯
          return (
            <button
              key={index}
              onClick={() => handleSlotClick(index)}
              className="flex aspect-4/3 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-xs font-medium">사진 {index + 1} 업로드</span>
            </button>
          );
        })}
      </div>

      {/* 파일이 선택되면 전체화면 모달 마운트 */}
      {fileToCrop && (
        <CroppingModal file={fileToCrop} onConfirm={handleModalConfirm} onCancel={closeModal} />
      )}
    </div>
  );
}
