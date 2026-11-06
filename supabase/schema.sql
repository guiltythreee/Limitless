-- Limitless initial Supabase schema. Run once in Supabase Dashboard > SQL Editor.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text, avatar_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin insert into public.profiles (id, display_name) values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', '')) on conflict (id) do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();


-- Per-user cloud mirror for first-party module progress. Values remain strings
-- so existing localStorage formats can be restored without schema conversion.
create table if not exists public.user_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_key text not null check (char_length(storage_key) between 1 and 512),
  value_text text,
  is_deleted boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, storage_key),
  constraint user_progress_value_state check (
    (is_deleted = true and value_text is null) or
    (is_deleted = false and value_text is not null)
  )
);
alter table public.user_progress enable row level security;
drop policy if exists "Users can read their own progress" on public.user_progress;
create policy "Users can read their own progress" on public.user_progress
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users can insert their own progress" on public.user_progress;
create policy "Users can insert their own progress" on public.user_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update their own progress" on public.user_progress;
create policy "Users can update their own progress" on public.user_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
drop policy if exists "Users can delete their own progress" on public.user_progress;
create policy "Users can delete their own progress" on public.user_progress
  for delete to authenticated using ((select auth.uid()) = user_id);

create or replace function public.set_user_progress_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists user_progress_set_updated_at on public.user_progress;
create trigger user_progress_set_updated_at before update on public.user_progress
  for each row execute procedure public.set_user_progress_updated_at();
