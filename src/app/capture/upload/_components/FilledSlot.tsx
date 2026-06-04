interface FilledSlotProps {
  index: number;
  src: string;
  onChangeClick: () => void;
}

/**
 * 슬롯에 사진이 있는 경우 보여주는 UI
 * @param index - 슬롯 번호
 * @param src - 표시할 이미지 URL 또는 base64 데이터
 * @param onChangeClick - 이미지 교체 버튼 클릭 핸들러
 */
export default function FilledSlot({ index, src, onChangeClick }: FilledSlotProps) {
  return (
    <div className="group relative aspect-4/3 overflow-hidden rounded-xl border border-gray-200 bg-gray-900">
      <img
        src={src}
        alt={`슬롯 ${index + 1}`}
        className="h-full w-full object-cover opacity-90 transition group-hover:opacity-50"
      />
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onChangeClick}
          className="rounded-lg bg-white/20 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition hover:bg-white/40"
        >
          Replace
        </button>
      </div>
    </div>
  );
}
