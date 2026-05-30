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
      @media(max-width:900px){body.has-dr-sidebar{padding-left:0!important}#drSidebarHost.dr-sidebar,.dr-sidebar{position:fixed!important;left:0!important;top:0!important;bottom:auto!important;width:min(86vw,320px)!important;max-width:320px!important;height:100dvh!important;min-height:100dvh!important;overflow-y:auto!important;transform:translate3d(-110%,0,0)!important;transition:transform .25s ease!important;z-index:99995!important;box-shadow:16px 0 40px rgba(15,23,42,.22)!important;background:#fff!important}body.sidebar-open #drSidebarHost.dr-sidebar,body.sidebar-open .dr-sidebar{transform:translate3d(0,0,0)!important}}
    `;
    document.head.appendChild(s);
  }
  document.addEventListener('DOMContentLoaded', ()=>{ injectStyle(); renderSidebar(); });
  document.addEventListener('dr:language-applied', ()=>{ if(!isPublic()) renderSidebar(); });
})();
/* =========================================================
   MOBILE SIDEBAR TOGGLE - FINAL HARD FIX
   ใช้เฉพาะมือถือเท่านั้น ไม่แตะ Desktop/Web เดิม
========================================================= */

(function () {
  const MOBILE_WIDTH = 900;
  const publicPages = ["index.html", "register.html", "forgot-password.html", "reset-password.html", "report-view.html"];
  const sidebarSelector = [
    "#drSidebarHost",
    "#sidebar",
    ".dr-sidebar",
    ".sidebar",
    "aside.sidebar",
    ".side-bar",
    ".app-sidebar",
    ".left-sidebar",
    ".sidenav",
    ".side-nav",
    ".sidebar-menu"
  ].join(", ");

  function currentPage() {
    return (location.pathname.split("/").pop() || "index.html").toLowerCase();
  }

  function isPublicPage() {
    return publicPages.includes(currentPage());
  }

  function isMobileLike() {
    const ua = navigator.userAgent || "";
    return window.innerWidth <= MOBILE_WIDTH ||
      (window.screen && window.screen.width <= MOBILE_WIDTH) ||
      /Android|iPhone|iPad|iPod|Mobile|Line\//i.test(ua) ||
      (window.matchMedia && window.matchMedia("(hover: none) and (pointer: coarse)").matches);
  }

  function ensureViewportForMobile() {
    if (!isMobileLike()) return;
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "viewport");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "width=device-width, initial-scale=1, viewport-fit=cover");
  }

  function getSidebars() {
    return Array.from(document.querySelectorAll(sidebarSelector)).filter(function (el) {
      if (!el || el.classList.contains("mobile-sidebar-toggle") || el.classList.contains("mobile-sidebar-overlay")) return false;
      const text = (el.textContent || "").toLowerCase();
      return el.id === "drSidebarHost" ||
        el.classList.contains("dr-sidebar") ||
        el.className.toString().toLowerCase().includes("sidebar") ||
        text.includes("retinopathy") ||
        text.includes("screening") ||
        text.includes("patient") ||
        text.includes("report");
    });
  }

  function injectMobileStyle() {
    if (document.getElementById("drMobileHardFixStyle")) return;
    const s = document.createElement("style");
    s.id = "drMobileHardFixStyle";
    s.textContent = `
      .mobile-sidebar-toggle,.mobile-sidebar-overlay{display:none}

      html.dr-mobile body{overflow-x:hidden!important}
      html.dr-mobile body.has-dr-sidebar{padding-left:0!important}

      html.dr-mobile .mobile-sidebar-toggle{
        display:inline-flex!important;
        position:fixed!important;
        top:calc(12px + env(safe-area-inset-top, 0px))!important;
        left:14px!important;
        z-index:2147483647!important;
        width:46px!important;
        height:46px!important;
        border:0!important;
        border-radius:14px!important;
        align-items:center!important;
        justify-content:center!important;
        background:#ffffff!important;
        color:#173764!important;
        box-shadow:0 8px 24px rgba(15,23,42,.20)!important;
        font-size:24px!important;
        font-weight:900!important;
        line-height:1!important;
        cursor:pointer!important;
        -webkit-tap-highlight-color:transparent!important;
      }

      html.dr-mobile .mobile-sidebar-overlay{
        display:none!important;
        position:fixed!important;
        inset:0!important;
        z-index:2147483645!important;
        background:rgba(15,23,42,.45)!important;
        backdrop-filter:blur(2px)!important;
      }

      html.dr-mobile body.sidebar-open .mobile-sidebar-overlay{display:block!important}

      html.dr-mobile #drSidebarHost,
      html.dr-mobile #sidebar,
      html.dr-mobile .dr-sidebar,
      html.dr-mobile .sidebar,
      html.dr-mobile aside.sidebar,
      html.dr-mobile .side-bar,
      html.dr-mobile .app-sidebar,
      html.dr-mobile .left-sidebar,
      html.dr-mobile .sidenav,
      html.dr-mobile .side-nav,
      html.dr-mobile .sidebar-menu{
        position:fixed!important;
        top:0!important;
        left:0!important;
        right:auto!important;
        bottom:auto!important;
        z-index:2147483646!important;
        width:min(86vw, 320px)!important;
        max-width:320px!important;
        height:100dvh!important;
        min-height:100dvh!important;
        overflow-y:auto!important;
        -webkit-overflow-scrolling:touch!important;
        transform:translate3d(-115%,0,0)!important;
        transition:transform .24s ease!important;
        box-shadow:16px 0 40px rgba(15,23,42,.24)!important;
        background:#fff!important;
      }

      html.dr-mobile body.sidebar-open #drSidebarHost,
      html.dr-mobile body.sidebar-open #sidebar,
      html.dr-mobile body.sidebar-open .dr-sidebar,
      html.dr-mobile body.sidebar-open .sidebar,
      html.dr-mobile body.sidebar-open aside.sidebar,
      html.dr-mobile body.sidebar-open .side-bar,
      html.dr-mobile body.sidebar-open .app-sidebar,
      html.dr-mobile body.sidebar-open .left-sidebar,
      html.dr-mobile body.sidebar-open .sidenav,
      html.dr-mobile body.sidebar-open .side-nav,
      html.dr-mobile body.sidebar-open .sidebar-menu{
        transform:translate3d(0,0,0)!important;
      }

      html.dr-mobile main,
      html.dr-mobile .main,
      html.dr-mobile .content,
      html.dr-mobile .main-content,
      html.dr-mobile .page,
      html.dr-mobile .page-content,
      html.dr-mobile .dashboard,
      html.dr-mobile .app-main,
      html.dr-mobile .container{
        margin-left:0!important;
        width:100%!important;
        max-width:100%!important;
      }

      html.dr-mobile .topbar,
      html.dr-mobile .header,
      html.dr-mobile .page-header{
        padding-left:68px!important;
      }

      html:not(.dr-mobile) .mobile-sidebar-toggle,
      html:not(.dr-mobile) .mobile-sidebar-overlay{display:none!important}
    `;
    document.head.appendChild(s);
  }

  function createButtonAndOverlay() {
    if (!document.querySelector(".mobile-sidebar-toggle")) {
      const btn = document.createElement("button");
      btn.className = "mobile-sidebar-toggle";
      btn.type = "button";
      btn.setAttribute("aria-label", "Open menu");
      btn.innerHTML = "☰";
      document.body.appendChild(btn);
      btn.addEventListener("click", function () {
        document.body.classList.toggle("sidebar-open");
        forceApplyMobileState();
      });
    }

    if (!document.querySelector(".mobile-sidebar-overlay")) {
      const overlay = document.createElement("div");
      overlay.className = "mobile-sidebar-overlay";
      document.body.appendChild(overlay);
      overlay.addEventListener("click", closeSidebar);
    }
  }

  function forceApplyMobileState() {
    const mobile = isMobileLike() && !isPublicPage();
    document.documentElement.classList.toggle("dr-mobile", mobile);
    if (!mobile) {
      document.body.classList.remove("sidebar-open");
      return;
    }

    ensureViewportForMobile();
    injectMobileStyle();
    createButtonAndOverlay();

    const open = document.body.classList.contains("sidebar-open");
    getSidebars().forEach(function (el) {
      el.style.position = "fixed";
      el.style.top = "0";
      el.style.left = "0";
      el.style.right = "auto";
      el.style.bottom = "auto";
      el.style.zIndex = "2147483646";
      el.style.width = "min(86vw, 320px)";
      el.style.maxWidth = "320px";
      el.style.height = "100dvh";
      el.style.minHeight = "100dvh";
      el.style.overflowY = "auto";
      el.style.webkitOverflowScrolling = "touch";
      el.style.transition = "transform .24s ease";
      el.style.transform = open ? "translate3d(0,0,0)" : "translate3d(-115%,0,0)";
      el.style.boxShadow = "16px 0 40px rgba(15,23,42,.24)";
      el.style.background = "#fff";

      el.querySelectorAll("a").forEach(function (link) {
        if (link.dataset.mobileSidebarBound === "1") return;
        link.dataset.mobileSidebarBound = "1";
        link.addEventListener("click", closeSidebar);
      });
    });
  }

  function closeSidebar() {
    document.body.classList.remove("sidebar-open");
    forceApplyMobileState();
  }

  function bootMobileSidebar() {
    if (isPublicPage()) return;
    forceApplyMobileState();
    setTimeout(forceApplyMobileState, 150);
    setTimeout(forceApplyMobileState, 600);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSidebar();
  });

  window.addEventListener("resize", function () {
    forceApplyMobileState();
  });

  window.addEventListener("orientationchange", function () {
    setTimeout(forceApplyMobileState, 250);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootMobileSidebar);
  } else {
    bootMobileSidebar();
  }

  document.addEventListener("dr:language-applied", function () {
    setTimeout(forceApplyMobileState, 80);
  });
})();
