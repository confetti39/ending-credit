-- 기존 유저들에 대한 프로필 데이터 생성 (Backfill)
insert into public.profiles (id, nickname, profile_image_url, bio)
select
  id,
  -- 닉네임이 메타데이터에 없으면 'user_UUID앞8자리'로 임시 생성
  coalesce(
    raw_user_meta_data->>'nickname',
    'user_' || substr(id::text, 1, 8)
  ),
  -- avatar_url 메타데이터 가져오기, 없으면 null
  raw_user_meta_data->>'avatar_url',
  -- bio는 빈 문자열로 초기화
  ''
from auth.users
where id not in (select id from public.profiles);
