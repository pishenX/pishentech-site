# 皮神科技 · 作品页

现在网站**只保留作品页**：打开就是作品列表，没有首页大横幅，也没有关于页。整体仍然是浅色背景、蓝色主色、圆角卡片，手机上是一列卡片，不用横向滚动。

> 现在页面里的 6 个作品还是**示例**，名字、简介、链接和封面都是假的。上线前请按第 3 节换成你自己的。

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
├── index.html          ← 唯一的页面：作品列表
├── 404.html            ← 找不到页面时显示
├── css/
│   └── style.css       ← 颜色、圆角、卡片、手机布局
├── js/
│   ├── data.js         ← ★ 最常改：作品、邮箱、GitHub
│   └── site.js         ← 交互：筛选、卡片点击（一般别动）
├── assets/             ← 作品封面、网站图标
├── CNAME               ← GitHub Pages 的域名文件
├── robots.txt          ← 搜索引擎抓取规则
├── sitemap.xml         ← 给搜索引擎的网站地图
└── README.md           ← 这份说明书
```

**记住：改内容去 `js/data.js`，改颜色去 `css/style.css`。**

---

## 3. 先换掉这些示例内容

打开 `js/data.js`：

- [ ] **第 18 行左右 `profile`**：品牌名、邮箱、GitHub。
- [ ] **第 69 行 `projects`**：6 个示例作品，换成你真实的作品。
- [ ] **第 38 行 `categories`**：分类不够用的话，在这里加。

页面上的作品数量和“已开源”数量会自动计算，不用手改。

---

## 4. 怎么加一个新作品（重点）

### 4.1 改哪个文件、哪一行

打开 **`js/data.js`**：

- **第 69 行**：`projects: [`，作品列表开始。
- **第 70 行**：第一个示例作品。
- **第 165 行**：最后一个作品结束。
- **第 166 行**：`],`，列表结束。

**在 `js/data.js` 第 166 行 `],` 的前面插入新作品。**  
也就是先给第 165 行的 `}` 补一个英文逗号，再粘贴一整块新作品。

```js
    },
    {
      id: "my-new-app",
      title: "我的新作品",
      // ... 其他字段照下面模板填
    }
  ],
```

> 行号可能会因为你加了注释而变化。最稳的方法：按 **Ctrl + F** 搜 `projects: [`。

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

### 4.5 想加分类？

在 `js/data.js` **第 38 行** 的 `categories` 里加一行：

```js
{ id: "game", name: "小游戏" },
```

然后在作品的 `category` 里填 `"game"`。

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

- `index.html`（首页改成了作品页）
- `css/style.css`（加了作品页样式）
- `js/data.js`（删除了关于页数据）
- `js/site.js`（删除了关于页和手机菜单逻辑）
- `404.html`（导航里去掉“关于”）
- `sitemap.xml`（去掉关于页地址）
- `README.md`

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

打开 `index.html`，**第 61 行**：

```html
<h1 class="works-title">一些做完了的小东西<span class="title-dot">.</span></h1>
```

改文字时保留 `span` 和 `class`，这样蓝色小圆点还在。

### 改按钮、页脚文案

- 顶部“联系我”：`index.html` 第 44 行附近。
- 页脚标语：`js/data.js` 最下面 `copy`。
- 页面描述：`index.html` 第 65 行附近。

---

## 9. 常见问题

**Q：改完 `data.js` 刷新没变化？**  
按 **Ctrl + F5** 强制刷新；再确认改的是 `js/data.js`，不是 `site.js`。

**Q：图片不显示？**  
检查图片是否在 `assets` 里、文件名大小写是否一致、`cover` 路径有没有写错。

**Q：作品数量会自动变吗？**  
会。页面上的“06 个作品”“04 个已开源”都是自动算的。

**Q：为什么网站没有“关于”页了？**  
这是你选择的“只留作品”。如果以后想加回来，需要重新做页面并加导航。

**Q：小程序点不开？**  
把 `link` 换成微信小程序后台生成的 **URL Link**，普通浏览器不能直接拉起小程序。

**Q：需要买服务器吗？**  
不需要，GitHub Pages 免费额度够用。

---

## 10. 最后

这个网站现在只有一页，内容都在 `js/data.js` 里。加作品时不用碰 HTML 和 CSS，改数据就行。

先替换示例作品和邮箱，再上传到 GitHub，网站就是你的了。
