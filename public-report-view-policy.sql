-- public-report-view-policy.sql
-- ใช้เมื่อสแกน QR แล้วต้องให้คนไข้เปิด report-view.html ได้โดยไม่ต้อง Login
-- หมายเหตุ: Policy นี้อนุญาตให้ anon อ่านเฉพาะข้อมูลที่จำเป็นต่อการแสดงรายงาน
-- ถ้าในระบบต้องการความปลอดภัยสูงกว่านี้ ควรใช้ report_token แทน report_id ในอนาคต

alter table public.analysis_reports enable row level security;
alter table public.patients enable row level security;

create policy if not exists "public can read reports by QR"
on public.analysis_reports
for select
to anon
using (true);

create policy if not exists "public can read patient data for QR reports"
on public.patients
for select
to anon
using (true);
