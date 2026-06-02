// assets & types
import { CheckIcon } from '@/assets/icon/CheckIcon';
import { FRAME_OPTIONS, FrameType } from '@/constants';

interface FrameTypePickerProps {
  frameKeys: FrameType[];
  selected: FrameType;
  onSelect: (frame: FrameType) => void;
}

/**
 * 프레임 타입 선택 컴포넌트
 * basic / wide 등의 프레임 타입 버튼 목록을 렌더링하고, 선택된 항목에 체크 아이콘 오버레이를 표시
 * @param frameKeys - 선택 가능한 프레임 타입 키 배열
 * @param selected - 현재 선택된 프레임 타입
 * @param onSelect - 프레임 타입 선택 시 호출되는 핸들러
 */
export default function FrameTypePicker({ frameKeys, selected, onSelect }: FrameTypePickerProps) {
  if (frameKeys.length === 1) return null;

  return (
    <ul className="gap-sm flex">
      {frameKeys.map((frameKey) => {
        const isSelected = selected === frameKey;
        return (
          <li key={frameKey}>
            <button
              onClick={() => onSelect(frameKey)}
              className="px-lg py-xs sm:py-sm sm:text-body-lg text-muted-dark border-muted-light text-body-xs relative overflow-hidden rounded-lg border transition-colors"
            >
              {FRAME_OPTIONS[frameKey].label}
              {isSelected && (
                <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                  <CheckIcon size={24} />
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
