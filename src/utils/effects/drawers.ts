/* ════════════════════════════════════════
effect 요소 모음
════════════════════════════════════════ */

/**
 * effectType : bubble
 * 비눗방울, BubbleEffect 클래스에서 호출
 * @param ctx - 그리기 대상 캔버스 2D 컨텍스트
 * @param x - 버블 중심의 x 좌표
 * @param y - 버블 중심의 y 좌표
 * @param radius - 버블의 반지름 (px)
 * @param opacity - 버블의 투명도 (0 ~ 1)
 */
export function drawBubbleIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  opacity: number,
): void {
  ctx.save();

  // 버블 본체: 방사형 그라데이션
  const bodyGradient = ctx.createRadialGradient(
    x - radius * 0.3, // 그라데이션 시작점: 왼쪽 위 (빛이 비치는 방향)
    y - radius * 0.3,
    radius * 0.1, // 시작 반경: 작게
    x,
    y,
    radius, // 끝 반경: 버블 전체
  );
  bodyGradient.addColorStop(0, `rgba(200, 230, 255, ${opacity * 0.15})`); // 중심 : 거의 투명한 하늘색
  bodyGradient.addColorStop(0.7, `rgba(150, 200, 255, ${opacity * 0.1})`); // 중간 : 연한 파란 빛
  bodyGradient.addColorStop(1, `rgba(100, 180, 255, ${opacity * 0.5})`); // 테두리 : 반투명 파랑

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = bodyGradient;
  ctx.fill();

  // 버블 테두리
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(180, 220, 255, ${opacity * 0.6})`;
  ctx.lineWidth = radius * 0.04; // 반지름에 비례한 선 두께
  ctx.stroke();

  // 반사광
  const highlightX = x - radius * 0.35;
  const highlightY = y - radius * 0.35;
  const highlightGradient = ctx.createRadialGradient(
    highlightX,
    highlightY,
    0,
    highlightX,
    highlightY,
    radius * 0.4,
  );
  highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.7})`); // 중심: 밝은 흰색
  highlightGradient.addColorStop(1, `rgba(255, 255, 255, 0)`); // 가장자리: 완전 투명

  ctx.beginPath();

  // 타원형 하이라이트를 위해 scale 변환 사용
  ctx.save();
  ctx.translate(highlightX, highlightY);
  ctx.scale(1, 0.6); // 세로로 눌린 타원
  ctx.arc(0, 0, radius * 0.38, 0, Math.PI * 2);
  ctx.restore();
  ctx.fillStyle = highlightGradient;
  ctx.fill();

  // 반사광 (오른쪽 하단에 작은 반짝임)
  const smallHighlightX = x + radius * 0.4;
  const smallHighlightY = y + radius * 0.35;
  const smallHighlightGradient = ctx.createRadialGradient(
    smallHighlightX,
    smallHighlightY,
    0,
    smallHighlightX,
    smallHighlightY,
    radius * 0.15,
  );
  smallHighlightGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.5})`);
  smallHighlightGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

  ctx.beginPath();
  ctx.arc(smallHighlightX, smallHighlightY, radius * 0.14, 0, Math.PI * 2);
  ctx.fillStyle = smallHighlightGradient;
  ctx.fill();

  ctx.restore();
}
