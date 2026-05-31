import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

/**
 * Request-Scoped Singleton
 * Supabase 클라이언트 생성기
 * @param useAdmin - RLS 정책을 무시할 수 있는 마스터 어드민 권한 클라이언트를 반환
 */
export const createClient = cache(async (useAdmin = false) => {
  // default : 일반 유저용 ANON_KEY 사용
  let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // 마스터 권한이 필요할 경우 내부적으로 SERVICE_ROLE_KEY 장착
  if (useAdmin) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('서버 환경 변수에 SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.');
    }
    supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  }

  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabaseKey);
});
