วิธีใช้ชุด DR_CORE_RESTRUCTURE_V1

1) แตก ZIP แล้วนำไฟล์ทั้งหมดไปวางทับในโฟลเดอร์โปรเจกต์ VS Code
2) ไฟล์ใหม่ที่เพิ่ม: config.js, auth.js, sidebar.js, settings.html
3) ไฟล์ที่ถูกจัดใหม่: index.html, dashboard.html, language.js
4) ยังไม่แตะ retina-analysis.html เพื่อไม่ให้ปุ่มถ่ายภาพ/กล้องหาย
5) เปิด Live Server ใหม่ แล้วกด Cmd+Shift+R

โครงใหม่:
- index.html = login เท่านั้น
- dashboard.html = หน้าหลักเท่านั้น
- settings.html = ตั้งค่าแยกไฟล์
- config.js = Supabase URL/KEY ตัวเดียว
- auth.js = login/session/logout
- sidebar.js = sidebar กลางทุกหน้า
- language.js = ไทย/อังกฤษเท่านั้น
