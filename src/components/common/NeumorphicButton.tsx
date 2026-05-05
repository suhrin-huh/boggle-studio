interface NeumorphicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function NeumorphicButton({
  children,
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

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'cursor-pointer select-none',
        'rounded-2xl bg-[#e1ecfa]/30 px-8 py-3.5',
        'font-unbounded text-xs font-semibold tracking-wide md:text-sm',
        'transition-all duration-200 ease-in-out outline-none',
        'active:scale-[0.97]',
        disabled
          ? `${pressedShadow} text-gray-400`
          : `${raisedShadow} ${raisedHoverShadow} text-muted-dark`,
        'active:shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.85),inset_3px_3px_7px_rgba(163,177,198,0.65)]',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}
