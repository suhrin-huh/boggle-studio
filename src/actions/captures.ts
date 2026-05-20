/**
 * 사진 및 비디오 조회, 저장 관련 action
 * TODO: interface 수정 필요, error를 좀 더 명확하게 처리하여 던져주면 좋을듯.
 */
'use server';

import { createClient } from '@/utils/supabase/server';
import { ActionState } from '@/types';

interface uploadAndSaveCaptureResponse {
  id: string; // uuid
  expiresAt: string; // 만료되는 시간
  ttlMinutes: number; // 저장된 데이터의 수명
}

/**
 * 사진 및 비디오를 저장하는 action
 * storage에 저장 -> URL 획득 -> DB에 저장 -> 데이터 반환
 * @param formData : image, video
 * @returns success, data(id, expiresAt)
 */
export async function uploadAndSaveCapture(
  formData: FormData,
): Promise<ActionState<uploadAndSaveCaptureResponse>> {
  // Request-Scoped 로 캐싱된 Supabase 클라이언트 호출
  const supabase = await createClient();

  // 프론트엔드에서 보낸 파일 추출
  const fileName = formData.get('filename');
  const imageFile = formData.get('image') as File;
  const videoFile = formData.get('video') as File | null;

  if (!imageFile) {
    return { success: false, message: 'QR 코드 생성을 위해서는 사진 파일이 필요합니다.' };
  }

  // 스토리지 경로 생성
  const captureId = crypto.randomUUID();
  const imagePath = `images/${captureId}.jpg`;
  const videoPath = videoFile ? `videos/${captureId}.webm` : null;

  // 롤백을 위해 성공적으로 업로드된 파일들의 경로를 기록해둘 배열
  const uploadedPaths: string[] = [];

  try {
    // 스토리지 업로드 실행
    const { error: imgError } = await supabase.storage
      .from('booth-artifacts')
      .upload(imagePath, imageFile, { contentType: 'image/jpeg' });

    if (imgError) throw new Error(`사진 업로드 실패: ${imgError.message}`);
    uploadedPaths.push(imagePath); // 롤백 명단에 추가

    if (videoFile && videoPath) {
      const { error: vidError } = await supabase.storage
        .from('booth-artifacts')
        .upload(videoPath, videoFile, { contentType: 'video/webm' });

      if (vidError) throw new Error(`영상 업로드 실패: ${vidError.message}`);
      uploadedPaths.push(videoPath); // 롤백 명단에 추가
    }

    // 스토리지 저장 완료 시 Public URL 추출
    const {
      data: { publicUrl: imageUrl },
    } = supabase.storage.from('booth-artifacts').getPublicUrl(imagePath);

    const videoUrl = videoPath
      ? supabase.storage.from('booth-artifacts').getPublicUrl(videoPath).data.publicUrl
      : null;

    // RPC 호출하여 DB에 저장
    const { data, error: dbError } = await supabase.rpc('create_capture', {
      p_image_url: imageUrl,
      p_video_url: videoUrl,
      p_filename: fileName,
    });

    // DB 저장이 실패시 아래 catch 블록 실행
    if (dbError) throw new Error(`데이터베이스 저장 실패: ${dbError.message}`);

    // 모든 과정이 성공적으로 완료됨
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

    // DB에 저장 중 에러 발생 시 롤백 (수동 트랜잭션)
    // 스토리지에 올라간 파일이 1개라도 있다면 삭제 시도
    if (uploadedPaths.length > 0) {
      console.log(`롤백 실행: 스토리지에서 ${uploadedPaths.length}개의 파일을 삭제`);

      const { error: rollbackError } = await supabase.storage
        .from('booth-artifacts')
        .remove(uploadedPaths);

      if (rollbackError) {
        console.error('롤백(파일 삭제) 실패', rollbackError);
      } else {
        console.log('롤백 완료');
      }
    }
    // 실패 응답 전달
    return { success: false, message: 'DB 저장에 실패하였습니다.', error: error };
  }
}

/**
 *
 */
interface getCaptureDetailResponse {
  imageUrl: string;
  videoUrl: string | null;
  fileName: string;
}

/**
 * QR 코드로 진입한 사용자를 위해 captureId로 데이터를 조회하는 함수
 */
export async function getCaptureDetail(
  captureId: string,
): Promise<ActionState<getCaptureDetailResponse>> {
  const supabase = await createClient();

  try {
    // captures 테이블에서 id가 일치하는 데이터 단건 조회
    const { data, error } = await supabase.rpc('get_capture_detail', { p_id: captureId });

    // 데이터를 찾지 못했거나 에러가 난 경우 예외 처리
    if (error || !data) {
      console.warn(`[조회 실패] captureId: ${captureId} - ${error?.message}`);
      return {
        success: false,
        message: '만료되었거나 존재하지 않는 페이지입니다.',
      };
    }

    /** 테스트용으로 잠시 삭제되는 것 구현 */
    // return {
    //   success: false,
    //   message: '만료되었거나 존재하지 않는 페이지입니다.',
    // };

    // 검증을 모두 통과한 안전한 데이터 반환
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
