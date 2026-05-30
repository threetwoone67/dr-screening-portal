// sidebar.js - sidebar กลางทุกหน้า ยกเว้นหน้า login/register/reset
(function(){
  const publicPages = ['index.html','register.html','forgot-password.html','reset-password.html'];
  function page(){ return (location.pathname.split('/').pop() || 'index.html').toLowerCase(); }
  function isPublic(){ return publicPages.includes(page()); }
  function link(labelKey, href, icon, cls=''){
    const active = page() === href.toLowerCase() || (href==='dashboard.html' && page()==='dashboard.html') || cls;
    return `<a class="dr-nav-link ${active ? 'active':''}" href="${href}"><span>${icon}</span><span data-i18n="${labelKey}">${window.t ? t(labelKey) : labelKey}</span></a>`;
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
        <div class="dr-nav-group"><div class="dr-nav-label" data-i18n="screening">${t('screening')}</div>
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
      <div class="dr-sidebar-footer"><div class="dr-org">${window.DR_CONFIG ? window.DR_CONFIG.ORG_NAME_TH : 'KMUTNB'}</div><button onclick="DR_AUTH.logout()" data-i18n="logout">${t('logout')}</button></div>
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
      @media(max-width:900px){body.has-dr-sidebar{padding-left:0!important}#drSidebarHost.dr-sidebar,.dr-sidebar{position:fixed!important;left:0!important;top:0!important;bottom:auto!important;width:min(84vw,310px)!important;max-width:310px!important;height:100dvh!important;min-height:100dvh!important;overflow-y:auto!important;transform:translateX(-105%)!important;transition:transform .25s ease!important;z-index:99995!important;box-shadow:16px 0 40px rgba(15,23,42,.22)!important}body.sidebar-open #drSidebarHost.dr-sidebar,body.sidebar-open .dr-sidebar{transform:translateX(0)!important}}
    `;
    document.head.appendChild(s);
  }
  document.addEventListener('DOMContentLoaded', ()=>{ injectStyle(); renderSidebar(); });
  document.addEventListener('dr:language-applied', ()=>{ if(!isPublic()) renderSidebar(); });
})();
/* =========================================================
   MOBILE SIDEBAR TOGGLE - FINAL
   เฉพาะมือถือเท่านั้น: Desktop/Web เดิมไม่ถูกแตะ
========================================================= */

(function () {
  const MOBILE_WIDTH = 900;
  const publicPages = ["index.html", "register.html", "forgot-password.html", "reset-password.html"];

  function currentPage() {
    return (location.pathname.split("/").pop() || "index.html").toLowerCase();
  }

  function isPublicPage() {
    return publicPages.includes(currentPage());
  }

  function findSidebar() {
    return document.querySelector(
      "#drSidebarHost, .dr-sidebar, .sidebar, aside.sidebar, .side-bar, .app-sidebar, .left-sidebar"
    );
  }

  function closeSidebar() {
    document.body.classList.remove("sidebar-open");
  }

  function toggleSidebar() {
    document.body.classList.toggle("sidebar-open");
  }

  function createMobileSidebarControl() {
    if (isPublicPage()) return;

    const sidebar = findSidebar();
    if (!sidebar) return;

    if (!document.querySelector(".mobile-sidebar-toggle")) {
      const btn = document.createElement("button");
      btn.className = "mobile-sidebar-toggle";
      btn.type = "button";
      btn.setAttribute("aria-label", "Open menu");
      btn.innerHTML = "☰";
      document.body.appendChild(btn);

      btn.addEventListener("click", toggleSidebar);
    }

    if (!document.querySelector(".mobile-sidebar-overlay")) {
      const overlay = document.createElement("div");
      overlay.className = "mobile-sidebar-overlay";
      document.body.appendChild(overlay);

      overlay.addEventListener("click", closeSidebar);
    }

    sidebar.querySelectorAll("a").forEach(function (link) {
      if (link.dataset.mobileSidebarBound === "1") return;
      link.dataset.mobileSidebarBound = "1";

      link.addEventListener("click", function () {
        if (window.innerWidth <= MOBILE_WIDTH) closeSidebar();
      });
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSidebar();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > MOBILE_WIDTH) closeSidebar();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(createMobileSidebarControl, 0);
    });
  } else {
    setTimeout(createMobileSidebarControl, 0);
  }

  document.addEventListener("dr:language-applied", function () {
    setTimeout(createMobileSidebarControl, 50);
  });
})();
