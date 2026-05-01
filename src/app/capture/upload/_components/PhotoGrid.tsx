interface PhotoGridProps {
  children: React.ReactNode;
  totalCount: number;
}

/**리스트 형태를 잡아주는 래퍼 컴포넌트
 * @param children
 * @param totalCount 선택한 프레임에 필요한 사진 수
 */
export default function PhotoGrid({ children, totalCount }: PhotoGridProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-gray-700">사진 업로드 (총 {totalCount}장)</h2>
      </div>
      {/* 2x2 슬롯 그리드 */}
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}
