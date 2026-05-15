# 서비스 플로우 재편: capture-first 구조로 전환

---

## (1) 문제 정의

### 현 상황

현재 서비스 플로우는 **프레임 선택 → 촬영** 순서로 구성되어 있다.

```
(home) → /frame → /capture → /capture/camera or /capture/upload → /result
```

- `CameraBooth` / `UploadBooth` 진입 시 `frameId`가 store에 없으면 홈으로 redirect
- `capture/page.tsx`에서 이펙트 프레임 여부에 따라 업로드 모드 비활성화
- `bubble_black` 프레임에 한해 BubbleEffect canvas 애니메이션이 촬영 중 실행됨
- `effectSlots`(촬영 순간의 canvas 스냅샷 배열)를 store에 저장 후, result에서 photo 위에 합성

### 변경 목표

**촬영 먼저, 프레임 나중** 구조로 플로우를 뒤집는다. Canvas 이펙트 시스템은 전체 제거한다.

```
(home) → /capture → /capture/camera or /capture/upload → /frame → /result
```

- 사진 수는 4장으로 고정 (기존과 동일하나 frameId 의존 제거)
- Canvas 이펙트(BubbleEffect) 및 관련 파일·타입·store 필드 전부 삭제

---

## (2) 해결 방안

### Commit 1 — canvas 이펙트 시스템 전체 제거

```
refactor: canvas 이펙트 시스템 제거
```

**작업 내용:**

| 파일 | 작업 |
|------|------|
| `src/hooks/useCanvasEffect.ts` | **삭제** |
| `src/utils/effects/BubbleEffect.ts` | **삭제** |
| `src/utils/effects/drawers.ts` | **삭제** |
| `src/types/effect.ts` | **삭제** |
| `src/types/booth.ts` | `FrameConfig`에서 `effectType?: EffectType` 제거, `EffectType` 타입 제거 |
| `src/constants/booth.ts` | 모든 프레임 설정에서 `effectType` 필드 제거 |
| `src/store/useBoothStore.ts` | `effectSlots` 필드·`setEffectSlots` 액션·`resetBooth` 초기화 코드 제거 |
| `src/utils/canvasHelper.ts` | `assembleFrame` 파라미터에서 `effectSlots` 제거, 이펙트 합성 레이어 코드 제거 |
| `src/hooks/useFrameAssembly.ts` | `effectSlots` store 구독 제거, `assembleFrame` 호출 인자 제거 |
| `src/app/capture/camera/_components/CameraBooth.tsx` | `useCanvasEffect`, `canvasRef`, `isPlaying`, `localEffectSlots`, `effectType` 계산 전부 제거. `handleCapture`에서 스냅샷 코드 제거. `handlePrint`에서 `setEffectSlots(...)` 제거. canvas 오버레이 JSX 제거. `CameraControls` props `effectType`·`isPlaying`·`onTogglePlay` 제거 |
| `src/app/capture/camera/_components/CameraControls.tsx` | `effectType`, `isPlaying`, `onTogglePlay` props 및 "Pause Effect / Play Effect" 버튼 JSX 제거. `CameraControlsProps` 단순화 |

---

### Commit 2 — 서비스 플로우를 capture-first 순서로 변경

```
refactor: 서비스 플로우를 capture-first 구조로 변경 (home→capture→frame→result)
```

**작업 내용:**

| 파일 | 작업 |
|------|------|
| `src/app/(home)/page.tsx` | `<Link href="/frame">` → `<Link href="/capture">` |
| `src/hooks/useFrameSelection.ts` | `router.push('/capture')` → `router.push('/result')` |
| `src/app/capture/camera/_components/CameraBooth.tsx` | `handlePrint`에서 `router.push('/result')` → `router.push('/frame')`. `frameId` 없으면 홈으로 redirect하는 가드 **제거**. `totalSlots`를 `frameId` 의존 없이 `4`로 고정 |
| `src/app/capture/upload/_components/UploadBooth.tsx` | `handlePrint`에서 `router.push('/result')` → `router.push('/frame')`. `frameId` 가드 **제거**. `totalSlots` = `4` 고정 |
| `src/app/frame/_components/FrameSelector.tsx` | `photoSlots.length === 0`이면 `router.replace('/')` 가드 **추가** (`useBoothStore(state => state.photoSlots)` 사용) |
| `src/app/capture/page.tsx` | `frameId` 구독 제거. `isUploadDisabled` 로직 제거 (업로드 항상 활성). `FrameConfig` 임포트 제거 |

---

## (3) 참고 내용

### 주의할 점

- **`effectSlots` 필드 제거 시 localStorage 구 데이터 충돌**: `useBoothStore`는 `persist` 미들웨어를 사용한다. `effectSlots`를 제거하면 기존 localStorage에 저장된 구 버전 스냅샷 데이터가 남아 있을 수 있다. `partialize`에 `effectSlots`가 포함되어 있지 않으면 문제 없지만, 포함되어 있었다면 store version을 올리거나 `migrate` 옵션을 추가해야 한다.
- **`bubble_black` 프레임 처리**: `effectType`만 제거하면 프레임 자체는 유지된다. 해당 프레임을 계속 노출할지 제거할지는 별도 결정 필요. Commit 1 단계에서는 effectType 필드만 제거하고 프레임은 유지한다.
- **URL 직접 접근 방어 재검토**: 플로우 변경 후 방어 로직은 아래와 같이 재정렬된다.
  - `/capture/camera`, `/capture/upload`: 가드 없음 (누구나 접근 가능)
  - `/frame`: `photoSlots` 비어 있으면 `/`로 redirect
  - `/result`: 기존대로 `frameId` 또는 `photoSlots` 없으면 `/`로 redirect

### 핵심 개념 포인트

- **Commit 순서의 이유**: 이펙트 제거(Commit 1)를 먼저 수행해야 Commit 2에서 `CameraBooth`와 store 수정 시 의존 관계가 깔끔하게 정리된다. 순서를 바꾸면 중간 상태에서 타입 에러가 복잡하게 발생할 수 있다.
- **`totalSlots = 4` 고정**: 기존에는 `frameId ? FRAMES[frameId].requiredPhotoCount : 4` 패턴을 사용했으나, 촬영 시점에 frameId가 없으므로 단순히 상수 `4`로 대체한다. 향후 프레임별 사진 수가 달라질 가능성이 생기면 그때 별도 상수(예: `DEFAULT_PHOTO_COUNT = 4`)로 분리한다.
