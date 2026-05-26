import Header from '@/components/common/Header';
import Image from 'next/image';
import background from '@/assets/image/background.jpg';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    // 화면 전체 틀
    <div className="md:p-lg flex h-dvh min-h-150 min-w-80 justify-center font-sans">
      {/* 메인 요소 레이아웃 */}
      <div className="md:shadow-neu relative flex w-full flex-col overflow-hidden md:max-w-140 md:rounded-lg">
        <Header />
        <Image src={background} alt="배경" loading="eager" fill className="-z-10" />
        {children}
      </div>
    </div>
  );
}
