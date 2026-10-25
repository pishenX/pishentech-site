/* ==========================================================================
   site.js —— 把 data.js 里的内容变成页面
   --------------------------------------------------------------------------
   这个文件负责：
   1. 生成作品分类按钮和作品卡片
   2. 处理分类筛选、卡片点击、复制邮箱、手机菜单
   3. 生成关于页的近况、技能、时间线和联系方式

   一般不需要改这里；除非你想调整交互逻辑。
   ========================================================================== */

(function () {
  "use strict";

  // 读取 data.js 里的内容。如果读不到，就用空对象兜底，避免整页报错。
  const data = window.SITE_DATA || {};
  const profile = data.profile || {};
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const categories = Array.isArray(data.categories) && data.categories.length
    ? data.categories
    : [{ id: "all", name: "全部" }];
  const about = data.about || {};
  const copy = data.copy || {};

  // 小工具：选一个 / 选全部
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  // 把文字里的特殊符号转义，避免内容里的 < > 破坏页面结构
  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character]));
  }

  // 判断一个链接是不是「还没填」的占位链接
  function isPlaceholder(url) {
    return !url || url === "#" || String(url).trim() === "";
  }

  // 外链统一新窗口打开，并加上安全属性
  function externalAttrs(url) {
    return /^https?:\/\//i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : "";
  }

  // 把外部链接显示成 github.com/xxx 这种更短的文字
  function displayUrl(url) {
    return String(url || "")
      .replace(/^https?:\/\//i, "")
      .replace(/\/+$/, "");
  }

  /* ------------------------------------------------------------------------
     常用小图标（直接写成 SVG，页面加载更快，也不依赖图标库）
     ------------------------------------------------------------------------ */
  const icons = {
    arrowRight: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowUpRight: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    download: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 3v10m0 0 4-4m-4 4-4-4M4 16h12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    code: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7 6-4 4 4 4M13 6l4 4-4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    email: '<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    github: '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a10.9 10.9 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.18c0 .31.21.68.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/></svg>',
    wechat: '<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 4C5.9 4 3 6.6 3 9.8c0 1.9 1 3.5 2.7 4.6l-.7 2.2 2.5-1.2c.7.2 1.6.3 2.5.3 4.1 0 7-2.5 7-5.7S14.1 4 10 4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M17.3 9.2c2.1 0 3.7 1.4 3.7 3.3 0 1.1-.6 2.1-1.6 2.8l.4 1.4-1.6-.8c-.5.1-1 .2-1.6.2-2.2 0-3.9-1.4-3.9-3.4s1.7-3.5 4.6-3.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    layout: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M3 9h18M9 9v11" stroke="currentColor" stroke-width="1.7"/></svg>',
    server: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="6" rx="2" stroke="currentColor" stroke-width="1.7"/><rect x="3" y="14" width="18" height="6" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M7 7h.01M7 17h.01" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/></svg>',
    pen: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m4 20 1.2-5.2L16.4 3.6a2 2 0 0 1 2.8 0l1.2 1.2a2 2 0 0 1 0 2.8L9.2 18.8 4 20Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m14.5 5.5 4 4" stroke="currentColor" stroke-width="1.7"/></svg>',
    copy: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="7" y="7" width="9" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
  };

  const skillIcons = [icons.layout, icons.server, icons.pen];

  /* ------------------------------------------------------------------------
     1. 填充个人资料（姓名、头像、邮箱等）
     ------------------------------------------------------------------------ */
  function fillProfile() {
    $$("[data-profile]").forEach((element) => {
      const key = element.dataset.profile;
      if (profile[key] !== undefined && profile[key] !== null) {
        element.textContent = profile[key];
      }
    });

    $$("[data-avatar]").forEach((image) => {
      if (profile.avatar) {
        image.src = profile.avatar;
      }
      image.alt = `${profile.name || "我"}的头像`;
      // 如果头像路径写错了，退回默认头像，不让页面出现破图
      image.addEventListener("error", () => {
        if (!image.dataset.fallback) {
          image.dataset.fallback = "true";
          image.src = "assets/avatar.svg";
        }
      });
    });

    $$("[data-email-link]").forEach((link) => {
      if (profile.email) {
        link.href = `mailto:${profile.email}`;
      }
    });

    $$("[data-email-text]").forEach((element) => {
      if (profile.email) {
        element.textContent = profile.email;
      }
    });

    $$("[data-github-link]").forEach((link) => {
      if (profile.github) {
        link.href = profile.github;
        link.textContent = displayUrl(profile.github);
      }
    });

    $$("[data-copy]").forEach((element) => {
      const key = element.dataset.copy;
      if (copy[key]) {
        element.textContent = copy[key];
      }
    });

    // 左上角和页脚的品牌名也跟着 data.js 改变
    $$(".brand-text").forEach((element) => {
      if (profile.brand) {
        element.innerHTML = `${escapeHTML(profile.brand)}<span class="brand-dot">.</span>`;
      }
    });

    $$("[data-year]").forEach((element) => {
      element.textContent = new Date().getFullYear();
    });
  }

  /* ------------------------------------------------------------------------
     2. 首页统计数字
     ------------------------------------------------------------------------ */
  function fillStats() {
    const openSourceCount = projects.filter((project) => project.code && String(project.code).trim()).length;
    const stats = data.stats || {};

    $$('[data-stat="projects"]').forEach((element) => {
      element.textContent = String(projects.length).padStart(2, "0");
    });

    $$('[data-stat="opensource"]').forEach((element) => {
      element.textContent = String(openSourceCount).padStart(2, "0");
    });

    $$('[data-stat="since"]').forEach((element) => {
      element.textContent = stats.since || "2022";
    });

    const labels = {
      projects: stats.projectsLabel || "个作品",
      opensource: stats.openSourceLabel || "个已开源",
      since: stats.sinceLabel || "开始折腾"
    };

    $$("[data-stat-label]").forEach((element) => {
      const key = element.dataset.statLabel;
      if (labels[key]) {
        element.textContent = labels[key];
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. 首页作品：分类按钮 + 卡片
     ------------------------------------------------------------------------ */
  let activeCategory = "all";

  // 生成分类按钮
  function renderFilters() {
    const container = $("[data-filters]");
    if (!container) return;

    const categoryCounts = categories.map((category) => {
      if (category.id === "all") return projects.length;
      return projects.filter((project) => project.category === category.id).length;
    });

    container.innerHTML = categories.map((category, index) => {
      const isActive = category.id === activeCategory;
      return `
        <button
          class="filter-btn"
          type="button"
          data-filter="${escapeHTML(category.id)}"
          aria-pressed="${isActive}"
        >
          ${escapeHTML(category.name)}
          <span class="filter-count">${categoryCounts[index]}</span>
        </button>
      `;
    }).join("");

    container.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;

      const nextCategory = button.dataset.filter;
      if (nextCategory === activeCategory) return;

      activeCategory = nextCategory;
      $$(".filter-btn", container).forEach((item) => {
        item.setAttribute("aria-pressed", String(item.dataset.filter === activeCategory));
      });
      renderProjects();
    });
  }

  // 生成一张作品卡片的 HTML
  function projectCard(project, index) {
    const category = categories.find((item) => item.id === project.category);
    const categoryName = category ? category.name : "作品";
    const link = isPlaceholder(project.link) ? "#" : String(project.link);
    // code 留空 = 不显示按钮；填 "#" = 显示按钮但提示待补充
    const code = project.code && String(project.code).trim() ? String(project.code) : "";
    const cover = project.cover || "assets/cover-placeholder.svg";
    const title = escapeHTML(project.title || "未命名作品");
    const description = escapeHTML(project.description || "");
    const year = escapeHTML(project.year || "");
    const subtitle = project.subtitle ? `<p class="project-subtitle">${escapeHTML(project.subtitle)}</p>` : "";
    const tags = (Array.isArray(project.tags) ? project.tags : []).map((tag) => `<li class="tag">${escapeHTML(tag)}</li>`).join("");

    const primaryLabel = escapeHTML(project.linkLabel || (project.download ? "下载试用" : "查看作品"));
    const primaryIcon = project.download ? icons.download : icons.arrowUpRight;
    const primaryAttrs = isPlaceholder(project.link)
      ? 'data-placeholder="true" data-placeholder-message="这个作品正在整理中，敬请期待。"'
      : externalAttrs(link);

    const titleAttrs = isPlaceholder(project.link)
      ? 'data-placeholder="true" data-placeholder-message="这个作品正在整理中，敬请期待。"'
      : externalAttrs(link);

    // 查看代码按钮：data.js 里 code 留空，按钮就不会显示；填 "#" 会显示按钮但提示待补充
    const codeButton = code
      ? `<a class="card-btn card-btn-ghost" href="${escapeHTML(code)}" data-placeholder="${isPlaceholder(project.code) ? "true" : "false"}" data-placeholder-message="代码还在整理中，敬请期待。"${isPlaceholder(project.code) ? "" : externalAttrs(code)}>
           ${icons.code}
           ${escapeHTML(project.codeLabel || "查看代码")}
         </a>`
      : "";

    return `
      <article
        class="project-card"
        style="--i:${index}"
        data-project-card
        data-link="${escapeHTML(link)}"
        data-download="${project.download ? "true" : "false"}"
        data-project-title="${title}"
      >
        <span class="project-cover" aria-hidden="true">
          <img
            src="${escapeHTML(cover)}"
            alt="${escapeHTML(project.coverAlt || `${project.title || "作品"}的封面`)}"
            width="1200"
            height="750"
            loading="lazy"
            decoding="async"
          >
          <span class="project-type">${escapeHTML(categoryName)}</span>
          <span class="project-card-arrow">${icons.arrowUpRight}</span>
        </span>

        <div class="project-body">
          <div class="project-heading">
            <div>
              <h3 class="project-title">
                <a href="${escapeHTML(link)}" ${titleAttrs}>${title}</a>
              </h3>
              ${subtitle}
            </div>
            <span class="project-year">${year}</span>
          </div>

          <p class="project-desc">${description}</p>

          <ul class="tags" aria-label="技术标签">${tags}</ul>

          <div class="project-actions">
            <a class="card-btn card-btn-primary" href="${escapeHTML(link)}"${project.download ? " download" : ""} ${primaryAttrs}>
              ${primaryIcon}
              ${primaryLabel}
            </a>
            ${codeButton}
          </div>
        </div>
      </article>
    `;
  }

  // 按当前分类筛选并渲染作品
  function renderProjects() {
    const grid = $("[data-projects]");
    if (!grid) return;

    const visibleProjects = activeCategory === "all"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

    grid.innerHTML = visibleProjects.map(projectCard).join("");
    grid.setAttribute("aria-busy", "false");

    const emptyState = $("[data-empty]");
    if (emptyState) {
      emptyState.hidden = visibleProjects.length > 0;
    }

    // 封面图片加载失败时，换一张通用占位图，避免出现破图图标
    $$("img", grid).forEach((image) => {
      image.addEventListener("error", () => {
        if (!image.dataset.fallback) {
          image.dataset.fallback = "true";
          image.src = "assets/cover-placeholder.svg";
        }
      });
    });
  }

  // 卡片空白处也可以点击：优先打开主链接
  function handleProjectGridClick(event) {
    const grid = event.currentTarget;

    // 点到卡片里的链接 / 按钮，交给浏览器处理
    const anchor = event.target.closest("a");
    if (anchor) {
      if (anchor.dataset.placeholder === "true") {
        event.preventDefault();
        showToast(anchor.dataset.placeholderMessage || "这个链接正在整理中，敬请期待。");
      }
      return;
    }

    // 拖选文字时不触发跳转
    if (window.getSelection && String(window.getSelection()).trim()) return;

    const card = event.target.closest("[data-project-card]");
    if (!card) return;

    const link = card.dataset.link;
    if (isPlaceholder(link)) {
      showToast("这个作品正在整理中，敬请期待。");
      return;
    }

    // 标记为 download 的作品，尽量直接下载；否则新窗口打开
    if (card.dataset.download === "true") {
      const downloadLink = document.createElement("a");
      downloadLink.href = link;
      downloadLink.download = "";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      return;
    }

    window.open(link, "_blank", "noopener,noreferrer");
  }

  /* ------------------------------------------------------------------------
     4. 关于页：近况、技能、时间线、联系方式
     ------------------------------------------------------------------------ */
  function renderAboutPage() {
    const eyebrow = $('[data-about="eyebrow"]');
    if (eyebrow && about.eyebrow) eyebrow.textContent = about.eyebrow;

    const lead = $('[data-about="lead"]');
    if (lead && about.lead) lead.textContent = about.lead;

    const paragraphs = $("[data-about-paragraphs]");
    if (paragraphs && Array.isArray(about.paragraphs)) {
      paragraphs.innerHTML = about.paragraphs
        .map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
        .join("");
    }

    const nowContainer = $("[data-now]");
    if (nowContainer && Array.isArray(about.now)) {
      nowContainer.innerHTML = about.now.map((item, index) => `
        <article class="now-card">
          <div class="now-card-top">
            <span class="now-label">${escapeHTML(item.label)}</span>
            <span class="now-index">${String(index + 1).padStart(2, "0")}</span>
          </div>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.text)}</p>
        </article>
      `).join("");
    }

    const skillsContainer = $("[data-skills]");
    if (skillsContainer && Array.isArray(about.skills)) {
      skillsContainer.innerHTML = about.skills.map((group, index) => `
        <article class="skill-card">
          <div class="skill-card-top">
            <span class="skill-icon">${skillIcons[index] || icons.code}</span>
            <span class="skill-number">${String(index + 1).padStart(2, "0")}</span>
          </div>
          <h3>${escapeHTML(group.title)}</h3>
          <p>${escapeHTML(group.description)}</p>
          <ul class="skill-tags">
            ${(group.items || []).map((item) => `<li class="skill-tag">${escapeHTML(item)}</li>`).join("")}
          </ul>
        </article>
      `).join("");
    }

    const timelineContainer = $("[data-timeline]");
    if (timelineContainer && Array.isArray(about.timeline)) {
      timelineContainer.innerHTML = about.timeline.map((item) => `
        <li class="timeline-item">
          <span class="timeline-dot" aria-hidden="true"></span>
          <div class="timeline-year">${escapeHTML(item.year)}</div>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.text)}</p>
        </li>
      `).join("");
    }

    renderContacts();
  }

  function contactIcon(type) {
    if (type === "github") return icons.github;
    if (type === "wechat") return icons.wechat;
    return icons.email;
  }

  function renderContacts() {
    const container = $("[data-contacts]");
    if (!container || !Array.isArray(about.contacts)) return;

    container.innerHTML = about.contacts.map((contact) => {
      const type = contact.type || "email";
      const label = contact.label || "联系方式";

      // 联系方式自动从 profile 里取，改邮箱 / GitHub / 微信只需要改一处
      const derivedValue = type === "email"
        ? (profile.email || "")
        : (type === "github" ? displayUrl(profile.github) : (type === "wechat" ? (profile.wechat || "") : ""));
      const value = contact.value || derivedValue;
      const href = contact.href || (
        type === "email" && profile.email
          ? `mailto:${profile.email}`
          : (type === "github" ? (profile.github || "") : "")
      );
      const isLink = Boolean(href) && type !== "wechat";
      const actionText = type === "github" ? "打开主页" : (type === "email" ? "写封邮件" : "发消息");
      const actionIcon = type === "github" ? icons.arrowUpRight : (type === "email" ? icons.email : icons.arrowRight);
      const copyLabel = type === "wechat" ? "复制微信号" : "复制邮箱";

      const valueMarkup = isLink
        ? `<a href="${escapeHTML(href)}"${externalAttrs(href)}>${escapeHTML(value)}</a>`
        : escapeHTML(value);

      const primaryAction = isLink
        ? `<a class="contact-action contact-action-primary" href="${escapeHTML(href)}"${externalAttrs(href)}>
             ${actionIcon}
             ${actionText}
           </a>`
        : "";

      const copyAction = contact.copy
        ? `<button class="contact-action" type="button" data-copy-value="${escapeHTML(value)}" data-copy-label="${escapeHTML(label)}">
             ${icons.copy}
             ${copyLabel}
           </button>`
        : "";

      return `
        <article class="contact-card">
          <div class="contact-card-top">
            <span class="contact-icon">${contactIcon(type)}</span>
            <span class="contact-kicker">${escapeHTML(type)}</span>
          </div>
          <h3>${escapeHTML(label)}</h3>
          <p class="contact-value">${valueMarkup}</p>
          <div class="contact-card-footer">
            ${primaryAction}
            ${copyAction}
          </div>
        </article>
      `;
    }).join("");
  }

  /* ------------------------------------------------------------------------
     5. 点击卡片 / 复制 / 提示条
     ------------------------------------------------------------------------ */
  let toastTimer = null;

  function showToast(message) {
    const toast = $("[data-toast]");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2800);
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    let succeeded = false;
    try {
      succeeded = document.execCommand("copy");
    } catch (error) {
      succeeded = false;
    }

    textarea.remove();
    return succeeded;
  }

  async function copyText(text) {
    if (!text) return false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      // 剪贴板权限被拒绝时，继续走下面的旧方法
    }

    return fallbackCopy(text);
  }

  function setupCopyButtons() {
    document.addEventListener("click", async (event) => {
      // 首页 / 关于页的「复制邮箱」按钮
      const emailButton = event.target.closest("[data-copy-email]");
      if (emailButton) {
        const email = profile.email || "";
        if (!email) {
          showToast("还没有设置邮箱，请先改 js/data.js。");
          return;
        }
        const copied = await copyText(email);
        showToast(copied ? `邮箱已复制：${email}` : `复制失败，请手动记下：${email}`);
        return;
      }

      // 关于页联系方式卡片里的复制按钮
      const valueButton = event.target.closest("[data-copy-value]");
      if (valueButton) {
        const value = valueButton.dataset.copyValue || "";
        const label = valueButton.dataset.copyLabel || "内容";
        const copied = await copyText(value);
        showToast(copied ? `${label}已复制：${value}` : `复制失败，请手动记下：${value}`);
      }
    });
  }

  /* ------------------------------------------------------------------------
     6. 手机菜单
     ------------------------------------------------------------------------ */
  function setupMobileMenu() {
    const toggle = $("[data-nav-toggle]");
    const mobileNav = $("[data-mobile-nav]");
    if (!toggle || !mobileNav) return;

    function openMenu() {
      toggle.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "关闭菜单");
      mobileNav.classList.add("is-open");
      mobileNav.removeAttribute("inert");
    }

    function closeMenu(returnFocus) {
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "打开菜单");
      mobileNav.classList.remove("is-open");
      mobileNav.setAttribute("inert", "");

      if (returnFocus) {
        toggle.focus();
      }
    }

    toggle.addEventListener("click", () => {
      if (mobileNav.classList.contains("is-open")) {
        closeMenu(false);
      } else {
        openMenu();
      }
    });

    // 点了菜单里的链接就收起菜单
    mobileNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        closeMenu(false);
      }
    });

    // 点空白处收起
    document.addEventListener("click", (event) => {
      if (!mobileNav.classList.contains("is-open")) return;
      if (!event.target.closest(".site-header")) {
        closeMenu(false);
      }
    });

    // 按 Esc 收起，并把焦点还给菜单按钮
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobileNav.classList.contains("is-open")) {
        closeMenu(true);
      }
    });

    // 放大到电脑宽度时，自动收起手机菜单
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860 && mobileNav.classList.contains("is-open")) {
        closeMenu(false);
      }
    });
  }

  /* ------------------------------------------------------------------------
     7. 顶部导航的滚动阴影
     ------------------------------------------------------------------------ */
  function setupHeaderScroll() {
    const header = $("[data-header]");
    if (!header) return;

    const update = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ------------------------------------------------------------------------
     8. 滚动时轻轻淡入（如果系统设置了「减少动态效果」，就不做）
     ------------------------------------------------------------------------ */
  function setupReveal() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const targets = $$(".section-head, .filters, .contact-panel, .story-content, .now-grid, .skills-grid, .timeline-layout, .contact-detail-grid");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.06
    });

    targets.forEach((element) => {
      element.classList.add("reveal");
      observer.observe(element);
    });
  }

  /* ------------------------------------------------------------------------
     9. 页面启动
     ------------------------------------------------------------------------ */
  function init() {
    fillProfile();
    fillStats();
    renderFilters();
    renderProjects();
    renderAboutPage();
    setupCopyButtons();
    setupMobileMenu();
    setupHeaderScroll();

    const grid = $("[data-projects]");
    if (grid) {
      grid.addEventListener("click", handleProjectGridClick);
    }

    setupReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
