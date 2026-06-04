/**
 * 카메라 초기화 중 표시하는 바운스 애니메이션 로딩 텍스트
 */
export default function LoadingText() {
  return (
    <div className="gap-sm font-unbounded absolute flex h-full w-full items-center justify-center font-bold">
      {'Setting...'.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block animate-bounce"
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
