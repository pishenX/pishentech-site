/* ==========================================================================
   site.js —— 把 data.js 里的作品变成页面
   --------------------------------------------------------------------------
   这个文件负责：
   1. 生成分类按钮和作品卡片
   2. 处理分类筛选、卡片点击
   3. 填充品牌名、邮箱、GitHub、作品数量

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
  const copy = data.copy || {};
  const stats = data.stats || {};

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
     常用小图标（直接写成 SVG，不依赖图标库）
     ------------------------------------------------------------------------ */
  const icons = {
    arrowUpRight: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    download: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 3v10m0 0 4-4m-4 4-4-4M4 16h12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    code: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7 6-4 4 4 4M13 6l4 4-4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ------------------------------------------------------------------------
     1. 填充品牌名、邮箱、GitHub、年份
     ------------------------------------------------------------------------ */
  function fillBasics() {
    // 顶部和页脚的品牌名跟着 data.js 改变
    $$(".brand-text").forEach((element) => {
      if (profile.brand) {
        element.innerHTML = `${escapeHTML(profile.brand)}<span class="brand-dot">.</span>`;
      }
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

    $$("[data-year]").forEach((element) => {
      element.textContent = new Date().getFullYear();
    });
  }

  /* ------------------------------------------------------------------------
     2. 作品数量（自动计算，不用手改）
     ------------------------------------------------------------------------ */
  function fillStats() {
    const openSourceCount = projects.filter((project) => project.code && String(project.code).trim()).length;

    $$('[data-stat="projects"]').forEach((element) => {
      element.textContent = String(projects.length).padStart(2, "0");
    });

    $$('[data-stat="opensource"]').forEach((element) => {
      element.textContent = String(openSourceCount).padStart(2, "0");
    });

    const labels = {
      projects: stats.projectsLabel || "个作品",
      opensource: stats.openSourceLabel || "个已开源"
    };

    $$("[data-stat-label]").forEach((element) => {
      const key = element.dataset.statLabel;
      if (labels[key]) {
        element.textContent = labels[key];
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. 分类按钮
     ------------------------------------------------------------------------ */
  let activeCategory = "all";

  function renderFilters() {
    const container = $("[data-filters]");
    if (!container) return;

    const categoryCounts = categories.map((category) => {
      if (category.id === "all") return projects.length;
      return projects.filter((project) => project.category === category.id).length;
    });

    container.innerHTML = categories.map((category, index) => `
      <button
        class="filter-btn"
        type="button"
        data-filter="${escapeHTML(category.id)}"
        aria-pressed="${category.id === activeCategory}"
      >
        ${escapeHTML(category.name)}
        <span class="filter-count">${categoryCounts[index]}</span>
      </button>
    `).join("");

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

  /* ------------------------------------------------------------------------
     4. 作品卡片
     ------------------------------------------------------------------------ */
  function projectCard(project, index) {
    const category = categories.find((item) => item.id === project.category);
    const categoryName = category ? category.name : "作品";
    const link = isPlaceholder(project.link) ? "#" : String(project.link);
    const code = project.code && String(project.code).trim() ? String(project.code) : "";
    const cover = project.cover || "assets/cover-placeholder.svg";
    const title = escapeHTML(project.title || "未命名作品");
    const description = escapeHTML(project.description || "");
    const year = escapeHTML(project.year || "");
    const subtitle = project.subtitle
      ? `<p class="project-subtitle">${escapeHTML(project.subtitle)}</p>`
      : "";
    const tags = (Array.isArray(project.tags) ? project.tags : [])
      .map((tag) => `<li class="tag">${escapeHTML(tag)}</li>`)
      .join("");

    const primaryLabel = escapeHTML(project.linkLabel || (project.download ? "下载试用" : "查看作品"));
    const primaryIcon = project.download ? icons.download : icons.arrowUpRight;
    const primaryAttrs = isPlaceholder(project.link)
      ? 'data-placeholder="true" data-placeholder-message="这个作品正在整理中，敬请期待。"'
      : externalAttrs(link);
    const titleAttrs = isPlaceholder(project.link)
      ? 'data-placeholder="true" data-placeholder-message="这个作品正在整理中，敬请期待。"'
      : externalAttrs(link);

    // 查看代码按钮：data.js 里 code 留空，按钮就不会显示
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
      >
        <span class="project-cover" aria-hidden="true">
          <img
            src="${escapeHTML(cover)}"
            alt="${escapeHTML(project.coverAlt || `${project.title || "作品"}的封面`)}"
            width="1200"
            height="750"
            decoding="async"
          >
          <span class="project-type">${escapeHTML(categoryName)}</span>
          <span class="project-card-arrow">${icons.arrowUpRight}</span>
        </span>

        <div class="project-body">
          <div class="project-heading">
            <div>
              <h2 class="project-title">
                <a href="${escapeHTML(link)}" ${titleAttrs}>${title}</a>
              </h2>
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

    // 封面图片加载失败时，换一张通用占位图，避免出现破图
    $$("img", grid).forEach((image) => {
      image.addEventListener("error", () => {
        if (!image.dataset.fallback) {
          image.dataset.fallback = "true";
          image.src = "assets/cover-placeholder.svg";
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. 点击卡片 / 提示条
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

  function handleProjectGridClick(event) {
    const anchor = event.target.closest("a");
    if (anchor) {
      if (anchor.dataset.placeholder === "true") {
        event.preventDefault();
        showToast(anchor.dataset.placeholderMessage || "这个链接正在整理中，敬请期待。");
      }
      return;
    }

    if (window.getSelection && String(window.getSelection()).trim()) return;

    const card = event.target.closest("[data-project-card]");
    if (!card) return;

    const link = card.dataset.link;
    if (isPlaceholder(link)) {
      showToast("这个作品正在整理中，敬请期待。");
      return;
    }

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
     6. 顶部导航滚动阴影
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
     7. 滚动时轻轻淡入（系统开了「减少动态效果」就不做）
     ------------------------------------------------------------------------ */
  function setupReveal() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const targets = $$(".works-head, .filters");
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
     8. 启动
     ------------------------------------------------------------------------ */
  function init() {
    fillBasics();
    fillStats();
    renderFilters();
    renderProjects();
    setupHeaderScroll();
    setupReveal();

    const grid = $("[data-projects]");
    if (grid) {
      grid.addEventListener("click", handleProjectGridClick);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
