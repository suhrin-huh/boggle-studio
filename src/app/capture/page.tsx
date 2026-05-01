'use client';

import { useRouter } from 'next/navigation';
import { CAPTURE_MODE } from '@/constants/booth';
export default function CapturePage() {
  const router = useRouter();
  const captureModes = Object.values(CAPTURE_MODE);

  return (
    <>
      <h1 className="text-center">촬영 방법 선택</h1>
      <div className="gap-md flex justify-center">
        {captureModes.map((mode) => (
          <button
            key={`${mode.id}`}
            className="p-lg rounded-lg border-2"
            onClick={() => router.push(mode.path)}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </>
  );
}
