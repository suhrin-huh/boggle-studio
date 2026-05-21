// components
import PageTitle from '@/components/common/PageTitle';
import ThemeSelector from './_components/ThemeSelector';
import ThemePreloadImages from './_components/ThemePreloadImages';

export default function ThemePage() {
  return (
    <main className="gap-lg flex flex-1 flex-col items-center">
      <PageTitle title="Choose Your Theme" />
      <ThemeSelector>
        {/* theme 이미지 preload용 */}
        <ThemePreloadImages />
      </ThemeSelector>
    </main>
  );
}
