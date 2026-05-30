// sidebar.js - sidebar กลางทุกหน้า ยกเว้นหน้า login/register/reset
(function(){
  const publicPages = ['index.html','register.html','forgot-password.html','reset-password.html','report-view.html'];
  function page(){ return (location.pathname.split('/').pop() || 'index.html').toLowerCase(); }
  function isPublic(){ return publicPages.includes(page()); }
  function safeT(key){ return window.t ? window.t(key) : key; }
  function link(labelKey, href, icon, cls=''){
    const active = page() === href.toLowerCase() || (href==='dashboard.html' && page()==='dashboard.html') || cls;
    return `<a class="dr-nav-link ${active ? 'active':''}" href="${href}"><span>${icon}</span><span data-i18n="${labelKey}">${safeT(labelKey)}</span></a>`;
  }
  function renderSidebar(){
    if (isPublic()) return;
    let host = document.getElementById('drSidebarHost');
    if (!host) {
      host = document.createElement('aside');
      host.id = 'drSidebarHost';
      document.body.prepend(host);
      document.body.classList.add('has-dr-sidebar');
    }
    host.className = 'dr-sidebar';
    host.innerHTML = `
      <div class="dr-brand"><div class="dr-logo">DR</div><div><b>Diabetic<br>Retinopathy</b><small>DR Screening Portal</small></div></div>
      <nav class="dr-nav">
        ${link('home','dashboard.html','🏠')}
        ${link('account','dashboard.html#profile','👤')}
        ${link('patients','dashboard.html#patients','👥')}
        <div class="dr-nav-group"><div class="dr-nav-label" data-i18n="screening">${safeT('screening')}</div>
          ${link('createNewPatient','dashboard.html#newPatient','➕')}
          ${link('retinaAnalysis','retina-analysis.html','🔬')}
          ${link('report','retina-report-new.html','📄')}
          ${link('appointment','appointment-followup.html','📅')}
        </div>
        ${link('transfer','patient-transfer.html','🔁')}
        ${link('knowledge','knowledge-dr.html','💡')}
        ${link('history','patient-history.html','🕘')}
        ${link('settings','settings.html','⚙️')}
      </nav>
      <div class="dr-sidebar-footer"><div class="dr-org">${window.DR_CONFIG ? window.DR_CONFIG.ORG_NAME_TH : 'KMUTNB'}</div><button onclick="DR_AUTH.logout()" data-i18n="logout">${safeT('logout')}</button></div>
    `;
    window.applyLanguage && window.applyLanguage();
  }
  function injectStyle(){
    if(document.getElementById('drSidebarStyle')) return;
    const s=document.createElement('style'); s.id='drSidebarStyle';
    s.textContent=`
      body.has-dr-sidebar{padding-left:240px!important;}
      .dr-sidebar{position:fixed;left:0;top:0;bottom:0;width:240px;background:#fff;border-right:1px solid #e5edf8;padding:18px 14px;z-index:50;display:flex;flex-direction:column;gap:18px;box-sizing:border-box;font-family:Inter,system-ui,'Segoe UI',sans-serif;color:#17345d}
      .dr-brand{display:flex;gap:12px;align-items:center;border-bottom:1px solid #e5edf8;padding-bottom:16px}.dr-logo{width:38px;height:38px;border-radius:12px;background:#eef5ff;display:grid;place-items:center;font-weight:900;color:#1d4ed8}.dr-brand small{display:block;color:#7890ad;font-size:11px;margin-top:3px}.dr-nav{display:flex;flex-direction:column;gap:8px}.dr-nav-link{display:flex;align-items:center;gap:12px;text-decoration:none;color:#55708f;font-weight:800;padding:12px 14px;border-radius:14px}.dr-nav-link:hover{background:#f4f7fb;color:#1d4ed8}.dr-nav-link.active{background:#2f5be8;color:#fff;box-shadow:0 8px 20px rgba(47,91,232,.22)}.dr-nav-group{border-left:2px solid #e5edf8;margin-left:10px;padding-left:8px}.dr-nav-label{font-size:12px;color:#8aa0ba;font-weight:900;margin:6px 0 4px}.dr-sidebar-footer{margin-top:auto}.dr-org{font-size:11px;line-height:1.35;color:#617998;background:#f8fbff;border:1px solid #e5edf8;border-radius:14px;padding:12px;margin-bottom:10px}.dr-sidebar-footer button{width:100%;border:1px solid #fecaca;background:#fff;color:#dc2626;border-radius:14px;padding:11px;font-weight:900;cursor:pointer}
      @media(max-width:900px){body.has-dr-sidebar{padding-left:0!important}#drSidebarHost.dr-sidebar,.dr-sidebar{display:none!important;visibility:hidden!important;pointer-events:none!important}}
    `;
    document.head.appendChild(s);
  }
  document.addEventListener('DOMContentLoaded', ()=>{ injectStyle(); renderSidebar(); });
  document.addEventListener('dr:language-applied', ()=>{ if(!isPublic()) renderSidebar(); });
})();

/* =========================================================
   MOBILE APP SHELL v1 - READY
   มือถือใช้ Bottom Navigation / Desktop ไม่เปลี่ยน
========================================================= */
(function () {
  const mobileSkipPages = [
    "index.html",
    "register.html",
    "forgot-password.html",
    "reset-password.html",
    "report-view.html"
  ];

  function currentPage() {
    return (location.pathname.split("/").pop() || "index.html").toLowerCase();
  }

  function shouldSkipMobileShell() {
    return mobileSkipPages.includes(currentPage()) ||
      (document.body && document.body.getAttribute("data-report-view") === "true");
  }

  function currentLang() {
    const lang =
      localStorage.getItem("dr_language") ||
      localStorage.getItem("dr_lang") ||
      localStorage.getItem("language") ||
      localStorage.getItem("site_language") ||
      localStorage.getItem("app_language") ||
      "th";
    return lang === "en" ? "en" : "th";
  }

  function txt(th, en) {
    return currentLang() === "en" ? en : th;
  }

  function closeMore() {
    document.body.classList.remove("dr-mobile-more-open");
  }

  function openMore() {
    document.body.classList.add("dr-mobile-more-open");
  }

  function goTo(url) {
    closeMore();
    location.href = url;
  }

  function activeClass(matchList) {
    const p = currentPage();
    return matchList.includes(p) ? "active" : "";
  }

  function removeMobileShell() {
    const nav = document.querySelector(".dr-mobile-bottom-nav");
    const overlay = document.querySelector(".dr-mobile-more-overlay");
    const sheet = document.querySelector(".dr-mobile-more-sheet");
    if (nav) nav.remove();
    if (overlay) overlay.remove();
    if (sheet) sheet.remove();
    document.body.classList.remove("dr-mobile-more-open");
  }

  function createBottomNav() {
    if (shouldSkipMobileShell()) {
      removeMobileShell();
      return;
    }

    document.body.classList.add("dr-mobile-shell");

    if (!document.querySelector(".dr-mobile-bottom-nav")) {
      const nav = document.createElement("nav");
      nav.className = "dr-mobile-bottom-nav";
      nav.innerHTML = `
        <button class="dr-mobile-nav-item ${activeClass(["dashboard.html"])}" data-go="dashboard.html" type="button">
          <span>🏠</span><small>${txt("หน้าหลัก", "Home")}</small>
        </button>

        <button class="dr-mobile-nav-item ${activeClass(["patients.html", "create-patient.html"])}" data-go="patients.html" type="button">
          <span>👥</span><small>${txt("ผู้ป่วย", "Patients")}</small>
        </button>

        <button class="dr-mobile-nav-item primary ${activeClass(["retina-analysis.html"])}" data-go="retina-analysis.html" type="button">
          <span>🔬</span><small>${txt("ตรวจ", "Analyze")}</small>
        </button>

        <button class="dr-mobile-nav-item ${activeClass(["retina-report-new.html"])}" data-go="retina-report-new.html" type="button">
          <span>📄</span><small>${txt("รายงาน", "Report")}</small>
        </button>

        <button class="dr-mobile-nav-item" data-more="true" type="button">
          <span>☰</span><small>${txt("เพิ่มเติม", "More")}</small>
        </button>
      `;
      document.body.appendChild(nav);

      nav.addEventListener("click", function (e) {
        const btn = e.target.closest(".dr-mobile-nav-item");
        if (!btn) return;

        if (btn.dataset.more) {
          openMore();
          return;
        }

        if (btn.dataset.go) {
          goTo(btn.dataset.go);
        }
      });
    }

    if (!document.querySelector(".dr-mobile-more-overlay")) {
      const overlay = document.createElement("div");
      overlay.className = "dr-mobile-more-overlay";
      overlay.addEventListener("click", closeMore);
      document.body.appendChild(overlay);
    }

    if (!document.querySelector(".dr-mobile-more-sheet")) {
      const sheet = document.createElement("div");
      sheet.className = "dr-mobile-more-sheet";
      sheet.innerHTML = `
        <div class="dr-mobile-more-title">${txt("เมนูเพิ่มเติม", "More Menu")}</div>
        <div class="dr-mobile-more-grid">
          <a class="dr-mobile-more-link" href="dashboard.html#profile">👤 ${txt("บัญชีผู้ใช้", "Account")}</a>
          <a class="dr-mobile-more-link" href="create-patient.html">➕ ${txt("สร้างผู้ป่วย", "New Patient")}</a>
          <a class="dr-mobile-more-link" href="appointment-followup.html">📅 ${txt("นัดหมาย", "Appointment")}</a>
          <a class="dr-mobile-more-link" href="patient-transfer.html">🔁 ${txt("โอนย้าย", "Transfer")}</a>
          <a class="dr-mobile-more-link" href="patient-history.html">🕘 ${txt("ประวัติ", "History")}</a>
          <a class="dr-mobile-more-link" href="knowledge-dr.html">💡 ${txt("ความรู้", "Knowledge")}</a>
          <a class="dr-mobile-more-link" href="settings.html">⚙️ ${txt("ตั้งค่า", "Settings")}</a>
          <button class="dr-mobile-more-logout" type="button" id="drMobileLogout">🚪 ${txt("ออกจากระบบ", "Logout")}</button>
        </div>
      `;
      document.body.appendChild(sheet);

      sheet.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", closeMore);
      });

      const logout = sheet.querySelector("#drMobileLogout");
      if (logout) {
        logout.addEventListener("click", async function () {
          try {
            if (window.DR_AUTH && typeof window.DR_AUTH.logout === "function") {
              await window.DR_AUTH.logout();
            } else if (window.db && window.db.auth) {
              await window.db.auth.signOut();
              location.href = "index.html";
            } else {
              location.href = "index.html";
            }
          } catch (e) {
            location.href = "index.html";
          }
        });
      }
    }
  }

  function refreshMobileLabels() {
    removeMobileShell();
    createBottomNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createBottomNav);
  } else {
    createBottomNav();
  }

  document.addEventListener("dr:language-applied", function () {
    if (!shouldSkipMobileShell()) {
      setTimeout(refreshMobileLabels, 50);
    }
  });

  window.addEventListener("pageshow", function () {
    setTimeout(createBottomNav, 80);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMore();
  });
})();
