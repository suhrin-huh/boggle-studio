'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FRAME_THEMES } from '@/constants/themes';
import useBoothStore from '@/store/useBoothStore';
import { ThemeOption } from '@/types/booth';

export default function FramePage() {
  const router = useRouter();
  const setTheme = useBoothStore((state) => state.setTheme);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (theme: ThemeOption) => {
    setSelectedId(theme.id);
  };

  const handleNext = () => {
    const theme = FRAME_THEMES.find((t) => t.id === selectedId);
    if (!theme) return;
    setTheme(theme);
    router.push('/capture');
  };

  return (
    <div>
      <h1>프레임 선택</h1>
      <ul>
        {FRAME_THEMES.map((theme) => (
          <li key={theme.id}>
            <label>
              <input
                type="radio"
                name="frame-theme"
                value={theme.id}
                checked={selectedId === theme.id}
                onChange={() => handleSelect(theme)}
              />
              {theme.label}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleNext} disabled={!selectedId}>
        다음
      </button>
    </div>
  );
}
