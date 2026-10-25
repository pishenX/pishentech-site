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
     一、个人资料（首页和关于页都会用到）
     ------------------------------------------------------------------------ */
  profile: {
    brand: "皮神科技",                 // 左上角品牌名
    name: "皮神",                      // 你的名字 / 昵称
    role: "独立开发者 / 前端工程师",    // 一句话身份
    location: "中国 · 远程",            // 所在地
    avatar: "assets/avatar.svg",       // 头像图片路径（换成自己的图片时改这里）
    email: "hello@pishentech.cn",      // 联系邮箱（记得换成真实可收信的邮箱）
    github: "https://github.com/pishentech", // GitHub 主页
    wechat: "pishentech",              // 微信号（换成你的）
    status: "正在打磨「天气小窗」2.0",  // 首页卡片上的当前状态
    availability: "开放合作与交流",      // 首页顶部的小圆点文案
    heroDescription: "这里是我的数字工作台：收集我写过的代码、做过的小工具，以及一些还在发芽的点子。慢慢做，认真改，希望它们刚好能帮到你。"
  },

  /* ------------------------------------------------------------------------
     二、首页统计数字（前两个会自动计算，最后一个手动改）
     ------------------------------------------------------------------------ */
  stats: {
    projectsLabel: "个作品",
    openSourceLabel: "个已开源",
    since: "2022",                     // 你是从哪一年开始折腾的
    sinceLabel: "开始折腾"
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
        上线前请把它们换成你真实的作品；换完之后，首页的作品数量会自动更新。

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

  /* ========================================================================
     五、关于页内容
     ------------------------------------------------------------------------
     ⚠️ 这一段的自我介绍、技能、时间线也都是示例，请按你的真实经历改写。
     ======================================================================== */
  about: {
    eyebrow: "ABOUT ME",
    lead: "你好，我是皮神。一个喜欢把想法落地、也愿意慢慢打磨细节的人。",
    paragraphs: [
      "我的主业是前端开发，业余时间喜欢做一些「可能只有我会用，但用起来很顺手」的小东西。从第一行 HTML 到现在，最让我上瘾的，始终是「想法变成现实」的那一瞬间。",
      "我相信好软件不一定很大。它可以只是帮你少点两次屏幕、少复制一次链接，或者在不知道吃什么的时候，替你做一个小小的决定。",
      "这个网站是我的数字花园。作品不一定完美，但每一个都认真做过。如果你对其中某个东西感兴趣，或者只是想聊聊，欢迎随时找我。"
    ],
    now: [
      {
        label: "在做",
        title: "天气小窗 2.0",
        text: "重新梳理信息层级，让每天早上看天气这件事更轻一点。"
      },
      {
        label: "在学",
        title: "TypeScript & 产品设计",
        text: "想写出更稳的代码，也想把「为什么这样做」想得更清楚。"
      },
      {
        label: "在玩",
        title: "像素画与随手写",
        text: "用 16×16 的小格子记录生活，偶尔把折腾过程写成文章。"
      }
    ],
    skills: [
      {
        title: "前端 & 小程序",
        description: "把设计稿变成能点、能用、跑得快的界面。",
        items: ["HTML / CSS", "JavaScript", "TypeScript", "Vue", "微信小程序"]
      },
      {
        title: "后端 & 工具",
        description: "够用就好，重点是让想法先跑起来。",
        items: ["Python", "Node.js", "SQLite", "Git", "Cloudflare"]
      },
      {
        title: "设计 & 其他",
        description: "不是设计师，但愿意为一行间距多改几遍。",
        items: ["Figma", "产品设计", "像素画", "写作"]
      }
    ],
    timeline: [
      {
        year: "2022",
        title: "第一次写下 Hello, World",
        text: "用 HTML 做了一个很简陋的个人主页，从此掉进前端的坑。"
      },
      {
        year: "2023",
        title: "开始做真正能用的小工具",
        text: "系统学习 JavaScript，第一个浏览器插件被自己每天使用。"
      },
      {
        year: "2024",
        title: "第一个微信小程序上线",
        text: "第一次完整经历「想法 → 设计 → 开发 → 上线」的全过程。"
      },
      {
        year: "2025",
        title: "把作品开源，也开始做桌面端",
        text: "学会写文档、处理反馈，也第一次把自己的代码交给别人用。"
      },
      {
        year: "2026",
        title: "搭起这间「数字小店」",
        text: "把散落在各处的作品收好，认真介绍自己，也认真对待每一次访问。"
      }
    ],
    contacts: [
      {
        type: "email",
        label: "邮箱",
        copy: true
      },
      {
        type: "github",
        label: "GitHub",
        copy: false
      },
      {
        type: "wechat",
        label: "微信",
        copy: true
      }
    ]
  },

  /* ------------------------------------------------------------------------
     六、页脚和按钮上的小文案（一般不用改）
     ------------------------------------------------------------------------ */
  copy: {
    footerTagline: "用代码做一些小而美的东西。",
    copyright: "皮神科技"
  }
};
