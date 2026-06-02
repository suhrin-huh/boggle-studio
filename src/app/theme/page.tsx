// components
import PageContainer from '@/components/common/PageContainer';
import ThemeBooth from './_components/ThemeBooth';
import ThemeImagePreloader from './_components/ThemeImagePreloader';

/**
 * 테마 선택 페이지
 * 사용자가 사진 부스의 프레임 타입과 배경을 선택하는 라우트 컴포넌트
 */
export default function ThemePage() {
  return (
    <PageContainer>
      <ThemeBooth>
        {/* theme 이미지 preload용 */}
        <ThemeImagePreloader />
      </ThemeBooth>
    </PageContainer>
  );
}
