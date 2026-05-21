'use client';

import QRCode from 'react-qr-code';
import NeumorphicButton from '@/components/common/NeumorphicButton';
import QrCodeIcon from '@/assets/icon/QrCodeIcon';
import ErrorIcon from '@/assets/icon/ErrorIcon';
import { QrState } from '@/hooks/useQrUpload';

interface QrCodeButtonProps {
  state: QrState;
  onClick: () => void;
}

export default function QrCodeButton({ state, onClick }: QrCodeButtonProps) {
  const shareUrl =
    state.status === 'done'
      ? `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/share/${state.captureId}`
      : '';

  return (
    <NeumorphicButton
      onClick={onClick}
      disabled={state.status === 'loading' || state.status === 'done'}
    >
      {state.status === 'idle' && (
        <div className="flex flex-col items-center gap-1.5">
          <QrCodeIcon />
          <p className="tracking-wide">QR Code</p>
        </div>
      )}

      {state.status === 'loading' && (
        <div className="flex flex-col items-center gap-1.5">
          <div className="border-muted h-6 w-6 animate-spin rounded-full border-4 border-t-white" />
          <p className="tracking-wide">Uploading...</p>
        </div>
      )}

      {state.status === 'error' && (
        <div className="flex flex-col items-center gap-1.5 text-red-400">
          <ErrorIcon />
          <p className="tracking-wide">Error</p>
        </div>
      )}

      {state.status === 'done' && (
        <div className="flex flex-col items-center">
          <QRCode value={shareUrl} size={60} />
          <p className="text-muted-dark text-[9px]">
            {state.ttlMinutes}분간 사진을 다운로드할 수 있습니다.
          </p>
        </div>
      )}
    </NeumorphicButton>
  );
}
