import PageContainer from '@/components/common/PageContainer';
import ThemeBooth from './_components/ThemeBooth';
import ThemeImagePreloader from './_components/ThemeImagePreloader';

/**
 * 테마 선택 페이지
 */
export default function ThemePage() {
  return (
    <PageContainer>
      <ThemeBooth>
        <ThemeImagePreloader />
      </ThemeBooth>
    </PageContainer>
  );
}
