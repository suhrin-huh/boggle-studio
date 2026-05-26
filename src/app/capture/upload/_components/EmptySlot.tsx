interface EmptySlotProps {
  index: number;
  onClick: () => void;
}

/**
 * 슬롯에 사진이 없는 경우 보여주는 UI
 * @param index: 슬롯 번호
 * @param onClick: 클릭 이벤트 함수
 */
export default function EmptySlot({ index, onClick }: EmptySlotProps) {
  return (
    <button
      onClick={onClick}
      className="hover:bg-muted-hover/30 flex aspect-4/3 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 transition"
    >
      <svg
        className="text-muted-dark h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <span className="font-unbounded text-muted-dark text-xs font-medium sm:text-sm">
        SLOT {index + 1}
      </span>
    </button>
  );
}
