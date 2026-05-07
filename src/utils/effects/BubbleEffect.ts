import { CanvasEffect } from '@/types';
import { drawBubbleIcon } from './drawers';

/**튜닝 상수 */
const BUBBLE_CONFIG = {
  SPAWN_RATE: 0.05, // 매 프레임 버블 생성 확률
  MIN_RADIUS: 4, // 버블 최소 반지름 (px)
  MAX_RADIUS: 20, // 버블 최대 반지름 (px)
  MIN_SPEED: 0.4, // 버블 최소 상승 속도 (px/frame)
  MAX_SPEED: 1.4, // 버블 최대 상승 속도 (px/frame)
  MIN_OPACITY: 0.5, // 버블 최소 초기 투명도
  MAX_OPACITY: 0.85, // 버블 최대 초기 투명도
  FADE_RATE: 0.0005, // 매 프레임마다 감소하는 투명도
  WOBBLE_AMPLITUDE: 0.5, // 좌우 흔들림 폭 (px). 높을수록 더 넓게 흔들림
  WOBBLE_SPEED_MIN: 0.02, // 흔들림 주기 최솟값
  WOBBLE_SPEED_MAX: 0.05, // 흔들림 주기 최댓값
} as const;

/** 버블 개체의 내부 상태 */
interface Bubble {
  x: number; // 현재 x 좌표 (중심)
  y: number; // 현재 y 좌표 (중심)
  radius: number; // 반지름
  opacity: number; // 현재 투명도
  speed: number; // 상승 속도
  wobbleOffset: number; // sin 계산에 사용되는 위상 오프셋 (초기 위치를 랜덤하게)
  wobbleSpeed: number; // sin 주기 속도
  frameCount: number; // 생성 이후 경과 프레임 수 (wobble 계산에 사용)
}

/**
 * 비눗방울 애니메이션 이펙트
 * CanvasEffect 인터페이스를 구현 => useCanvasEffect 훅이 render()를 매 프레임 호출
 */
export class BubbleEffect implements CanvasEffect {
  private bubbles: Bubble[] = [];

  render(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // 캔버스 전체를 지우고 새 프레임을 그리기
    ctx.clearRect(0, 0, width, height);

    // 새 버블 생성
    // SPAWN_RATE 확률로 버블 하나를 화면 하단 랜덤 위치에 생성
    if (Math.random() < BUBBLE_CONFIG.SPAWN_RATE) {
      const radius =
        BUBBLE_CONFIG.MIN_RADIUS +
        Math.random() * (BUBBLE_CONFIG.MAX_RADIUS - BUBBLE_CONFIG.MIN_RADIUS);

      this.bubbles.push({
        x: radius + Math.random() * (width - radius * 2), // 화면 안쪽에서만 생성
        y: height + radius, // 화면 하단 바깥에서 시작
        radius,
        opacity:
          BUBBLE_CONFIG.MIN_OPACITY +
          Math.random() * (BUBBLE_CONFIG.MAX_OPACITY - BUBBLE_CONFIG.MIN_OPACITY),
        speed:
          BUBBLE_CONFIG.MIN_SPEED +
          Math.random() * (BUBBLE_CONFIG.MAX_SPEED - BUBBLE_CONFIG.MIN_SPEED),
        wobbleOffset: Math.random() * Math.PI * 2, // sin 위상을 랜덤하게 시작
        wobbleSpeed:
          BUBBLE_CONFIG.WOBBLE_SPEED_MIN +
          Math.random() * (BUBBLE_CONFIG.WOBBLE_SPEED_MAX - BUBBLE_CONFIG.WOBBLE_SPEED_MIN),
        frameCount: 0,
      });
    }

    // 버블 업데이트 및 렌더
    // filter로 죽은 버블을 제거 후 살아있는 버블만 이동 후 그림
    this.bubbles = this.bubbles.filter((bubble) => {
      bubble.frameCount++;

      // 상승 이동
      bubble.y -= bubble.speed;

      // 좌우 흔들림: sin 파동으로 자연스러운 부유 느낌 구현
      bubble.x +=
        Math.sin(bubble.frameCount * bubble.wobbleSpeed + bubble.wobbleOffset) *
        BUBBLE_CONFIG.WOBBLE_AMPLITUDE;

      // 투명도 감소
      bubble.opacity -= BUBBLE_CONFIG.FADE_RATE;

      // 생명주기 종료 조건: 화면 위로 완전히 벗어나거나 투명도가 0 이하
      const isDead = bubble.y + bubble.radius < 0 || bubble.opacity <= 0;
      if (isDead) return false;

      // 살아있는 버블을 그리기
      drawBubbleIcon(ctx, bubble.x, bubble.y, bubble.radius, bubble.opacity);
      return true;
    });
  }

  cleanup(): void {
    // 내부 버블 배열 초기화 → 가비지 컬렉터가 객체들을 수거할 수 있게 참조 해제
    this.bubbles = [];
  }
}
