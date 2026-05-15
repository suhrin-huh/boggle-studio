This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### 기본 기능 완성하기!

아래의 페이지별 기능에 맞추어서 스타일 없이 기본 요소들로만 페이지를 완성해줘. 크기조절이 필요한 경우에만 스타일을 적용해줘.

1. `/` : home
   '시작하기' 버튼을 클릭하면 '/frame' 페이지로 이동한다.

2. '/frame'
   블랙, 화이트, 물고기 라는 3개의 테마 선택지가 있다. 각 선택지는 서비스 요소이기 때문에 상수로 관리한다. 선택지 중에 하나만 선택할 수 있으며, 선택하지 않는 경우 '다음'이라는 버튼은 비활성화 상태이다. 선택을 완료한 후 '다음' 버튼을 클릭하면 선택한 프레임 데이터를 상태로 저장하고 '/capture' 페이지로 이동한다.

3. '/capture'
   사진은 총 4장이 필요하며,
   사용자가 '촬영하기' 또는 '사진 업로드 하기' 중 선택을 할 수 있다.

(1) 촬영하기를 선택할 경우 카메라로 촬영을 할 수 있다. 카메라 비율은 가로형(4:3)이며, 촬영하기 버튼을 누르면 사진이 촬영된다.

(2) 사진 업로드 하기를 선택할 경우 4개의 사진 업로드 버튼이 생긴다. 각 버튼을 클릭하면 사진을 업로드 할 수 있으며, 가로형(4:3) 비율에 맞추어 사진을 원하는 범위에 맞게 확대 및 축소, 자르기가 가능하다.

처음 선택한 방식으로 4개의 사진을 모두 채워야한다.
4개의 사진이 다 채워질 경우, '사진을 모두 선택하였습니다' 버튼이 보임과 동시에 3초 카운트가 보이고. '/result' 페이지로 넘어간다.

4. '/result'
   선택한 사진 4개를 열 기준으로 세로로 길게 조립한 하나의 파일을 만들고, 그 파일 이미지를 보여준다.
   '다운로드'버튼을 누르면 파일이 다운로드된다.

필요한 전역변수는 다음과 같다.
`useBoothStore.ts`에 들어가야 할 핵심 요소들

우리 '보글보글 스튜디오'의 유저 플로우(프레임 선택 ➔ 촬영 ➔ 결과 확인)를 머릿속에 그려보면, 페이지가 넘어가도 절대 까먹으면 안 되는 데이터들이 있어. 이게 바로 스토어에 들어갈 '상태(State)'와 그걸 조작할 '액션(Actions)'이야.

TypeScript 인터페이스로 깔끔하게 정리해 줄게.

📊 상태 (State - 들고 다닐 데이터)
selectedTheme: 사용자가 선택한 프레임 배경 색상/패턴 (예: '#F1F5F9' 등)

capturedCuts: 촬영이 완료된 사진들의 데이터 배열 (Base64 문자열 또는 Blob URL)

finalImageName: 마지막 '/result'에서 캔버스 합성 후 생성된 결과물 파일명 (Supabase 업로드 및 다운로드용)

🛠️ 액션 (Actions - 데이터를 바꾸는 스위치)
setTheme(): 배경 테마 변경하기

addCapture(): 찍힌 사진 하나를 배열에 추가하기

resetBooth(): 처음부터 다시 찍기! (모든 상태를 초기값으로 되돌림)

### `frame` 이전 코드

```
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FRAME_THEMES } from '@/constants/themes';
import useBoothStore from '@/store/useBoothStore';
import { ThemeOption } from '@/types/booth';
import Carousel from '@/components/common/Carousel';
import frameImg from '@/assets/frame.png';

const FramePage = () => {
  const router = useRouter();
  const setTheme = useBoothStore((state) => state.setTheme);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleNext = () => {
    const theme = FRAME_THEMES.find((t) => t.id === selectedId);
    if (!theme) return;
    setTheme(theme);
    router.push('/capture');
  };

  const renderThemeItem = (theme: ThemeOption) => (
    <button
      type="button"
      onClick={() => setSelectedId(theme.id)}
      style={{ outline: selectedId === theme.id ? '2px solid black' : 'none' }}
    >
      <Image src={frameImg} alt={theme.label} width={200} height={150} />
      <p>{theme.label}</p>
    </button>
  );

  return (
    <div className="flex flex-col items-center">
      <h1>프레임 선택</h1>
      <div className="mx-auto w-100">
        <Carousel items={FRAME_THEMES} renderItem={renderThemeItem} infinite={false} />
      </div>
      <button onClick={handleNext} disabled={!selectedId}>
        촬영 시작하기
      </button>
    </div>
  );
};

export default FramePage;
```

### `capture` 이전 코드(업로드 포함)

```
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import useBoothStore from '@/store/useBoothStore';
import useCamera from '@/hooks/useCamera';
import useImageCrop from '@/hooks/useImageCrop';
import { MAX_PHOTO_COUNT } from '@/constants/themes';
import { CaptureMode } from '@/types/booth';

// 카메라 해상도: 4:3 비율
const VIDEO_CONSTRAINTS = {
  width: 800,
  height: 600,
  facingMode: 'user',
} as const;

// 업로드 크롭 영역 크기 (4:3 비율)
const CROP_WIDTH = 400;
const CROP_HEIGHT = 300;

// 업로드 슬롯 하나의 크롭 UI
function UploadSlot({
  index,
  onConfirm,
  confirmed,
}: {
  index: number;
  onConfirm: (index: number, data: string) => void;
  confirmed: boolean;
}) {
  const {
    imageUrl,
    containerRef,
    handleFileChange,
    handleWheel,
    handleMouseDown,
    cropToBase64,
    reset,
  } = useImageCrop();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConfirm = () => {
    const data = cropToBase64(CROP_WIDTH, CROP_HEIGHT);
    if (!data) return;
    onConfirm(index, data);
  };

  if (confirmed) {
    return <div>사진 {index + 1} 완료</div>;
  }

  return (
    <div>
      <p>사진 {index + 1}</p>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
      {imageUrl && (
        <>
          {/* 크롭 미리보기 영역 - 4:3 비율 크기만 지정 */}
          <div
            ref={containerRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            style={{
              width: CROP_WIDTH,
              height: CROP_HEIGHT,
              overflow: 'hidden',
              cursor: 'grab',
              position: 'relative',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={`업로드 사진 ${index + 1}`}
              style={{
                position: 'absolute',
                maxWidth: 'none',
                objectFit: 'contain',
                width: '100%',
                height: '100%',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              draggable={false}
            />
          </div>
          <button onClick={handleConfirm}>이 범위로 자르기</button>
          <button onClick={reset}>다시 선택</button>
        </>
      )}
    </div>
  );
}

export default function CapturePage() {
  const router = useRouter();
  const addCapture = useBoothStore((state) => state.addCapture);
  const capturedCuts = useBoothStore((state) => state.capturedCuts);

  const [mode, setMode] = useState<CaptureMode | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [confirmedSlots, setConfirmedSlots] = useState<string[]>([]);
  const { webcamRef, capture } = useCamera();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allFilled =
    mode === 'camera'
      ? capturedCuts.length >= MAX_PHOTO_COUNT
      : confirmedSlots.filter(Boolean).length >= MAX_PHOTO_COUNT;

  // 4장 완성 시 3초 카운트다운 후 result 페이지로 이동
  useEffect(() => {
    if (!allFilled) return;

    setCountdown(3);
    let remaining = 3;

    timerRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        router.push('/result');
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [allFilled, router]);

  const handleCameraCapture = useCallback(() => {
    if (capturedCuts.length >= MAX_PHOTO_COUNT) return;
    const screenshot = capture();
    if (screenshot) addCapture(screenshot);
  }, [capture, addCapture, capturedCuts.length]);

  const handleUploadConfirm = useCallback(
    (index: number, data: string) => {
      setConfirmedSlots((prev) => {
        const next = [...prev];
        next[index] = data;
        return next;
      });
      addCapture(data);
    },
    [addCapture],
  );

  // 모드 선택 전
  if (!mode) {
    return (
      <div>
        <h1>촬영 방법 선택</h1>
        <button onClick={() => setMode('camera')}>촬영하기</button>
        <button onClick={() => setMode('upload')}>사진 업로드 하기</button>
      </div>
    );
  }

  return (
    <div>
      <h1>촬영</h1>
      <p>
        {mode === 'camera' ? capturedCuts.length : confirmedSlots.filter(Boolean).length} /{' '}
        {MAX_PHOTO_COUNT}
      </p>

      {/* 카메라 모드 */}
      {mode === 'camera' && (
        <div>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/png"
            videoConstraints={VIDEO_CONSTRAINTS}
            style={{ width: 400, height: 300 }}
          />
          <br />
          <button onClick={handleCameraCapture} disabled={capturedCuts.length >= MAX_PHOTO_COUNT}>
            촬영하기
          </button>
          {/* 촬영된 사진 미리보기 */}
          {capturedCuts.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt={`촬영 ${i + 1}`} style={{ width: 100, height: 75 }} />
          ))}
        </div>
      )}

      {/* 업로드 모드 */}
      {mode === 'upload' && (
        <div>
          {Array.from({ length: MAX_PHOTO_COUNT }).map((_, i) => (
            <UploadSlot
              key={i}
              index={i}
              onConfirm={handleUploadConfirm}
              confirmed={!!confirmedSlots[i]}
            />
          ))}
        </div>
      )}

      {/* 4장 완성 시 버튼 + 카운트다운 */}
      {allFilled && (
        <div>
          <button disabled>사진을 모두 선택하였습니다</button>
          {countdown !== null && <p>{countdown}초 후 결과 페이지로 이동합니다</p>}
        </div>
      )}
    </div>
  );
}
```

```
// 결과 파일명 생성: BoggleBoggle_[Text]_[YYYYMMDDHHmmss]_[Random4Chars].png
export const generateFileName = (text: string): string => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const timestamp =
    `${now.getFullYear()}` +
    `${pad(now.getMonth() + 1)}` +
    `${pad(now.getDate())}` +
    `${pad(now.getHours())}` +
    `${pad(now.getMinutes())}` +
    `${pad(now.getSeconds())}`;

  const random = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `BoggleBoggle_${text}_${timestamp}_${random}.png`;
};

```

## 잠시 저장해두는 미리보기

````
      {/* 미리보기 */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {localSlots.map((slot, i) => (
          // aspect-4/3으로 셀 높이를 고정 → img의 h-full/w-full이 이 높이를 기준으로 동작
          <div
            key={i}
            className="aspect-4/3 w-full overflow-hidden rounded-lg border-2 border-gray-500"
          >
            {slot && (
              <img src={slot} alt={`slot ${i + 1}`} className="h-full w-full object-cover" />
            )}
          </div>
        ))}
      </div>
      ```

````
