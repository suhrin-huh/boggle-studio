/** 브라우저 지원 여부에 따라 최적 MediaRecorder mimeType을 반환
 *  vp9 → vp8 → generic webm 순으로 fallback
 */
export function getSupportedMimeType(): string {
  const candidates = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return '';
}
