# 星の命式 实施计划

版本: v0.1  
日期: 2026-05-10  
当前基准: `site3/`

## 1. 当前状态

已完成：

- SEO 调研。
- 产品需求初稿。
- 多轮视觉探索。
- `site3` 视觉基准。
- GitHub Pages 部署。

当前问题：

- `site3` 是设计样稿，不是正式产品工程。
- 内容文案尚未产品化。
- 站点架构尚未落到真实路由。
- 四柱推命计算逻辑未确定。
- 结果页结构未实现。

## 2. 推荐技术方向

正式工程建议迁移到 Next.js。

原因：

- SEO 页面需要稳定 metadata。
- 后续需要计算 API。
- 结果页可能需要短链接或服务端生成。
- 可扩展分享图、结构化数据、Search Console。
- 比当前浏览器端 React+Babel 更适合生产。

备选：

- Astro：更适合内容站，但工具交互和结果页扩展稍弱。

当前建议：

```text
Next.js + TypeScript + 静态/服务端混合渲染
```

## 3. 迁移原则

不要直接把 `site3` 原样复制成生产代码。

应该拆分：

```text
视觉系统
页面路由
表单交互
命式计算
结果解释
SEO 内容
```

`site3` 主要提供：

- 视觉基调。
- 组件造型。
- 动效语气。
- 移动端参考。

## 4. 第一阶段任务

### 4.1 建立正式工程

目标：

- 创建 Next.js 工程。
- 引入 site3 设计 tokens。
- 建立基础 layout。
- 创建首页和免费鉴定页。

建议目录：

```text
app/
  page.tsx
  shichusuimei/
    page.tsx
    free/
      page.tsx
    result/
      page.tsx
components/
  StarChart.tsx
  Seal.tsx
  SiteHeader.tsx
  DivinationForm.tsx
  ResultSummary.tsx
lib/
  shichusuimei/
    calculate.ts
    types.ts
    fixtures.ts
content/
  columns/
```

### 4.2 视觉系统迁移

从 `site3/styles.css` 提取：

- CSS variables。
- theme tokens。
- typography。
- StarChart styles。
- form styles。
- motion settings。

暂时保留：

- 月夜。
- 紙白。
- 靛深。
- 朱墨。

可以延后：

- 完整 Tweaks 面板。
- mobile-preview 框架。

### 4.3 页面内容产品化

需要重写：

- 首页说明文案。
- 免费鉴定字段说明。
- 免责声明。
- FAQ。
- SEO title/description。

原则：

- 视觉可以古雅。
- 说明必须现代清楚。
- 日文表达优先自然，不要过度文言。

## 5. 第二阶段任务

### 5.1 四柱推命计算方案

必须先形成 `CALCULATION_SPEC.md`。

待确认：

- 节气算法。
- 日柱算法。
- 时柱算法。
- 日本时区。
- 出生地补正。
- 真太阳时。
- 大运是否进入 MVP。

测试：

- 至少 20 组已知命例。
- 节气边界样例。
- 时辰边界样例。
- 出生时间不明样例。

### 5.2 结果页

实现：

- 命式结构化输出。
- 摘要解释。
- 五行可视化。
- 命式表。
- 分类解释。
- 保存/分享入口。

## 6. 第三阶段任务

### 6.1 SEO 内容

建立：

- `/shichusuimei/`
- `/birthday-fortune/`
- `/columns/`

每个页面要有：

- title。
- description。
- canonical。
- FAQ。
- 内链。

### 6.2 Analytics 与 Search Console

上线前接入：

- Search Console。
- 基础访问统计。
- 表单完成率事件。
- 结果页查看事件。

## 7. 发布策略

当前 GitHub Pages 可作为设计预览。

正式产品建议：

- 继续用 GitHub Pages 预览静态样稿。
- 正式 Next.js 项目部署到 Vercel 或类似平台。
- 绑定 `hoshinomeishiki.jp`。

## 8. 推荐下一步

优先级：

1. 创建 `CALCULATION_SPEC.md`。
2. 选择四柱推命计算方案。
3. 新建正式 Next.js 工程。
4. 从 `site3` 迁移视觉系统。
5. 实现 `/shichusuimei/free/` 表单和假数据结果页。
6. 替换为真实计算。

