import NeumorphicButton from '@/components/common/NeumorphicButton';
import Link from 'next/link';

export default function ResultError() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <p className="text-md text-muted-dark font-unbounded text-center">
        Sorry, something went wrong.
      </p>
      <NeumorphicButton>
        <Link
          href="/"
          className="border-muted-light text-muted-dark px-lg py-md rounded-full border font-sans text-sm tracking-widest transition-opacity hover:opacity-70"
        >
          Go to Home
        </Link>
      </NeumorphicButton>
    </div>
  );
}
