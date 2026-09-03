# 模板升级清单

本项目基于 [moeyua/astro-theme-typography](https://github.com/moeyua/astro-theme-typography) 模板搭建。
本文档记录**最后一次同步的模板 commit 信息**、**本项目相对于模板的自定义改动**，以及后续升级模板时的核对清单，避免升级时覆盖自己的改动。

---

## 一、最后同步的模板版本

| 项目 | 内容 |
| --- | --- |
| 模板仓库 | https://github.com/moeyua/astro-theme-typography |
| 同步 commit | [`162ca9c`](https://github.com/moeyua/astro-theme-typography/commit/162ca9cee59f84cfba2a140c84f53364d14a1686) |
| 完整 SHA | `162ca9cee59f84cfba2a140c84f53364d14a1686` |
| 作者 | Moeyua \<mail@moeyua.com\> |
| 提交说明 | chore: 添加类型检查脚本并恢复 TypeScript 依赖项（PR [#232](https://github.com/moeyua/astro-theme-typography/pull/232)） |

---

## 二、本项目相对于模板的自定义改动

> 升级模板时，以下文件/目录需要重点保留或逐一复核，防止被模板覆盖。

### 1. 环境与工程配置

- **删除 `.nvmrc`**：模板内容为 `lts/*`，本项目不再使用 nvm 固定 Node 版本。
- **新增 `.npmrc`**：配置 `registry=https://registry.npmmirror.com`（国内镜像）。
- **新增 `.editorconfig`**：统一编辑器格式。
- **修改 `.gitattributes`**：新增 `.xsl` 文件不参与 GitHub 语言统计的规则注释。
- **修改 `package.json`**：调整字段顺序，移除模板的 `description` / `author` / `license` 字段（保留 `packageManager: pnpm@10.13.1`）；依赖与脚本与模板保持一致。
- **删除 `.github/dependabot.yml`**；**新增 `.github/workflows/deploy.yml`**：GitHub Pages 自动部署工作流（模板本身不含部署 workflow）。

### 2. 站点内容配置

- **自定义 `src/.config/user.ts`**（核心改动）：
  - `site.title`：学贤社；`site.description`：学而有思，见贤思齐
  - `site.author`：CondorHero；`site.website`：https://condorheroblog.github.io/
  - `site.socialLinks`：GitHub / RSS / Twitter / 掘金
  - `site.navLinks`：Posts / Archive / Categories / About
  - `site.categoryMap`：{ name: '胡适', path: 'hu-shi' }
  - `appearance`：`theme: 'light'`、`locale: 'zh-cn'`
  - `seo.twitter`：@Condor2Hero
- **修改 `src/content/spec/about.md`**：替换为个人「关于我」页面（自我介绍、工作经历、联系方式，pubDate: 2025-10-25）。
- **新增 `src/content/posts/` 下全部博客文章**：个人博客内容（2019 年起至今），与模板无关。

### 3. 静态资源与杂项

- `public/favicon.svg`、`public/placeholder.png`：替换为个人版本。
- 新增 `public/placeholder.svg`、`public/pretty-feed-v3.xsl`（RSS 样式表）。
- 删除模板的 `public/typograph-og.jpg`。
- 修改 `LICENSE`：版权人改为 CondorHero（2024）。
- 修改 `README.md`；删除模板的 `README.zh-CN.md`。

### 4. 未改动的部分（可安全随模板升级）

- `src/components/`、`src/layouts/`、`src/pages/`、`src/plugins/`、`src/utils/` 等模板源码目录均**未做修改**，升级时可直接用模板覆盖。
- `astro.config.ts`、`uno.config.js`、`eslint.config.mjs` 等根配置与模板一致。

---

## 三、升级操作清单

当模板 `main` 分支出现新提交时，按以下步骤升级：

1. [ ] 查看模板最新提交：https://github.com/moeyua/astro-theme-typography/commits/main
2. [ ] 浏览从上一个同步 commit（`162ca9c`）到最新 commit 之间的改动：
     https://github.com/moeyua/astro-theme-typography/compare/162ca9c...main
3. [ ] 重点确认新改动是否涉及「二、自定义改动」中的文件，尤其是：
   - [ ] `package.json`（依赖/脚本变化，注意保留本地字段调整，执行 `pnpm install` 同步 lockfile）
   - [ ] `src/.config/user.ts`（如模板配置结构变更，需同步合并字段）
   - [ ] `src/content/spec/about.md`
   - [ ] `.github/workflows/deploy.yml`、`.npmrc`、`.gitattributes` 等本地新增文件
4. [ ] 覆盖更新未自定义的模板源码目录（`src/components`、`src/layouts`、`src/pages` 等）。
5. [ ] 本地验证：
   - [ ] `pnpm install`
   - [ ] `pnpm dev` 本地跑通，检查首页 / 文章 / 归档 / 分类 / 关于页
   - [ ] `pnpm build`（含 `astro check` 类型检查）通过
   - [ ] RSS（`/atom.xml`）、站点地图等正常
6. [ ] 推送后确认 GitHub Pages 部署 workflow 正常。
7. [ ] 更新本文档「一、最后同步的模板版本」与下方升级记录表。

---

## 四、升级记录

| 日期 | 同步到的 commit | 提交说明 | 备注 |
| --- | --- | --- | --- |
| 2026-09-03 建档 | [`162ca9c`](https://github.com/moeyua/astro-theme-typography/commit/162ca9cee59f84cfba2a140c84f53364d14a1686) | chore: 添加类型检查脚本并恢复 TypeScript 依赖项 | 建档时该提交为模板最新，无需升级 |
| | | | |
