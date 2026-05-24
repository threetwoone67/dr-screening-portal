// settings-global.js - Global theme + shared settings for every page
// ใส่ไฟล์นี้ทุกหน้า เพื่อให้โหมดมืด/สว่างทำงานทั้งหน้า รวม sidebar, card, input, table
(function () {
  const THEME_KEY = "dr_theme";

  function getTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "dark" ? "dark" : "light";
  }

  function setTheme(theme) {
    theme = theme === "dark" ? "dark" : "light";
    localStorage.setItem(THEME_KEY, theme);
    applyTheme();
  }

  function toggleTheme() {
    setTheme(getTheme() === "dark" ? "light" : "dark");
  }

  function applyTheme() {
    const theme = getTheme();
    document.documentElement.setAttribute("data-theme", theme);
    document.body.classList.toggle("dark-mode", theme === "dark");
    document.body.classList.toggle("light-mode", theme !== "dark");

    document.querySelectorAll("[data-theme-label]").forEach(el => {
      const isDark = theme === "dark";
      el.textContent = isDark
        ? (window.t ? t("lightMode") : "โหมดสว่าง")
        : (window.t ? t("darkMode") : "โหมดมืด");
    });

    document.querySelectorAll("[data-theme-status], #themeStatus").forEach(el => {
      el.textContent = theme === "dark" ? "Dark" : "Light";
    });
  }

  function installGlobalThemeCss() {
    if (document.getElementById("dr-global-theme-style")) return;
    const style = document.createElement("style");
    style.id = "dr-global-theme-style";
    style.textContent = `
      :root{
        --dr-bg:#f3f7ff;--dr-panel:#ffffff;--dr-panel-2:#f8fbff;--dr-text:#122b4d;--dr-muted:#64748b;
        --dr-border:#e5edf8;--dr-primary:#2f5be8;--dr-shadow:0 8px 28px rgba(29,78,216,.06);
      }
      [data-theme="dark"]{
        --dr-bg:#07111f;--dr-panel:#101c2e;--dr-panel-2:#16243a;--dr-text:#eaf2ff;--dr-muted:#9fb3cc;
        --dr-border:#253957;--dr-primary:#6285ff;--dr-shadow:0 10px 34px rgba(0,0,0,.32);
        color-scheme:dark;
      }
      html[data-theme="dark"], html[data-theme="dark"] body{background:var(--dr-bg)!important;color:var(--dr-text)!important;}
      html[data-theme="dark"] main, html[data-theme="dark"] .main, html[data-theme="dark"] .content, html[data-theme="dark"] .page, html[data-theme="dark"] .page-content{background:var(--dr-bg)!important;color:var(--dr-text)!important;}
      html[data-theme="dark"] .sidebar, html[data-theme="dark"] aside, html[data-theme="dark"] nav.sidebar, html[data-theme="dark"] #sidebar{
        background:#081425!important;color:var(--dr-text)!important;border-color:var(--dr-border)!important;
      }
      html[data-theme="dark"] .sidebar *, html[data-theme="dark"] aside *, html[data-theme="dark"] #sidebar *{color:inherit;}
      html[data-theme="dark"] .sidebar a, html[data-theme="dark"] aside a, html[data-theme="dark"] #sidebar a{color:var(--dr-muted)!important;}
      html[data-theme="dark"] .sidebar a.active, html[data-theme="dark"] aside a.active, html[data-theme="dark"] #sidebar a.active,
      html[data-theme="dark"] .nav-item.active, html[data-theme="dark"] .menu-item.active{
        background:linear-gradient(135deg,#3158ff,#2444d8)!important;color:#fff!important;
      }
      html[data-theme="dark"] .card, html[data-theme="dark"] .panel, html[data-theme="dark"] .box, html[data-theme="dark"] .stat-card,
      html[data-theme="dark"] .history-card, html[data-theme="dark"] .transfer-card, html[data-theme="dark"] section:not(.hero){
        background:var(--dr-panel)!important;color:var(--dr-text)!important;border-color:var(--dr-border)!important;box-shadow:var(--dr-shadow)!important;
      }
      html[data-theme="dark"] input, html[data-theme="dark"] select, html[data-theme="dark"] textarea{
        background:#0c1829!important;color:var(--dr-text)!important;border-color:var(--dr-border)!important;
      }
      html[data-theme="dark"] input::placeholder, html[data-theme="dark"] textarea::placeholder{color:#8294ad!important;}
      html[data-theme="dark"] table, html[data-theme="dark"] tr, html[data-theme="dark"] td, html[data-theme="dark"] th{color:var(--dr-text)!important;border-color:var(--dr-border)!important;}
      html[data-theme="dark"] .muted, html[data-theme="dark"] small, html[data-theme="dark"] .subtitle{color:var(--dr-muted)!important;}
      html[data-theme="dark"] button{border-color:var(--dr-border);}
      html[data-theme="dark"] .kmutnb-sidebar-brand{background:rgba(255,255,255,.05)!important;border-color:var(--dr-border)!important;}
      html[data-theme="dark"] .kmutnb-text b{color:var(--dr-text)!important;} html[data-theme="dark"] .kmutnb-text span{color:var(--dr-muted)!important;}
    `;
    document.head.appendChild(style);
  }

  function bindThemeButtons() {
    document.querySelectorAll("[data-theme-toggle], #themeToggleBtn").forEach(btn => {
      if (btn.dataset.themeBound === "1") return;
      btn.dataset.themeBound = "1";
      btn.addEventListener("click", toggleTheme);
    });
  }

  function init() {
    installGlobalThemeCss();
    applyTheme();
    bindThemeButtons();

    // ถ้า sidebar ถูก render ใหม่ภายหลัง ให้ theme/lang ตามอีกครั้ง
    setTimeout(() => {
      applyTheme();
      if (window.applyLanguage) window.applyLanguage();
    }, 80);
  }

  window.DR_SETTINGS = {
    getTheme, setTheme, toggleTheme, applyTheme,
    getSavedLang: () => window.getLang ? window.getLang() : (localStorage.getItem("dr_language") || "th")
  };

  document.addEventListener("DOMContentLoaded", init);
})();
