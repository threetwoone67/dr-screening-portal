// language.js - Thai / English only. No sidebar injection. No public-page blocking.
(function(){
  const KEY = "dr_language";
  const LEGACY = ["site_language", "dr_dashboard_language", "dr_report_language", "language", "app_language"];

  const DICT = {
    th: {
      langThai:"ไทย", langEnglish:"English",
      appTitle:"Diabetic Retinopathy Detection Program",
      appSubtitle:"โปรแกรมตรวจวัดระดับเบาหวานขึ้นจอประสาทตา",
      loginTitle:"เข้าสู่ระบบ", loginSubtitle:"เข้าสู่ระบบเพื่อใช้งานระบบตรวจคัดกรอง", loginBtn:"เข้าสู่ระบบ",
      email:"อีเมล", password:"รหัสผ่าน", forgotPassword:"ลืมรหัสผ่าน?", register:"สมัครสมาชิก",
      home:"หน้าหลัก", account:"บัญชีผู้ใช้", patients:"ข้อมูลผู้ป่วย", screening:"การตรวจ",
      createNewPatient:"สร้างคนไข้ใหม่", retinaAnalysis:"วิเคราะห์จอประสาทตา", report:"รายงานผล",
      appointment:"การนัดหมาย", transfer:"โอนย้ายผู้ป่วย", knowledge:"เกร็ดความรู้", history:"ประวัติการตรวจ", settings:"ตั้งค่า", logout:"ออกจากระบบ",
      dashboardTitle:"หน้าหลัก", dashboardBreadcrumb:"หน้าหลัก / ภาพรวมประจำสัปดาห์", welcome:"ยินดีต้อนรับ", dashboardDesc:"สรุปข้อมูลการตรวจคัดกรอง ผู้ป่วย นัดหมาย และผลวิเคราะห์ด้วย AI",
      screeningsThisWeek:"ตรวจในสัปดาห์นี้", appointmentsThisWeek:"นัดหมายในสัปดาห์นี้", totalPatients:"ผู้ป่วยในระบบ", abnormalCases:"พบความผิดปกติ",
      recentCases:"เคสล่าสุด", todaysAppointments:"นัดตรวจวันนี้", loading:"กำลังโหลดข้อมูล...", noData:"ยังไม่มีข้อมูล", viewAll:"ดูทั้งหมด",
      settingsTitle:"ตั้งค่าระบบ", settingsDesc:"จัดการภาษา โหมดการแสดงผล และข้อมูลพื้นฐานของระบบ", language:"ภาษา", theme:"โหมดมืด-สว่าง", darkMode:"โหมดมืด", lightMode:"โหมดสว่าง", systemInfo:"ข้อมูลระบบ", ready:"พร้อมใช้งาน",
      save:"บันทึก", saved:"บันทึกแล้ว", backHome:"กลับหน้าหลัก",
      crumb:"หน้าหลัก / ภาพรวมประจำสัปดาห์", subtitle:"สรุปข้อมูลการตรวจคัดกรอง ผู้ป่วย นัดหมาย และผลวิเคราะห์ด้วย AI", heroTitle:"ศูนย์ควบคุมการตรวจคัดกรองประจำสัปดาห์", week:"ข้อมูลประจำสัปดาห์",
      statPatients:"ผู้ป่วยในระบบ", statPatientsSub:"จำนวนผู้ป่วยทั้งหมดในระบบ", statScreenWeek:"ตรวจในสัปดาห์นี้", statScreenSub:"รายงานที่บันทึกในสัปดาห์นี้", statAbnormal:"พบความผิดปกติ", statAbnormalSub:"จากผลตรวจทั้งหมด", statTodayAppt:"นัดหมายวันนี้", statTodaySub:"รายการนัดหมายที่ต้องติดตาม",
      genderTitle:"สถิติเพศผู้ป่วย", genderDesc:"แยกตามเพศของผู้ป่วยในระบบ", ageTitle:"ช่วงอายุผู้ป่วย", ageDesc:"แยกตามช่วงอายุของผู้ป่วย", resultTitle:"ผลตรวจประจำสัปดาห์", resultDesc:"สัดส่วนปกติ/ผิดปกติ และระดับความรุนแรง",
      latestTitle:"เคสล่าสุด", latestDesc:"ข้อมูลการรายงานล่าสุดใน Supabase", calendarTitle:"ปฏิทินนัดหมาย", calendarDesc:"วันที่มีนัดหมายและจุดติดตาม", manageAppt:"จัดการนัดหมาย", todayApptTitle:"นัดตรวจวันนี้ / ใกล้ถึง",
      male:"ชาย", female:"หญิง", unknown:"ไม่ระบุ", normal:"ปกติ / No DR", empty:"ยังไม่มีข้อมูล"
    },
    en: {
      langThai:"Thai", langEnglish:"English",
      appTitle:"Diabetic Retinopathy Detection Program",
      appSubtitle:"Diabetic retinopathy screening program",
      loginTitle:"Login", loginSubtitle:"Sign in to use the screening system", loginBtn:"Login",
      email:"Email", password:"Password", forgotPassword:"Forgot password?", register:"Register",
      home:"Home", account:"User Account", patients:"Patient Information", screening:"Screening",
      createNewPatient:"Create New Patient", retinaAnalysis:"Retina Analysis", report:"Report",
      appointment:"Appointment", transfer:"Patient Transfer", knowledge:"Knowledge", history:"Screening History", settings:"Settings", logout:"Logout",
      dashboardTitle:"Dashboard", dashboardBreadcrumb:"Home / Weekly Overview", welcome:"Welcome", dashboardDesc:"Overview of screening records, patients, appointments, and AI results",
      screeningsThisWeek:"Screenings This Week", appointmentsThisWeek:"Appointments This Week", totalPatients:"Patients in System", abnormalCases:"Abnormal Cases",
      recentCases:"Recent Cases", todaysAppointments:"Today's Appointments", loading:"Loading...", noData:"No data", viewAll:"View all",
      settingsTitle:"System Settings", settingsDesc:"Manage language, display mode, and system information", language:"Language", theme:"Dark / Light Mode", darkMode:"Dark mode", lightMode:"Light mode", systemInfo:"System Information", ready:"Ready",
      save:"Save", saved:"Saved", backHome:"Back to Home",
      crumb:"Home / Weekly Overview", subtitle:"Overview of screening records, patients, appointments, and AI results", heroTitle:"Weekly Screening Control Center", week:"Week",
      statPatients:"Patients in System", statPatientsSub:"Total registered patients", statScreenWeek:"Screenings This Week", statScreenSub:"Reports recorded this week", statAbnormal:"Abnormal Results", statAbnormalSub:"From all screening results", statTodayAppt:"Today's Appointments", statTodaySub:"Appointments to follow up",
      genderTitle:"Patient Gender Statistics", genderDesc:"Grouped by patient gender", ageTitle:"Patient Age Groups", ageDesc:"Grouped by patient age range", resultTitle:"Weekly Screening Results", resultDesc:"Normal/abnormal ratio and severity levels",
      latestTitle:"Latest Cases", latestDesc:"Latest records from Supabase", calendarTitle:"Appointment Calendar", calendarDesc:"Appointment dates and follow-up markers", manageAppt:"Manage Appointments", todayApptTitle:"Today's / Upcoming Appointments",
      male:"Male", female:"Female", unknown:"Unknown", normal:"Normal / No DR", empty:"No data"
    }
  };

  function normalize(lang){ return (lang === "en" || lang === "th") ? lang : "th"; }
  function getLang(){
    return normalize(localStorage.getItem(KEY) || localStorage.getItem("site_language") || localStorage.getItem("dr_dashboard_language") || "th");
  }
  function setLang(lang){
    lang = normalize(lang);
    localStorage.setItem(KEY, lang);
    LEGACY.forEach(k => localStorage.setItem(k, lang));
    applyLanguage();
  }
  function t(key){ const lang=getLang(); return (DICT[lang] && DICT[lang][key]) || (DICT.th && DICT.th[key]) || key; }
  function normalizeLanguageSelects(){
    document.querySelectorAll('[data-language-select], #languageSelect, .language-select').forEach(sel => {
      if (!sel || sel.tagName !== 'SELECT') return;
      sel.setAttribute('data-language-select','');
      sel.innerHTML = `<option value="th">${t('langThai')}</option><option value="en">${t('langEnglish')}</option>`;
      sel.value = getLang();
      sel.onchange = function(){ setLang(this.value); };
    });
  }
  function applyLanguage(){
    const lang=getLang();
    document.documentElement.lang = lang;
    normalizeLanguageSelects();
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.getAttribute('data-i18n-placeholder')); });
    document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.getAttribute('data-i18n-title')); });
    document.querySelectorAll('[data-th][data-en]').forEach(el => {
      el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-th');
    });
    document.dispatchEvent(new CustomEvent('dr:language-applied', { detail: { lang } }));
  }
  window.DR_I18N = { getLang, setLang, t, applyLanguage, DICT };
  window.getLang = getLang; window.setLang = setLang; window.t = t; window.applyLanguage = applyLanguage;
  document.addEventListener('DOMContentLoaded', applyLanguage);
})();
