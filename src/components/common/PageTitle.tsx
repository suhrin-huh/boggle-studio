interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
}

export default function PageTitle({ title, description, className }: PageTitleProps) {
  return (
    <div className={`flex flex-col items-center gap-1 text-center ${className ?? ''}`}>
      <h1 className="text-muted-dark text-body-lg md:text-h3 font-luckiestguy">{title}</h1>
      {description && <p className="text-caption text-muted-dark font-sans">{description}</p>}
    </div>
  );
}
