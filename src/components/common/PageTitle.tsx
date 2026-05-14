interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
}

export default function PageTitle({ title, description, className }: PageTitleProps) {
  return (
    <div className={`flex flex-col items-center gap-1 text-center ${className ?? ''}`}>
      <p className="text-muted-dark text-h3 font-luckiestguy">{title}</p>
      {description && <p className="text-caption text-muted-dark font-sans">{description}</p>}
    </div>
  );
}
