# Backend

Ending Credit 애플리케이션의 백엔드 서비스입니다. Hono와 Supabase를 사용하여 구축되었습니다.

## 데이터베이스 설정

이 프로젝트는 데이터베이스 공급자로 Supabase를 사용합니다.

### 스키마 적용 방법

데이터베이스 테이블(예: `profiles`)을 설정하려면 `src/db/`에 위치한 SQL 스크립트를 실행해야 합니다. 현재 제가 로컬 환경에서 회원님의 Supabase 프로젝트에 직접 접근할 권한이 없으므로, **Supabase 대시보드에서 직접 실행**해주셔야 합니다.

1.  [Supabase 대시보드](https://supabase.com/dashboard)로 이동합니다.
2.  **SQL Editor** 메뉴로 이동합니다.
3.  `src/db/schema.sql` 파일의 내용을 복사합니다.
4.  에디터에 붙여넣고 **Run** 버튼을 클릭하여 실행합니다.

이 작업을 통해 필요한 테이블, RLS 정책(보안 규칙), 트리거가 생성됩니다.
