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
        className="font-luckiestguy text-foreground-main text-h3 md:text-h1 text-center"
      >
        BOGGLE STUDIO
      </p>
    </header>
  );
}
