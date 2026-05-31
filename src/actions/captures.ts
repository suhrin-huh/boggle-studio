/**
 * 사진 및 비디오 조회, 저장 관련 action
 */
'use server';

import { createClient } from '@/utils/supabase/server';
import { ActionState } from '@/types';

// createClient 반환 타입에서 클라이언트 타입 추론
type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

// ─── 내부 타입 ────────────────────────────────────────────────────────────────

interface UploadedPaths {
  imagePath: string;
  videoPath: string | null;
}

interface CaptureUrls {
  imageUrl: string;
  videoUrl: string | null;
}

// ─── 응답 타입 ────────────────────────────────────────────────────────────────

interface UploadAndSaveCaptureResponse {
  id: string;
  expiresAt: string;
  ttlMinutes: number;
}

interface GetCaptureDetailResponse {
  imageUrl: string;
  videoUrl: string | null;
  fileName: string;
}

/**
 * 캔버스에서 합성된 최종 이미지와 스케치 비디오 파일을 Supabase Storage에 업로드함
 * @param supabase    - Supabase 서버 컴포넌트용 클라이언트 인스턴스
 * @param artifactId   - 에셋 파일명으로 사용할 UUID
 * @param imageFile   - 저장할 4컷 합성 완료된 이미지 파일
 * @param videoFile   - 저장할 타임랩스 비디오 파일(optional)
 * @returns uploaded : 업로드 완료된 스토리지 상대 경로 객체
 * @returns storageRollbackList: 실패 시 일괄 롤백(제거)에 사용할 경로 배열
 * @throws {Error} 이미지 또는 비디오 업로드 실패 시 에러를 발생시켜 상위 트랜잭션 롤백을 유도
 */
async function uploadFilesToStorage(
  supabase: SupabaseServerClient,
  artifactId: string,
  imageFile: File,
  videoFile: File | null,
): Promise<{ uploaded: UploadedPaths; storageRollbackList: string[] }> {
  // 자원별 Storage 경로 설정
  const imagePath = `images/${artifactId}.jpg`;
  const videoPath = videoFile ? `videos/${artifactId}.webm` : null;

  // 저장 후 반환되는 상대 경로 저장할 배열
  const rollbackList: string[] = [];

  // 이미지 업로드
  const { error: imgError } = await supabase.storage
    .from('booth-artifacts')
    .upload(imagePath, imageFile, { contentType: 'image/jpeg' });

  if (imgError) throw new Error(`사진 업로드 실패: ${imgError.message}`);
  rollbackList.push(imagePath);

  // 비디오 업로드
  if (videoFile && videoPath) {
    const { error: vidError } = await supabase.storage
      .from('booth-artifacts')
      .upload(videoPath, videoFile, { contentType: 'video/webm' });

    if (vidError) throw new Error(`영상 업로드 실패: ${vidError.message}`);
    rollbackList.push(videoPath);
  }

  return { uploaded: { imagePath, videoPath }, storageRollbackList: rollbackList };
}

/**
 * @description 업로드된 파일의 Public URL을 추출
 */
function getPublicUrls(supabase: SupabaseServerClient, uploaded: UploadedPaths): CaptureUrls {
  const {
    data: { publicUrl: imageUrl },
  } = supabase.storage.from('booth-artifacts').getPublicUrl(uploaded.imagePath);

  const videoUrl = uploaded.videoPath
    ? supabase.storage.from('booth-artifacts').getPublicUrl(uploaded.videoPath).data.publicUrl
    : null;

  return { imageUrl, videoUrl };
}

/**
 * @description 업로드에 실패했을 때 스토리지에서 파일을 삭제 (수동 롤백)
 */
async function rollbackUploads(supabase: SupabaseServerClient, paths: string[]): Promise<void> {
  if (paths.length === 0) return;

  console.log(`롤백 실행: 스토리지에서 ${paths.length}개의 파일을 삭제`);

  const { error } = await supabase.storage.from('booth-artifacts').remove(paths);

  if (error) {
    console.error('롤백(파일 삭제) 실패', error);
  } else {
    console.log('롤백 완료');
  }
}

// ─── 서버 액션 ────────────────────────────────────────────────────────────────

/**
 * @description 사진 및 비디오를 스토리지에 업로드하고 DB에 저장하는 action.
 * storage 업로드 → Public URL 획득 → RPC 호출로 DB에 저장 순으로 실행되며, 실패 시 롤백
 * @param {FormData} formData - image, video, filename
 * @returns 성공시 id, expiresAt, ttlMinutes 반환
 */
export async function uploadAndSaveCapture(
  formData: FormData,
): Promise<ActionState<UploadAndSaveCaptureResponse>> {
  const supabase = await createClient();

  const fileName = formData.get('filename');
  const imageFile = formData.get('image') as File;
  const videoFile = formData.get('video') as File | null;

  // 이미지가 없을 경우 에러 반환
  if (!imageFile) {
    return { success: false, message: 'QR 코드 생성을 위해서는 사진 파일이 필요합니다.' };
  }

  // 스토리지에 저장할 고유 이름
  const artifactId = crypto.randomUUID();

  // 에러 발생 시 스토리지 청소(롤백)에 사용할 파일 경로 리스트 장부 개설
  let storageRollbackList: string[] = [];

  try {
    // 1. storage 업로드
    const { uploaded, storageRollbackList: paths } = await uploadFilesToStorage(
      supabase,
      artifactId,
      imageFile,
      videoFile,
    );
    storageRollbackList = paths;

    // 2. Public URL 획득
    const { imageUrl, videoUrl } = getPublicUrls(supabase, uploaded);

    // 3. RPC 호출로 DB에 저장
    const { data, error: dbError } = await supabase.rpc('create_capture', {
      p_image_url: imageUrl,
      p_video_url: videoUrl,
      p_filename: fileName,
    });

    if (dbError) throw new Error(`데이터베이스 저장 실패: ${dbError.message}`);

    return {
      success: true,
      message: 'DB에 저장이 완료되었습니다.',
      data: {
        id: data.id,
        expiresAt: data.expires_at,
        ttlMinutes: data.ttl_minutes,
      },
    };
  } catch (error: any) {
    console.error('캡처본 저장 중 에러 발생:', error.message);
    await rollbackUploads(supabase, storageRollbackList);
    return { success: false, message: 'DB 저장에 실패하였습니다.', error: error };
  }
}

/**
 * @description QR 코드로 진입한 사용자를 위해 captureId로 데이터를 조회하는 action.
 * @param {string} captureId - 조회할 캡처 데이터의 UUID
 * @returns {Promise<ActionState<GetCaptureDetailResponse>>} imageUrl, videoUrl, fileName
 */
export async function getCaptureDetail(
  captureId: string,
): Promise<ActionState<GetCaptureDetailResponse>> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.rpc('get_capture_detail', { p_id: captureId });

    if (error || !data) {
      console.warn(`[조회 실패] captureId: ${captureId} - ${error?.message}`);
      return { success: false, message: '만료되었거나 존재하지 않는 페이지입니다.' };
    }

    return {
      success: true,
      message: '데이터 조회에 성공하였습니다.',
      data: {
        imageUrl: data.image_url,
        videoUrl: data.video_url,
        fileName: data.filename,
      },
    };
  } catch (error) {
    console.error('서버 액션 내부 오류:', error);
    return { success: false, message: '데이터를 불러오는 중 알 수 없는 오류가 발생했습니다.' };
  }
}
