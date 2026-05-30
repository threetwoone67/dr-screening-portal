const SUPABASE_URL = "https://pncgbphbcmtlzrmwnhcy.supabase.co";
const SUPABASE_KEY = "sb_publishable_jOwAmvtqBPKPd7uyGqvaBQ_c4UEhh1K";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const QR_API = "https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=";
const WORD_CSS = "\n@page WordSection1{size:595.3pt 841.9pt;margin:32pt 38pt 28pt 38pt}\ndiv.WordSection1{page:WordSection1}\nbody{margin:0;font-family:\"Sarabun\",Arial,sans-serif;color:#0f172a;font-size:10pt}\ntable{border-collapse:collapse}\n.wTitle{font-size:18pt;font-weight:700;margin-top:4pt}\n.wSub{font-size:9pt;font-weight:700;margin-top:4pt}\n.wOrg{font-size:9pt;font-weight:700;color:#173764;margin-top:5pt}\n.wSmall{font-size:7pt;font-weight:700}\n.wCode{font-size:7.5pt;font-weight:700;word-break:break-word}\n.wTiny{font-size:6.5pt;color:#64748b}\n.wRule{border-top:1.5pt solid #20395f;margin:14pt 0 9pt}\n.wInfo td{width:50%;font-size:9pt;font-weight:700;padding:1.8pt 4pt;vertical-align:top}\n.wInfo b{font-weight:900}\n.wResult{margin-top:9pt;font-size:8.2pt}\n.wResult th{background:#f1f5f9;border:1pt solid #d9e2ef;padding:5pt;text-align:left;font-weight:900}\n.wResult td{border:1pt solid #d9e2ef;padding:5pt;vertical-align:top;font-weight:700}\n.wSummary{margin-top:9pt;border:1pt solid #d9e2ef;background:#f8fafc;padding:8pt;font-size:8.5pt;font-weight:700;line-height:1.2}\n.wSign{margin-top:24pt;font-size:8.5pt;font-weight:700}\n.wSign td{width:50%;padding:3pt 12pt}\n";
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

let lang = localStorage.getItem("dr_language") || localStorage.getItem("dr_lang") || localStorage.getItem("language") || localStorage.getItem("site_language") || localStorage.getItem("app_language") || "th";
if(!["th","en"].includes(lang)) lang = "th";
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
  if(!r) return {};
  const reportCodes = [
    r.patient_code, r.hn, r.patient_hn, r.patient_id, r.patient_uuid, r.patient_code_id
  ].map(x => String(x || "").trim().toLowerCase()).filter(Boolean);
  const reportNames = [
    r.patient_name, r.full_name, r.name, r.pt_name
  ].map(x => String(x || "").trim().toLowerCase()).filter(Boolean);

  return patients.find(p => {
    const codes = [
      p.patient_code, p.hn, p.patient_hn, p.id, p.patient_id, p.patient_uuid
    ].map(x => String(x || "").trim().toLowerCase()).filter(Boolean);
    const names = [
      p.full_name, p.name, p.patient_name, p.pt_name
    ].map(x => String(x || "").trim().toLowerCase()).filter(Boolean);

    return reportCodes.some(c => codes.includes(c)) ||
           reportNames.some(n => names.includes(n)) ||
           reportCodes.some(c => names.includes(c)) ||
           reportNames.some(n => codes.includes(n));
  }) || {};
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

function reportValue(obj, keys, fallback="-"){
  for(const k of keys){
    if(obj && obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== "") return obj[k];
  }
  return fallback;
}
function patientNameOf(r,p){
  return reportValue(r,["patient_name","full_name","name","pt_name"], reportValue(p,["full_name","name","patient_name"],"-"));
}
function patientCodeOf(r,p){
  return reportValue(r,["patient_code","hn","patient_hn","patient_id","patient_uuid"], reportValue(p,["patient_code","hn","patient_id","id"],"-"));
}
function reportNoOf(r){
  return reportValue(r,["report_id","report_no","id"],"-");
}
function patientField(r,p, reportKeys, patientKeys){
  return reportValue(r, reportKeys, reportValue(p, patientKeys, "-"));
}
function patientBirth(r,p){ return patientField(r,p,["birth_date","dob","patient_birth_date"],["birth_date","dob"]); }
function patientAge(r,p){ return reportValue(r,["age","patient_age"], age(p)); }
function patientSex(r,p){ return patientField(r,p,["gender","sex","patient_gender","patient_sex"],["gender","sex"]); }
function patientPhone(r,p){ return patientField(r,p,["phone","patient_phone","tel"],["phone","tel"]); }
function patientWeight(r,p){ return patientField(r,p,["weight","patient_weight"],["weight"]); }
function patientHeight(r,p){ return patientField(r,p,["height","patient_height"],["height"]); }
function patientBMI(r,p){
  const rbmi = reportValue(r,["bmi","patient_bmi"],"");
  if(rbmi) return rbmi;
  return bmi(p);
}
function patientDisease(r,p){ return patientField(r,p,["disease","underlying_disease","medical_history"],["disease","underlying_disease","medical_history"]); }
function patientAllergy(r,p){ return patientField(r,p,["allergy","drug_allergy"],["allergy","drug_allergy"]); }
function applyTheme(){
  const theme = localStorage.getItem("dr_theme") || localStorage.getItem("theme") || localStorage.getItem("dr_dashboard_theme") || localStorage.getItem("site_theme") || localStorage.getItem("app_theme") || "light";
  document.documentElement.setAttribute("data-theme", theme);
  document.body.classList.toggle("dark-mode", theme === "dark");
  document.body.classList.toggle("dark", theme === "dark");
}
function setupSidebarImages(){
  document.querySelectorAll(".brand .logo img,.orgLogo img,.seal").forEach(img=>{
    if(!img.getAttribute("data-safe")){
      img.setAttribute("data-safe","1");
      img.addEventListener("error",()=>{ img.style.display="none"; });
    }
  });
}
function markActiveReportMenu(){
  document.querySelectorAll(".nav a").forEach(a=>{
    if((a.getAttribute("href")||"").includes("retina-report-new")) a.classList.add("active");
  });
}
function syncLangStorage(){
  ["dr_language","dr_lang","language","site_language","app_language","dr_report_language"].forEach(k=>localStorage.setItem(k, lang));
}

function applyLang(){
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i]").forEach(e => { e.textContent = tr(e.dataset.i); });
  const sel = document.getElementById("langSelect");
  if(sel) sel.value = lang;
  renderList();
  if(selected) renderPaper(selected);
}
function setLang(x){
  lang = (x === "en" ? "en" : "th");
  syncLangStorage();
  applyLang();
  window.dispatchEvent(new CustomEvent("dr:language-changed",{detail:{lang}}));
  document.dispatchEvent(new CustomEvent("dr:language-applied",{detail:{lang}}));
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

function finalSeverityOf(r){
  return reportValue(r, ["final_severity_result","doctor_severity_result","reviewed_severity_result","severity_result","result","diagnosis"], "-");
}
function aiSeverityOf(r){
  return reportValue(r, ["ai_severity_result","severity_result","result","diagnosis"], "-");
}
function finalBinaryOf(r){
  const v = reportValue(r, ["final_binary_result","doctor_binary_result","reviewed_binary_result","binary_result","screening_result"], "");
  if(v) return String(v);
  const s = String(finalSeverityOf(r) || "").toLowerCase();
  return s.includes("no") ? "No DR" : "DR";
}
function doctorNoteOf(r){
  return reportValue(r, ["doctor_note","review_note","clinician_note","doctor_comment","reviewer_note"], "");
}
function reportNoteOf(r){
  const doctorNote = doctorNoteOf(r);
  const aiNote = reportValue(r, ["result_note","note","ai_note"], "");
  const aiSeverity = aiSeverityOf(r);
  const finalSeverity = finalSeverityOf(r);
  const isOverride = Boolean(r && (r.is_doctor_override || r.final_severity_result || r.final_binary_result || doctorNote));
  const parts = [];

  if(doctorNote && doctorNote !== "-") {
    parts.push((lang === "th" ? "หมายเหตุผู้ตรวจ: " : "Doctor note: ") + doctorNote);
  }

  if(isOverride && aiSeverity && aiSeverity !== "-" && String(aiSeverity) !== String(finalSeverity)) {
    parts.push((lang === "th" ? "ผล AI เดิม: " : "Original AI result: ") + aiSeverity);
  }

  if(aiNote && aiNote !== "-" && aiNote !== doctorNote) {
    parts.push((lang === "th" ? "หมายเหตุ AI: " : "AI note: ") + aiNote);
  }

  if(parts.length) return parts.join(" | ");
  return "Result from HuggingFace DR model API. AI output is for screening support and should be confirmed by clinical assessment.";
}
function summaryLeadOf(r){
  const finalSeverity = finalSeverityOf(r);
  const isReviewed = Boolean(r && (r.final_severity_result || r.final_binary_result || r.doctor_note || r.is_doctor_override));
  return (isReviewed
    ? (lang === "th" ? "ผลยืนยันโดยผู้ตรวจ: " : "Final result confirmed by examiner: ")
    : (lang === "th" ? "ผลการคัดกรองโดย AI พบว่า: " : "AI screening result: ")) + sev(finalSeverity);
}
async function loadData(){
  const listBox = document.getElementById("reportList");
  if(listBox) listBox.innerHTML = '<div class="empty">' + tr("loading") + '</div>';

  const res = await Promise.allSettled([
    db.from("analysis_reports").select("*").order("created_at", {ascending:false}).limit(1000),
    db.from("patients").select("*").order("created_at", {ascending:false}).limit(1000)
  ]);

  if(res[0].status === "fulfilled" && !res[0].value.error) reports = res[0].value.data || [];
  if(res[1].status === "fulfilled" && !res[1].value.error) patients = res[1].value.data || [];

  // fallback: use local cached report/patient data if Supabase returns empty due to session/RLS timing
  try{
    const cachedReports = JSON.parse(localStorage.getItem("dr_analysis_reports") || localStorage.getItem("analysis_reports") || "[]");
    if(!reports.length && Array.isArray(cachedReports)) reports = cachedReports;
  }catch(e){}
  try{
    const cachedPatients = JSON.parse(localStorage.getItem("dr_patients") || localStorage.getItem("patients") || "[]");
    if(!patients.length && Array.isArray(cachedPatients)) patients = cachedPatients;
  }catch(e){}

  let msg = "reports " + reports.length + " / patients " + patients.length;
  if(res[0].status === "fulfilled" && res[0].value.error) msg = "analysis_reports error: " + res[0].value.error.message;
  if(document.getElementById("debugText")) document.getElementById("debugText").textContent = msg;

  if(document.getElementById("totalReports")) document.getElementById("totalReports").textContent = reports.length;
  if(document.getElementById("normalReports")) document.getElementById("normalReports").textContent = reports.filter(r => String(finalSeverityOf(r)).toLowerCase().includes("no")).length;
  if(document.getElementById("abnormalReports")) document.getElementById("abnormalReports").textContent = reports.filter(r => !String(finalSeverityOf(r)).toLowerCase().includes("no")).length;

  const rid = new URLSearchParams(location.search).get("report_id");
  if(rid){
    await selectReport(rid);
  } else {
    renderList();
  }

  resolveAllVisibleImages();
}
function searchableReportText(r){
  const p = patientOf(r);
  return [
    r.patient_name, r.full_name, r.name,
    r.patient_code, r.hn, r.patient_id, r.report_id, r.id,
    r.final_severity_result, r.final_binary_result, r.doctor_note,
    r.ai_severity_result, r.ai_binary_result,
    r.severity_result, r.result, r.diagnosis, r.result_note,
    p.full_name, p.name, p.patient_name, p.patient_code, p.hn, p.id, p.phone
  ].map(x => String(x || "").toLowerCase()).join(" ");
}

function renderList(){
  const search = document.getElementById("searchInput");
  const q = (search ? search.value : "").toLowerCase().trim();
  const box = document.getElementById("reportList");
  if(!box) return;

  let rows = reports.filter(r => !q || searchableReportText(r).includes(q));

  // ถ้ายังไม่พิมพ์ค้นหา ให้แสดงรายการล่าสุดแทน เพื่อให้กดดูรายงานได้ทันที
  if(!q) rows = reports.slice(0, 30);

  if(!rows.length){
    box.innerHTML = '<div class="empty">' + tr("noReports") + '</div>';
    return;
  }

  box.innerHTML = rows.map(r => {
    const p = patientOf(r);
    const id = r.report_id || r.id;
    const active = selected && String(selected.report_id || selected.id) === String(id) ? "active" : "";
    const patientName = patientNameOf(r,p);
    const patientCode = patientCodeOf(r,p);
    const reportNo = reportNoOf(r);
    return '<div class="item ' + active + '" data-id="' + esc(id) + '"><b>' + esc(patientName) + '</b><span>HN: ' + esc(patientCode) + ' | ' + esc(tr("reportNo")) + ': ' + esc(reportNo) + '</span><span>' + esc(dt(r.created_at || r.report_date || r.exam_date)) + '</span><span class="pill">' + esc(sev(finalSeverityOf(r))) + '</span></div>';
  }).join("");

  document.querySelectorAll(".item").forEach(el => {
    el.onclick = () => selectReport(el.dataset.id);
  });
}
async function selectReport(id){
  selected = reports.find(r => String(r.report_id || r.id) === String(id));

  // รองรับการเปิดจาก URL โดยตรง เช่น ?report_id=...
  if(!selected && id){
    try{
      let q1 = await db.from("analysis_reports").select("*").eq("report_id", id).maybeSingle();
      if(!q1.error && q1.data) selected = q1.data;
      if(!selected){
        let q2 = await db.from("analysis_reports").select("*").eq("id", id).maybeSingle();
        if(!q2.error && q2.data) selected = q2.data;
      }
      if(selected && !reports.some(r => String(r.report_id || r.id) === String(selected.report_id || selected.id))){
        reports.unshift(selected);
      }
    }catch(e){
      console.warn("selectReport direct load warning:", e);
    }
  }

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
  const finalSeverity = finalSeverityOf(r);
  const note = val(reportNoteOf(r));
  const screening = finalBinaryOf(r);
  const imgBlock = img ? '<img class="fundus" src="' + esc(img) + '" onerror="this.outerHTML=\'<div class=&quot;image-note&quot;>'+esc(tr("noImage"))+'</div>\'">' : '<div style="width:94px;height:86px;border:1px dashed #aaa;display:grid;place-items:center;color:#64748b;font-size:11px">' + esc(tr("noImage")) + '</div>';
  return '<div class="paper"><div class="phead"><img class="seal" src="institution-logo.png"><div class="ptitle"><h1>' + esc(tr("reportTitle")) + '</h1><p>' + esc(tr("screeningTitle")) + '</p><p style="color:#173764;font-weight:900">' + esc(tr("orgName")) + '</p></div><div class="code">' + esc(tr("reportNo")) + '<br>' + esc(reportNoOf(r)) + '<br><br>' + esc(patientCodeOf(r,p)) + '<br><img class="qr" src="' + esc(qr) + '"><br><span style="font-size:10px;color:#64748b">' + esc(tr("onlineScan")) + '</span></div></div><hr class="div"><div class="info"><div><b>' + esc(tr("patientName")) + ' :</b> ' + esc(patientNameOf(r,p)) + '</div><div><b>HN :</b> ' + esc(patientCodeOf(r,p)) + '</div><div><b>' + esc(tr("patientCode")) + ' :</b> ' + esc(patientCodeOf(r,p)) + '</div><div><b>' + esc(tr("reportNo")) + ' :</b> ' + esc(reportNoOf(r)) + '</div><div><b>' + esc(tr("birthDate")) + ' :</b> ' + esc(patientBirth(r,p)) + '</div><div><b>' + esc(tr("age")) + ' :</b> ' + esc(patientAge(r,p)) + '</div><div><b>' + esc(tr("sex")) + ' :</b> ' + esc(patientSex(r,p)) + '</div><div><b>' + esc(tr("phone")) + ' :</b> ' + esc(patientPhone(r,p)) + '</div><div><b>' + esc(tr("weight")) + ' :</b> ' + esc(patientWeight(r,p)) + '</div><div><b>' + esc(tr("height")) + ' :</b> ' + esc(patientHeight(r,p)) + '</div><div><b>BMI :</b> ' + esc(patientBMI(r,p)) + '</div><div><b>' + esc(tr("examDate")) + ' :</b> ' + esc(dt(r.created_at)) + '</div><div><b>' + esc(tr("department")) + ' :</b> Diabetic Retinopathy Screening System</div><div><b>' + esc(tr("disease")) + ' :</b> ' + esc(patientDisease(r,p)) + '</div><div><b>' + esc(tr("doctor")) + ' :</b> ' + esc(examinerName(r)) + '</div><div><b>' + esc(tr("allergy")) + ' :</b> ' + esc(patientAllergy(r,p)) + '</div></div><table class="rt"><thead><tr><th style="width:120px">' + esc(tr("image")) + '</th><th>' + esc(tr("result")) + '</th><th style="width:110px">' + esc(tr("confidence")) + '</th><th style="width:85px">' + esc(tr("screeningResult")) + '</th><th>' + esc(tr("note")) + '</th></tr></thead><tbody><tr><td>' + imgBlock + '<b>ภาพที่ 1</b></td><td><b>' + esc(r.severity_result) + '</b><br>' + esc(sev(r.severity_result)) + '</td><td>Severity: ' + esc(pct(r.confidence || r.severity_confidence)) + '<br>Binary: ' + esc(pct(r.binary_confidence)) + '</td><td><b>' + esc(screening) + '</b></td><td>' + esc(note) + '</td></tr></tbody></table><div class="summary"><h3>' + esc(tr("summary")) + '</h3><p>' + esc(summaryLeadOf(r)) + '</p><p>' + esc(note) + '</p></div><div class="sign"><div class="line">' + esc(tr("reporter")) + '<br>(' + esc(examinerName(r)) + ')</div><div class="line">' + esc(tr("reviewer")) + '<br>(............................)</div></div></div>';
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
  const finalSeverity = finalSeverityOf(r);
  const note = val(reportNoteOf(r));
  const screening = finalBinaryOf(r);
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
          <div class="wCode">${esc(reportNoOf(r))}</div>
          <div class="wCode">${esc(patientCodeOf(r,p))}</div>
          <img src="${esc(qr)}" width="78" height="78"><br>
          <span class="wTiny">${esc(tr("onlineScan"))}</span>
        </td>
      </tr>
    </table>

    <div class="wRule"></div>

    <table class="wInfo" width="100%" cellspacing="0" cellpadding="0">
      <tr><td><b>${esc(tr("patientName"))} :</b> ${esc(patientNameOf(r,p))}</td><td><b>HN :</b> ${esc(patientCodeOf(r,p))}</td></tr>
      <tr><td><b>${esc(tr("patientCode"))} :</b> ${esc(patientCodeOf(r,p))}</td><td><b>${esc(tr("reportNo"))} :</b> ${esc(reportNoOf(r))}</td></tr>
      <tr><td><b>${esc(tr("birthDate"))} :</b> ${esc(patientBirth(r,p))}</td><td><b>${esc(tr("age"))} :</b> ${esc(patientAge(r,p))}</td></tr>
      <tr><td><b>${esc(tr("sex"))} :</b> ${esc(patientSex(r,p))}</td><td><b>${esc(tr("phone"))} :</b> ${esc(patientPhone(r,p))}</td></tr>
      <tr><td><b>${esc(tr("weight"))} :</b> ${esc(patientWeight(r,p))}</td><td><b>${esc(tr("height"))} :</b> ${esc(patientHeight(r,p))}</td></tr>
      <tr><td><b>BMI :</b> ${esc(patientBMI(r,p))}</td><td><b>${esc(tr("examDate"))} :</b> ${esc(dt(r.created_at))}</td></tr>
      <tr><td><b>${esc(tr("department"))} :</b> Diabetic Retinopathy Screening System</td><td><b>${esc(tr("disease"))} :</b> ${esc(patientDisease(r,p))}</td></tr>
      <tr><td><b>${esc(tr("doctor"))} :</b> ${esc(examiner)}</td><td><b>${esc(tr("allergy"))} :</b> ${esc(patientAllergy(r,p))}</td></tr>
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
        <td><b>${esc(finalSeverity)}</b><br>${esc(sev(finalSeverity))}</td>
        <td><b>Severity:</b> ${esc(pct(r.confidence || r.severity_confidence))}<br><b>Binary:</b> ${esc(pct(r.binary_confidence))}</td>
        <td><b>${esc(screening)}</b></td>
        <td>${esc(note)}</td>
      </tr>
    </table>

    <div class="wSummary">
      <b>${esc(tr("summary"))}</b><br>
      ${esc(summaryLeadOf(r))}<br>
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
  a.download = "DR_Report_" + val(patientCodeOf(selected, patientOf(selected))) + "_" + lang + ".doc";
  a.click();
  URL.revokeObjectURL(a.href);
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
    timer = setTimeout(renderList, 120);
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
    if(["dr_lang","dr_language","language","app_lang","site_lang","site_language","app_language","dr_dashboard_language","dr_report_language"].includes(e.key)){
      lang = localStorage.getItem("dr_language") || localStorage.getItem("dr_lang") || localStorage.getItem("language") || localStorage.getItem("site_language") || localStorage.getItem("app_language") || lang;
      applyLang();
    }
    if(["dr_theme","theme","dr_dashboard_theme","site_theme","app_theme"].includes(e.key)) applyTheme();
  });
  window.addEventListener("focus", () => {
    lang = localStorage.getItem("dr_language") || localStorage.getItem("dr_lang") || localStorage.getItem("language") || localStorage.getItem("site_language") || localStorage.getItem("app_language") || lang;
    applyTheme(); applyLang();
  });
  window.addEventListener("dr:language-changed", (e)=>{ if(e.detail && e.detail.lang){ lang=e.detail.lang; applyLang(); }});
  document.addEventListener("dr:language-applied", (e)=>{ if(e.detail && e.detail.lang){ lang=e.detail.lang; applyLang(); }});

  applyLang();
  await loadProfile();
  await loadData();
});
