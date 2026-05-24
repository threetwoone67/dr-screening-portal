-- Supabase fix for DR Screening user pages
-- Run this in Supabase SQL Editor once.

alter table public.analysis_reports enable row level security;
alter table public.patients enable row level security;

drop policy if exists "authenticated can read analysis reports" on public.analysis_reports;
drop policy if exists "authenticated can insert analysis reports" on public.analysis_reports;
drop policy if exists "authenticated can update analysis reports" on public.analysis_reports;

create policy "authenticated can read analysis reports"
on public.analysis_reports for select to authenticated using (true);

create policy "authenticated can insert analysis reports"
on public.analysis_reports for insert to authenticated with check (true);

create policy "authenticated can update analysis reports"
on public.analysis_reports for update to authenticated using (true) with check (true);

drop policy if exists "authenticated can read patients" on public.patients;
create policy "authenticated can read patients"
on public.patients for select to authenticated using (true);

-- optional columns used by current frontend
alter table public.analysis_reports
  add column if not exists token text,
  add column if not exists hn text,
  add column if not exists image_name text,
  add column if not exists image_url text,
  add column if not exists original_image text,
  add column if not exists gradcam_image text,
  add column if not exists binary_result text,
  add column if not exists eye_side text,
  add column if not exists eye_confidence numeric,
  add column if not exists report_data jsonb;
