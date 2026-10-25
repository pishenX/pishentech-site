# 皮神科技 · 个人作品集

这是一个纯 HTML / CSS / JavaScript 的静态个人网站：有首页作品墙、分类筛选、手机菜单、关于页和联系方式。不需要安装 Node.js，不需要数据库，也不需要买服务器。

> 先说明一件事：现在网站里的作品、头像、自我介绍都是**示例内容**。上线前请按第 3 节换成你自己的，不然别人会以为这些作品真的是你做的。

---

## 1. 先看看效果

### 方法一：直接双击（最简单）

打开文件夹，双击 **`index.html`**。会用你的默认浏览器打开。

### 方法二：本地预览地址

如果你现在正开着 DSH，可以打开：

**http://127.0.0.1:4173**

这是临时预览地址。DSH 关掉后它就会失效，不影响你双击 `index.html`。

### 方法三：用 VS Code（推荐以后改代码用）

1. 用 VS Code 打开整个 `pishentech-site` 文件夹。
2. 在扩展里搜索并安装 **Live Server**。
3. 右键 `index.html`，选 **Open with Live Server**。
4. 以后改完代码保存，浏览器会自动刷新。

> 直接双击也能正常看。只有「复制邮箱」在部分浏览器里可能受限制，用 Live Server 会更稳。

---

## 2. 每个文件是干什么的

```text
pishentech-site/
├── index.html          ← 首页（一般不用大改）
├── about.html          ← 关于页（一般不用大改）
├── 404.html            ← 找不到页面时显示的页面
├── css/
│   └── style.css       ← 所有样式：颜色、圆角、阴影、手机布局
├── js/
│   ├── data.js         ← ★ 你以后最常改的文件：作品、资料、技能、时间线
│   └── site.js         ← 交互逻辑：筛选、菜单、复制（一般别动）
├── assets/             ← 头像、作品封面、网站图标
├── CNAME               ← GitHub Pages 用的域名文件（内容是 pishentech.cn）
├── robots.txt          ← 告诉搜索引擎可以收录
├── sitemap.xml         ← 给搜索引擎的网站地图
└── README.md           ← 你正在看的这份说明书
```

**记住一句话：改内容去 `js/data.js`，改颜色去 `css/style.css`。**

---

## 3. 上线前，先换掉这些示例内容

打开 `js/data.js`，从上往下改：

- [ ] **第 17 行左右 `profile`**：名字、身份、所在地、邮箱、GitHub、微信号、状态。
- [ ] **第 22 行 `avatar`**：把 `assets/avatar.svg` 换成你的头像文件。
- [ ] **第 77 行 `projects`**：6 个示例作品，换成你真实的作品。
- [ ] **第 181 行左右 `about`**：自我介绍、近况、技能、学习经历。
- [ ] 首页大标题和段落：在 `index.html` 里（第 104～116 行附近）。
- [ ] `README` 里提到的邮箱和 GitHub，记得同步换成真实的。

改完记得保存，然后刷新网页（Windows 上按 **Ctrl + F5** 强制刷新）。

---

## 4. 怎么加一个新作品（重点）

### 4.1 打开哪个文件？

打开 **`js/data.js`**。

作品列表从 **第 77 行** 的 `projects: [` 开始。第一个示例在第 78 行，最后一个作品在第 173 行结束，第 174 行是列表的右方括号 `],`。

> 如果你以后在文件上面加了别的内容，行号可能会变。最稳的方法是：用 VS Code 的搜索（Ctrl + F）搜 `projects: [`，就能直接跳到作品列表。

**你以后加新作品：在 `js/data.js` 第 174 行 `],` 的前面插入。**  
也就是放在最后一个作品的 `}` 后面，先加一个英文逗号，再粘贴新作品。

原来是这样的：

```js
    }
  ],
```

加了新作品以后变成：

```js
    },
    {
      id: "my-new-app",
      // ... 其他字段
    }
  ],
```

注意看：原来的 `}` 后面多了一个逗号，新作品整个 `{ ... }` 放在它后面。这是新手最容易漏的地方。

### 4.2 复制这段模板

把下面这一整块复制过去，粘在最后一个作品后面。每一项都要有英文冒号 `:`，最后一项后面不要多余逗号（加了现代浏览器也能运行，但新手容易乱）。

```js
    {
      id: "my-new-app",                    // 唯一英文编号，不能重复
      title: "我的新作品",                  // 卡片上的名字
      subtitle: "MY NEW APP",              // 英文小标题，可以写 ""
      category: "web",                     // 必须是 categories 里有的 id
      year: "2026",                        // 年份
      description: "一句话介绍这个作品解决了什么问题。", // 建议 20～45 个字
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

### 4.3 几个字段怎么填

| 字段 | 怎么填 | 例子 |
| --- | --- | --- |
| `id` | 英文、短横线，不能重复 | `"focus-timer"` |
| `category` | 必须是 `categories` 里已有的 id | `"web"` / `"miniprogram"` / `"desktop"` / `"extension"` |
| `link` | 网页地址、小程序 URL Link、下载文件路径 | `"https://..."` 或 `"assets/downloads/app.zip"` |
| `code` | GitHub / Gitee 仓库地址；没有就 `""` | `"https://github.com/..."` |
| `download` | 点了要直接下载，写 `true`；打开网页，写 `false` | `true` |

**关于小程序：** 普通浏览器不能直接拉起微信小程序。请在小程序后台生成 **URL Link**（或做一个放小程序码的页面），把生成的链接填到 `link`。不要直接把 `wx...` 开头的原始小程序路径填进去，那样点击是打不开的。

**关于下载：** 把 `.zip` / `.exe` 放到 `assets` 里（例如 `assets/downloads/工具.zip`），然后：

```js
link: "assets/downloads/工具.zip",
linkLabel: "下载试用",
download: true
```

### 4.4 加完不显示？检查这 4 件事

1. 新作品前面有没有 **英文逗号**？
2. `id` 是不是和别的作品重复？
3. `category` 是不是写成了不存在的分类？
4. 打开浏览器按 **F12** → Console，看有没有红色报错。最常见的报错是少了一个逗号或引号。

### 4.5 想加一个新分类？

在 `js/data.js` **第 46 行** 的 `categories` 里加一行：

```js
{ id: "game", name: "小游戏" },
```

然后把这个分类的 `id` 填到作品的 `category` 里。分类按钮和数量会自动出现。

---

## 5. 怎么换头像和作品封面

### 换头像

1. 准备一张正方形图片，建议 **400 × 400**，PNG / JPG / WebP 都行。
2. 把图片放进 `assets` 文件夹，例如 `assets/my-avatar.png`。
3. 打开 `js/data.js`，找到 **第 22 行**：
   ```js
   avatar: "assets/avatar.svg",
   ```
   改成：
   ```js
   avatar: "assets/my-avatar.png",
   ```
4. 保存，刷新。

### 换作品封面

1. 准备一张横向图片，建议 **1200 × 750**（16:10）。
2. 放进 `assets`，例如 `assets/my-weather.png`。
3. 在对应作品的 `cover` 字段里改路径：
   ```js
   cover: "assets/my-weather.png",
   ```
4. 如果图片路径写错，网站会自动显示一张「作品封面」占位图，不会出现破图。

> 小建议：文件名用英文和短横线，不要用空格，例如 `my-weather-cover.png`。虽然中文文件名也能用，但部署到一些平台时容易出问题。

---

## 6. 怎么上线到 pishentech.cn

### 先看现状（截至 2026-10-25）

我查了一下，`pishentech.cn` 现在：

- 域名服务器（NS）在 **DNSPod**；
- 还没有设置 `A` 记录或 `CNAME` 记录；
- 所以现在访问 `pishentech.cn` 是打不开网站的。

也就是说，网站文件已经做好了，但还差两步：**先放到一个能访问的主机上，再去 DNSPod 做域名解析。**

> 这一步必须在你的 DNSPod / 腾讯云账号里操作。我没有你的账号，也不能替你登录。千万不要把密码发给任何人。

### 方案 A：GitHub Pages（免费，步骤最明确）

适合：有 GitHub 账号，愿意花 10 分钟。

1. 登录 GitHub，新建一个仓库，名字随意，例如 `pishentech-site`，选 **Public**。
2. 把 `pishentech-site` 文件夹**里面的所有文件**上传到仓库根目录：
   - 在仓库首页点 **Add file → Upload files**（新仓库也可以点 **uploading an existing file**）。
   - 打开 `pishentech-site` 文件夹，按 **Ctrl + A** 全选里面的文件（`index.html`、`about.html`、`css/`、`js/`、`assets/`、`CNAME` 等），一起拖进网页。
   - **不要**把最外层的 `pishentech-site` 文件夹整个拖进去，否则 `index.html` 会跑到子文件夹里，Pages 首页会 404。
   - 拖完点 **Commit changes**。上传后确认仓库首页直接就能看到 `index.html`，而不是先看到一个文件夹。
   - `.nojekyll` 是隐藏文件，网页上传时看不到也没关系，可以跳过。
3. 进入仓库 **Settings → Pages**：
   - Source 选 **Deploy from a branch**
   - Branch 选 **main**，目录选 **/(root)**
   - 点 **Save**
4. 等 1～2 分钟，GitHub 会给你一个临时地址，例如 `https://你的用户名.github.io/pishentech-site/`。
   - 如果它自动跳到了 `pishentech.cn` 并且打不开，不要慌：这是因为仓库里的 `CNAME` 文件已经生效了。
   - 直接继续第 5 步做 DNS 解析，解析完成后就能正常打开。
5. 在 **Settings → Pages → Custom domain** 里填 `pishentech.cn`，点 **Save**。如果这里已经自动填好了，就不用再动。
6. 去 **DNSPod** 添加下面这些记录：

| 主机记录 | 类型 | 记录值 | TTL |
| --- | --- | --- | --- |
| `@` | A | `185.199.108.153` | 600 |
| `@` | A | `185.199.109.153` | 600 |
| `@` | A | `185.199.110.153` | 600 |
| `@` | A | `185.199.111.153` | 600 |
| `www` | CNAME | `你的GitHub用户名.github.io` | 600 |

> 这四个 A 记录是 GitHub Pages 官方地址，分别加四条，不是只加一条。
> `www` 那条把「你的GitHub用户名」换成真的用户名，不要带 `https://`。

7. 回 GitHub Pages 等 DNS 检查通过，再勾选 **Enforce HTTPS**。
8. 打开 `https://pishentech.cn` 测试。DNS 生效通常几分钟，偶尔要等几小时。

项目根目录里的 `CNAME` 文件已经写好了 `pishentech.cn`，不用再新建。

### 方案 B：Netlify Drop（不想用 GitHub 的话）

1. 打开 `https://app.netlify.com/drop`。
2. 把整个 `pishentech-site` 文件夹拖进去。
3. 注册 / 登录 Netlify，保留这个站点。
4. 在 **Domain management** 里添加 `pishentech.cn`。
5. Netlify 会显示它要求的 DNS 记录。**按 Netlify 显示的值去 DNSPod 添加**，不要照抄方案 A 的 GitHub 地址。两家平台的记录值不一样。

### 我不能直接帮你点「保存」的原因

域名解析需要登录你的 DNSPod 账号，这是你的私人账号。我能做的是：帮你把文件准备好、把记录值算清楚、在你操作后帮你检查有没有生效。

如果你把「用 GitHub Pages 还是 Netlify」定下来，我可以继续一步一步带你点。

### 上线后怎么更新网站

- GitHub Pages：把修改后的文件重新上传到仓库，提交一次即可。
- Netlify：重新拖一次文件夹，或在站点里重新部署。
- 更新后强制刷新浏览器（Ctrl + F5）。

---

## 7. 想改颜色、字体、首页标题

### 改主色

打开 `css/style.css`，最上面 **第 10 行** 的 `:root` 里：

```css
--blue: #2563eb;        /* 主蓝色 */
--blue-dark: #1d4ed8;   /* 深一点的蓝 */
--blue-soft: #eaf1ff;   /* 浅蓝背景 */
--bg: #f6f8fc;          /* 页面底色 */
```

把颜色值换掉即可。比如想换成紫色，可以把 `--blue` 改成 `#7c3aed`，`--blue-dark` 改成 `#6d28d9`，`--blue-soft` 改成 `#f1eafe`。

### 改首页大标题

打开 `index.html`，找到 **第 104～107 行**：

```html
<h1 class="hero-title">
  <span class="hero-title-line">把有趣的小想法，</span>
  <span class="hero-title-line">做成<span class="mark">好用的小软件</span>。</span>
</h1>
```

`class="mark"` 的那几个字会有蓝色高亮。改文字时保留这两个 `span` 的结构，手机上的换行才不会乱。

### 改按钮、章节标题

- 首页按钮文字：`index.html` 里搜「看看作品」「认识我」。
- 作品区大标题：`index.html` 里搜「一些做完了的小东西」。
- 关于页大标题：`about.html` 里搜「写代码」。
- 页脚文案：`js/data.js` 最下面 `copy` 那一段。

---

## 8. 手机和菜单

- 电脑上导航在顶部中间；手机上会变成一个 **☰ 按钮**，点开是下拉菜单。
- 点菜单里的链接、点页面空白处、按 **Esc**，都会自动收起菜单。
- 屏幕变宽后菜单会自动关闭，不会挡住页面。
- 作品卡片在手机上是 **一列**，不会左右滚动。
- 分类按钮会自动换行，不需要横向滑动。

如果你在手机上看到横向滚动条，通常是某张图片太宽。检查新加的封面尺寸，或者按 **F12** → 切换手机模式 → 看哪个元素超出了屏幕。

---

## 9. 常见问题

**Q：我改完 `data.js`，刷新没变化？**  
A：先按 **Ctrl + F5** 强制刷新；再检查是不是改错了文件（是 `js/data.js`，不是 `site.js`）；最后按 F12 看 Console 有没有红字。

**Q：图片不显示？**  
A：检查三件事：图片是不是真的在 `assets` 里、文件名大小写是否一致、`cover` / `avatar` 的路径有没有写错。路径区分大小写。

**Q：作品数量会自动变吗？**  
A：会。首页的「个作品」「个已开源」和分类按钮上的数字都是自动算的，不用手改。

**Q：为什么小程序点不开？**  
A：普通浏览器不能直接打开微信小程序。请把 `link` 换成微信小程序后台生成的 **URL Link**，或者做一个放小程序码的页面。

**Q：可以直接双击 `index.html` 吗？**  
A：可以，整个网站能正常浏览。只有「复制到剪贴板」在部分浏览器里需要本地服务器，如果复制失败，它会提示你手动复制。

**Q：需要买服务器吗？**  
A：不需要。这是纯静态网站，GitHub Pages / Netlify 的免费额度就够个人作品集用。

**Q：域名已经买了，为什么还打不开？**  
A：域名只是「门牌号」，还需要把网站放到主机上，再把域名解析过去。按第 6 节做。

---

## 10. 最后

这个网站没有后台，也没有数据库，所有内容都写在 `js/data.js` 里。它的好处是简单、快、免费、随时能改；坏处是每次加作品都要手动改文件。

慢慢来，不用一次改完。先把头像、名字、邮箱换成真的，再换一个作品试试；能跑通一个，剩下的就都会了。

如果哪天想加「文章」「留言」或者「后台管理」，再在这个基础上加就行。

—— 祝你做出自己喜欢的小东西。
