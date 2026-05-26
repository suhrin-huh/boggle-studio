'use client';

import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <header className="p-md">
      <p onClick={handleClick} className="font-luckiestguy text-primary-dark text-h4 text-center">
        BOGGLE STUDIO
      </p>
    </header>
  );
}
