ใช้ชุดนี้ทับไฟล์เดิมเฉพาะ 4 ไฟล์นี้:
- language.js
- dashboard.html
- knowledge-dr.html
- retina-report-new.html

ไม่ได้แก้ retina-analysis.html ตามที่บอกไว้

หลังทับไฟล์:
1) ปิด Live Server
2) เปิด Live Server ใหม่
3) กด Cmd+Shift+R หรือ Ctrl+Shift+R
4) ถ้ายังมีค่าภาษาเก่าค้าง ให้เปิด Console แล้วรัน:
localStorage.setItem('site_language','th'); localStorage.setItem('dr_dashboard_language','th'); location.reload();

สิ่งที่แก้:
- ภาษาเหลือไทย/อังกฤษเท่านั้น
- ตัดจีน/สเปนออกจาก select
- เปลี่ยนภาษาแล้วไม่ alert / ไม่ค้าง
- กู้เมนูประวัติการตรวจใน sidebar
- dashboard sidebar เรียงใหม่
- knowledge-dr แปลข้อความหลักเป็นอังกฤษได้
- retina-report-new แก้ SyntaxError ใน export DOC และใส่ language.js
- แก้ query appointment ใน dashboard ไม่ให้เรียก patient_name ที่ไม่มี
