-- 공개 프로필 테이블 생성
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  nickname text unique not null,
  profile_image_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) 설정
-- 상세 내용은 https://supabase.com/docs/guides/auth/row-level-security 참조
alter table profiles enable row level security;

-- 모든 사용자가 프로필을 볼 수 있도록 허용
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

-- 사용자는 자신의 프로필만 생성(Insert) 가능
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

-- 사용자는 자신의 프로필만 수정(Update) 가능
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- 새 유저 가입 시 프로필을 자동 생성하는 함수
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname, profile_image_url, bio)
  values (new.id, new.raw_user_meta_data->>'nickname', new.raw_user_meta_data->>'avatar_url', '');
  return new;
end;
$$ language plpgsql security definer;

-- 유저 가입 시 위 함수를 실행하는 트리거
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
