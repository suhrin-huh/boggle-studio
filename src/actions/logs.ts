/**
 * 페이지 조회 로그 기록
 */
'use server';

import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { ActionState } from '@/types';

export async function recordActiveView(): Promise<ActionState> {
  const supabase = await createClient();
  const headerList = await headers();

  // 접속 기기 파악을 위한 user-agent 수집
  const userAgent = headerList.get('user-agent') || 'unknown';

  const isDevMode = process.env.NODE_ENV === 'development';

  if (isDevMode)
    return {
      success: false,
      message: '개발중에는 조회수가 측정되지 않습니다.',
    };

  const { error } = await supabase.rpc('record_page_view', {
    p_path: '/', // 현재에는 메인페이지만 조회 기록 사용
    p_ua: userAgent,
  });

  if (error) {
    console.error('조회수 기록 실패:', error);
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: '조회수 기록이 완료되었습니다.',
  };
}
