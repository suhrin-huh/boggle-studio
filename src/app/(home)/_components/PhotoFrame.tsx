interface PhotoFrameProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 은빛 금속 질감의 사진 프레임 컴포넌트. 자식 요소를 프레임 안에 감싸 렌더링한다.
 */
export default function PhotoFrame({ children, className }: PhotoFrameProps) {
  return (
    <div
      className={`p-xs relative overflow-hidden rounded-md after:rounded-sm after:shadow-[inset_0_0_2px_rgba(0,0,0,0.25)] after:content-[''] ${className ?? ''}`}
      style={{
        background:
          'linear-gradient(145deg, #f5f5f5 0%, #bdbdbd 20%, #eeeeee 45%, #8a8a8a 70%, #d0d0d0 90%, #f0f0f0 100%)',
        boxShadow:
          '0 4px 10px rgba(0,0,0,0.45), inset 0 2px 3px rgba(255,255,255,0.95), inset 0 -2px 4px rgba(0,0,0,0.25)',
      }}
    >
      {children}
    </div>
  );
}
