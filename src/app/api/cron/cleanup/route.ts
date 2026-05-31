// libraries & frameworks
import { NextResponse } from 'next/server';

// utils
import { createClient } from '@/utils/supabase/server';
import { getStoragePaths } from '@/utils/fileHelper';

// 스토리지 버킷명
const BUCKET_NAME = 'booth-artifacts';

/** */
export async function GET(request: Request) {
  // 보안 게이트웨이 검증 (토큰 체크)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn('유효하지 않은 크론 토큰 접근 발생');
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 어드민 인스턴스 가동
    const supabaseAdmin = await createClient(true);

    // 대한민국 표준시(KST) 기준 현재 시간 계산
    const kstOffset = 9 * 60 * 60 * 1000;
    const nowKST = new Date(Date.now() + kstOffset).toISOString().replace('Z', '');

    // expires_at(만료 시간) 기준 배치 조회
    const { data: expiredRecords, error: fetchError } = await supabaseAdmin
      .from('captures')
      .select('id, image_url, video_url')
      .not('image_url', 'is', null)
      .lte('expires_at', nowKST);

    if (fetchError) throw fetchError;

    // 스토리지 삭제를 위한 상대 경로 추출
    const storagePathsToDelete = getStoragePaths(expiredRecords || [], BUCKET_NAME);

    // 청소할 스토리지 파일이 없다면 즉시 조기 종료
    if (storagePathsToDelete.length === 0) {
      return NextResponse.json({ success: true, message: '청소할 만료 아티팩트가 없습니다.' });
    }

    // storage 에셋 일괄 삭제
    const { data: deletedFiles, error: storageError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove(storagePathsToDelete);

    // 에러 발생 시 즉시 종료
    if (storageError) {
      throw new Error('스토리지 삭제 실패로 청소를 중단합니다.');
    }

    // 스토리지에서 삭제 성공한 데이터 DB에 null로 처리
    const successfullyDeletedPaths = deletedFiles?.map((f) => f.name) || [];

    if (successfullyDeletedPaths.length === 0)
      return NextResponse.json({ success: true, message: '청소 작업이 완료되었습니다.' });

    // 삭제 성공한 경로가 포함된 DB행 NULL로 마킹
    for (const path of successfullyDeletedPaths) {
      // 경로가 'images/'로 시작하면 이미지 null로 변경
      if (path.startsWith('images/')) {
        await supabaseAdmin
          .from('captures')
          .update({ image_url: null })
          .like('image_url', `%${path}%`);
      }

      // 경로가 'videos/'로 시작하면 비디오 null로 변경
      else if (path.startsWith('videos/')) {
        await supabaseAdmin
          .from('captures')
          .update({ video_url: null })
          .like('video_url', `%${path}%`);
      }
    }
  } catch (error) {
    console.error();
  }
}
