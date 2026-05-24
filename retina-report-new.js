const SUPABASE_URL = "https://pncgbphbcmtlzrmwnhcy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuY2dicGhiY210bHpybXduaGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyODEwOTksImV4cCI6MjA5NDg1NzA5OX0.-JS7vYBzMJYybm5QA4RxKUA5rTa5ibR2_40W73PPYso";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const QR_API = "https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=";
const WORD_CSS = "\n@page WordSection1{size:595.3pt 841.9pt;margin:32pt 38pt 28pt 38pt}\ndiv.WordSection1{page:WordSection1}\nbody{margin:0;font-family:Arial,\"Noto Sans Thai\",sans-serif;color:#0f172a;font-size:10pt}\ntable{border-collapse:collapse}\n.wTitle{font-size:18pt;font-weight:700;margin-top:4pt}\n.wSub{font-size:9pt;font-weight:700;margin-top:4pt}\n.wOrg{font-size:9pt;font-weight:700;color:#173764;margin-top:5pt}\n.wSmall{font-size:7pt;font-weight:700}\n.wCode{font-size:7.5pt;font-weight:700;word-break:break-word}\n.wTiny{font-size:6.5pt;color:#64748b}\n.wRule{border-top:1.5pt solid #20395f;margin:14pt 0 9pt}\n.wInfo td{width:50%;font-size:9pt;font-weight:700;padding:1.8pt 4pt;vertical-align:top}\n.wInfo b{font-weight:900}\n.wResult{margin-top:9pt;font-size:8.2pt}\n.wResult th{background:#f1f5f9;border:1pt solid #d9e2ef;padding:5pt;text-align:left;font-weight:900}\n.wResult td{border:1pt solid #d9e2ef;padding:5pt;vertical-align:top;font-weight:700}\n.wSummary{margin-top:9pt;border:1pt solid #d9e2ef;background:#f8fafc;padding:8pt;font-size:8.5pt;font-weight:700;line-height:1.2}\n.wSign{margin-top:24pt;font-size:8.5pt;font-weight:700}\n.wSign td{width:50%;padding:3pt 12pt}\n";
const IMAGE_BUCKET = "retina-images";

const dict = {
  th: {
    navHome:"🏠 หน้าหลัก", navUser:"👤 บัญชีผู้ใช้", navPatients:"👥 ข้อมูลผู้ป่วย",
    navScreeningGroup:"การตรวจ", navCreate:"➕ สร้างคนไข้ใหม่", navAnalysis:"🔬 วิเคราะห์จอประสาทตา",
    navReport:"📄 รายงานผล", navAppointment:"📅 การนัดหมาย", navTransfer:"🔁 โอนย้ายผู้ป่วย",
    navKnowledge:"💡 เกร็ดความรู้", navHistory:"🕘 ประวัติการตรวจ", navSettings:"⚙️ ตั้งค่า",
    orgName:"มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ", orgSub:"ระบบตรวจคัดกรองจอประสาทตาเบาหวาน",
    logout:"ออกจากระบบ", breadcrumb:"รายงานผล / เอกสารผลตรวจ", pageTitle:"รายงานผลการตรวจจอประสาทตา",
    pageSubtitle:"พิมพ์ชื่อหรือ HN เพื่อค้นหารายงาน แล้วเลือกเอกสารเพื่อดูและส่งออก",
    home:"หน้าหลัก", newAnalysis:"วิเคราะห์ใหม่", saveDoc:"บันทึกเป็น DOC", printPdf:"พิมพ์ / บันทึก PDF",
    totalReports:"รายงานทั้งหมด", abnormalReports:"พบความผิดปกติ", readyPrint:"พร้อมพิมพ์",
    reportList:"รายการรายงานผล", reportSearchDesc:"พิมพ์ชื่อผู้ป่วย / HN / รหัสผู้ป่วย / ผลตรวจ ก่อนเลือกเอกสาร",
    selectReport:"เลือกรายงานจากรายการด้านซ้าย", noReports:"ไม่พบรายงานที่ค้นหา", loading:"กำลังโหลดรายงาน...",
    typeToSearch:"พิมพ์คำค้นหาเพื่อแสดงรายงาน",
    reportTitle:"รายงานผล", screeningTitle:"ตรวจวัดระดับเบาหวานขึ้นจอประสาทตา", reportNo:"เลขรายงาน",
    patientName:"ชื่อผู้ป่วย", patientCode:"รหัสผู้ป่วย", birthDate:"วันเกิด", age:"อายุ", sex:"เพศ", phone:"เบอร์โทร",
    weight:"น้ำหนัก", height:"ส่วนสูง", examDate:"วันที่ตรวจ", department:"แผนก / ระบบ", doctor:"ผู้ตรวจ",
    disease:"โรคประจำตัว", allergy:"ประวัติแพ้ยา / ภูมิแพ้", image:"รูปภาพ", result:"ผลตรวจ",
    confidence:"ความแม่นยำ", screeningResult:"ผลคัดกรอง", note:"หมายเหตุ", summary:"สรุปผลการตรวจ",
    reporter:"ผู้รายงานผล", reviewer:"ผู้ตรวจสอบผล", onlineScan:"สแกนดูผลออนไลน์", noImage:"ยังไม่พบรูปจาก Supabase Storage"
  },
  en: {
    navHome:"🏠 Home", navUser:"👤 User Account", navPatients:"👥 Patient Information",
    navScreeningGroup:"Screening", navCreate:"➕ Create New Patient", navAnalysis:"🔬 Retina Analysis",
    navReport:"📄 Report", navAppointment:"📅 Appointment", navTransfer:"🔁 Patient Transfer",
    navKnowledge:"💡 Knowledge", navHistory:"🕘 Screening History", navSettings:"⚙️ Settings",
    orgName:"King Mongkut's University of Technology North Bangkok", orgSub:"Diabetic Retinopathy Screening System",
    logout:"Logout", breadcrumb:"Report / Screening Document", pageTitle:"Retinal Screening Report",
    pageSubtitle:"Type patient name or HN, then select a report to view and export.",
    home:"Home", newAnalysis:"New Analysis", saveDoc:"Save DOC", printPdf:"Print / Save PDF",
    totalReports:"Total Reports", abnormalReports:"Abnormal Reports", readyPrint:"Ready to Print",
    reportList:"Report List", reportSearchDesc:"Type patient name / HN / patient ID / result before selecting a document",
    selectReport:"Select a report from the left list", noReports:"No matching reports", loading:"Loading reports...",
    typeToSearch:"Type to search reports",
    reportTitle:"Report", screeningTitle:"Diabetic Retinopathy Screening", reportNo:"Report No.",
    patientName:"Patient Name", patientCode:"Patient Code", birthDate:"Birth Date", age:"Age", sex:"Sex", phone:"Phone",
    weight:"Weight", height:"Height", examDate:"Exam Date", department:"Department / System", doctor:"Examiner",
    disease:"Underlying Disease", allergy:"Drug Allergy / Allergy", image:"Image", result:"Result",
    confidence:"Confidence", screeningResult:"Screening", note:"Note", summary:"Summary",
    reporter:"Reporter", reviewer:"Reviewer", onlineScan:"Scan online result", noImage:"No image found in Supabase Storage"
  }
};

function normalizeLang(v){
  v = String(v || "th").toLowerCase();
  return v.startsWith("en") ? "en" : "th";
}
function getSavedLang(){
  return normalizeLang(
    localStorage.getItem("dr_lang") ||
    localStorage.getItem("dr_language") ||
    localStorage.getItem("language") ||
    localStorage.getItem("app_lang") ||
    localStorage.getItem("site_lang") ||
    localStorage.getItem("dr_report_language") ||
    "th"
  );
}
let lang = getSavedLang();
let reports = [];
let patients = [];
let selected = null;
let timer = null;
let currentProfile = {};

function tr(k){ return (dict[lang] && dict[lang][k]) || dict.th[k] || k; }
function val(x){ return x === null || x === undefined || x === "" ? "-" : x; }
function esc(x){
  return String(val(x)).replace(/[&<>"']/g, function(c){
    if(c === "&") return "&amp;";
    if(c === "<") return "&lt;";
    if(c === ">") return "&gt;";
    if(c === '"') return "&quot;";
    return "&#039;";
  });
}
function pct(x){
  if(x === null || x === undefined || x === "") return "-";
  let n = Number(String(x).replace("%",""));
  if(Number.isNaN(n)) return val(x);
  if(n <= 1) n *= 100;
  return n.toFixed(1) + "%";
}
function dt(x){
  if(!x) return "-";
  const d = new Date(x);
  if(Number.isNaN(d.getTime())) return val(x);
  return d.toLocaleString(lang === "th" ? "th-TH" : "en-US", {year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});
}
function sev(x){
  const s = String(x || "").toLowerCase();
  if(s.includes("no")) return lang === "th" ? "ไม่พบเบาหวานขึ้นจอประสาทตา" : "No DR / Normal";
  if(s.includes("mild")) return lang === "th" ? "เบาหวานขึ้นจอประสาทตาระยะเล็กน้อย / Mild" : "Mild DR";
  if(s.includes("moderate")) return lang === "th" ? "เบาหวานขึ้นจอประสาทตาระยะปานกลาง / Moderate" : "Moderate DR";
  if(s.includes("severe")) return lang === "th" ? "เบาหวานขึ้นจอประสาทตาระยะรุนแรง / Severe" : "Severe DR";
  if(s.includes("pdr") || s.includes("proliferative")) return lang === "th" ? "เบาหวานขึ้นจอประสาทตาระยะรุนแรงมาก / PDR" : "Proliferative DR / PDR";
  return val(x);
}
function age(p){
  if(p && p.age) return p.age;
  const b = p && (p.birth_date || p.dob);
  if(!b) return "-";
  const bd = new Date(b);
  if(Number.isNaN(bd.getTime())) return "-";
  const n = new Date();
  let a = n.getFullYear() - bd.getFullYear();
  if(n.getMonth() < bd.getMonth() || (n.getMonth() === bd.getMonth() && n.getDate() < bd.getDate())) a--;
  return a;
}
function bmi(p){
  const w = Number(p && p.weight);
  const h = Number(p && p.height) / 100;
  if(!w || !h) return "-";
  return (w / (h*h)).toFixed(2) + " kg/m²";
}
function patientOf(r){
  const code = String(r.patient_code || r.hn || "");
  const name = String(r.patient_name || "").toLowerCase();
  return patients.find(p => String(p.patient_code || p.hn || p.id || "") === code) ||
         patients.find(p => String(p.full_name || p.name || p.patient_name || "").toLowerCase() === name) || {};
}
function publicStorageUrl(path){
  if(!path) return "";
  const s = String(path).trim();
  if(s.startsWith("data:")) return "";
  if(s.startsWith("http://") || s.startsWith("https://")) return s;
  let key = s.replace(/^\/+/, "");
  if(key.startsWith(IMAGE_BUCKET + "/")) key = key.slice((IMAGE_BUCKET + "/").length);
  return SUPABASE_URL + "/storage/v1/object/public/" + IMAGE_BUCKET + "/" + key;
}
function directImageCandidate(r){
  const candidates = [
    r.image_url, r.original_image_url, r.image_public_url, r.fundus_image_url, r.retina_image_url,
    r.storage_url, r.file_url, r.original_url,
    r.image_path, r.original_image_path, r.storage_path, r.file_path, r.image_storage_path
  ];
  for(const c of candidates) if(c) return publicStorageUrl(c);
  return "";
}
async function fileExists(url){
  if(!url) return false;
  try {
    const res = await fetch(url, {method:"HEAD", cache:"no-store"});
    return res.ok;
  } catch(e) {
    return false;
  }
}
async function listStorage(folder){
  try {
    const res = await db.storage.from(IMAGE_BUCKET).list(folder, {limit:100, offset:0, sortBy:{column:"created_at", order:"desc"}});
    if(res.error || !res.data) return [];
    return res.data;
  } catch(e) {
    return [];
  }
}
async function firstFileInFolder(folder){
  const items = await listStorage(folder);
  const img = items.find(f => f && f.name && /\.(png|jpg|jpeg|webp)$/i.test(f.name));
  if(img) return publicStorageUrl(folder.replace(/^\/+|\/+$/g, "") + "/" + img.name);
  return "";
}
async function firstImageRecursive(folder, depth=0){
  if(!folder || depth > 3) return "";
  const direct = await firstFileInFolder(folder);
  if(direct) return direct;
  const items = await listStorage(folder);
  const subfolders = items.filter(f => f && f.name && !/\.(png|jpg|jpeg|webp)$/i.test(f.name));
  for(const sub of subfolders){
    const url = await firstImageRecursive(folder.replace(/^\/+|\/+$/g, "") + "/" + sub.name, depth + 1);
    if(url) return url;
  }
  return "";
}
async function resolveImage(r){
  if(r.__resolvedImage !== undefined) return r.__resolvedImage;
  const direct = directImageCandidate(r);
  if(direct && await fileExists(direct)) {
    r.__resolvedImage = direct;
    return direct;
  }
  const code = String(r.patient_code || r.hn || "").trim();
  const rid = String(r.report_id || r.id || "").trim();
  const folders = [];
  if(code && rid) folders.push(code + "/" + rid);
  if(rid && code) folders.push(rid + "/" + code);
  if(code) folders.push(code);
  if(rid) folders.push(rid);
  for(const f of folders){
    const url = await firstImageRecursive(f, 0);
    if(url) {
      r.__resolvedImage = url;
      return url;
    }
  }
  r.__resolvedImage = "";
  return "";
}
async function resolveAllVisibleImages(){
  const tasks = reports.slice(0, 80).map(r => resolveImage(r).catch(() => ""));
  await Promise.all(tasks);
  if(selected) renderPaper(selected);
}
function applyLang(){
  lang = getSavedLang();
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i]").forEach(e => {
    const key = e.dataset.i;
    if(key) e.textContent = tr(key);
  });
  document.querySelectorAll("[data-i18n]").forEach(e => {
    const key = e.dataset.i18n;
    if(key) e.textContent = tr(key);
  });
  document.querySelectorAll("[data-i-placeholder]").forEach(e => {
    const key = e.dataset.iPlaceholder;
    if(key) e.placeholder = tr(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(e => {
    const key = e.dataset.i18nPlaceholder;
    if(key) e.placeholder = tr(key);
  });

  const sel = document.getElementById("langSelect") || document.getElementById("reportLangSelect") || document.getElementById("languageSelect");
  if(sel) sel.value = lang;

  renderList();
  if(selected) renderPaper(selected);
}
function setLang(x){
  lang = normalizeLang(x);
  localStorage.setItem("dr_lang", lang);
  localStorage.setItem("dr_language", lang);
  localStorage.setItem("language", lang);
  localStorage.setItem("app_lang", lang);
  localStorage.setItem("site_lang", lang);
  localStorage.setItem("dr_report_language", lang);
  applyLang();
}
async function loadProfile(){
  try{
    const auth = await db.auth.getUser();
    const user = auth && auth.data && auth.data.user ? auth.data.user : null;
    currentProfile.email = user ? user.email : "";
    if(user){
      const p = await db.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if(!p.error && p.data) currentProfile = Object.assign(currentProfile, p.data);
    }
  }catch(e){}
}
function examinerName(r){
  return r.doctor_name || r.created_by_name || currentProfile.full_name || currentProfile.name || currentProfile.display_name || currentProfile.email || "-";
}
async function loadData(){
  document.getElementById("reportList").innerHTML = '<div class="empty">' + tr("typeToSearch") + '</div>';
  const res = await Promise.allSettled([
    db.from("analysis_reports").select("*").order("id", {ascending:false}).limit(300),
    db.from("patients").select("*").order("id", {ascending:false}).limit(500)
  ]);
  if(res[0].status === "fulfilled" && !res[0].value.error) reports = res[0].value.data || [];
  if(res[1].status === "fulfilled" && !res[1].value.error) patients = res[1].value.data || [];
  let msg = "reports " + reports.length + " / patients " + patients.length;
  if(res[0].status === "fulfilled" && res[0].value.error) msg = "analysis_reports error: " + res[0].value.error.message;
  document.getElementById("debugText").textContent = msg;
  document.getElementById("totalReports").textContent = reports.length;
  document.getElementById("normalReports").textContent = reports.filter(r => String(r.severity_result || "").toLowerCase().includes("no")).length;
  document.getElementById("abnormalReports").textContent = reports.filter(r => !String(r.severity_result || "").toLowerCase().includes("no")).length;
  const rid = new URLSearchParams(location.search).get("report_id");
  if(rid) selectReport(rid);
  else renderList();
  resolveAllVisibleImages();
}
function renderList(){
  const search = document.getElementById("searchInput");
  const q = (search ? search.value : "").toLowerCase().trim();
  const box = document.getElementById("reportList");
  if(!box) return;
  if(!q && !selected){
    box.innerHTML = '<div class="empty">' + tr("typeToSearch") + '</div>';
    return;
  }
  const rows = reports.filter(r => {
    const txt = [r.patient_name, r.patient_code, r.hn, r.report_id, r.severity_result, r.result_note].map(x => String(x || "").toLowerCase()).join(" ");
    return !q || txt.includes(q);
  });
  if(!rows.length){
    box.innerHTML = '<div class="empty">' + tr("noReports") + '</div>';
    return;
  }
  box.innerHTML = rows.map(r => {
    const id = r.report_id || r.id;
    const active = selected && String(selected.report_id || selected.id) === String(id) ? "active" : "";
    return '<div class="item ' + active + '" data-id="' + esc(id) + '"><b>' + esc(r.patient_name) + '</b><span>HN: ' + esc(r.patient_code || r.hn) + ' | ' + esc(tr("reportNo")) + ': ' + esc(r.report_id) + '</span><span>' + esc(dt(r.created_at)) + '</span><span class="pill">' + esc(sev(r.severity_result)) + '</span></div>';
  }).join("");
  document.querySelectorAll(".item").forEach(el => {
    el.onclick = () => selectReport(el.dataset.id);
  });
}
async function selectReport(id){
  selected = reports.find(r => String(r.report_id || r.id) === String(id));
  renderList();
  renderPaper(selected);
  if(selected) {
    await resolveImage(selected);
    renderPaper(selected);
  }
}
function paperHTML(r){
  const p = patientOf(r);
  const img = r.__resolvedImage || directImageCandidate(r);
  const qr = QR_API + encodeURIComponent(location.origin + location.pathname + "?report_id=" + encodeURIComponent(r.report_id || r.id || ""));
  const note = val(r.result_note || "Result from HuggingFace DR model API. AI output is for screening support and should be confirmed by clinical assessment.");
  const screening = String(r.severity_result || "").toLowerCase().includes("no") ? "No DR" : "DR";
  const imgBlock = img ? '<img class="fundus" src="' + esc(img) + '" onerror="this.outerHTML=\'<div class=&quot;image-note&quot;>'+esc(tr("noImage"))+'</div>\'">' : '<div style="width:94px;height:86px;border:1px dashed #aaa;display:grid;place-items:center;color:#64748b;font-size:11px">' + esc(tr("noImage")) + '</div>';
  return '<div class="paper"><div class="phead"><img class="seal" src="institution-logo.png"><div class="ptitle"><h1>' + esc(tr("reportTitle")) + '</h1><p>' + esc(tr("screeningTitle")) + '</p><p style="color:#173764;font-weight:900">' + esc(tr("orgName")) + '</p></div><div class="code">' + esc(tr("reportNo")) + '<br>' + esc(r.report_id) + '<br><br>' + esc(r.patient_code || r.hn) + '<br><img class="qr" src="' + esc(qr) + '"><br><span style="font-size:10px;color:#64748b">' + esc(tr("onlineScan")) + '</span></div></div><hr class="div"><div class="info"><div><b>' + esc(tr("patientName")) + ' :</b> ' + esc(r.patient_name || p.full_name || p.name) + '</div><div><b>HN :</b> ' + esc(r.patient_code || p.hn) + '</div><div><b>' + esc(tr("patientCode")) + ' :</b> ' + esc(r.patient_code || p.patient_code) + '</div><div><b>' + esc(tr("reportNo")) + ' :</b> ' + esc(r.report_id) + '</div><div><b>' + esc(tr("birthDate")) + ' :</b> ' + esc(p.birth_date || p.dob) + '</div><div><b>' + esc(tr("age")) + ' :</b> ' + esc(age(p)) + '</div><div><b>' + esc(tr("sex")) + ' :</b> ' + esc(p.gender || p.sex) + '</div><div><b>' + esc(tr("phone")) + ' :</b> ' + esc(p.phone) + '</div><div><b>' + esc(tr("weight")) + ' :</b> ' + esc(p.weight) + '</div><div><b>' + esc(tr("height")) + ' :</b> ' + esc(p.height) + '</div><div><b>BMI :</b> ' + esc(bmi(p)) + '</div><div><b>' + esc(tr("examDate")) + ' :</b> ' + esc(dt(r.created_at)) + '</div><div><b>' + esc(tr("department")) + ' :</b> Diabetic Retinopathy Screening System</div><div><b>' + esc(tr("disease")) + ' :</b> ' + esc(p.disease || p.underlying_disease) + '</div><div><b>' + esc(tr("doctor")) + ' :</b> ' + esc(examinerName(r)) + '</div><div><b>' + esc(tr("allergy")) + ' :</b> ' + esc(p.allergy) + '</div></div><table class="rt"><thead><tr><th style="width:120px">' + esc(tr("image")) + '</th><th>' + esc(tr("result")) + '</th><th style="width:110px">' + esc(tr("confidence")) + '</th><th style="width:85px">' + esc(tr("screeningResult")) + '</th><th>' + esc(tr("note")) + '</th></tr></thead><tbody><tr><td>' + imgBlock + '<b>ภาพที่ 1</b></td><td><b>' + esc(r.severity_result) + '</b><br>' + esc(sev(r.severity_result)) + '</td><td>Severity: ' + esc(pct(r.confidence || r.severity_confidence)) + '<br>Binary: ' + esc(pct(r.binary_confidence)) + '</td><td><b>' + esc(screening) + '</b></td><td>' + esc(note) + '</td></tr></tbody></table><div class="summary"><h3>' + esc(tr("summary")) + '</h3><p>' + esc((lang === "th" ? "ผลการคัดกรองโดย AI พบว่า: " : "AI screening result: ") + sev(r.severity_result)) + '</p><p>' + esc(note) + '</p></div><div class="sign"><div class="line">' + esc(tr("reporter")) + '<br>(' + esc(examinerName(r)) + ')</div><div class="line">' + esc(tr("reviewer")) + '<br>(............................)</div></div></div>';
}
function renderPaper(r){
  const c = document.getElementById("paperContainer");
  if(!r){
    c.innerHTML = '<div class="empty">' + tr("selectReport") + '</div>';
    return;
  }
  c.innerHTML = paperHTML(r);
}

function wordPaperHTML(r){
  const p = patientOf(r);
  const img = r.__resolvedImage || directImageCandidate(r);
  const qr = QR_API + encodeURIComponent(location.origin + location.pathname + "?report_id=" + encodeURIComponent(r.report_id || r.id || ""));
  const note = val(r.result_note || "Result from HuggingFace DR model API. AI output is for screening support and should be confirmed by clinical assessment.");
  const screening = String(r.severity_result || "").toLowerCase().includes("no") ? "No DR" : "DR";
  const examiner = examinerName(r);
  const imgTag = img ? '<img src="' + esc(img) + '" width="82" height="70" style="width:82px;height:70px;object-fit:cover;border-radius:6px;background:#020617;">' : '<div style="width:82px;height:70px;border:1px dashed #999;font-size:9px;color:#64748b;text-align:center;padding-top:22px;">' + esc(tr("noImage")) + '</div>';
  return `
  <div class="WordSection1">
    <table class="wHead" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td width="75" valign="top"><img src="institution-logo.png" width="58" height="58"></td>
        <td align="center" valign="top">
          <div class="wTitle">${esc(tr("reportTitle"))}</div>
          <div class="wSub">${esc(tr("screeningTitle"))}</div>
          <div class="wOrg">${esc(tr("orgName"))}</div>
        </td>
        <td width="120" align="right" valign="top">
          <div class="wSmall">${esc(tr("reportNo"))}</div>
          <div class="wCode">${esc(r.report_id)}</div>
          <div class="wCode">${esc(r.patient_code || r.hn)}</div>
          <img src="${esc(qr)}" width="78" height="78"><br>
          <span class="wTiny">${esc(tr("onlineScan"))}</span>
        </td>
      </tr>
    </table>

    <div class="wRule"></div>

    <table class="wInfo" width="100%" cellspacing="0" cellpadding="0">
      <tr><td><b>${esc(tr("patientName"))} :</b> ${esc(r.patient_name || p.full_name || p.name)}</td><td><b>HN :</b> ${esc(r.patient_code || p.hn)}</td></tr>
      <tr><td><b>${esc(tr("patientCode"))} :</b> ${esc(r.patient_code || p.patient_code)}</td><td><b>${esc(tr("reportNo"))} :</b> ${esc(r.report_id)}</td></tr>
      <tr><td><b>${esc(tr("birthDate"))} :</b> ${esc(p.birth_date || p.dob)}</td><td><b>${esc(tr("age"))} :</b> ${esc(age(p))}</td></tr>
      <tr><td><b>${esc(tr("sex"))} :</b> ${esc(p.gender || p.sex)}</td><td><b>${esc(tr("phone"))} :</b> ${esc(p.phone)}</td></tr>
      <tr><td><b>${esc(tr("weight"))} :</b> ${esc(p.weight)}</td><td><b>${esc(tr("height"))} :</b> ${esc(p.height)}</td></tr>
      <tr><td><b>BMI :</b> ${esc(bmi(p))}</td><td><b>${esc(tr("examDate"))} :</b> ${esc(dt(r.created_at))}</td></tr>
      <tr><td><b>${esc(tr("department"))} :</b> Diabetic Retinopathy Screening System</td><td><b>${esc(tr("disease"))} :</b> ${esc(p.disease || p.underlying_disease)}</td></tr>
      <tr><td><b>${esc(tr("doctor"))} :</b> ${esc(examiner)}</td><td><b>${esc(tr("allergy"))} :</b> ${esc(p.allergy)}</td></tr>
    </table>

    <table class="wResult" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <th width="100">${esc(tr("image"))}</th>
        <th width="105">${esc(tr("result"))}</th>
        <th width="115">${esc(tr("confidence"))}</th>
        <th width="75">${esc(tr("screeningResult"))}</th>
        <th>${esc(tr("note"))}</th>
      </tr>
      <tr>
        <td>${imgTag}<br><b>ภาพที่ 1</b></td>
        <td><b>${esc(r.severity_result)}</b><br>${esc(sev(r.severity_result))}</td>
        <td><b>Severity:</b> ${esc(pct(r.confidence || r.severity_confidence))}<br><b>Binary:</b> ${esc(pct(r.binary_confidence))}</td>
        <td><b>${esc(screening)}</b></td>
        <td>${esc(note)}</td>
      </tr>
    </table>

    <div class="wSummary">
      <b>${esc(tr("summary"))}</b><br>
      ${esc((lang === "th" ? "ผลการคัดกรองโดย AI พบว่า: " : "AI screening result: ") + sev(r.severity_result))}<br>
      ${esc(note)}
    </div>

    <table class="wSign" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">....................................................</td>
        <td align="center">....................................................</td>
      </tr>
      <tr>
        <td align="center"><b>${esc(tr("reporter"))}</b><br>(${esc(examiner)})</td>
        <td align="center"><b>${esc(tr("reviewer"))}</b><br>(............................)</td>
      </tr>
    </table>
  </div>`;
}

async function exportDoc(){
  if(!selected){
    alert(tr("selectReport"));
    return;
  }
  await resolveImage(selected);
  const content = '<!doctype html><html><head><meta charset="utf-8"><title>DR Report</title><style>' + WORD_CSS + '</style></head><body>' + wordPaperHTML(selected) + '</body></html>';
  const blob = new Blob([content], {type:"application/msword;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "DR_Report_" + val(selected.patient_code || selected.hn) + "_" + lang + ".doc";
  a.click();
  URL.revokeObjectURL(a.href);
}


function applyTheme(){
  const theme = localStorage.getItem("dr_theme") || localStorage.getItem("theme") || localStorage.getItem("dr_dashboard_theme") || "light";
  const isDark = theme === "dark";
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  document.body.classList.toggle("dark-mode", isDark);
}
function setupSidebarImages(){
  document.querySelectorAll("img[data-logo-fallbacks]").forEach(img => {
    const paths = img.dataset.logoFallbacks.split(",").map(s => s.trim()).filter(Boolean);
    let i = 0;
    const fallback = img.parentElement ? img.parentElement.querySelector("span") : null;

    const showFallback = () => {
      img.style.display = "none";
      if(fallback) fallback.style.display = "grid";
    };

    const tryNext = () => {
      if(i >= paths.length){
        showFallback();
        return;
      }
      img.src = paths[i++];
    };

    img.onload = () => {
      img.style.display = "block";
      if(fallback) fallback.style.display = "none";
    };

    img.onerror = tryNext;
    tryNext();
  });
}
function markActiveReportMenu(){
  document.querySelectorAll(".nav a, .nav-menu a, .nav-item").forEach(a => {
    const href = a.getAttribute("href") || "";
    if(href.includes("retina-report-new.html")) a.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  applyTheme();
  setupSidebarImages();
  markActiveReportMenu();
  const langSelector = document.getElementById("langSelect") || document.getElementById("reportLangSelect") || document.getElementById("languageSelect");
  if(langSelector) langSelector.onchange = e => setLang(e.target.value);
  const searchInput = document.getElementById("searchInput");
  if(searchInput) searchInput.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(renderList, 180);
  });
  const pdfBtn = document.getElementById("pdfBtn");
  if(pdfBtn) pdfBtn.onclick = () => window.print();
  const docBtn = document.getElementById("docBtn");
  if(docBtn) docBtn.onclick = exportDoc;
  const logoutBtn = document.getElementById("logoutBtn");
  if(logoutBtn) logoutBtn.onclick = async () => {
    try { await db.auth.signOut(); } catch(e) {}
    location.href = "index.html";
  };
  window.addEventListener("storage", (e) => {
    if(["dr_lang","dr_language","language","app_lang","site_lang","dr_report_language"].includes(e.key)) applyLang();
    if(["dr_theme","theme","dr_dashboard_theme"].includes(e.key)) applyTheme();
  });
  window.addEventListener("focus", () => { applyTheme(); applyLang(); });
  applyLang();
  await loadProfile();
  loadData();
});
