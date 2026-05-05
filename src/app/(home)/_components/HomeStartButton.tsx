'use client';

import { useRouter } from 'next/navigation';
import NeumorphicButton from '@/components/common/NeumorphicButton';

export default function HomeStartButton() {
  const router = useRouter();

  return (
    <NeumorphicButton className="z-10" onClick={() => router.push('/frame')}>
      START
    </NeumorphicButton>
  );
}
