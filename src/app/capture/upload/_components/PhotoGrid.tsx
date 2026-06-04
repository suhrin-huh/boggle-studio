interface PhotoGridProps {
  children: React.ReactNode;
}

/**
 * 사진 슬롯을 그리드 형태로 나열하는 래퍼 컴포넌트
 */
export default function PhotoGrid({ children }: PhotoGridProps) {
  return <div className="p-md grid grid-cols-2 gap-3">{children}</div>;
}
