วิธีใช้ชุดกู้คืนล่าสุด
1) ปิด Live Server ก่อน
2) Copy ไฟล์ทั้งหมดไปทับใน DR_DEPLOYMENT_PACKAGE
3) เปิด Live Server ใหม่
4) เปิด index.html แล้วกด Ctrl+Shift+R

แก้ในชุดนี้:
- index.html หยุดอาการ login กระพริบ/วน redirect
- ใช้ Supabase project ปัจจุบัน pncgbphbcmtlzrmwnhcy ทุกหน้า
- dashboard.html ไม่เด้งกลับ login ถ้ามี session/localStorage login
- เพิ่มเมนูประวัติการตรวจเหนือ settings
- ตัดภาษาเหลือไทย/อังกฤษ
