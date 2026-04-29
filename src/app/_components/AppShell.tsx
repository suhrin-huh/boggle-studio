import Header from '@/components/common/Header';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="bg-primary p-md flex h-dvh min-h-150 min-w-80 justify-center">
      <main className="relative flex w-full max-w-120 flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        <Header />
        {children}
      </main>
    </div>
  );
}
