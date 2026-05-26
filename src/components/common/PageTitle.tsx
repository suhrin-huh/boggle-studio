interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
}

export default function PageTitle({ title, description, className }: PageTitleProps) {
  return (
    <div className={`flex flex-col items-center gap-1 text-center ${className ?? ''}`}>
      {/* <p className="text-muted-dark text-h4 font-sans font-bold">{title}</p> */}
      <p className="text-xs font-black tracking-widest text-slate-700 uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">
        {title}
      </p>
      {/* <p className="text-muted-dark text-h4 font-luckiestguy">{title}</p> */}

      {description && <p className="text-caption text-muted-dark font-sans">{description}</p>}
    </div>
  );
}
