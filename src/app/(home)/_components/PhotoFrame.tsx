interface PhotoFrameProps {
  children: React.ReactNode;
  className?: string;
}

export default function PhotoFrame({ children, className }: PhotoFrameProps) {
  return (
    <div
      className={`p-xs relative rounded-md ${className ?? ''}`}
      style={{
        background:
          'linear-gradient(145deg, #f5f5f5 0%, #bdbdbd 20%, #eeeeee 45%, #8a8a8a 70%, #d0d0d0 90%, #f0f0f0 100%)',
        boxShadow:
          '0 4px 10px rgba(0,0,0,0.45), inset 0 2px 3px rgba(255,255,255,0.95), inset 0 -2px 4px rgba(0,0,0,0.25)',
      }}
    >
      {/* 안쪽 테두리 음영으로 액자 깊이감 표현 */}
      <div className="relative h-full w-full overflow-hidden rounded-sm shadow-[inset_0_0_2px_rgba(0,0,0,0.25)]">
        {children}
      </div>
    </div>
  );
}
