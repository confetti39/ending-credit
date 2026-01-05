-- 이미 profiles 테이블이 존재하므로, 함수만 업데이트합니다.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname, profile_image_url, bio)
  values (
    new.id,
    -- 닉네임이 없으면 'user_앞8자리'로 자동 생성
    coalesce(new.raw_user_meta_data->>'nickname', 'user_' || substr(new.id::text, 1, 8)),
    new.raw_user_meta_data->>'avatar_url',
    ''
  );
  return new;
end;
$$ language plpgsql security definer;
