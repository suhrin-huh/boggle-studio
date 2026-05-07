'use client';

import { CAPTURE_MODE, FRAMES } from '@/constants/booth';
import Link from 'next/link';
import PageTitle from '@/components/common/PageTitle';
import CaptureModeButton from './_components/CaptureModeButton';
import { useBoothStore } from '@/store/useBoothStore';
import { FrameConfig } from '@/types';

export default function CapturePage() {
  const captureModes = Object.values(CAPTURE_MODE);
  const frameId = useBoothStore((state) => state.frameId);

  // satisfies 연산자로 좁혀진 타입을 FrameConfig로 캐스팅하여 optional 필드 접근
  // 이펙트가 있는 프레임은 카메라 전용 → Upload 버튼 비활성화
  const isUploadDisabled = frameId ? !!(FRAMES[frameId] as FrameConfig).effectType : false;

  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <PageTitle title="SELECT A MODE" />

      {/* 모드 선택 버튼 리스트 */}
      <div className="gap-lg p-lg flex w-full shrink-0 flex-col">
        {captureModes.map((mode) => {
          const disabled = mode.id === 'upload' && isUploadDisabled;
          return disabled ? (
            /* disabled 상태에서는 Link 없이 버튼만 렌더 → 네비게이션 차단 */
            <CaptureModeButton key={mode.id} mode={mode} disabled />
          ) : (
            /* Link를 밖으로 빼서 제어권을 부모가 가짐 */
            <Link key={mode.id} href={mode.path} className="w-full">
              <CaptureModeButton mode={mode} />
            </Link>
          );
        })}
      </div>
    </main>
  );
}
