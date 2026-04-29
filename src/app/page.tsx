'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="mx-auto my-50 h-full max-h-150 min-h-125 w-full max-w-100 min-w-80">
      <div className="flex flex-col items-center justify-center gap-2 border-2 p-4">
        <h1 className="font-pixel">BOGGLE BOGGLE STUDIO</h1>
        <p>집에서 편리하게 촬영하는 인생네컷</p>
        <button
          className="rounded-lg border-2 p-1 hover:bg-black/20 active:bg-black/30"
          type="button"
          onClick={() => router.push('/frame')}
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
