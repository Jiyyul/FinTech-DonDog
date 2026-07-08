import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * 모든 DB 접근은 서버(Server Component/Server Action/스크립트)에서만 일어난다.
 * 클라이언트 컴포넌트가 직접 Supabase를 호출하지 않으므로 anon key를
 * 브라우저에 노출할 필요가 없다 (NEXT_PUBLIC_ 접두사 미사용).
 * 이 저장소 파일들은 Next.js 서버 컴포넌트뿐 아니라 tsx로 실행하는 CLI
 * 스크립트(scripts/*)에서도 import되므로 "server-only" 패키지는 쓰지 않는다
 * (Next.js 번들러 밖에서 실행되면 즉시 예외를 던짐).
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        "SUPABASE_URL / SUPABASE_ANON_KEY가 설정되지 않았습니다. .env.local을 확인하세요."
      );
    }
    client = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return client;
}
