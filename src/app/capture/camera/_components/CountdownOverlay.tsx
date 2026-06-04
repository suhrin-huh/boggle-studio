interface CountdownOverlayProps {
  countdown: number | null;
}

/**
 * 카운트다운 숫자를 화면 중앙에 표시하는 오버레이
 * @param countdown - 표시할 카운트다운 숫자, null이면 미표시
 */
export default function CountdownOverlay({ countdown }: CountdownOverlayProps) {
  if (countdown === null) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      <span className="text-[120px] font-bold text-white drop-shadow-lg">{countdown}</span>
    </div>
  );
}
