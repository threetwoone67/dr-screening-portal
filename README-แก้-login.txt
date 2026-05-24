ชุดนี้แก้ Supabase config ให้ตรงกับโปรเจกต์ใหม่ pncgbphbcmtlzrmwnhcy

วิธีใช้:
1) แตก ZIP
2) ทับไฟล์เดิมทั้งหมดในโฟลเดอร์ VS
3) ปิด Live Server แล้วเปิดใหม่
4) กด Cmd+Shift+R หรือ Ctrl+Shift+R

ไฟล์หลัก:
- config.js = Supabase URL/KEY ตัวเดียวทั้งระบบ
- index.html = login เท่านั้น
- dashboard.html = หน้าหลักเท่านั้น
- settings.html = ตั้งค่าแยกหน้า
- auth.js = login/session/logout
- sidebar.js = sidebar กลาง
- language.js = ไทย/อังกฤษเท่านั้น

ถ้ายังขึ้น Failed to fetch ให้ตรวจว่าไฟล์ config.js ใน VS มี URL นี้จริง:
https://pncgbphbcmtlzrmwnhcy.supabase.co
