// admin-core.js - fixed for current Supabase project
const supabaseUrl = "https://pncgbphbcmtlzrmwnhcy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuY2dicGhiY210bHpybXduaGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyODEwOTksImV4cCI6MjA5NDg1NzA5OX0.-JS7vYBzMJYybm5QA4RxKUA5rTa5ibR2_40W73PPYso";

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAIL = "kchalima0@gmail.com";

function safeParse(key, fallback) {
try {
const data = localStorage.getItem(key);
return data ? JSON.parse(data) : fallback;
} catch (error) {
localStorage.removeItem(key);
return fallback;
}
}

let admins = safeParse("dr_admins", [
{
id: Date.now(),
name: "Chalima",
email: "kchalima0@gmail.com",
phone: "-",
role: "Super Admin"
}
]);

let users = safeParse("users", []);
let patients = [];
let visits = [];
let recovery = safeParse("dr_recovery", []);

const translations = {
th: {
portal: "ระบบผู้ดูแล",
dashboard: "หน้าหลัก",
admins: "บัญชีผู้ใช้แอดมิน",
users: "บัญชีผู้ใช้งาน",
patients: "บัญชีผู้ป่วย",
recovery: "การกู้คืน",
settings: "การตั้งค่า",
logout: "ออกจากระบบ"
},
en: {
portal: "Admin Portal",
dashboard: "Dashboard",
admins: "Admin Accounts",
users: "User Accounts",
patients: "Patient Accounts",
recovery: "Recovery",
settings: "Settings",
logout: "Logout"
}
};

function getLang() {
  const v = localStorage.getItem("admin_language") || localStorage.getItem("dr_lang") || "th";
  return String(v).toLowerCase().startsWith("en") ? "en" : "th";
}

function tAdmin(key) {
const lang = getLang();
return translations[lang]?.[key] || translations.th[key] || key;
}

function saveAll() {
localStorage.setItem("dr_admins", JSON.stringify(admins));
localStorage.setItem("users", JSON.stringify(users));
localStorage.setItem("dr_recovery", JSON.stringify(recovery));
}

async function checkAdmin() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error || !data || !data.session) {
    window.location.href = "index.html";
    return false;
  }

  const user = data.session.user;
  const email = String(user.email || "").toLowerCase();

  let profile = null;
  try {
    const res = await supabaseClient
      .from("profiles")
      .select("id,email,role,full_name,is_active")
      .eq("id", user.id)
      .maybeSingle();
    if (!res.error && res.data) profile = res.data;
  } catch (e) {}

  if (!profile) {
    try {
      const res = await supabaseClient
        .from("profiles")
        .select("id,email,role,full_name,is_active")
        .eq("email", email)
        .maybeSingle();
      if (!res.error && res.data) profile = res.data;
    } catch (e) {}
  }

  const role = String(profile?.role || "").toLowerCase().trim().replace(/\s+/g, "_");
  const isAdmin = role === "admin" || role === "super_admin" || role === "superadmin" || email === ADMIN_EMAIL;

  if (!isAdmin) {
    window.location.href = "dashboard.html";
    return false;
  }

  try {
    if (profile?.id) {
      await supabaseClient.from("profiles").update({ last_seen_at: new Date().toISOString() }).eq("id", profile.id);
    }
  } catch (e) {}

  const adminEmail = document.getElementById("adminEmail");
  if (adminEmail) adminEmail.textContent = profile?.email || email;
  return true;
}

async function logout() {
await supabaseClient.auth.signOut();
localStorage.removeItem("admin_logged_in");
localStorage.removeItem("dr_user_role");
window.location.href = "index.html";
}

function applySavedTheme() {
const theme = localStorage.getItem("admin_theme") || "light";
document.body.classList.toggle("dark", theme === "dark");
}

function renderSidebar(activePage) {
window.__ADMIN_ACTIVE_PAGE = activePage;
const sidebar = document.getElementById("adminSidebar");
if (!sidebar) return;

sidebar.innerHTML = `
<div class="brand">
<div class="logo">DR</div>
<div>
<h2>DR Admin</h2>
<p>${tAdmin("portal")}</p>
</div>
</div>

<nav class="menu">
<a class="${activePage === "dashboard" ? "active" : ""}" href="admin-dashboard.html">🏠 ${tAdmin("dashboard")}</a>
<a class="${activePage === "admins" ? "active" : ""}" href="admin-admins.html">🛡️ ${tAdmin("admins")}</a>
<a class="${activePage === "users" ? "active" : ""}" href="admin-users.html">👥 ${tAdmin("users")}</a>
<a class="${activePage === "patients" ? "active" : ""}" href="admin-patients.html">🧑‍⚕️ ${tAdmin("patients")}</a>
<a class="${activePage === "recovery" ? "active" : ""}" href="admin-recovery.html">♻️ ${tAdmin("recovery")}</a>
<a class="${activePage === "settings" ? "active" : ""}" href="admin-settings.html">⚙️ ${tAdmin("settings")}</a>
</nav>

<button class="logout" onclick="logout()">${tAdmin("logout")}</button>
`;
}

async function loadPatientsFromSupabase() {
const { data, error } = await supabaseClient
.from("patients")
.select("*")
.order("id", { ascending: true });

if (error) {
console.error("load patients error:", error);
patients = [];
return;
}

patients = data || [];
}

async function loadVisitsFromSupabase() {
const { data, error } = await supabaseClient
.from("visits")
.select("*")
.order("id", { ascending: false });

if (error) {
console.error("load visits error:", error);
visits = [];
return;
}

visits = data || [];
}

// ---------- Admin language controls and page translation ----------
function detectAdminPage(){
  const p = location.pathname.split("/").pop();
  if(p.includes("users")) return "users";
  if(p.includes("patients")) return "patients";
  if(p.includes("recovery")) return "recovery";
  if(p.includes("settings")) return "settings";
  if(p.includes("admins")) return "admins";
  return "dashboard";
}
function setText(selector, text){
  const el = document.querySelector(selector);
  if(el && text !== undefined) el.textContent = text;
}
function setAllText(selector, list){
  document.querySelectorAll(selector).forEach((el,i)=>{
    if(list && list[i] !== undefined) el.textContent = list[i];
  });
}
function setAdminLanguage(lang){
  lang = String(lang || "th").toLowerCase().startsWith("en") ? "en" : "th";
  localStorage.setItem("admin_language", lang);
  localStorage.setItem("dr_lang", lang);
  renderSidebar(window.__ADMIN_ACTIVE_PAGE || detectAdminPage());
  applyAdminLanguage(window.__ADMIN_ACTIVE_PAGE || detectAdminPage());
}

function installAdminLanguageSelect(){
  const top = document.querySelector(".top");
  if(!top) return;
  const badge = top.querySelector(".admin-badge");
  if(!badge) return;
  let tools = top.querySelector(".admin-top-tools");
  if(!tools){
    tools = document.createElement("div");
    tools.className = "admin-top-tools";
    top.insertBefore(tools, badge);
    tools.appendChild(badge);
  }
  let sel = tools.querySelector("#adminLanguageTop");
  if(!sel){
    sel = document.createElement("select");
    sel.id = "adminLanguageTop";
    sel.className = "admin-lang-select";
    sel.innerHTML = '<option value="th">ไทย</option><option value="en">English</option>';
    sel.addEventListener("change", function(){ setAdminLanguage(this.value); });
    tools.insertBefore(sel, badge);
  }
  sel.value = getLang();
}

function applyAdminLanguage(page){
  const lang = getLang();
  document.documentElement.lang = lang;
  installAdminLanguageSelect();

  const D = {
    dashboard:{
      th:{top:["หน้าหลักผู้ดูแลระบบ","ภาพรวมข้อมูลการใช้งาน ระบบตรวจคัดกรอง และปฏิทินตรวจเช็กระบบ"], cards:["บัญชีแอดมิน","บัญชีผู้ใช้งาน","ผู้ป่วยทั้งหมด","สถานะระบบ"], h2:["กราฟการใช้งานในระบบ","ปฏิทินตรวจเช็กระบบ","กิจกรรมล่าสุด","สรุปการตรวจเช็กระบบ"], p:["แสดงจำนวนแอดมิน ผู้ใช้งาน และผู้ป่วยในระบบ","จุดสีเขียว = ตรวจระบบปกติ / จุดสีเหลือง = ควรตรวจสอบ"], btn:["‹ เดือนก่อน","เดือนถัดไป ›"]},
      en:{top:["Admin Dashboard","System usage overview, screening system, and maintenance calendar"], cards:["Admin Accounts","User Accounts","Total Patients","System Status"], h2:["System Usage Chart","System Check Calendar","Recent Activities","System Check Summary"], p:["Shows the number of admins, users, and patients in the system","Green dot = normal check / Yellow dot = needs review"], btn:["‹ Previous Month","Next Month ›"]}
    },
    users:{
      th:{top:["บัญชีผู้ใช้งาน","ภาพรวมบัญชีแพทย์และพยาบาลในระบบตรวจคัดกรอง"], cards:["ผู้ใช้งานทั้งหมด","แพทย์","พยาบาล","Active"], h2:["ภาพรวมประเภทบัญชี","สรุปสถานะการเข้าใช้งาน","รายการบัญชีผู้ใช้งาน"], p:["แสดงจำนวนผู้ใช้งานแยกเป็นแพทย์และพยาบาล","Active คำนวณจากการเปิดใช้งานเว็บล่าสุด","กดที่ชื่อผู้ใช้งานเพื่อดูข้อมูลส่วนตัว"], ths:["ชื่อ","อีเมล","เบอร์โทร","Role","สถานะ","เข้าใช้งานล่าสุด","จัดการ"]},
      en:{top:["User Accounts","Overview of doctor and nurse accounts in the screening system"], cards:["Total Users","Doctors","Nurses","Active"], h2:["Account Type Overview","Login Status Summary","User Account List"], p:["Shows users separated by doctor and nurse roles","Active is calculated from latest web activity","Click a user name to view profile details"], ths:["Name","Email","Phone","Role","Status","Last Seen","Actions"]}
    },
    patients:{
      th:{top:["บัญชีผู้ป่วย","ดูข้อมูลผู้ป่วย สถิติ และประวัติการตรวจ"], stats:["ผู้ป่วยทั้งหมด","ชาย","หญิง","อื่นๆ","จำนวนการตรวจทั้งหมด"], h2:["สถิติผู้ป่วยแยกตามเพศ","สถิติระดับเบาหวานขึ้นจอประสาทตา","รายการผู้ป่วย"], p:["กดดูประวัติเพื่อดูข้อมูลผู้ป่วยและประวัติการตรวจ"], ths:["ชื่อ","HN","อายุ","เพศ","รหัสผู้ป่วย","จัดการ"]},
      en:{top:["Patient Accounts","View patient data, statistics, and screening history"], stats:["Total Patients","Male","Female","Other","Total Visits"], h2:["Patient Gender Statistics","DR Severity Statistics","Patient List"], p:["Click history to view patient information and screening records"], ths:["Name","HN","Age","Sex","Patient Code","Actions"]}
    },
    recovery:{
      th:{top:["การกู้คืนข้อมูล","ดูรายการที่ถูกลบ แยกประเภท พร้อมกู้คืนหรือลบถาวร"], cards:["รายการที่ถูกลบทั้งหมด","แอดมินที่ถูกลบ","ผู้ใช้งานที่ถูกลบ","ผู้ป่วยที่ถูกลบ"], h2:["รายการข้อมูลที่ถูกลบ"], p:["สามารถตรวจสอบรายละเอียดก่อนกู้คืนได้ เพื่อป้องกันการลบผิด"], tabs:["ทั้งหมด","แอดมิน","ผู้ใช้งาน","ผู้ป่วย"], ths:["ประเภท","ชื่อ / ข้อมูลหลัก","อีเมล / HN","ข้อมูลสำคัญ","วันที่ลบ","จัดการ"]},
      en:{top:["Recovery","View deleted records by type, restore them, or delete permanently"], cards:["Total Deleted Records","Deleted Admins","Deleted Users","Deleted Patients"], h2:["Deleted Records"], p:["Review details before restoring data to prevent mistakes"], tabs:["All","Admins","Users","Patients"], ths:["Type","Name / Main Data","Email / HN","Important Info","Deleted Date","Actions"]}
    },
    settings:{
      th:{top:["การตั้งค่า","ปรับแต่งโหมดสว่าง / มืด และภาษาในส่วนแอดมิน"], h2:["โหมดการแสดงผล","ภาษา","ข้อมูลระบบ"], p:["เลือกโหมดสว่างหรือโหมดมืดสำหรับหน้าแอดมิน","เลือกภาษาสำหรับเมนูและข้อความในหน้าแอดมิน"], btn:["บันทึกโหมด","บันทึกภาษา"]},
      en:{top:["Settings","Customize light/dark mode and language for admin pages"], h2:["Display Mode","Language","System Information"], p:["Choose light or dark mode for admin pages","Choose language for admin menu and page text"], btn:["Save Mode","Save Language"]}
    },
    admins:{
      th:{top:["บัญชีผู้ใช้แอดมิน","จัดการสิทธิ์ผู้ดูแลระบบจาก Supabase ตาราง profiles"], h2:["เพิ่ม / แก้ไข สิทธิ์แอดมิน","วิธีสร้าง Admin คนแรก","รายการบัญชีแอดมินทั้งหมด"], p:["โหลดจาก Supabase profiles ที่ role เป็น admin / super_admin"], ths:["ชื่อ","อีเมล","เบอร์โทร","สิทธิ์","สถานะ","จัดการ"]},
      en:{top:["Admin Accounts","Manage administrator permissions from Supabase profiles"], h2:["Add / Edit Admin Permission","How to Create the First Admin","All Admin Accounts"], p:["Loaded from Supabase profiles where role is admin / super_admin"], ths:["Name","Email","Phone","Permission","Status","Actions"]}
    }
  };

  const d = (D[page] || D[detectAdminPage()] || {})[lang];
  if(!d) return;

  if(d.top){ setText(".top h1", d.top[0]); setText(".top p", d.top[1]); }
  if(d.cards) setAllText(".cards .card h3", d.cards);
  if(d.stats) setAllText(".stats-grid .stat-card h3", d.stats);
  if(d.h2) setAllText(".panel h2, .form-box h2, .chart-box h2", d.h2);
  if(d.p) setAllText(".panel > p, .form-box > p", d.p);
  if(d.tabs) setAllText(".recovery-tabs button", d.tabs);
  if(d.ths) setAllText("thead th", d.ths);

  const langSelect = document.getElementById("languageSelect");
  if(langSelect) langSelect.value = lang;
  const topSelect = document.getElementById("adminLanguageTop");
  if(topSelect) topSelect.value = lang;
}

document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  setTimeout(() => applyAdminLanguage(window.__ADMIN_ACTIVE_PAGE || detectAdminPage()), 80);
});
