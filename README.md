# 皮神科技 · 作品页

现在网站以**作品页**为主，并增加了智慧树学习助手说明（`/zhihuishu/`）和「今天吃什么」系列（`/eat/` 是入口，里面有北洋园 / 卫津路、校内 / 附近四个转盘）。打开首页就是作品列表，没有首页大横幅，也没有关于页。整体仍然是浅色背景、蓝色主色、圆角卡片，手机上是一列卡片，不用横向滚动。



---

## 1. 怎么打开

### 最简单：双击

打开文件夹，双击 **`index.html`**。

### 本地预览

如果 DSH 还开着，可以访问：

**http://127.0.0.1:4173**

关掉 DSH 后这个地址会失效，不影响双击 `index.html`。

### 用 VS Code

1. 用 VS Code 打开整个 `pishentech-site` 文件夹。
2. 安装 **Live Server** 插件。
3. 右键 `index.html`，选 **Open with Live Server**。
4. 改完保存，浏览器自动刷新。

---

## 2. 文件都是干什么的

```text
pishentech-site/
├── index.html          ← 作品列表
├── 404.html            ← 找不到页面时显示
├── zhihuishu/
│   └── index.html      ← 智慧树学习助手：使用方法和 API Key 配置
├── eat/
│   ├── index.html      ← 今天吃什么：入口页，选择校区和场景
│   ├── data.js         ← ★ 四个转盘的菜谱，在这里加菜
│   ├── eat.css         ← 入口页和转盘页样式
│   ├── eat.js          ← 转盘逻辑（一般别动）
│   ├── beiyang-campus/
│   │   └── index.html  ← 北洋园 · 校内
│   ├── beiyang-nearby/
│   │   └── index.html  ← 北洋园 · 附近
│   ├── weijin-campus/
│   │   └── index.html  ← 卫津路 · 校内
│   └── weijin-nearby/
│       └── index.html  ← 卫津路 · 附近
├── css/
│   └── style.css       ← 颜色、圆角、卡片、手机布局
├── js/
│   ├── data.js         ← ★ 作品、邮箱、GitHub
│   └── site.js         ← 交互：卡片点击（一般别动）
├── assets/
│   ├── cover-food.svg             ← 今天吃什么作品封面
│   ├── cover-zhihuishu.svg        ← 智慧树作品封面
│   └── downloads/
│       └── zhihuishu-helper.zip   ← 可下载的 Windows 工具包
├── CNAME               ← GitHub Pages 的域名文件
├── robots.txt          ← 搜索引擎抓取规则
├── sitemap.xml         ← 给搜索引擎的网站地图
└── README.md           ← 这份说明书
```

**记住：作品和邮箱去 `js/data.js`，转盘菜谱去 `eat/data.js`，颜色去 `css/style.css`。**

---

## 3. 先换掉这些示例内容

打开 `js/data.js`：

- [ ] **`profile`**：品牌名、邮箱、GitHub。
- [ ] **`projects`**：当前作品，换成你真实的作品。
- [ ] **`categories`**：分类只显示在卡片左上角，不再有顶部筛选按钮，一般不用改。

页面上的作品数量和“已开源”数量会自动计算，不用手改。

---

## 4. 怎么加一个新作品（重点）

### 4.1 改哪个文件、哪个位置

打开 **`js/data.js`**，按 **Ctrl + F** 搜索 `projects: [`：

- `projects: [` 后面就是作品列表。
- 每个作品是一个 `{ ... }` 块，块与块之间用英文逗号隔开。
- 列表最后是 `],`。

**在最后一个作品块的 `}` 后面补一个英文逗号，然后把新作品块粘贴进去。**

```js
    },
    {
      id: "my-new-app",
      title: "我的新作品",
      // ... 其他字段照下面模板填
    }
  ],
```

> 行号会因为加注释或加作品而变化，直接搜 `projects: [` 最稳。

### 4.2 复制这块模板

```js
    {
      id: "my-new-app",                    // 唯一英文编号，不能重复
      title: "我的新作品",                  // 卡片上的名字
      subtitle: "MY NEW APP",              // 英文小标题，可写 ""
      category: "web",                     // 必须是 categories 里有的 id
      year: "2026",                        // 年份
      description: "一句话介绍这个作品解决了什么问题。",
      tags: ["JavaScript", "Vue"],         // 技术标签，建议 3 个以内
      cover: "assets/my-new-app.png",      // 封面图，建议 1200×750
      coverAlt: "我的新作品封面",           // 图片说明
      link: "https://example.com",         // 点卡片后去哪里
      linkLabel: "在线试用",               // 主按钮文字
      code: "https://github.com/你的用户名/仓库名", // 没有代码就写 ""
      codeLabel: "查看代码",
      download: false                      // 直接下载文件才写 true
    },
```

### 4.3 字段说明

| 字段 | 怎么填 | 例子 |
| --- | --- | --- |
| `id` | 英文、短横线，不能重复 | `"focus-timer"` |
| `category` | 必须是 `categories` 里的 id | `"web"` / `"miniprogram"` / `"desktop"` / `"extension"` |
| `link` | 网页地址、小程序 URL Link、下载文件路径 | `"https://..."` 或 `"assets/downloads/app.zip"` |
| `code` | GitHub / Gitee 仓库地址；没有就 `""` | `"https://github.com/..."` |
| `download` | 点了直接下载写 `true`；打开网页写 `false` | `true` |

**小程序：** 普通浏览器不能直接拉起微信小程序。请在小程序后台生成 **URL Link**，把链接填到 `link`。

**下载：** 把文件放进 `assets`，例如 `assets/downloads/工具.zip`，然后：

```js
link: "assets/downloads/工具.zip",
linkLabel: "下载试用",
download: true
```

### 4.4 加完不显示？检查

1. 新作品前面有没有英文逗号？
2. `id` 有没有和别的作品重复？
3. `category` 是不是写成了不存在的分类？
4. 按 **F12** 看 Console 有没有红字。

### 4.5 关于分类

现在顶部的分类筛选按钮已经删掉了，`category` 只用来显示卡片左上角的分类角标。

如果新增一个分类，在 `js/data.js` **第 38 行** 的 `categories` 里加一行：

```js
{ id: "game", name: "小游戏" },
```

然后在作品的 `category` 里填 `"game"`。它不会生成筛选按钮，只会改变卡片角标。

### 4.6 新增的“智慧树学习助手”详情页

这次除了首页卡片，还新增了一个独立详情页：

- 页面：`zhihuishu/index.html`
- 封面：`assets/cover-zhihuishu.svg`
- 下载包：`assets/downloads/zhihuishu-helper.zip`

详情页只保留“使用方法”和“API Key 配置”，样式直接写在这个 HTML 文件里，不再单独引用 CSS 或 JS。

首页卡片在 `js/data.js` 的 `projects` 列表里，`id` 是 `zhihuishu-helper`，点击后进入 `zhihuishu/`。下载包内不包含任何 API Key。

### 4.7 「今天吃什么」：入口 + 四个转盘

- 入口页：`eat/index.html`（选择北洋园 / 卫津路、校内 / 附近）
- 四个转盘页：
  - `eat/beiyang-campus/index.html`：北洋园 · 校内
  - `eat/beiyang-nearby/index.html`：北洋园 · 附近
  - `eat/weijin-campus/index.html`：卫津路 · 校内
  - `eat/weijin-nearby/index.html`：卫津路 · 附近
- 菜谱：`eat/data.js`（四个 `dishes` 数组，已经清空）
- 样式和逻辑：`eat/eat.css`、`eat/eat.js`
- 封面：`assets/cover-food.svg`

首页卡片 `id` 是 `what-to-eat`，点击后进入 `eat/` 入口。整个应用不请求接口，也不上传数据。结果卡片只显示菜名、一句话简介和价格，没有分类、辣度或标签。

### 4.8 怎么给转盘加菜（重点）

菜品已经全部清空，四个转盘的 `dishes` 都是空数组。加菜只需要改 `eat/data.js`。

**第一步：找到要改的转盘**

| 页面 | 地址 | `data.js` 里的 key |
| --- | --- | --- |
| 北洋园 · 校内 | `/eat/beiyang-campus/` | `"beiyang-campus"` |
| 北洋园 · 附近 | `/eat/beiyang-nearby/` | `"beiyang-nearby"` |
| 卫津路 · 校内 | `/eat/weijin-campus/` | `"weijin-campus"` |
| 卫津路 · 附近 | `/eat/weijin-nearby/` | `"weijin-nearby"` |

**第二步：在 `dishes: [` 和 `]` 之间加一行**

```js
{ name: "菜名", note: "一句话简介", price: 26 },
```

**第三步：多道菜就多写几行，保存刷新**

```js
"beiyang-campus": {
  dishes: [
    { name: "番茄牛腩饭", note: "汤汁拌饭，一口下去很踏实。", price: 26 },
    { name: "黄焖鸡米饭", note: "香菇和鸡汤，永远站在米饭这边。", price: 24 },
    { name: "兰州牛肉面", note: "一清二白三红四绿，标准答案。", price: 22 }
  ]
},
```

注意：

- 每道菜末尾要有英文逗号，最后一道菜后面也可以留。
- 用英文双引号 `"` 和英文逗号 `,`，不要用中文的“”和，。
- `name` 建议 2～6 个字，转盘上才放得下；更长会自动缩小或省略号，结果卡片仍显示全名。
- `note` 写一句话；不想写可以留空 `""`。
- `price` 写数字，单位是元，不要写 `¥26` 或 `"26 元"`；显示时会自动加 `¥`。不写 `price` 时结果卡片不显示价格。
- 每个转盘最多抽 8 道菜上盘。超过 8 道时，转盘下方会出现「换一批」。
- 某个转盘保持 `dishes: []` 时，页面会显示空状态，不会报错。
- 加完不显示？先检查英文逗号和双引号，再按 **F12** 看 Console 有没有红字；`eat/data.js` 有语法错误时四个页面都会变空。

> 改完保存，刷新对应页面就能看到。四个页面共用 `eat/data.js`，不用分别改四个文件。

---

## 5. 换作品封面

1. 准备一张横向图片，建议 **1200 × 750**（16:10）。
2. 放进 `assets`，例如 `assets/my-weather.png`。
3. 在对应作品里改：
   ```js
   cover: "assets/my-weather.png",
   ```
4. 保存刷新。

文件名建议用英文和短横线，例如 `my-weather-cover.png`。图片路径区分大小写。

如果图片路径写错，会自动显示占位图，不会出现破图。

---

## 6. 怎么更新到 GitHub

现在网站已经部署在：

- 仓库：`https://github.com/pishenX/pishentech-site`
- 分支：`main`
- Pages 目录：`/ (root)`
- 自定义域名：`pishentech.cn`

### 这次“只留作品”改了哪些文件？

需要更新这些：

- `index.html`（首页改成了作品页，顶部“作品”导航已去掉）
- `css/style.css`（加了作品页样式）
- `js/data.js`（删除了关于页数据）
- `js/site.js`（删除了关于页和手机菜单逻辑）
- `404.html`（导航里去掉“关于”和顶部“作品”）
- `sitemap.xml`（去掉关于页地址）
- `README.md`

### 这次新增“智慧树”详情页需要上传

- `zhihuishu/index.html`
- `js/data.js`（新增卡片）
- `assets/cover-zhihuishu.svg`
- `assets/downloads/zhihuishu-helper.zip`
- `sitemap.xml`

### 这次新增「今天吃什么」需要上传

- `eat/index.html`
- `eat/data.js`
- `eat/eat.css`
- `eat/eat.js`
- `eat/beiyang-campus/index.html`
- `eat/beiyang-nearby/index.html`
- `eat/weijin-campus/index.html`
- `eat/weijin-nearby/index.html`
- `assets/cover-food.svg`
- `js/data.js`（更新卡片文案）
- `sitemap.xml`

最省事的做法还是把整个 `pishentech-site` 文件夹里的内容全选拖上去。上传 `eat` 文件夹时，记得连文件夹一起拖，不要只拖里面的单个文件，否则路径会变成 `/index.html` 而不是 `/eat/`。

### 还要删掉一个旧文件

**必须在 GitHub 上删除 `about.html`。**

因为 GitHub 不会因为你上传新文件就自动删除旧文件。操作：

1. 打开仓库，点 `about.html`。
2. 右上角找到垃圾桶图标 **Delete file**。
3. 点 **Commit changes**。

如果只是把整个文件夹重新上传一遍，`about.html` 还会留在仓库里，`https://pishentech.cn/about.html` 仍然能打开。

### 上传步骤

1. 仓库首页点 **Add file → Upload files**。
2. 打开电脑上的 `pishentech-site` 文件夹，全选里面的文件，拖进去。
3. 点 **Commit changes**。
4. 等 1～2 分钟，GitHub Pages 会自动重新发布。

以后只改作品文字/图片的话，通常只需要上传 `js/data.js` 和新图片，再删掉旧图片即可。

---

## 7. 域名和 HTTPS 现在是什么状态

`pishentech.cn` 已经解析到 GitHub Pages：

| 主机记录 | 类型 | 记录值 |
| --- | --- | --- |
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `www` | CNAME | `pishenx.github.io` |

> DNSPod 免费版每个主机记录最多 2 条同类型记录，所以只保留了两条 A。GitHub Pages 至少需要一条 A，两条已经够用；四条只是多一层备用线路。
>
> 参考：[DNSPod 负载均衡说明](https://docs.dnspod.cn/dns/load-balancing-service/)、[GitHub Pages 自定义域名文档](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)。

现在 `http://pishentech.cn` 已经可以打开网站。HTTPS 证书由 GitHub 自动申请，可能需要几分钟到 24 小时。等 **Enforce HTTPS** 可以勾选后，勾上，以后用 `https://pishentech.cn` 访问。

如果 GitHub Pages 仍显示 DNS 错误，先点一次 **Check again**，再等一会儿。

---

## 8. 想改颜色、标题

### 改主色

打开 `css/style.css`，第 10 行 `:root`：

```css
--blue: #2563eb;        /* 主蓝色 */
--blue-dark: #1d4ed8;   /* 深一点的蓝 */
--blue-soft: #eaf1ff;   /* 浅蓝背景 */
--bg: #f6f8fc;          /* 页面底色 */
```

### 改页面大标题

打开 `index.html`，**第 56 行**：

```html
<h1 class="works-title">皮神妙妙小工具<span class="title-dot">.</span></h1>
```

改文字时保留 `span` 和 `class`，这样蓝色小圆点还在。

### 改按钮、页脚文案

- 顶部“联系我”：`index.html` 第 40 行附近。
- 页脚标语：`js/data.js` 最下面 `copy`。
- 页面描述：`index.html` 第 60 行附近。

---

## 9. 常见问题

**Q：改完 `data.js` 刷新没变化？**  
按 **Ctrl + F5** 强制刷新；再确认改的是 `js/data.js`，不是 `site.js`。

**Q：图片不显示？**  
检查图片是否在 `assets` 里、文件名大小写是否一致、`cover` 路径有没有写错。

**Q：作品数量会自动变吗？**  
会。页面上的“02 个作品”“00 个已开源”都是自动算的。

**Q：为什么网站没有“关于”页了？**  
这是你选择的“只留作品”。如果以后想加回来，需要重新做页面并加导航。

**Q：小程序点不开？**  
把 `link` 换成微信小程序后台生成的 **URL Link**，普通浏览器不能直接拉起小程序。

**Q：需要买服务器吗？**  
不需要，GitHub Pages 免费额度够用。

---

## 10. 最后

这个网站现在有作品首页、一个工具详情页，以及「今天吃什么」入口和四个校区 / 场景转盘。作品卡片内容在 `js/data.js` 里；详情页是 `zhihuishu/index.html`，「今天吃什么」的入口和四个转盘在 `eat/` 下，菜谱统一放在 `eat/data.js`。加新作品时通常只需要改数据。

先替换示例作品和邮箱，再上传到 GitHub，网站就是你的了。
