import Link from 'next/link';

interface NeumorphicButtonProps {
  children: React.ReactNode;
  href?: string;       // href가 있으면 <a>(Link)로, 없으면 <button>으로 렌더링
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function NeumorphicButton({
  children,
  href,
  onClick,
  disabled = false,
  className = '',
}: NeumorphicButtonProps) {
  const raisedShadow =
    'shadow-[-3px_-3px_8px_rgba(255,255,255,0.95),5px_5px_12px_rgba(163,177,198,0.7)]';
  const raisedHoverShadow =
    'hover:shadow-[-4px_-4px_10px_rgba(255,255,255,1),8px_8px_16px_rgba(163,177,198,0.75)]';
  const pressedShadow =
    'shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.85),inset_3px_3px_7px_rgba(163,177,198,0.65)]';

  const computedClassName = [
    'cursor-pointer select-none',
    'px-lg py-md rounded-2xl bg-[#e1ecfa]/30',
    'font-unbounded text-[10px] font-semibold tracking-wide',
    'transition-all duration-200 ease-in-out outline-none',
    'active:scale-[0.97]',
    disabled
      ? `${pressedShadow} text-gray-400`
      : `${raisedShadow} ${raisedHoverShadow} text-muted-dark`,
    'active:shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.85),inset_3px_3px_7px_rgba(163,177,198,0.65)]',
    className,
  ].join(' ');

  // href가 있으면 링크로 동작 (인터랙티브 요소 중첩 방지)
  if (href) {
    return (
      <Link href={href} className={computedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={computedClassName}
    >
      {children}
    </button>
  );
}
