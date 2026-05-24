// components
import PageContainer from '@/components/common/PageContainer';
import PageTitle from '@/components/common/PageTitle';
import ThemeSelector from './_components/ThemeSelector';
import ThemePreloadImages from './_components/ThemePreloadImages';

export default function ThemePage() {
  return (
    <PageContainer>
      <PageTitle title="Choose Your Theme" />
      <ThemeSelector>
        {/* theme 이미지 preload용 */}
        <ThemePreloadImages />
      </ThemeSelector>
    </PageContainer>
  );
}
