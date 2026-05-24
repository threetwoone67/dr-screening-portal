วิธีใช้
1) Backup ไฟล์เดิมก่อน
2) เอาไฟล์ใน ZIP นี้ไปทับในโฟลเดอร์งาน VS Code
   - retina-report-new.html
   - dashboard.html
   - retina-analysis.html
   - patient-history.html
3) ปิด/เปิด Live Server ใหม่
4) กด Ctrl+Shift+R

สิ่งที่แก้:
- Export DOC จัด layout แบบ A4 เป็นตารางเหมือน PDF มากขึ้น
- DOC มี logo/header/QR/ข้อมูลผู้ป่วย/รูปตรวจ/ผลตรวจ/ลายเซ็น
- Print/Save PDF ภาษาไทยคมขึ้นจาก print CSS
- เพิ่มหน้า patient-history.html สำหรับดูประวัติการตรวจ + นัดหมายของผู้ป่วย
- Sidebar เพิ่ม ประวัติการตรวจ อยู่เหนือ ตั้งค่า
- หน้า Dashboard ตัดจีน/สเปน เหลือไทย/อังกฤษ
- แสดงสิทธิ์ผู้ใช้งาน 2 บทบาท: แพทย์, พยาบาล/ผู้ช่วยแพทย์
