/**
 * 모든 캔버스 이펙트 클래스가 구현해야 하는 공통 인터페이스.
 * 새로운 이펙트(예: SnowEffect, ConfettiEffect)를 추가할 때 이 인터페이스를 구현하면 된다.
 */
export interface CanvasEffect {
  /**
   * 매 애니메이션 프레임마다 호출되는 렌더 메서드.
   * isPlaying이 true인 동안 requestAnimationFrame 루프에서 지속적으로 호출된다.
   * @param ctx - 그리기 대상 캔버스 2D 컨텍스트
   * @param width - 캔버스의 현재 너비 (px)
   * @param height - 캔버스의 현재 높이 (px)
   */
  render(ctx: CanvasRenderingContext2D, width: number, height: number): void;

  /**
   * 컴포넌트 언마운트 또는 이펙트 교체 시 내부 상태를 정리하는 메서드.
   * 배열, 타이머 등 메모리를 점유하는 내부 리소스를 해제한다.
   */
  cleanup(): void;
}
