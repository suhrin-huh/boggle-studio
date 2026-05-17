import PageTitle from '@/components/common/PageTitle';
import ThemeSelector from './_components/ThemeSelector';
import ThemePreloadImages from './_components/ThemePreloadImages';

export default function ThemePage() {
  return (
    <main className="p-md flex flex-1 flex-col items-center justify-center gap-8 font-sans">
      <PageTitle title="SELECT A THEME" />
      <ThemeSelector>
        <ThemePreloadImages />
      </ThemeSelector>
    </main>
  );
}
