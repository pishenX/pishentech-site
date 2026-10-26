/* ==========================================================================
   eat.js —— 「今天吃什么」转盘
   --------------------------------------------------------------------------
   全部逻辑都在浏览器本地完成：
   1. 50 道菜的数据
   2. 预算 / 辣度筛选，今天吃过的不重复
   3. 随机抽 8 个候选，转动 SVG 转盘
   4. 结果、「就吃这个」、今日记录（localStorage）

   不请求任何接口，也不上传任何数据。
   ========================================================================== */

(function () {
  "use strict";

  /* ========================================================================
     一、菜单数据
     ------------------------------------------------------------------------
     category  分类，也会显示在结果卡片上
     short     转盘上显示的短名字，最好 2～5 个字
     price     人均价格（元）
     spicy     0 不辣 / 1 微辣 / 2 重辣
     tags      结果卡片上的三个小标签
     note      抽中之后的一句推荐语
     ======================================================================== */
  const DISHES = [
    /* ---------- 米饭 ---------- */
    { name: "番茄牛腩饭", short: "牛腩饭", category: "米饭", price: 26, spicy: 0, tags: ["热乎", "酸甜", "顶饱"], note: "汤汁拌饭，一口下去很踏实。" },
    { name: "黄焖鸡米饭", short: "黄焖鸡", category: "米饭", price: 24, spicy: 1, tags: ["热乎", "下饭", "经典"], note: "香菇和鸡汤，永远站在米饭这边。" },
    { name: "广式腊味煲仔饭", short: "煲仔饭", category: "米饭", price: 32, spicy: 0, tags: ["锅巴", "咸香", "慢一点"], note: "为了那一层锅巴，值得多等十分钟。" },
    { name: "扬州炒饭", short: "扬州炒饭", category: "米饭", price: 22, spicy: 0, tags: ["粒粒分明", "清爽", "快手"], note: "虾仁、火腿和蛋，简单但不容易出错。" },
    { name: "咖喱鸡肉饭", short: "咖喱饭", category: "米饭", price: 28, spicy: 1, tags: ["浓郁", "土豆", "满足"], note: "咖喱汁多一点，米饭就不够吃了。" },
    { name: "台式卤肉饭", short: "卤肉饭", category: "米饭", price: 20, spicy: 0, tags: ["卤香", "便宜", "顶饱"], note: "一颗卤蛋，一勺肉汁，午饭的最低成本快乐。" },
    { name: "石锅拌饭", short: "拌饭", category: "米饭", price: 30, spicy: 1, tags: ["锅巴", "蔬菜", "拌一拌"], note: "把蛋黄戳破，然后用力拌。" },
    { name: "黑椒牛柳饭", short: "牛柳饭", category: "米饭", price: 34, spicy: 1, tags: ["黑椒", "嫩", "重口"], note: "黑椒味够冲，下午开会都清醒。" },

    /* ---------- 面食 ---------- */
    { name: "日式豚骨拉面", short: "豚骨拉面", category: "面食", price: 32, spicy: 0, tags: ["浓汤", "叉烧", "热乎"], note: "汤要喝完，才算认真吃过。" },
    { name: "重庆小面", short: "重庆小面", category: "面食", price: 16, spicy: 2, tags: ["麻辣", "便宜", "上头"], note: "二两小面，多放点青菜。" },
    { name: "兰州牛肉面", short: "牛肉面", category: "面食", price: 22, spicy: 1, tags: ["清汤", "萝卜", "现拉"], note: "一清二白三红四绿，标准答案。" },
    { name: "番茄鸡蛋面", short: "番茄鸡蛋面", category: "面食", price: 18, spicy: 0, tags: ["家常", "酸甜", "暖胃"], note: "不知道吃什么的时候，它从不让人失望。" },
    { name: "油泼面", short: "油泼面", category: "面食", price: 20, spicy: 1, tags: ["宽面", "蒜香", "热油"], note: "热油泼下去的那一声，值了。" },
    { name: "老北京炸酱面", short: "炸酱面", category: "面食", price: 24, spicy: 0, tags: ["酱香", "黄瓜丝", "实在"], note: "酱要够咸，面要够筋道。" },
    { name: "葱油拌面", short: "葱油面", category: "面食", price: 15, spicy: 0, tags: ["极简", "香", "快"], note: "一碗面，一勺葱油，五分钟解决战斗。" },
    { name: "山西刀削面", short: "刀削面", category: "面食", price: 22, spicy: 1, tags: ["筋道", "汤浓", "碳水"], note: "面片中间厚两边薄，咬起来很过瘾。" },

    /* ---------- 粉类 ---------- */
    { name: "螺蛳粉", short: "螺蛳粉", category: "粉类", price: 20, spicy: 2, tags: ["酸笋", "上头", "真香"], note: "闻着犹豫，吃着上瘾，记得加腐竹。" },
    { name: "桂林米粉", short: "桂林米粉", category: "粉类", price: 18, spicy: 1, tags: ["卤水", "锅烧", "酸豆角"], note: "先干拌，再加汤，两步都别省。" },
    { name: "重庆酸辣粉", short: "酸辣粉", category: "粉类", price: 14, spicy: 2, tags: ["酸辣", "红薯粉", "开胃"], note: "酸得皱眉，辣得开心。" },
    { name: "云南过桥米线", short: "过桥米线", category: "粉类", price: 28, spicy: 1, tags: ["鲜汤", "仪式感", "烫"], note: "先把肉片烫熟，再慢慢下米线。" },
    { name: "湖南牛肉粉", short: "牛肉粉", category: "粉类", price: 22, spicy: 2, tags: ["香辣", "牛肉", "热乎"], note: "红油盖满，牛肉给足，才算湖南早餐。" },
    { name: "潮汕粿条", short: "粿条", category: "粉类", price: 25, spicy: 0, tags: ["清鲜", "牛肉丸", "汤水"], note: "汤清味足，吃完不困。" },

    /* ---------- 轻食 ---------- */
    { name: "牛油果鸡胸沙拉", short: "鸡胸沙拉", category: "轻食", price: 24, spicy: 0, tags: ["轻盈", "高蛋白", "清爽"], note: "今天对自己好一点，但别只吃草。" },
    { name: "三文鱼波奇饭", short: "波奇饭", category: "轻食", price: 38, spicy: 0, tags: ["鲜", "颜值", "饱腹"], note: "三文鱼、牛油果和米饭，轻食也可以很满足。" },
    { name: "全麦鸡肉卷", short: "鸡肉卷", category: "轻食", price: 19, spicy: 1, tags: ["便携", "低负担", "快手"], note: "边走边吃，也不耽误下午的会。" },
    { name: "希腊酸奶碗", short: "酸奶碗", category: "轻食", price: 18, spicy: 0, tags: ["清爽", "酸甜", "下午茶"], note: "坚果和莓果铺满，假装在度假。" },
    { name: "藜麦蔬菜碗", short: "藜麦碗", category: "轻食", price: 26, spicy: 0, tags: ["健康", "彩色", "清淡"], note: "把五种颜色装进一个碗里。" },
    { name: "鸡蛋三明治", short: "三明治", category: "轻食", price: 12, spicy: 0, tags: ["简单", "便宜", "不犯困"], note: "两片吐司，一个煎蛋，够了。" },

    /* ---------- 快餐 ---------- */
    { name: "麦香鸡汉堡", short: "汉堡", category: "快餐", price: 18, spicy: 0, tags: ["快", "经典", "不踩雷"], note: "不知道吃什么的时候，汉堡永远在。" },
    { name: "炸鸡桶", short: "炸鸡", category: "快餐", price: 45, spicy: 1, tags: ["快乐", "脆", "热量"], note: "今天先不算热量，脆皮最重要。" },
    { name: "薯条汉堡套餐", short: "汉堡套餐", category: "快餐", price: 32, spicy: 0, tags: ["快乐", "套餐", "管饱"], note: "可乐去冰，薯条现炸。" },
    { name: "玛格丽特披萨", short: "披萨", category: "快餐", price: 39, spicy: 0, tags: ["芝士", "分享", "满足"], note: "芝士拉丝的那一刻，烦恼少一半。" },
    { name: "墨西哥牛肉卷", short: "牛肉卷", category: "快餐", price: 28, spicy: 1, tags: ["微辣", "扎实", "方便"], note: "一手握住，肉和蔬菜都有了。" },
    { name: "热狗", short: "热狗", category: "快餐", price: 15, spicy: 0, tags: ["快", "街头", "解馋"], note: "面包、香肠、黄芥末，三步到位。" },

    /* ---------- 锅物 ---------- */
    { name: "麻辣香锅", short: "香锅", category: "锅物", price: 35, spicy: 2, tags: ["麻辣", "自选", "下饭"], note: "想吃什么加什么，最后都变成一碗饭。" },
    { name: "番茄火锅", short: "番茄锅", category: "锅物", price: 48, spicy: 0, tags: ["酸甜", "暖胃", "适合分享"], note: "番茄汤底先喝一碗，再开始涮。" },
    { name: "日式寿喜锅", short: "寿喜锅", category: "锅物", price: 55, spicy: 0, tags: ["甜咸", "牛肉", "仪式感"], note: "牛肉裹上蛋液，今晚值得慢一点。" },
    { name: "韩式部队锅", short: "部队锅", category: "锅物", price: 42, spicy: 1, tags: ["芝士", "拉面", "热闹"], note: "泡面、午餐肉和芝士，热量是明天的烦恼。" },
    { name: "冒菜", short: "冒菜", category: "锅物", price: 28, spicy: 2, tags: ["麻辣", "一个人的火锅", "下饭"], note: "一个人的火锅，也要认真冒一碗。" },

    /* ---------- 烤肉 ---------- */
    { name: "烤串", short: "烤串", category: "烤肉", price: 30, spicy: 1, tags: ["烟火气", "夜宵", "啤酒"], note: "十串起步，孜然多放。" },
    { name: "烤肉拌饭", short: "烤肉拌饭", category: "烤肉", price: 26, spicy: 1, tags: ["酱香", "扎实", "顶饱"], note: "烤肉和米饭，是永远不会出错的组合。" },
    { name: "铁板牛排", short: "铁板牛排", category: "烤肉", price: 58, spicy: 0, tags: ["滋滋响", "西式", "犒劳"], note: "听到铁板响，心情就先好了。" },
    { name: "韩式烤肉", short: "韩式烤肉", category: "烤肉", price: 68, spicy: 1, tags: ["生菜包肉", "聚会", "慢吃"], note: "生菜包肉，再加一片蒜。" },

    /* ---------- 小吃 ---------- */
    { name: "猪肉白菜饺子", short: "饺子", category: "小吃", price: 18, spicy: 0, tags: ["家常", "热乎", "蘸醋"], note: "皮薄馅大，蘸醋加蒜。" },
    { name: "生煎包", short: "生煎", category: "小吃", price: 16, spicy: 1, tags: ["底脆", "汤汁", "小心烫"], note: "先咬小口，不然汤汁会偷袭。" },
    { name: "小笼包", short: "小笼包", category: "小吃", price: 20, spicy: 0, tags: ["鲜", "汤汁", "精致"], note: "一笼八个，配一碗蛋皮汤。" },
    { name: "煎饼果子", short: "煎饼", category: "小吃", price: 10, spicy: 1, tags: ["街头", "快", "加蛋"], note: "加两个蛋，薄脆要双份。" },
    { name: "肉夹馍", short: "肉夹馍", category: "小吃", price: 15, spicy: 1, tags: ["酥", "肉香", "扎实"], note: "白吉馍要酥，腊汁肉要肥瘦相间。" },
    { name: "章鱼小丸子", short: "章鱼丸子", category: "小吃", price: 18, spicy: 0, tags: ["木鱼花", "街头", "解馋"], note: "木鱼花在动，说明它刚出锅。" },
    { name: "关东煮", short: "关东煮", category: "小吃", price: 22, spicy: 0, tags: ["清淡", "暖手", "夜宵"], note: "萝卜和福袋，是关东煮的灵魂。" }
  ];

  const SPICE_LABELS = ["不辣", "微辣", "重辣"];
  const SECTOR_COLORS = ["#fb7185", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa", "#fcd34d", "#fb923c", "#2dd4bf"];
  const HISTORY_KEY = "pishentech:eat:history:v1";
  const SPIN_KEY = "pishentech:eat:spins:v1";
  const MAX_CANDIDATES = 8;
  const MAX_HISTORY = 12;
  const SPIN_MS = 4600;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const els = {
    wheel: $("[data-wheel]"),
    stage: $("[data-wheel-stage]"),
    hub: $(".eat-hub"),
    hubMain: $(".eat-hub-main"),
    hubSub: $(".eat-hub-sub"),
    result: $("[data-result]"),
    history: $("[data-history]"),
    clear: $("[data-clear-history]"),
    shuffle: $("[data-shuffle]"),
    shuffleLabel: $("[data-shuffle-label]"),
    spinLabel: $("[data-spin-label]"),
    prefs: $(".eat-prefs"),
    avoid: $("[data-avoid-history]"),
    toast: $("[data-toast]")
  };

  /* ========================================================================
     二、状态
     ======================================================================== */
  const state = {
    budget: 0,
    spice: "any",
    avoidHistory: true,
    candidates: [],
    winner: null,
    pendingIndex: -1,
    rotation: 0,
    spinning: false,
    hasResult: false,
    decided: false,
    spinCount: 0,
    history: [],
    spinTimer: null
  };

  /* ========================================================================
     三、小工具
     ======================================================================== */
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

  function todayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  function readStore(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeStore(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      /* 隐私模式下写不进去也没关系，页面照常能用 */
    }
  }

  let toastTimer = null;
  function showToast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      els.toast.classList.remove("is-visible");
    }, 2800);
  }

  /* ========================================================================
     四、筛选 & 计数
     ======================================================================== */
  function filteredPool() {
    let pool = DISHES.slice();

    if (state.budget) {
      pool = pool.filter((dish) => dish.price <= state.budget);
    }

    if (state.spice !== "any") {
      const level = Number(state.spice);
      pool = pool.filter((dish) => dish.spicy === level);
    }

    if (state.avoidHistory && state.history.length) {
      const eaten = new Set(state.history.map((item) => item.name));
      pool = pool.filter((dish) => !eaten.has(dish.name));
    }

    return pool;
  }

  function updateStats() {
    const poolCount = filteredPool().length;
    const candidateCount = Math.min(MAX_CANDIDATES, poolCount);

    $$("[data-pool-count]").forEach((element) => {
      element.textContent = String(poolCount);
    });
    $$("[data-candidate-count]").forEach((element) => {
      element.textContent = String(candidateCount);
    });
    $$("[data-candidate-copy]").forEach((element) => {
      element.textContent = poolCount ? `随机抽 ${candidateCount} 个` : "先放宽条件";
    });
    $$("[data-spin-count]").forEach((element) => {
      element.textContent = String(state.spinCount).padStart(2, "0");
    });
  }

  function updateSpinLabel() {
    if (!els.spinLabel) return;
    if (state.spinning) {
      els.spinLabel.textContent = "转盘正在转…";
    } else if (state.hasResult) {
      els.spinLabel.textContent = "再转一次";
    } else {
      els.spinLabel.textContent = "转一转，听天由命";
    }
  }

  function updateAvailability() {
    const poolCount = filteredPool().length;
    $$("[data-spin]").forEach((button) => {
      button.disabled = state.spinning || poolCount === 0;
    });
    if (els.shuffle) {
      const allShown = poolCount > 0 && poolCount <= MAX_CANDIDATES;
      els.shuffle.disabled = state.spinning || poolCount <= MAX_CANDIDATES;
      els.shuffle.setAttribute(
        "aria-label",
        poolCount === 0
          ? "当前条件下没有候选"
          : allShown
            ? "当前条件下的候选已经全部在转盘上"
            : "重新抽取一批候选"
      );
      if (els.shuffleLabel) {
        els.shuffleLabel.textContent = allShown ? "全部在这" : "换一批";
      }
    }
    $$(".eat-chip").forEach((chip) => {
      chip.disabled = state.spinning;
    });
    if (els.avoid) {
      els.avoid.disabled = state.spinning;
    }
    if (els.clear) {
      els.clear.disabled = state.spinning;
    }
  }

  function setBusy(busy) {
    state.spinning = busy;
    if (els.stage) {
      els.stage.classList.toggle("is-spinning", busy);
    }
    updateSpinLabel();
    updateAvailability();
  }

  /* ========================================================================
     五、转盘绘制
     ======================================================================== */
  function polar(radius, angle) {
    const radians = (angle * Math.PI) / 180;
    return {
      x: 250 + radius * Math.cos(radians),
      y: 250 + radius * Math.sin(radians)
    };
  }

  function layoutLabels(rotation) {
    if (!els.wheel) return;
    const offset = ((rotation % 360) + 360) % 360;
    $$(".eat-wheel-label[data-angle]", els.wheel).forEach((label) => {
      const angle = Number(label.dataset.angle) + offset;
      const point = polar(151, angle);
      label.setAttribute("x", point.x.toFixed(2));
      label.setAttribute("y", point.y.toFixed(2));
    });
  }

  function renderWheel() {
    if (!els.wheel) return;
    els.wheel.classList.remove("is-labels-hidden");
    const list = state.candidates;

    if (!list.length) {
      els.wheel.innerHTML = `
        <circle cx="250" cy="250" r="239" fill="none" stroke="#eccfb4" stroke-width="1.3" stroke-dasharray="2 10"/>
        <circle cx="250" cy="250" r="214" fill="#fff8ee" stroke="#e2cbb4" stroke-width="1.5" stroke-dasharray="7 8"/>
        <text x="250" y="352" text-anchor="middle" fill="#a5886f" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="16" font-weight="700">条件太严格了</text>
        <text x="250" y="378" text-anchor="middle" fill="#c4a88f" font-family="'SFMono-Regular',Consolas,monospace" font-size="9" letter-spacing="2">TRY WIDER FILTERS</text>
      `;
      els.wheel.setAttribute("aria-label", "当前筛选条件下没有可选的菜，请放宽预算或辣度。");
      if (els.hub) els.hub.setAttribute("aria-label", "当前条件下没有可选菜品");
      if (els.hubMain) els.hubMain.textContent = "空";
      if (els.hubSub) els.hubSub.textContent = "CHANGE FILTERS";
      return;
    }

    if (els.hub) els.hub.setAttribute("aria-label", "转动转盘");
    if (els.hubMain) els.hubMain.textContent = "转";
    if (els.hubSub) els.hubSub.textContent = "LET FATE DECIDE";

    if (list.length === 1) {
      const dish = list[0];
      els.wheel.innerHTML = `
        <defs>
          <radialGradient id="eatWheelGloss" cx="35%" cy="26%" r="78%">
            <stop offset="0" stop-color="#ffffff" stop-opacity=".30"/>
            <stop offset=".6" stop-color="#ffffff" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="250" cy="250" r="239" fill="none" stroke="#eccfb4" stroke-width="1.3" stroke-dasharray="2 10"/>
        <circle cx="250" cy="250" r="228" fill="none" stroke="#fffaf2" stroke-width="10"/>
        <g class="eat-wheel-rotor" data-rotor>
          <circle cx="250" cy="250" r="214" fill="${SECTOR_COLORS[0]}" class="eat-wheel-sector" data-index="0"/>
        </g>
        <circle cx="250" cy="250" r="214" fill="url(#eatWheelGloss)" pointer-events="none"/>
        <circle cx="250" cy="250" r="88" fill="#fffaf2" stroke="#f5e3d0" stroke-width="1.4"/>
        <g class="eat-wheel-labels">
          <text x="250" y="356" text-anchor="middle" dominant-baseline="middle" class="eat-wheel-label" aria-hidden="true">${escapeHTML(dish.short)}</text>
          <text x="250" y="384" text-anchor="middle" fill="#7a5237" font-family="'SFMono-Regular',Consolas,monospace" font-size="8" letter-spacing="1.6" aria-hidden="true">THE ONLY CHOICE</text>
        </g>
      `;
      els.wheel.setAttribute("aria-label", `今天吃什么的转盘，唯一候选是${dish.name}。`);
      return;
    }

    const step = 360 / list.length;
    const largeArc = step > 180 ? 1 : 0;
    let sectors = "";
    let labels = "";
    let dots = "";

    for (let index = 0; index < 24; index += 1) {
      const dot = polar(232, index * 15);
      dots += `<circle cx="${dot.x.toFixed(1)}" cy="${dot.y.toFixed(1)}" r="1.4" fill="#d9b995" opacity=".75"/>`;
    }

    list.forEach((dish, index) => {
      const startAngle = -90 + index * step;
      const endAngle = startAngle + step;
      const start = polar(214, startAngle);
      const end = polar(214, endAngle);
      const labelAngle = startAngle + step / 2;
      const labelPoint = polar(151, labelAngle);
      const path = [
        `M 250 250`,
        `L ${start.x.toFixed(2)} ${start.y.toFixed(2)}`,
        `A 214 214 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
        `Z`
      ].join(" ");

      sectors += `<path d="${path}" fill="${SECTOR_COLORS[index % SECTOR_COLORS.length]}" class="eat-wheel-sector" data-index="${index}"/>`;
      labels += `<text x="${labelPoint.x.toFixed(2)}" y="${labelPoint.y.toFixed(2)}" text-anchor="middle" dominant-baseline="middle" class="eat-wheel-label" data-index="${index}" data-angle="${labelAngle.toFixed(2)}" aria-hidden="true">${escapeHTML(dish.short)}</text>`;
    });

    els.wheel.innerHTML = `
      <defs>
        <radialGradient id="eatWheelGloss" cx="35%" cy="26%" r="78%">
          <stop offset="0" stop-color="#ffffff" stop-opacity=".30"/>
          <stop offset=".6" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="250" cy="250" r="239" fill="none" stroke="#eccfb4" stroke-width="1.3" stroke-dasharray="2 10"/>
      <circle cx="250" cy="250" r="228" fill="none" stroke="#fffaf2" stroke-width="10"/>
      <g class="eat-wheel-rotor" data-rotor>
        ${dots}
        ${sectors}
      </g>
      <circle cx="250" cy="250" r="214" fill="none" stroke="#fffaf2" stroke-width="4"/>
      <circle cx="250" cy="250" r="214" fill="url(#eatWheelGloss)" pointer-events="none"/>
      <circle cx="250" cy="250" r="88" fill="#fffaf2" stroke="#f5e3d0" stroke-width="1.4"/>
      <g class="eat-wheel-labels">${labels}</g>
    `;

    els.wheel.setAttribute("aria-label", `今天吃什么的转盘，候选：${list.map((dish) => dish.name).join("、")}。`);
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

  function rebuildWheel(options) {
    const settings = options || {};
    if (state.spinning) return;

    const commit = () => {
      const pool = filteredPool();
      state.candidates = sample(pool, Math.min(MAX_CANDIDATES, pool.length));
      state.winner = null;
      state.pendingIndex = -1;
      renderWheel();
      resetRotation();
      updateStats();
      updateAvailability();
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
      }, 170);
    } else {
      commit();
    }
  }

  function highlightWinner(index) {
    $$(".eat-wheel-sector", els.wheel).forEach((sector, sectorIndex) => {
      sector.classList.toggle("is-winner", sectorIndex === index);
    });
    $$(".eat-wheel-label", els.wheel).forEach((label, labelIndex) => {
      label.classList.toggle("is-winner", labelIndex === index);
    });

    // 单独画一层描边，避免被相邻扇区的白色分隔线盖住
    $$(".eat-wheel-highlight", els.wheel).forEach((element) => element.remove());
    const winner = $$(".eat-wheel-sector", els.wheel)[index];
    const rotor = $("[data-rotor]", els.wheel);
    if (!winner || !rotor || !winner.getAttribute("d")) return;

    const outline = document.createElementNS("http://www.w3.org/2000/svg", "path");
    outline.setAttribute("d", winner.getAttribute("d"));
    outline.setAttribute("fill", "none");
    outline.setAttribute("stroke", "#382216");
    outline.setAttribute("stroke-width", "4");
    outline.setAttribute("stroke-linejoin", "round");
    outline.setAttribute("class", "eat-wheel-highlight");
    outline.setAttribute("aria-hidden", "true");
    rotor.appendChild(outline);
  }

  /* ========================================================================
     六、结果区
     ======================================================================== */
  function emptyMarkup(title, text) {
    return `
      <div class="eat-result-empty">
        <span class="eat-empty-mark" aria-hidden="true">?</span>
        <h2>${escapeHTML(title || "答案还在转盘里")}</h2>
        <p>${escapeHTML(text || "点一下转盘中间的「转」，或者按下面的按钮。")}</p>
        <div class="eat-empty-steps" aria-hidden="true">
          <span><b>01</b>选条件</span>
          <span><b>02</b>转一转</span>
          <span><b>03</b>就吃这个</span>
        </div>
      </div>
    `;
  }

  function showEmpty(title, text) {
    state.hasResult = false;
    state.decided = false;
    state.winner = null;
    state.pendingIndex = -1;
    if (!els.result) return;
    els.result.classList.remove("is-decided");
    els.result.innerHTML = emptyMarkup(title, text);
    updateSpinLabel();
  }

  function showSpinning() {
    if (!els.result) return;
    els.result.classList.remove("is-decided");
    els.result.innerHTML = `
      <div class="eat-result-loading">
        <span class="eat-loading-plate" aria-hidden="true"></span>
        <h2>正在翻菜谱</h2>
        <p>让运气再飞一会儿……</p>
      </div>
    `;
  }

  function showResult(dish) {
    if (!els.result || !dish) return;
    state.hasResult = true;
    state.decided = false;
    state.winner = dish;
    els.result.classList.remove("is-decided");

    const tags = dish.tags.map((tag) => `<li>${escapeHTML(tag)}</li>`).join("");
    const categoryInitial = dish.category.slice(0, 1);
    const spice = SPICE_LABELS[dish.spicy] || "不辣";

    els.result.innerHTML = `
      <p class="eat-result-kicker">
        <span>TODAY'S PICK · 今日答案</span>
        <span class="eat-result-count">第 ${state.spinCount} 次翻牌</span>
      </p>

      <div class="eat-result-main">
        <span class="eat-result-cat" aria-hidden="true">${escapeHTML(categoryInitial)}</span>
        <div class="eat-result-headline">
          <h2 class="eat-result-name">${escapeHTML(dish.name)}</h2>
          <p class="eat-result-sub">${escapeHTML(dish.category)} · ${spice}</p>
        </div>
        <span class="eat-result-price">¥${dish.price}</span>
      </div>

      <p class="eat-result-note">${escapeHTML(dish.note)}</p>
      <ul class="eat-result-tags" aria-label="这道菜的关键词">${tags}</ul>
      <p class="eat-result-aside">转盘负责选，胃负责点头。</p>

      <div class="eat-result-actions">
        <button class="btn btn-primary eat-decide" type="button" data-decide>就吃这个</button>
        <button class="eat-again" type="button" data-spin>再转一次</button>
      </div>
    `;

    updateSpinLabel();
    updateAvailability();
  }

  /* ========================================================================
     七、转动
     ======================================================================== */
  function spin() {
    if (state.spinning) return;

    const pool = filteredPool();
    if (!pool.length) {
      showToast("这个条件下没菜了，放宽一点试试。");
      return;
    }

    const candidatesOutdated = state.candidates.length === 0
      || state.candidates.some((dish) => !pool.includes(dish));

    if (candidatesOutdated) {
      rebuildWheel();
    }

    if (!state.candidates.length) return;

    window.clearTimeout(state.spinTimer);
    state.pendingIndex = randomInt(state.candidates.length);
    state.spinCount += 1;
    saveSpins();
    updateStats();

    setBusy(true);
    showSpinning();

    const count = state.candidates.length;
    const step = count === 1 ? 360 : 360 / count;
    const center = (state.pendingIndex + 0.5) * step;
    const current = ((state.rotation % 360) + 360) % 360;
    const delta = (((-center - current) % 360) + 360) % 360;
    const turns = prefersReducedMotion() ? 1 : 5 + randomInt(2);
    const target = state.rotation + turns * 360 + delta;
    const rotor = $("[data-rotor]", els.wheel);

    if (!rotor) {
      setBusy(false);
      showEmpty("转盘卡住了", "刷新一下页面，再转一次。");
      return;
    }

    $$(".is-winner", els.wheel).forEach((element) => element.classList.remove("is-winner"));
    $$(".eat-wheel-highlight", els.wheel).forEach((element) => element.remove());
    els.wheel.classList.remove("is-refreshing");
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
      showEmpty("转盘卡住了", "换个条件，再转一次。");
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

    if (window.matchMedia("(max-width: 920px)").matches) {
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
     八、记录
     ======================================================================== */
  function loadHistory() {
    const saved = readStore(HISTORY_KEY, null);
    if (!saved || saved.date !== todayKey() || !Array.isArray(saved.items)) return [];
    return saved.items
      .filter((item) => item && item.name && Number.isFinite(item.at))
      .slice(-MAX_HISTORY);
  }

  function saveHistory() {
    writeStore(HISTORY_KEY, { date: todayKey(), items: state.history });
  }

  function loadSpins() {
    const saved = readStore(SPIN_KEY, null);
    if (!saved || saved.date !== todayKey()) return 0;
    return Math.max(0, Number(saved.count) || 0);
  }

  function saveSpins() {
    writeStore(SPIN_KEY, { date: todayKey(), count: state.spinCount });
  }

  function addHistory(dish) {
    const last = state.history[state.history.length - 1];
    if (last && last.name === dish.name) return;
    state.history.push({
      name: dish.name,
      short: dish.short,
      category: dish.category,
      price: dish.price,
      at: Date.now()
    });
    if (state.history.length > MAX_HISTORY) {
      state.history.shift();
    }
    saveHistory();
  }

  function renderHistory() {
    if (!els.history) return;
    if (els.clear) {
      els.clear.hidden = state.history.length === 0;
    }

    if (!state.history.length) {
      els.history.innerHTML = '<span class="eat-history-empty">还没有定下第一顿，转一次试试。</span>';
      return;
    }

    els.history.innerHTML = state.history.slice().reverse().map((item) => `
      <span class="eat-history-item">
        <span class="eat-history-cat" aria-hidden="true">${escapeHTML(String(item.category || "").slice(0, 1))}</span>
        <span>${escapeHTML(item.name)}</span>
        <time datetime="${new Date(item.at).toISOString()}">${formatTime(item.at)}</time>
      </span>
    `).join("");
  }

  function decide() {
    if (!state.winner) return;
    if (state.decided) {
      showToast("已经记下啦，就吃它。");
      return;
    }

    state.decided = true;
    addHistory(state.winner);

    const button = els.result ? els.result.querySelector("[data-decide]") : null;
    if (button) {
      button.disabled = true;
      button.textContent = "✓ 已经记下";
    }
    if (els.result) {
      els.result.classList.add("is-decided");
    }

    burstConfetti();
    renderHistory();
    updateStats();
    showToast(`已记下：${state.winner.name}。别反悔。`);

    if (state.avoidHistory) {
      window.setTimeout(() => {
        if (!state.spinning) {
          rebuildWheel({ animate: true });
        }
      }, 720);
    }
  }

  function burstConfetti() {
    if (!els.result || prefersReducedMotion()) return;

    const layer = document.createElement("div");
    layer.className = "eat-confetti";
    els.result.appendChild(layer);

    for (let index = 0; index < 18; index += 1) {
      const piece = document.createElement("i");
      piece.style.background = SECTOR_COLORS[index % SECTOR_COLORS.length];
      piece.style.left = `${44 + randomInt(34)}%`;
      piece.style.top = `${34 + randomInt(22)}%`;
      layer.appendChild(piece);

      const x = randomInt(180) - 90;
      const y = -(50 + randomInt(120));
      const rotate = randomInt(300) - 150;

      if (typeof piece.animate === "function") {
        piece.animate([
          { transform: "translate(0, 0) rotate(0deg) scale(.7)", opacity: 1 },
          { transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(1)`, opacity: 0 }
        ], {
          duration: 720 + randomInt(420),
          easing: "cubic-bezier(.2,.7,.3,1)",
          fill: "forwards"
        });
      }
    }

    window.setTimeout(() => layer.remove(), 1400);
  }

  /* ========================================================================
     九、时间文案
     ======================================================================== */
  function mealName(hour) {
    if (hour < 5) return "夜宵";
    if (hour < 10) return "早餐";
    if (hour < 14) return "午饭";
    if (hour < 17) return "下午茶";
    if (hour < 21) return "晚饭";
    return "夜宵";
  }

  function updateClock() {
    const now = new Date();
    const clock = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const dateText = new Intl.DateTimeFormat("zh-CN", {
      month: "long",
      day: "numeric",
      weekday: "long"
    }).format(now);

    $$("[data-clock]").forEach((element) => {
      element.textContent = clock;
    });
    $$("[data-meal]").forEach((element) => {
      element.textContent = mealName(now.getHours());
    });
    $$("[data-today]").forEach((element) => {
      element.textContent = dateText;
    });
    $$("[data-year]").forEach((element) => {
      element.textContent = String(now.getFullYear());
    });
  }

  /* ========================================================================
     十、交互
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

  function handlePrefClick(event) {
    if (!(event.target instanceof Element) || state.spinning) return;
    const chip = event.target.closest(".eat-chip");
    if (!chip) return;

    if (chip.dataset.budget !== undefined) {
      state.budget = Number(chip.dataset.budget) || 0;
      $$("[data-budget]", els.prefs).forEach((button) => {
        const active = Number(button.dataset.budget) === state.budget;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    }

    if (chip.dataset.spice !== undefined) {
      state.spice = chip.dataset.spice;
      $$("[data-spice]", els.prefs).forEach((button) => {
        const active = button.dataset.spice === state.spice;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    }

    const pool = filteredPool();
    if (!pool.length) {
      showEmpty("这个条件太严格了", "放宽预算或者辣度，菜就回来了。");
    } else {
      showEmpty("答案还在转盘里", "条件换好了，再转一次。");
    }
    rebuildWheel({ animate: true });
    updateStats();
  }

  function handleShuffle() {
    if (state.spinning) return;
    if (filteredPool().length < 2) return;
    showEmpty("答案还在转盘里", "换了一批候选，挑个顺眼的再转。");
    rebuildWheel({ animate: true });
  }

  function handleClearHistory() {
    if (!state.history.length) return;
    const hadResult = state.hasResult || state.decided;
    state.history = [];
    saveHistory();
    renderHistory();
    updateStats();
    if (hadResult) {
      showEmpty("记录清空了", "重新转一次，看看今天吃什么。");
    }
    if (!state.spinning) {
      rebuildWheel({ animate: true });
    }
    showToast("记录清空了，今天可以重新来过。");
  }

  function handleAvoidChange() {
    if (state.spinning) {
      els.avoid.checked = state.avoidHistory;
      return;
    }
    state.avoidHistory = els.avoid.checked;
    showEmpty("答案还在转盘里", state.avoidHistory ? "今天吃过的已经排除，再转一次。" : "今天吃过的也会出现，再转一次。");
    rebuildWheel({ animate: true });
    updateStats();
  }

  function init() {
    state.history = loadHistory();
    state.spinCount = loadSpins();
    state.avoidHistory = !els.avoid || els.avoid.checked;

    renderHistory();
    updateClock();
    window.setInterval(updateClock, 30000);

    bindEvents();
    rebuildWheel();
    showEmpty();
    updateStats();
    updateSpinLabel();
  }

  function bindEvents() {
    document.addEventListener("click", handleGlobalClick);
    if (els.prefs) {
      els.prefs.addEventListener("click", handlePrefClick);
    }
    if (els.shuffle) {
      els.shuffle.addEventListener("click", handleShuffle);
    }
    if (els.clear) {
      els.clear.addEventListener("click", handleClearHistory);
    }
    if (els.avoid) {
      els.avoid.addEventListener("change", handleAvoidChange);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
