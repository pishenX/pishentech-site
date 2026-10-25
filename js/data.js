/* ==========================================================================
   data.js —— 整站内容配置中心
   --------------------------------------------------------------------------
   你以后 90% 的修改，都只需要动这一个文件。
   改完保存，刷新网页就能看到，不需要安装任何软件。

   注意：
   1. 英文冒号、逗号、引号不要删；每项之间用英文逗号隔开。
   2. 文字里如果要用英文双引号，请写成 \" 转义，或者直接用中文引号「」。
   3. 作品列表在文件下半部分，搜索「作品列表」就能快速找到。
   ========================================================================== */

window.SITE_DATA = {
  /* ------------------------------------------------------------------------
     一、基本信息
     现在网站只保留作品页，所以这里只放最常用的品牌、邮箱和 GitHub。
     ------------------------------------------------------------------------ */
  profile: {
    brand: "皮神科技",                         // 左上角品牌名
    email: "hello@pishentech.cn",              // 联系邮箱（记得换成真实可收信的邮箱）
    github: "https://github.com/pishenX"       // 你的 GitHub 主页
  },

  /* ------------------------------------------------------------------------
     二、作品数量文案
     数字会自动计算，不需要手动改。
     ------------------------------------------------------------------------ */
  stats: {
    projectsLabel: "个作品",
    openSourceLabel: "个已开源"
  },

  /* ------------------------------------------------------------------------
     三、作品分类
     id 必须使用英文，不能重复；name 是按钮上显示的中文。
     增加分类后，在作品里把 category 改成对应的 id 即可。
     ------------------------------------------------------------------------ */
  categories: [
    { id: "all", name: "全部" },
    { id: "miniprogram", name: "微信小程序" },
    { id: "web", name: "网页应用" },
    { id: "desktop", name: "桌面工具" },
    { id: "extension", name: "浏览器插件" }
  ],

  /* ========================================================================
     四、作品列表  ←←← 以后加新作品，主要改这里
     ------------------------------------------------------------------------
     ⚠️ 下面 6 个作品都是「示例」，名字、简介、链接、封面都是假的。
        上线前请把它们换成你真实的作品；换完之后，页面上的作品数量会自动更新。

     每个作品是一个 { ... } 块，复制一整块，粘贴到列表最后，再修改内容即可。
     字段说明：
       id          唯一英文编号，不能和别的作品重复
       title       作品名称
       subtitle    英文小标题（可以留空 ""）
       category    分类，要跟上面 categories 里的 id 一致
       year        年份，显示在卡片右上角
       description 一句话简介（建议 20～45 个字）
       tags        技术标签，用英文逗号隔开，建议 3 个以内
       cover       封面图片路径，建议 1200×750（16:10）
       coverAlt    图片说明，给看不见图片的人听
       link        点卡片 /「查看作品」按钮后跳转的地址
       linkLabel   主按钮文字，例如「打开小程序」「下载试用」
       code        查看代码的地址；没有就写 ""
       codeLabel   代码按钮文字
       download    如果是直接下载文件，设为 true；否则 false
     ======================================================================== */
  projects: [
    {
      id: "weather",
      title: "天气小窗",
      subtitle: "WEATHER WINDOW",
      category: "miniprogram",
      year: "2025",
      description: "把未来七天的天气，装进一张会呼吸的小卡片里。",
      tags: ["微信小程序", "原生开发", "和风天气"],
      cover: "assets/cover-weather.svg",
      coverAlt: "天气小窗作品封面，蓝色天空与七天天气预报界面",
      link: "#",
      linkLabel: "打开小程序",
      code: "#",
      codeLabel: "查看代码",
      download: false
    },
    {
      id: "what-to-eat",
      title: "今天吃什么",
      subtitle: "EAT SOMETHING",
      category: "miniprogram",
      year: "2024",
      description: "选择困难症终结者，转一转，决定今天这一餐。",
      tags: ["微信小程序", "云开发", "动效"],
      cover: "assets/cover-food.svg",
      coverAlt: "今天吃什么作品封面，暖色转盘与食物卡片",
      link: "#",
      linkLabel: "打开小程序",
      code: "",
      codeLabel: "查看代码",
      download: false
    },
    {
      id: "clipboard",
      title: "剪贴板管家",
      subtitle: "CLIPBOARD KEEPER",
      category: "desktop",
      year: "2025",
      description: "复制过的内容不再弄丢，历史记录随手就能翻到。",
      tags: ["Electron", "TypeScript", "Windows"],
      cover: "assets/cover-clipboard.svg",
      coverAlt: "剪贴板管家作品封面，深色桌面应用界面",
      link: "#",
      linkLabel: "下载试用",
      code: "#",
      codeLabel: "查看代码",
      download: true
    },
    {
      id: "paper-note",
      title: "纸间",
      subtitle: "PAPER NOTE",
      category: "web",
      year: "2024",
      description: "一个安静、即开即用的 Markdown 笔记本。",
      tags: ["JavaScript", "Markdown", "PWA"],
      cover: "assets/cover-note.svg",
      coverAlt: "纸间作品封面，米色写作界面与分栏预览",
      link: "#",
      linkLabel: "在线试用",
      code: "#",
      codeLabel: "查看代码",
      download: false
    },
    {
      id: "color-card",
      title: "色卡",
      subtitle: "COLOR CARD",
      category: "extension",
      year: "2023",
      description: "在网页上随手取色，把喜欢的配色收进口袋。",
      tags: ["Chrome 插件", "Canvas", "HSV"],
      cover: "assets/cover-color.svg",
      coverAlt: "色卡作品封面，彩色色块与取色器界面",
      link: "#",
      linkLabel: "安装插件",
      code: "",
      codeLabel: "查看代码",
      download: false
    },
    {
      id: "api-cheat",
      title: "API 小抄",
      subtitle: "API CHEATSHEET",
      category: "web",
      year: "2026",
      description: "常用接口一搜就有，少开几个搜索标签页。",
      tags: ["Vue", "Vite", "开源"],
      cover: "assets/cover-api.svg",
      coverAlt: "API 小抄作品封面，深色代码检索界面",
      link: "#",
      linkLabel: "在线使用",
      code: "#",
      codeLabel: "查看代码",
      download: false
    }
  ],

  /* ------------------------------------------------------------------------
     五、页脚和按钮上的小文案（一般不用改）
     ------------------------------------------------------------------------ */
  copy: {
    footerTagline: "用代码做一些小而美的东西。",
    copyright: "皮神科技"
  }
};
