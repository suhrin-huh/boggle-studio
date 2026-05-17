'use client';

import useFrameAssembly from '@/hooks/useFrameAssembly';
import ResultLoading from './ResultLoading';
import ResultError from './ResultError';
import ResultView from './ResultView';

const LOADING_TIME = 3000;

export default function ResultBooth() {
  const { resultImage, fileName, isLoading, error } = useFrameAssembly({
    loadingTime: LOADING_TIME,
  });

  if (isLoading) return <ResultLoading />;
  if (error) return <ResultError />;
  if (!resultImage) return null;

  return <ResultView resultImage={resultImage} fileName={fileName} />;
}
