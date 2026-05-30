-- QR public report view + public retina image read
-- Run this in Supabase SQL Editor.

alter table public.analysis_reports enable row level security;
alter table public.patients enable row level security;

drop policy if exists "public can read reports by QR" on public.analysis_reports;
drop policy if exists "public can read patient data for QR reports" on public.patients;

create policy "public can read reports by QR"
on public.analysis_reports
for select
to anon
using (true);

create policy "public can read patient data for QR reports"
on public.patients
for select
to anon
using (true);

-- Make the image bucket public so report-view.html can load images without login.
update storage.buckets
set public = true
where id = 'retina-images';

drop policy if exists "public can read retina images" on storage.objects;

create policy "public can read retina images"
on storage.objects
for select
to anon
using (bucket_id = 'retina-images');
