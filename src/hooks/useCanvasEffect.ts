import { RefObject, useEffect, useRef } from 'react';
import { EffectType, CanvasEffect } from '@/types';
import { BubbleEffect } from '@/utils/effects/BubbleEffect';

/**
 * effectType 문자열로부터 해당하는 이펙트 인스턴스를 생성하는 팩토리 함수.
 * 새로운 이펙트 추가 시 이 switch에 case 추가하기
 */
function createEffect(type: EffectType): CanvasEffect {
  switch (type) {
    case 'bubble':
      return new BubbleEffect();
  }
}

/**
 * 캔버스 애니메이션의 메인 엔진 훅.
 * requestAnimationFrame 루프를 관리하고, isPlaying 상태에 따라 재생/일시정지를 제어
 *
 * [동작 원리]
 * - isPlaying = true  → RAF 루프 시작, 매 프레임마다 effect.render() 호출
 * - isPlaying = false → RAF 취소, 캔버스를 clear하지 않으므로 마지막 프레임이 그대로 유지 (일시정지)
 * - 컴포넌트 언마운트   → RAF 취소 + effect.cleanup() 호출하여 메모리 해제
 *
 * @param canvasRef - 애니메이션을 그릴 캔버스 엘리먼트의 ref
 * @param effectType - 실행할 이펙트 종류. undefined이면 훅이 아무것도 하지 않음
 * @param isPlaying - 애니메이션 재생 여부
 */
export default function useCanvasEffect(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  effectType: EffectType | undefined,
  isPlaying: boolean,
): void {
  // 이펙트 인스턴스를 ref로 보존 (리렌더 시에도 같은 인스턴스 유지)
  const effectRef = useRef<CanvasEffect | null>(null);
  // RAF ID를 ref로 보존 (취소 시 사용)
  const rafIdRef = useRef<number | null>(null);

  // effectType이 바뀔 때 이펙트 인스턴스를 교체
  useEffect(() => {
    if (!effectType) return;

    // 이전 이펙트가 있으면 정리 후 새 인스턴스 생성
    effectRef.current?.cleanup();
    effectRef.current = createEffect(effectType);

    return () => {
      effectRef.current?.cleanup();
      effectRef.current = null;
    };
  }, [effectType]);

  // isPlaying 변화에 따라 RAF 루프를 시작하거나 취소
  useEffect(() => {
    if (!effectType || !effectRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!isPlaying) {
      // 일시정지: RAF만 취소하고 canvas는 clear하지 않음 → 마지막 프레임 유지
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    // 재생: RAF 루프 시작
    const loop = () => {
      const effect = effectRef.current;
      if (!effect) return;

      // 캔버스 크기를 매 프레임마다 DOM 크기와 동기화 (리사이즈 대응)
      const { offsetWidth, offsetHeight } = canvas;
      if (canvas.width !== offsetWidth || canvas.height !== offsetHeight) {
        canvas.width = offsetWidth;
        canvas.height = offsetHeight;
      }

      effect.render(ctx, canvas.width, canvas.height);
      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [canvasRef, effectType, isPlaying]);
}
