'use client';

import useResultAssembly from '@/hooks/useResultAssembly';
import ResultLoading from './ResultLoading';
import ResultError from './ResultError';
import ResultView from './ResultView';

const LOADING_TIME = 3000;

/**
 * 합성된 사진 및 비디오 확인 및 다운로드 페이지
 * 상태에 따라 loading, error, preview 렌더링
 */
export default function ResultBooth() {
  const { resultVideoUrl, resultImage, fileName, isLoading, error } = useResultAssembly({
    loadingTime: LOADING_TIME,
  });

  if (isLoading) return <ResultLoading />;
  if (error) return <ResultError />;
  if (!resultImage) return null;

  return (
    <>
      <ResultView resultImage={resultImage} resultVideoUrl={resultVideoUrl} fileName={fileName} />
    </>
  );
}
