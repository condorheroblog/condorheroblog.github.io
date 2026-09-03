import type { UserConfig } from '~/types'

// 用户自定义配置：会与 default.ts 中的默认配置进行深度合并
// 从旧的 src/theme.config.ts 迁移而来
export const userConfig: Partial<UserConfig> = {
  site: {
    /** 博客标题 */
    title: '学贤社',
    /** 站点描述 */
    description: '学而有思，见贤思齐',
    /** 作者名称 */
    author: 'CondorHero',
    /** 部署域名 */
    website: 'https://condorheroblog.github.io/',
    /** 社交链接 */
    socialLinks: [
      {
        name: 'github',
        href: 'https://github.com/condorheroblog/',
      },
      {
        name: 'rss',
        href: '/atom.xml',
      },
      {
        name: 'twitter',
        href: 'https://twitter.com/Condor2Hero',
      },
      {
        name: 'mastodon',
        href: 'https://juejin.cn/user/1046390801441949',
      },
    ],
    /** 顶部导航链接 */
    navLinks: [
      {
        name: 'Posts',
        href: '/',
      },
      {
        name: 'Archive',
        href: '/archive',
      },
      {
        name: 'Categories',
        href: '/categories',
      },
      {
        name: 'About',
        href: '/about',
      },
    ],
    /** 分类名与 URL 路径的映射 */
    categoryMap: [
      { name: '胡适', path: 'hu-shi' },
    ],
  },
  appearance: {
    /** 主题风格：light / dark / system */
    theme: 'light',
    /** 站点语言 */
    locale: 'zh-cn',
  },
  seo: {
    /** Twitter 账号 */
    twitter: '@Condor2Hero',
  },
}
