export const THEME_CONFIG: App.Locals['config'] = {
  /** blog title */
  title: "我的博客",
  /** your name */
  author: "CondorHero",
  /** website description */
  desc: "CondorHero 的个人博客",
  /** your deployed domain */
  website: "https://condorheroblog.github.io/",
  /** your locale */
  locale: "zh-cn",
  /** theme style */
  themeStyle: "light",
  /** your socials */
  socials: [
    {
      name: "github",
      href: "https://github.com/condorheroblog/",
    },
    {
      name: "rss",
      href: "/atom.xml",
    },
    {
      name: "twitter",
      href: "https://twitter.com/Condor2Hero",
    },
    {
      name: "mastodon",
      href: "https://juejin.cn/user/1046390801441949",
    }
  ],
  /** your navigation links */
  navs: [
    {
      name: "Posts",
      href: "/posts/page/1",
    },
    {
      name: "Archive",
      href: "/archive",
    },
    {
      name: "Categories",
      href: "/categories"
    },
    {
      name: "About",
      href: "/about",
    },
  ]
}

