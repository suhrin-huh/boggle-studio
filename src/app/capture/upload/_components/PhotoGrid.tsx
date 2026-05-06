interface PhotoGridProps {
  children: React.ReactNode;
}

/**리스트 형태를 잡아주는 래퍼 컴포넌트
 * @param children
 * @param totalCount 선택한 프레임에 필요한 사진 수
 */
export default function PhotoGrid({ children }: PhotoGridProps) {
  return <div className="p-md grid grid-cols-2 gap-3">{children}</div>;
}
