import PixelWindow from '@/components/common/PixelWindow';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen min-h-[600px] w-dvw min-w-[360px] items-center justify-center bg-[#64BEF0]">
      <main className="relative flex max-w-[480px] flex-1 shrink-0 flex-col rounded-lg bg-white shadow-2xl">
        <PixelWindow title="BB STUDIO">
          <div className="mx-auto my-50 h-full max-h-150 min-h-125 w-full max-w-100 min-w-80">
            {children}
          </div>
        </PixelWindow>
      </main>
    </div>
  );
}
