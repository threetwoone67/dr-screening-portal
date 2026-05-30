const SUPABASE_URL = "https://pncgbphbcmtlzrmwnhcy.supabase.co";
const SUPABASE_KEY = "sb_publishable_jOwAmvtqBPKPd7uyGqvaBQ_c4UEhh1K";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const QR_API = "https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=";
const WORD_CSS = `
@page WordSection1{
  size:595.3pt 841.9pt;
  margin:28pt 34pt 26pt 34pt;
}
div.WordSection1{
  page:WordSection1;
  width:527pt;
  margin:0 auto;
}
body{
  margin:0;
  background:#ffffff;
  color:#0f172a;
  font-family:"Sarabun","Noto Sans Thai",Arial,sans-serif;
  font-size:8.7pt;
  line-height:1.22;
}
table{
  border-collapse:collapse;
  mso-table-lspace:0pt;
  mso-table-rspace:0pt;
}
.wHead{
  width:100%;
  table-layout:fixed;
  border-bottom:1.6pt solid #20395f;
  margin:0 0 8pt 0;
}
.wHead td{
  border:0;
  padding:0 0 8pt 0;
  vertical-align:top;
}
.wLogoCell{width:62pt;text-align:left;}
.wLogo{
  width:46pt!important;
  height:46pt!important;
  max-width:46pt!important;
  max-height:46pt!important;
  object-fit:contain;
  display:block;
}
.wTitleCell{
  text-align:center;
  padding:0 8pt!important;
  width:315pt;
}
.wTitle{
  font-size:16pt;
  font-weight:900;
  line-height:1.08;
  margin:0 0 2pt 0;
}
.wSub{
  font-size:8pt;
  font-weight:800;
  line-height:1.18;
  margin:2pt 0;
}
.wOrg{
  font-size:7.8pt;
  font-weight:900;
  color:#173764;
  line-height:1.18;
  margin:2pt 0 0 0;
}
.wQrCell{
  width:92pt;
  text-align:right;
  vertical-align:top;
}
.wSmall{
  font-size:6.5pt;
  font-weight:900;
  line-height:1.1;
}
.wCode{
  font-size:7pt;
  font-weight:900;
  line-height:1.12;
  word-break:break-word;
}
.wTiny{
  font-size:6pt;
  color:#64748b;
  font-weight:800;
  line-height:1.1;
}
.wQr{
  width:60pt!important;
  height:60pt!important;
  max-width:60pt!important;
  max-height:60pt!important;
  object-fit:contain;
  display:inline-block;
  margin-top:2pt;
}
.wInfo{
  width:100%;
  table-layout:fixed;
  margin:6pt 0 8pt 0;
}
.wInfo td{
  width:50%;
  font-size:8.2pt;
  font-weight:750;
  padding:1.4pt 4pt;
  vertical-align:top;
  line-height:1.18;
}
.wInfo b{font-weight:900;}
.wResult{
  width:100%;
  table-layout:fixed;
  margin-top:7pt;
  font-size:7.2pt;
  line-height:1.16;
}
.wResult th{
  background:#f1f5f9;
  border:1pt solid #d9e2ef;
  padding:3.8pt 4pt;
  text-align:left;
  font-weight:900;
}
.wResult td{
  border:1pt solid #d9e2ef;
  padding:4pt;
  vertical-align:top;
  font-weight:750;
}
.wResult .cImg{width:90pt;}
.wResult .cResult{width:75pt;}
.wResult .cConf{width:70pt;}
.wResult .cScreen{width:48pt;}
.wFundus{
  width:76pt!important;
  height:70pt!important;
  max-width:76pt!important;
  max-height:70pt!important;
  object-fit:cover;
  background:#020617;
  display:block;
  border-radius:5pt;
}
.wCaption{
  font-size:6.6pt;
  margin-top:3pt;
  font-weight:800;
}
.wSummary{
  margin-top:8pt;
  border:1pt solid #d9e2ef;
  background:#f8fafc;
  padding:7pt;
  font-size:7.6pt;
  font-weight:750;
  line-height:1.22;
  border-radius:7pt;
}
.wSummary b{font-weight:900;}
.wSummary p{margin:2.4pt 0;}
.wSign{
  width:100%;
  table-layout:fixed;
  margin-top:18pt;
  font-size:7.5pt;
  font-weight:750;
}
.wSign td{
  width:50%;
  padding:0 18pt;
  text-align:center;
  vertical-align:top;
}
.wLine{
  border-top:1pt dotted #0f2b4c;
  height:7pt;
  margin-bottom:2pt;
}
`;
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

async function queryReportsAndPatients(){
  return await Promise.allSettled([
    db.from("analysis_reports").select("*").order("created_at", {ascending:false}).limit(1000),
    db.from("patients").select("*").order("created_at", {ascending:false}).limit(1000)
  ]);
}
function applyQueryResults(res){
  if(res[0].status === "fulfilled" && !res[0].value.error) reports = res[0].value.data || [];
  if(res[1].status === "fulfilled" && !res[1].value.error) patients = res[1].value.data || [];
}
function saveReportCache(){
  try{
    if(Array.isArray(reports) && reports.length) localStorage.setItem("dr_analysis_reports", JSON.stringify(reports.slice(0,200)));
    if(Array.isArray(patients) && patients.length) localStorage.setItem("dr_patients", JSON.stringify(patients.slice(0,500)));
  }catch(e){}
}
function loadReportCache(){
  try{
    const cachedReports = JSON.parse(localStorage.getItem("dr_analysis_reports") || localStorage.getItem("analysis_reports") || "[]");
    if(!reports.length && Array.isArray(cachedReports)) reports = cachedReports;
  }catch(e){}
  try{
    const cachedPatients = JSON.parse(localStorage.getItem("dr_patients") || localStorage.getItem("patients") || "[]");
    if(!patients.length && Array.isArray(cachedPatients)) patients = cachedPatients;
  }catch(e){}
}
function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

async function loadData(){
  const listBox = document.getElementById("reportList");
  if(listBox) listBox.innerHTML = '<div class="empty">' + tr("loading") + '</div>';

  let res = await queryReportsAndPatients();
  applyQueryResults(res);

  // Supabase auth/session restoration can lag on deployed/mobile browsers.
  // Retry once before falling back to local cache.
  if(!reports.length){
    await sleep(650);
    res = await queryReportsAndPatients();
    applyQueryResults(res);
  }

  if(reports.length || patients.length) saveReportCache();
  loadReportCache();

  let msg = "reports " + reports.length + " / patients " + patients.length;
  if(res[0].status === "fulfilled" && res[0].value.error) msg = "analysis_reports error: " + res[0].value.error.message;
  if(res[1].status === "fulfilled" && res[1].value.error) msg += " | patients error: " + res[1].value.error.message;
  if(document.getElementById("debugText")) document.getElementById("debugText").textContent = msg;

  if(document.getElementById("totalReports")) document.getElementById("totalReports").textContent = reports.length;
  if(document.getElementById("normalReports")) document.getElementById("normalReports").textContent = reports.filter(r => String(r.severity_result || r.result || "").toLowerCase().includes("no")).length;
  if(document.getElementById("abnormalReports")) document.getElementById("abnormalReports").textContent = reports.filter(r => !String(r.severity_result || r.result || "").toLowerCase().includes("no")).length;

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
    return '<div class="item ' + active + '" data-id="' + esc(id) + '"><b>' + esc(patientName) + '</b><span>HN: ' + esc(patientCode) + ' | ' + esc(tr("reportNo")) + ': ' + esc(reportNo) + '</span><span>' + esc(dt(r.created_at || r.report_date || r.exam_date)) + '</span><span class="pill">' + esc(sev(r.severity_result || r.result || r.diagnosis)) + '</span></div>';
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
  const note = val(r.result_note || "Result from HuggingFace DR model API. AI output is for screening support and should be confirmed by clinical assessment.");
  const screening = String(r.severity_result || "").toLowerCase().includes("no") ? "No DR" : "DR";
  const imgBlock = img ? '<img class="fundus" src="' + esc(img) + '" onerror="this.outerHTML=\'<div class=&quot;image-note&quot;>'+esc(tr("noImage"))+'</div>\'">' : '<div style="width:94px;height:86px;border:1px dashed #aaa;display:grid;place-items:center;color:#64748b;font-size:11px">' + esc(tr("noImage")) + '</div>';
  return '<div class="paper"><div class="phead"><img class="seal" src="institution-logo.png"><div class="ptitle"><h1>' + esc(tr("reportTitle")) + '</h1><p>' + esc(tr("screeningTitle")) + '</p><p style="color:#173764;font-weight:900">' + esc(tr("orgName")) + '</p></div><div class="code">' + esc(tr("reportNo")) + '<br>' + esc(reportNoOf(r)) + '<br><br>' + esc(patientCodeOf(r,p)) + '<br><img class="qr" src="' + esc(qr) + '"><br><span style="font-size:10px;color:#64748b">' + esc(tr("onlineScan")) + '</span></div></div><hr class="div"><div class="info"><div><b>' + esc(tr("patientName")) + ' :</b> ' + esc(patientNameOf(r,p)) + '</div><div><b>HN :</b> ' + esc(patientCodeOf(r,p)) + '</div><div><b>' + esc(tr("patientCode")) + ' :</b> ' + esc(patientCodeOf(r,p)) + '</div><div><b>' + esc(tr("reportNo")) + ' :</b> ' + esc(reportNoOf(r)) + '</div><div><b>' + esc(tr("birthDate")) + ' :</b> ' + esc(patientBirth(r,p)) + '</div><div><b>' + esc(tr("age")) + ' :</b> ' + esc(patientAge(r,p)) + '</div><div><b>' + esc(tr("sex")) + ' :</b> ' + esc(patientSex(r,p)) + '</div><div><b>' + esc(tr("phone")) + ' :</b> ' + esc(patientPhone(r,p)) + '</div><div><b>' + esc(tr("weight")) + ' :</b> ' + esc(patientWeight(r,p)) + '</div><div><b>' + esc(tr("height")) + ' :</b> ' + esc(patientHeight(r,p)) + '</div><div><b>BMI :</b> ' + esc(patientBMI(r,p)) + '</div><div><b>' + esc(tr("examDate")) + ' :</b> ' + esc(dt(r.created_at)) + '</div><div><b>' + esc(tr("department")) + ' :</b> Diabetic Retinopathy Screening System</div><div><b>' + esc(tr("disease")) + ' :</b> ' + esc(patientDisease(r,p)) + '</div><div><b>' + esc(tr("doctor")) + ' :</b> ' + esc(examinerName(r)) + '</div><div><b>' + esc(tr("allergy")) + ' :</b> ' + esc(patientAllergy(r,p)) + '</div></div><table class="rt"><thead><tr><th style="width:120px">' + esc(tr("image")) + '</th><th>' + esc(tr("result")) + '</th><th style="width:110px">' + esc(tr("confidence")) + '</th><th style="width:85px">' + esc(tr("screeningResult")) + '</th><th>' + esc(tr("note")) + '</th></tr></thead><tbody><tr><td>' + imgBlock + '<b>ภาพที่ 1</b></td><td><b>' + esc(r.severity_result) + '</b><br>' + esc(sev(r.severity_result)) + '</td><td>Severity: ' + esc(pct(r.confidence || r.severity_confidence)) + '<br>Binary: ' + esc(pct(r.binary_confidence)) + '</td><td><b>' + esc(screening) + '</b></td><td>' + esc(note) + '</td></tr></tbody></table><div class="summary"><h3>' + esc(tr("summary")) + '</h3><p>' + esc((lang === "th" ? "ผลการคัดกรองโดย AI พบว่า: " : "AI screening result: ") + sev(r.severity_result)) + '</p><p>' + esc(note) + '</p></div><div class="sign"><div class="line">' + esc(tr("reporter")) + '<br>(' + esc(examinerName(r)) + ')</div><div class="line">' + esc(tr("reviewer")) + '<br>(............................)</div></div></div>';
}
function renderPaper(r){
  const c = document.getElementById("paperContainer");
  if(!r){
    c.innerHTML = '<div class="empty">' + tr("selectReport") + '</div>';
    return;
  }
  c.innerHTML = paperHTML(r);
}


function absDocUrl(src){
  if(!src) return "";
  try { return new URL(src, window.location.href).href; } catch(e) { return src; }
}
async function imageForWord(src){
  if(!src) return "";
  const raw = String(src || "").trim();
  if(!raw) return "";
  // ไม่ใช้ base64: ส่ง URL ตรงให้ Word โหลดรูปจากเว็บ / Supabase Storage
  return absDocUrl(raw);
}
async function waitForPaperImages(){
  const imgs = Array.from(document.querySelectorAll(".paper img"));
  await Promise.all(imgs.map(img => {
    if(img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
      setTimeout(resolve, 1800);
    });
  }));
}

async function wordPaperHTML(r){
  const p = patientOf(r);
  const img = r.__resolvedImage || directImageCandidate(r);
  const qr = QR_API + encodeURIComponent(location.origin + location.pathname + "?report_id=" + encodeURIComponent(r.report_id || r.id || ""));
  const note = val(r.result_note || "Result from HuggingFace DR model API. AI output is for screening support and should be confirmed by clinical assessment.");
  const screening = String(r.severity_result || "").toLowerCase().includes("no") ? "No DR" : "DR";
  const examiner = examinerName(r);

  const logoSrc = await imageForWord("institution-logo.png");
  const qrSrc = await imageForWord(qr);
  const imageSrc = await imageForWord(img);

  const imgTag = imageSrc
    ? '<img class="wFundus" src="' + esc(imageSrc) + '" width="76" height="70" style="width:76pt;height:70pt;object-fit:cover;">'
    : '<div style="width:76pt;height:70pt;border:1pt dashed #999;font-size:6.5pt;color:#64748b;text-align:center;padding-top:22pt;">' + esc(tr("noImage")) + '</div>';

  const infoRows = [
    ['patientName', patientNameOf(r,p), 'HN', patientCodeOf(r,p), true],
    ['patientCode', patientCodeOf(r,p), 'reportNo', reportNoOf(r), true],
    ['birthDate', patientBirth(r,p), 'age', patientAge(r,p), true],
    ['sex', patientSex(r,p), 'phone', patientPhone(r,p), true],
    ['weight', patientWeight(r,p), 'height', patientHeight(r,p), true],
    ['BMI', patientBMI(r,p), 'examDate', dt(r.created_at), false],
    ['department', 'Diabetic Retinopathy Screening System', 'disease', patientDisease(r,p), true],
    ['doctor', examiner, 'allergy', patientAllergy(r,p), true]
  ].map(row => {
    const leftLabel = row[4] ? tr(row[0]) : row[0];
    const rightLabel = tr(row[2]);
    return '<tr><td><b>' + esc(leftLabel) + ' :</b> ' + esc(row[1]) + '</td><td><b>' + esc(rightLabel) + ' :</b> ' + esc(row[3]) + '</td></tr>';
  }).join('');

  return `
  <div class="WordSection1">
    <table class="wHead" cellspacing="0" cellpadding="0">
      <tr>
        <td class="wLogoCell">${logoSrc ? `<img class="wLogo" src="${esc(logoSrc)}" width="46" height="46" style="width:46pt;height:46pt;object-fit:contain;">` : ""}</td>
        <td class="wTitleCell">
          <div class="wTitle">${esc(tr("reportTitle"))}</div>
          <div class="wSub">${esc(tr("screeningTitle"))}</div>
          <div class="wOrg">${esc(tr("orgName"))}</div>
        </td>
        <td class="wQrCell">
          <div class="wSmall">${esc(tr("reportNo"))}</div>
          <div class="wCode">${esc(reportNoOf(r))}</div>
          <div class="wCode">${esc(patientCodeOf(r,p))}</div>
          ${qrSrc ? `<img class="wQr" src="${esc(qrSrc)}" width="60" height="60" style="width:60pt;height:60pt;object-fit:contain;">` : ""}<br>
          <span class="wTiny">${esc(tr("onlineScan"))}</span>
        </td>
      </tr>
    </table>

    <table class="wInfo" cellspacing="0" cellpadding="0">${infoRows}</table>

    <table class="wResult" cellspacing="0" cellpadding="0">
      <tr>
        <th class="cImg" style="width:90pt">${esc(tr("image"))}</th>
        <th class="cResult" style="width:75pt">${esc(tr("result"))}</th>
        <th class="cConf" style="width:70pt">${esc(tr("confidence"))}</th>
        <th class="cScreen" style="width:48pt">${esc(tr("screeningResult"))}</th>
        <th>${esc(tr("note"))}</th>
      </tr>
      <tr>
        <td>${imgTag}<div class="wCaption">ภาพที่ 1</div></td>
        <td><b>${esc(r.severity_result)}</b><br>${esc(sev(r.severity_result))}</td>
        <td><b>Severity:</b> ${esc(pct(r.confidence || r.severity_confidence))}<br><b>Binary:</b> ${esc(pct(r.binary_confidence))}</td>
        <td><b>${esc(screening)}</b></td>
        <td>${esc(note)}</td>
      </tr>
    </table>

    <div class="wSummary">
      <b>${esc(tr("summary"))}</b>
      <p>${esc((lang === "th" ? "ผลการคัดกรองโดย AI พบว่า: " : "AI screening result: ") + sev(r.severity_result))}</p>
      <p>${esc(note)}</p>
    </div>

    <table class="wSign" cellspacing="0" cellpadding="0">
      <tr>
        <td><div class="wLine"></div><b>${esc(tr("reporter"))}</b><br>(${esc(examiner)})</td>
        <td><div class="wLine"></div><b>${esc(tr("reviewer"))}</b><br>(............................)</td>
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
  renderPaper(selected);
  await waitForPaperImages();
  const body = await wordPaperHTML(selected);
  const content = '<!doctype html><html><head><meta charset="utf-8"><title>DR Report</title><style>' + WORD_CSS + '</style></head><body>' + body + '</body></html>';
  const blob = new Blob(["\ufeff" + content], {type:"application/msword;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "DR_Report_" + val(patientCodeOf(selected, patientOf(selected))) + "_" + lang + ".doc";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

async function printReportPdf(){
  if(!selected){
    alert(tr("selectReport"));
    return;
  }
  await resolveImage(selected);
  renderPaper(selected);
  await waitForPaperImages();
  setTimeout(() => window.print(), 150);
}

window.exportDoc = exportDoc;
window.printReportPdf = printReportPdf;

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
  if(pdfBtn) pdfBtn.onclick = printReportPdf;

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
