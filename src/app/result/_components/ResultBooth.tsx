'use client';

import Image from 'next/image';
import useFrameAssembly from '@/hooks/useFrameAssembly';
import ResultActionButtons from './ResultActionButtons';
import PageTitle from '@/components/common/PageTitle';

export default function ResultBooth() {
  const { resultImage, fileName, isLoading, error } = useFrameAssembly();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="border-muted-dark h-8 w-8 animate-spin rounded-full border-4 border-t-white" />
        <PageTitle title="Generating" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!resultImage) return null;

  return (
    <>
      <PageTitle title="Done!" />

      {/* Generated Cut */}
      <div className="relative aspect-1/3 w-30">
        <Image src={resultImage} alt="Generated cut" fill className="object-cover" />
      </div>

      {/* 액션 버튼들 */}
      <ResultActionButtons resultImage={resultImage} fileName={fileName} />
    </>
  );
}
