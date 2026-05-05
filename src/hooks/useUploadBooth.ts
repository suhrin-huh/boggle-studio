// library
import { useState, useRef } from 'react';

interface UseUploadBoothProps {
  onConfirm: (index: number, data: string) => void;
}

/**
 * 업로드 모드에 필요한 비즈니스 로직
 * @param onConfirm : (index, data) => void / 완료 버튼 이벤트 핸들러
 * @returns fileInputRef, fileToCrop, handleSlotClick, handleFileChange, handleModalConfirm, closeModal
 */
export default function useUploadBooth({ onConfirm }: UseUploadBoothProps) {
  /** 상태 및 Ref */
  const fileInputRef = useRef<HTMLInputElement>(null); // 여러 슬롯을 하나의 input으로 관리
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // 편집이 진행되는 슬롯 index
  const [fileToCrop, setFileToCrop] = useState<File | null>(null); //

  /** 비즈니스 로직 (이벤트 핸들러) */
  const handleSlotClick = (index: number) => {
    setEditingIndex(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || editingIndex === null) return;

    setFileToCrop(file);

    // input 초기화
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

  return {
    fileInputRef,
    fileToCrop,
    handleSlotClick,
    handleFileChange,
    handleModalConfirm,
    closeModal,
  };
}
