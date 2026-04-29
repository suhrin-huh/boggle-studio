'use client';

import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <header className="p-md">
      <p
        onClick={handleClick}
        className="font-pixel text-primary text-body-sm md:text-body-lg text-center"
      >
        BB STUDIO
      </p>
    </header>
  );
}
