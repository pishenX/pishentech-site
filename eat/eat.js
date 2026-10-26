/* ==========================================================================
   eat.js —— 四个转盘共用的逻辑
   --------------------------------------------------------------------------
   菜谱在 eat/data.js 里。页面 body 上的 data-wheel 决定读哪一组：
     data-wheel="beiyang-campus"  → EAT_WHEELS["beiyang-campus"]
     data-wheel="weijin-campus"   → EAT_WHEELS["weijin-campus"]
     以此类推。

   这个文件一般不用改；加菜请改 eat/data.js。
   ========================================================================== */

(function () {
  "use strict";

  const MAX_CANDIDATES = 8;
  const SPIN_MS = 4200;
  const SECTOR_COLORS = [
    "#f4a3a3",
    "#f2c766",
    "#86d3a8",
    "#8fb8ea",
    "#b3a1e3",
    "#f0d27a",
    "#efa06f",
    "#7fd0c8"
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const wheelKey = document.body.getAttribute("data-wheel");
  const source = (window.EAT_WHEELS && window.EAT_WHEELS[wheelKey]) || {};
  const DISHES = normalizeDishes(source.dishes);
  const dataLoaded = Boolean(window.EAT_WHEELS);

  const els = {
    wheel: $(".wheel"),
    stage: $("[data-wheel-stage]"),
    hub: $(".wheel-hub"),
    hubText: $(".wheel-hub-text"),
    hint: $("[data-hint]"),
    shuffle: $("[data-shuffle]"),
    result: $("[data-result]"),
    toast: $("[data-toast]")
  };

  const state = {
    candidates: [],
    winner: null,
    pendingIndex: -1,
    rotation: 0,
    spinning: false,
    hasResult: false,
    decided: false,
    spinTimer: null
  };

  /* ========================================================================
     一、小工具
     ======================================================================== */
  function normalizeDishes(input) {
    if (!Array.isArray(input)) return [];
    return input
      .filter((dish) => dish && typeof dish.name === "string" && dish.name.trim())
      .map((dish) => ({
        name: dish.name.trim(),
        note: typeof dish.note === "string" ? dish.note.trim() : "",
        price: normalizePrice(dish.price)
      }));
  }

  function normalizePrice(value) {
    if (value === null || value === undefined || value === "") return null;

    if (typeof value === "number") {
      return Number.isFinite(value) && value >= 0 ? roundPrice(value) : null;
    }

    if (typeof value !== "string") return null;

    let text = value.trim();
    if (!text) return null;

    text = text.replace(/^[¥￥]\s*/, "").replace(/\s*(元|块)$/, "").trim();
    if (!text) return null;

    if (/^\d+(\.\d+)?$/.test(text)) {
      return roundPrice(Number(text));
    }

    if (/^\d+(\.\d+)?\s*[-~～—–至]\s*\d+(\.\d+)?$/.test(text)) {
      return text.replace(/\s+/g, "").replace(/[~～—–至]/g, "-");
    }

    return null;
  }

  function roundPrice(value) {
    return Math.round(value * 100) / 100;
  }

  function formatPrice(value) {
    if (value === null) return "";
    if (typeof value === "string") return value;
    return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character]));
  }

  function randomInt(max) {
    if (!max || max < 1) return 0;
    if (window.crypto && typeof window.crypto.getRandomValues === "function") {
      const buffer = new Uint32Array(1);
      window.crypto.getRandomValues(buffer);
      return buffer[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function sample(list, count) {
    const copy = list.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = randomInt(index + 1);
      const temp = copy[index];
      copy[index] = copy[swapIndex];
      copy[swapIndex] = temp;
    }
    return copy.slice(0, count);
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function labelSize(name) {
    const length = Array.from(name).length;
    if (length <= 4) return 19;
    if (length === 5) return 17;
    if (length === 6) return 15;
    if (length === 7) return 13.5;
    return 12;
  }

  function shortLabel(name) {
    const characters = Array.from(name);
    return characters.length > 7 ? `${characters.slice(0, 6).join("")}…` : name;
  }

  function polar(radius, angle) {
    const radians = (angle * Math.PI) / 180;
    return {
      x: 250 + radius * Math.cos(radians),
      y: 250 + radius * Math.sin(radians)
    };
  }

  let toastTimer = null;
  function showToast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      els.toast.classList.remove("is-visible");
    }, 2400);
  }

  /* ========================================================================
     二、转盘绘制
     ======================================================================== */
  function renderWheel() {
    if (!els.wheel) return;
    els.wheel.classList.remove("is-labels-hidden");

    const list = state.candidates;

    if (!list.length) {
      els.wheel.innerHTML = `
        <circle cx="250" cy="250" r="226" fill="#ffffff"/>
        <circle cx="250" cy="250" r="210" fill="#fffaf3" stroke="#e8d5c2" stroke-width="1.5" stroke-dasharray="6 8"/>
        <text x="250" y="354" text-anchor="middle" fill="#a5886f" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="16" font-weight="700">还没有菜</text>
      `;
      els.wheel.setAttribute("aria-label", "这个转盘还没有菜。请在 eat/data.js 里添加。");
      if (els.hub) els.hub.setAttribute("aria-label", "这个转盘还没有菜");
      if (els.hubText) els.hubText.textContent = "空";
      return;
    }

    if (els.hub) els.hub.setAttribute("aria-label", "转动转盘");
    if (els.hubText) els.hubText.textContent = "转";

    if (list.length === 1) {
      const dish = list[0];
      els.wheel.innerHTML = `
        <circle cx="250" cy="250" r="226" fill="#ffffff"/>
        <g class="wheel-rotor" data-rotor>
          <circle cx="250" cy="250" r="210" fill="${SECTOR_COLORS[0]}" class="wheel-sector" data-index="0"/>
        </g>
        <circle cx="250" cy="250" r="210" fill="none" stroke="#fffaf3" stroke-width="4"/>
        <circle cx="250" cy="250" r="86" fill="#fffaf3" stroke="#f0e3d5" stroke-width="1.2"/>
        <g class="wheel-labels">
          <text x="250" y="360" text-anchor="middle" class="wheel-label" font-size="${labelSize(dish.name)}" aria-hidden="true">${escapeHTML(shortLabel(dish.name))}</text>
        </g>
      `;
      els.wheel.setAttribute("aria-label", `今天吃什么的转盘，唯一候选是${dish.name}。`);
      return;
    }

    const step = 360 / list.length;
    const largeArc = step > 180 ? 1 : 0;
    let sectors = "";
    let labels = "";

    list.forEach((dish, index) => {
      const startAngle = -90 + index * step;
      const endAngle = startAngle + step;
      const start = polar(210, startAngle);
      const end = polar(210, endAngle);
      const labelAngle = startAngle + step / 2;
      const labelPoint = polar(147, labelAngle);
      const path = [
        "M 250 250",
        `L ${start.x.toFixed(2)} ${start.y.toFixed(2)}`,
        `A 210 210 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
        "Z"
      ].join(" ");

      sectors += `<path d="${path}" fill="${SECTOR_COLORS[index % SECTOR_COLORS.length]}" class="wheel-sector" data-index="${index}"/>`;
      labels += `<text x="${labelPoint.x.toFixed(2)}" y="${labelPoint.y.toFixed(2)}" text-anchor="middle" dominant-baseline="middle" class="wheel-label" data-index="${index}" data-angle="${labelAngle.toFixed(2)}" font-size="${labelSize(dish.name)}" aria-hidden="true">${escapeHTML(shortLabel(dish.name))}</text>`;
    });

    els.wheel.innerHTML = `
      <circle cx="250" cy="250" r="226" fill="#ffffff"/>
      <g class="wheel-rotor" data-rotor>
        ${sectors}
      </g>
      <circle cx="250" cy="250" r="210" fill="none" stroke="#fffaf3" stroke-width="4"/>
      <circle cx="250" cy="250" r="86" fill="#fffaf3" stroke="#f0e3d5" stroke-width="1.2"/>
      <g class="wheel-labels">${labels}</g>
    `;

    els.wheel.setAttribute("aria-label", `今天吃什么的转盘，候选：${list.map((dish) => dish.name).join("、")}。`);
  }

  function layoutLabels(rotation) {
    if (!els.wheel) return;
    const offset = ((rotation % 360) + 360) % 360;
    $$(".wheel-label[data-angle]", els.wheel).forEach((label) => {
      const angle = Number(label.dataset.angle) + offset;
      const point = polar(147, angle);
      label.setAttribute("x", point.x.toFixed(2));
      label.setAttribute("y", point.y.toFixed(2));
    });
  }

  function resetRotation() {
    if (!els.wheel) return;
    const rotor = $("[data-rotor]", els.wheel);
    state.rotation = 0;
    layoutLabels(0);
    if (!rotor) return;
    rotor.style.transition = "none";
    rotor.style.transform = "rotate(0deg)";
    void rotor.getBoundingClientRect();
    rotor.style.transition = "";
  }

  function pickCandidates() {
    if (DISHES.length <= MAX_CANDIDATES) {
      return sample(DISHES, DISHES.length);
    }

    const currentNames = new Set(state.candidates.map((dish) => dish.name));
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const next = sample(DISHES, MAX_CANDIDATES);
      if (next.some((dish) => !currentNames.has(dish.name))) {
        return next;
      }
    }
    return sample(DISHES, MAX_CANDIDATES);
  }

  function buildWheel(options) {
    const settings = options || {};
    if (state.spinning) return;

    const commit = () => {
      state.candidates = pickCandidates();
      state.winner = null;
      state.pendingIndex = -1;
      renderWheel();
      resetRotation();
      updateAvailability();
      updateShuffle();
      updateHint();
    };

    if (settings.animate) {
      els.wheel.classList.add("is-refreshing");
      window.setTimeout(() => {
        if (state.spinning) {
          els.wheel.classList.remove("is-refreshing");
          return;
        }
        commit();
        window.requestAnimationFrame(() => {
          els.wheel.classList.remove("is-refreshing");
        });
      }, 150);
    } else {
      commit();
    }
  }

  function highlightWinner(index) {
    $$(".wheel-sector", els.wheel).forEach((sector, sectorIndex) => {
      sector.classList.toggle("is-winner", sectorIndex === index);
    });
    $$(".wheel-label", els.wheel).forEach((label, labelIndex) => {
      label.classList.toggle("is-winner", labelIndex === index);
    });

    // 单独画一层描边，避免被相邻扇区的白色分隔线盖住
    $$(".wheel-highlight", els.wheel).forEach((element) => element.remove());
    const winner = $$(".wheel-sector", els.wheel)[index];
    const rotor = $("[data-rotor]", els.wheel);
    if (!winner || !rotor || !winner.getAttribute("d")) return;

    const outline = document.createElementNS("http://www.w3.org/2000/svg", "path");
    outline.setAttribute("d", winner.getAttribute("d"));
    outline.setAttribute("fill", "none");
    outline.setAttribute("stroke", "#382216");
    outline.setAttribute("stroke-width", "4");
    outline.setAttribute("stroke-linejoin", "round");
    outline.setAttribute("class", "wheel-highlight");
    outline.setAttribute("aria-hidden", "true");
    rotor.appendChild(outline);
  }

  /* ========================================================================
     三、结果卡片
     ======================================================================== */
  function emptyMarkup(title, text) {
    return `
      <div class="answer-empty">
        <span class="answer-mark" aria-hidden="true">?</span>
        <h2>${escapeHTML(title)}</h2>
        <p>${escapeHTML(text)}</p>
      </div>
    `;
  }

  function showEmpty(title, text) {
    state.hasResult = false;
    state.decided = false;
    state.winner = null;
    if (!els.result) return;
    els.result.innerHTML = emptyMarkup(title, text);
  }

  function showSpinning() {
    if (!els.result) return;
    els.result.innerHTML = `
      <div class="answer-loading">
        <span class="answer-spinner" aria-hidden="true"></span>
        <h2>正在翻菜谱…</h2>
      </div>
    `;
  }

  function showResult(dish) {
    if (!els.result || !dish) return;
    state.hasResult = true;
    state.decided = false;
    state.winner = dish;

    const price = dish.price === null
      ? ""
      : `<span class="answer-price">¥${escapeHTML(formatPrice(dish.price))}</span>`;

    els.result.innerHTML = `
      <div class="answer-head">
        <h2 class="answer-name">${escapeHTML(dish.name)}</h2>
        ${price}
      </div>
      ${dish.note ? `<p class="answer-note">${escapeHTML(dish.note)}</p>` : ""}
      <div class="answer-actions">
        <button class="btn btn-primary answer-decide" type="button" data-decide>就吃这个</button>
        <button class="answer-again" type="button" data-spin>再转一次</button>
      </div>
    `;
    updateAvailability();
  }

  function decide() {
    if (!state.winner) return;
    if (state.decided) {
      showToast("已经定了，就吃它。");
      return;
    }

    state.decided = true;
    const button = els.result ? els.result.querySelector("[data-decide]") : null;
    if (button) {
      button.disabled = true;
      button.textContent = "✓ 已定";
    }
    showToast("好，今天就吃它。");
  }

  /* ========================================================================
     四、转动
     ======================================================================== */
  function updateHint() {
    if (!els.hint) return;
    if (!dataLoaded) {
      els.hint.textContent = "菜谱加载失败，检查 eat/data.js。";
      return;
    }
    els.hint.textContent = DISHES.length
      ? "指针停在哪儿，就吃哪儿。"
      : "在 eat/data.js 里加菜。";
  }

  function updateShuffle() {
    if (!els.shuffle) return;
    els.shuffle.hidden = DISHES.length <= MAX_CANDIDATES;
  }

  function updateAvailability() {
    const disabled = state.spinning || DISHES.length === 0;
    $$("[data-spin]").forEach((button) => {
      button.disabled = disabled;
    });
    if (els.hub) {
      els.hub.disabled = disabled;
    }
    if (els.shuffle) {
      els.shuffle.disabled = state.spinning;
    }
  }

  function setBusy(busy) {
    state.spinning = busy;
    if (els.stage) {
      els.stage.classList.toggle("is-spinning", busy);
    }
    updateAvailability();
  }

  function spin() {
    if (state.spinning) return;

    if (!DISHES.length) {
      showToast("这个转盘还没有菜，先去 eat/data.js 里加菜。");
      return;
    }

    if (!state.candidates.length) {
      buildWheel();
    }
    if (!state.candidates.length) return;

    window.clearTimeout(state.spinTimer);
    els.wheel.classList.remove("is-refreshing");

    state.pendingIndex = randomInt(state.candidates.length);
    setBusy(true);
    showSpinning();

    const count = state.candidates.length;
    const step = count === 1 ? 360 : 360 / count;
    const center = (state.pendingIndex + 0.5) * step;
    const current = ((state.rotation % 360) + 360) % 360;
    const delta = (((-center - current) % 360) + 360) % 360;
    const turns = prefersReducedMotion() ? 1 : 4 + randomInt(2);
    const target = state.rotation + turns * 360 + delta;
    const rotor = $("[data-rotor]", els.wheel);

    if (!rotor) {
      setBusy(false);
      showEmpty("转盘卡住了", "刷新一下页面，再转一次。");
      return;
    }

    $$(".is-winner", els.wheel).forEach((element) => element.classList.remove("is-winner"));
    $$(".wheel-highlight", els.wheel).forEach((element) => element.remove());

    state.rotation = target;
    els.wheel.classList.add("is-labels-hidden");
    void rotor.getBoundingClientRect();
    rotor.style.transform = `rotate(${target}deg)`;

    const duration = prefersReducedMotion() ? 520 : SPIN_MS;
    state.spinTimer = window.setTimeout(finishSpin, duration + 120);
  }

  function finishSpin() {
    window.clearTimeout(state.spinTimer);
    if (!state.spinning) return;

    const dish = state.candidates[state.pendingIndex] || state.candidates[0];
    if (!dish) {
      setBusy(false);
      showEmpty("转盘卡住了", "刷新一下页面，再转一次。");
      return;
    }

    state.hasResult = true;
    setBusy(false);
    layoutLabels(state.rotation);
    highlightWinner(state.pendingIndex);
    window.requestAnimationFrame(() => {
      els.wheel.classList.remove("is-labels-hidden");
    });
    showResult(dish);

    if (window.matchMedia("(max-width: 980px)").matches) {
      window.setTimeout(() => {
        if (!els.result) return;
        els.result.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start"
        });
      }, 140);
    }
  }

  /* ========================================================================
     五、交互
     ======================================================================== */
  function handleGlobalClick(event) {
    if (!(event.target instanceof Element)) return;

    const spinTrigger = event.target.closest("[data-spin]");
    if (spinTrigger) {
      event.preventDefault();
      spin();
      return;
    }

    const decideTrigger = event.target.closest("[data-decide]");
    if (decideTrigger) {
      event.preventDefault();
      decide();
    }
  }

  function handleShuffle() {
    if (state.spinning || DISHES.length <= MAX_CANDIDATES) return;
    showEmpty("答案还在转盘里", "换了一批，按一下中间的「转」。");
    buildWheel({ animate: true });
  }

  function bindEvents() {
    document.addEventListener("click", handleGlobalClick);
    if (els.shuffle) {
      els.shuffle.addEventListener("click", handleShuffle);
    }
  }

  function init() {
    if (!dataLoaded) {
      console.warn("eat/data.js 没有加载，或文件里有语法错误。");
    }

    bindEvents();
    buildWheel();

    if (!dataLoaded) {
      showEmpty(
        "菜谱加载失败",
        "检查 eat/data.js 里的逗号、引号和价格写法；按 F12 看 Console 里的红字。"
      );
    } else if (DISHES.length) {
      showEmpty("答案还在转盘里", "按一下中间的「转」。");
    } else {
      showEmpty("这个转盘还没有菜", "打开 eat/data.js，在 dishes 里加几道菜，刷新页面。");
    }

    updateHint();
    updateShuffle();
    updateAvailability();
  }

  init();
})();
