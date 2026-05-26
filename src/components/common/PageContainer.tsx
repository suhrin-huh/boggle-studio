interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 페이지별 통합 UI를 위한 공통 컨테이너
 *
 */
export default function PageContainer({ children, className }: PageContainerProps) {
  const classes = [
    'p-md', // padding 및 margin
    'gap-lg flex flex-1 flex-col items-center justify-center', //flex 관련 속성
    'overflow-hidden', // overflow 및 스크롤 => 안 생기게 하자..!
    '', // width 및 height
    className,
  ].join(' ');

  return <main className={classes}>{children}</main>;
}
