interface CountdownOverlayProps {
  countdown: number | null;
}

export default function CountdownOverlay({ countdown }: CountdownOverlayProps) {
  if (countdown === null) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      <span className="text-[120px] font-bold text-white drop-shadow-lg">{countdown}</span>
    </div>
  );
}
