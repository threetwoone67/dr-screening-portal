-- ถ้าต้องการล็อกค่าบทบาทให้เหลือ 2 ค่า ใช้ข้อมูลชุดนี้เป็น guideline
-- role ที่ใช้ใน profiles: doctor, nurse_assistant
-- แพทย์ = doctor
-- พยาบาล/ผู้ช่วยแพทย์ = nurse_assistant

-- ตัวอย่างแก้ role คนที่ต้องการ:
-- update profiles set role = 'doctor' where email = 'doctor@email.com';
-- update profiles set role = 'nurse_assistant' where email = 'nurse@email.com';
