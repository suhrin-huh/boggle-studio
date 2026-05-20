'use client';

import { useState } from 'react';
import { uploadAndSaveCapture } from '@/actions/captures';

export type QrState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'done'; captureId: string; ttlMinutes: number };

interface UseQrUploadParams {
  resultImage: string;
  resultVideoUrl: string | null;
  fileName: string;
}

export function useQrUpload({ resultImage, resultVideoUrl, fileName }: UseQrUploadParams) {
  const [qrState, setQrState] = useState<QrState>({ status: 'idle' });

  const handleQrCreate = async () => {
    if (qrState.status !== 'idle') return;

    setQrState({ status: 'loading' });

    try {
      const formData = new FormData();
      // filename 통일하기
      formData.append('filename', fileName);
      // DataURL → Blob → File
      const imgRes = await fetch(resultImage);
      const imgBlob = await imgRes.blob();
      formData.append('image', new File([imgBlob], fileName, { type: 'image/png' }));

      // Blob URL → File (영상이 있을 때만)
      if (resultVideoUrl) {
        const vidRes = await fetch(resultVideoUrl);
        const vidBlob = await vidRes.blob();
        formData.append(
          'video',
          new File([vidBlob], fileName.replace('.png', '.webm'), { type: 'video/webm' }),
        );
      }

      const result = await uploadAndSaveCapture(formData);

      if (!result.success || !result.data) {
        setQrState({ status: 'error' });
        // error 상태가 먼저 렌더된 후 alert가 호출되도록 렌더 사이클 양보
        setTimeout(() => {
          window.alert(result.message);
          setQrState({ status: 'idle' });
        }, 0);
        return;
      }

      console.log(result.data);

      setQrState({
        status: 'done',
        captureId: result.data.id,
        ttlMinutes: result.data.ttlMinutes,
      });
    } catch (error) {
      setQrState({ status: 'error' });
      setTimeout(() => {
        window.alert('업로드 중 오류가 발생했습니다.');
        setQrState({ status: 'idle' });
      }, 0);
    }
  };

  return { qrState, handleQrCreate };
}
