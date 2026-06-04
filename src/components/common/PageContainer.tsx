interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 페이지별 통합 레이아웃을 위한 공통 컨테이너 컴포넌트
 */
export default function PageContainer({ children, className }: PageContainerProps) {
  const classes = [
    'p-md',
    'gap-lg flex flex-1 flex-col items-center justify-center',
    'overflow-hidden',
    className,
  ].join(' ');

  return <main className={classes}>{children}</main>;
}
