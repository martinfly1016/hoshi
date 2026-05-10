# 星の命式 计算库与算法选型

版本: v0.1  
日期: 2026-05-10  
范围: 四柱推命 MVP 计算层选型  
结论状态: 建议先做技术 Spike，再最终定型

## 1. 选型目标

我们需要选择一个能支撑日本向け四柱推命 MVP 的计算方案。

核心要求：

- 能准确输出年柱、月柱、日柱、时柱。
- 年柱需要处理立春换岁。
- 月柱需要按节气换月。
- 能输出或支持推导五行、通変星、藏干。
- 能在 Next.js / TypeScript 工程中稳定使用。
- 许可证适合商业网站。
- 可测试、可封装、可替换。

## 2. 评估维度

| 维度 | 说明 |
|---|---|
| 准确性 | 干支、节气、日柱、时柱是否可靠 |
| 维护状态 | 是否近期更新、生态活跃度 |
| TypeScript 适配 | 是否有类型、是否适合 Next.js |
| 许可证 | 是否适合商业产品 |
| 可控性 | 能否封装、替换、修正边界 |
| 产品适配 | 是否适合日本四柱推命表达 |
| 风险 | 算法黑箱、文档不足、精度限制 |

## 3. 候选方案总览

| 方案 | 推荐度 | 定位 |
|---|---:|---|
| A. `tyme4ts` + 自研解释层 | 高 | 新一代 TypeScript 历法基础库 |
| B. `lunar-typescript` / `lunar-javascript` + 自研解释层 | 高 | 成熟、资料多、功能覆盖广 |
| C. `lunisolar` + 自研解释层 | 中 | 功能强，但许可证风险大 |
| D. `bazi-calculator-by-alvamind` | 中低 | 直接八字分析，但成熟度较低 |
| E. `dantalion` | 低 | 更像生日性格应用，不适合作为命式核心 |
| F. 完全自研 | 中 | 控制力最高，但时间和校验成本最高 |
| G. 后端服务化计算 | 中 | 适合后续扩展，但 MVP 初期偏重 |

## 4. 方案 A: `tyme4ts` + 自研解释层

资料：

- GitHub: https://github.com/6tail/tyme4ts
- npm: https://www.npmjs.com/package/tyme4ts

### 描述

`tyme4ts` 是 6tail 的新一代日历工具库。官方描述中提到它可以看作 Lunar 的升级版，支持公历、农历、藏历、星座、干支、节气、法定假日等。

### 优势

- TypeScript 生态更友好。
- MIT 许可证，适合商业使用。
- 0 dependencies，依赖面较小。
- 支持节气、干支等核心历法能力。
- 由 6tail 维护，和 `lunar` 系列同源，可信度相对较高。
- 更适合作为正式 Next.js 工程的底层历法库。

### 劣势

- 相比 `lunar-javascript`，社区资料和历史使用案例更少。
- 需要确认 API 是否直接支持完整八字四柱，还是只提供干支/节气基础能力。
- 仍需我们自研通変星、五行解释、结果文案层。

### 主要风险

- 如果 API 对八字支持不如 `lunar` 直接，需要额外封装更多逻辑。
- 节气边界精度需要通过样例测试确认。

### 适合度

适合作为第一优先 Spike 对象。

推荐策略：

- 用它先生成四柱候选结果。
- 与 `lunar-typescript` 和外部排盘工具交叉验证。
- 若 API 足够稳定，则作为正式底层库。

## 5. 方案 B: `lunar-typescript` / `lunar-javascript` + 自研解释层

资料：

- lunar-javascript GitHub: https://github.com/6tail/lunar-javascript
- lunar-typescript GitHub: https://github.com/6tail/lunar-typescript
- npm: https://www.npmjs.com/package/lunar-javascript

### 描述

6tail 的 `lunar` 系列是成熟的公历/农历/黄历库，官方说明包含干支、节气、八字、五行、十神等能力。`lunar-javascript` 历史更长，`lunar-typescript` 更适合 TS 工程。

### 优势

- 成熟度高，使用者更多。
- MIT 许可证。
- 功能覆盖广，包含八字、节气、五行、十神等。
- 官方示例能输出年月日时干支。
- 文档和示例比多数八字库更完整。
- 非常适合作为验证基准库。

### 劣势

- `lunar-javascript` 原生不是最理想的 TS 设计。
- API 可能偏传统黄历库风格，工程封装需要适配。
- 输出内容很多，需要筛选，不能直接把所有黄历内容暴露给日本用户。

### 主要风险

- 需要确认在日本时区和边界时间下的表现。
- 需要确认四柱中的换日规则是否符合我们采用的产品口径。

### 适合度

适合作为第一阶段候选或对照基准。

推荐策略：

- 如果 `tyme4ts` API 不够直接，则优先转向 `lunar-typescript`。
- 即便最终不用，也建议保留为交叉验证工具。

## 6. 方案 C: `lunisolar` + 自研解释层

资料：

- GitHub: https://github.com/waterbeside/lunisolar
- npm: https://www.npmjs.com/package/lunisolar

### 描述

`lunisolar` 是 TypeScript 农历库，支持公历/阴历互转、八字查询、节气日期查询、八字增强插件、十神、四柱神煞等。

### 优势

- TypeScript 编写。
- 八字 API 比较直接。
- 支持插件和语言包。
- 文档说明里明确提到节气、换岁、换月等命理相关问题。
- 对“年柱按立春、月柱按节气”的解释更透明。

### 劣势

- GitHub 显示 GPL-3.0 license。对于商业网站或闭源产品有明显许可证风险。
- 文档中提到部分节气数据只精确到日，交节换月以日为准，这可能不满足高精度边界需求。
- 如果只作为内部验证工具也需要注意许可证使用边界。

### 主要风险

- 许可证风险最大。
- 节气边界精度可能不足以作为最终权威计算。

### 适合度

适合作为研究参考，不建议直接作为正式产品依赖，除非确认许可证和产品发布方式兼容。

推荐策略：

- 可以用于理解 API 设计和术语结构。
- 不建议进入生产依赖。

## 7. 方案 D: `bazi-calculator-by-alvamind`

资料：

- GitHub: https://github.com/alvamind/bazi-calculator-by-alvamind
- npm fork: https://www.npmjs.com/package/@aharris02/bazi-calculator-by-alvamind

### 描述

这是一个面向八字/Four Pillars 的 TypeScript 计算和分析库，README 中列出四柱、五行分析、日主分析、部分神煞和方位等能力。

### 优势

- 直接面向 Bazi，而不是通用历法。
- TypeScript。
- MIT 许可证。
- API 看起来更接近产品所需的“完整分析”。
- 包含五行、日主、部分分析组件。

### 劣势

- GitHub 主仓库提交数和 star 数较少，成熟度有限。
- README 自身也提示存在 timezone、lunar approximation、regional variation 等限制。
- 算法可信度需要强验证。
- 可能混入大量我们 MVP 不需要的分析概念。

### 主要风险

- 作为唯一计算源风险较高。
- 如果内部算法不透明或测试不足，后续纠错成本高。

### 适合度

适合作为参考或对照，不建议直接作为唯一核心引擎。

推荐策略：

- 可以做 Spike。
- 如果结果与 6tail 系列和外部排盘一致，再考虑部分借鉴结构。

## 8. 方案 E: `dantalion`

资料：

- GitHub: https://github.com/kurone-kito/dantalion
- npm: https://www.npmjs.com/package/@kurone-kito/dantalion-core

### 描述

`dantalion` 是生日性格/fortune 应用和库，README 提到其计算包含 Four Pillars of Destiny 方法，支持生日范围 1873-02-01 到 2050-12-31。

### 优势

- MIT 许可证。
- 有 monorepo、i18n、CLI 等周边结构。
- 可作为“生日性格产品”的参考。

### 劣势

- 目标不是专业命式排盘。
- 输出更偏性格类型，不符合我们需要的结构化命式结果。
- 最近 npm 包下载和维护活跃度偏低。
- 支持年份范围有限。

### 主要风险

- 产品方向不匹配。
- 不适合作为四柱推命核心计算源。

### 适合度

不建议用于核心计算。可以作为“解释层产品化”的参考，但优先级低。

## 9. 方案 F: 完全自研

### 描述

自行实现：

- 干支循环。
- 节气数据。
- 年柱、月柱、日柱、时柱。
- 五行。
- 通変星。
- 藏干。

### 优势

- 控制力最高。
- 规则口径完全可解释。
- 可以针对日本四柱推命表达定制。
- 无第三方库风险。

### 劣势

- 实现成本最高。
- 节气和日柱算法容易出错。
- 需要大量验证样例。
- MVP 进度会明显变慢。

### 主要风险

- 没有专家复核时，很容易出现边界错误。
- 维护成本会长期存在。

### 适合度

不建议一开始完全自研。

推荐策略：

- 自研解释层和归一化数据结构。
- 历法和四柱初算先依赖成熟库。
- 后续只在必要处替换为自研。

## 10. 方案 G: 后端服务化计算

### 描述

把四柱推命计算封装为服务端 API，不暴露在前端。

底层可以使用：

- TypeScript 库。
- Python 库。
- 自研算法。
- 混合验证引擎。

### 优势

- 前端不绑定具体库。
- 后续可替换算法。
- 可以保护规则和解释层。
- 更适合日志、A/B、缓存、短链接结果。

### 劣势

- 初期工程复杂度更高。
- 需要部署后端。
- 需要 API 错误处理和监控。

### 适合度

正式产品适合服务端计算；MVP Spike 可以先本地库验证。

推荐策略：

- Next.js API Route / Server Action 封装。
- 前端只依赖我们自己的 `calculateShichusuimei` 契约。

## 11. 推荐路线

### 阶段 1: 技术 Spike

同时验证两个库：

1. `tyme4ts`
2. `lunar-typescript` 或 `lunar-javascript`

目标：

- 输入同一组出生数据。
- 输出四柱。
- 比较年柱、月柱、日柱、时柱。
- 与外部排盘工具对照。
- 验证立春、节气、时辰边界。

### 阶段 2: 建立抽象层

不要在产品代码里直接依赖第三方库 API。

建立统一封装：

```ts
calculateShichusuimei(input): ShichusuimeiResult
```

第三方库只在内部 adapter 中出现：

```text
lib/shichusuimei/adapters/tyme.ts
lib/shichusuimei/adapters/lunar.ts
```

### 阶段 3: 决定 MVP 引擎

如果 `tyme4ts` 通过验证：

- 采用 `tyme4ts` 作为底层历法引擎。
- 自研五行/通変星/解释层。

如果 `tyme4ts` API 不够直接：

- 采用 `lunar-typescript`。
- 或短期采用 `lunar-javascript`，外层用 TS 类型封装。

如果两者在边界样例有差异：

- 不上线真实结果。
- 先建立 fixtures。
- 找第三方权威排盘和人工复核。

## 12. 当前推荐结论

当前最稳妥路线：

```text
首选: tyme4ts
备选: lunar-typescript / lunar-javascript
参考: lunisolar
不建议核心依赖: dantalion
谨慎评估: bazi-calculator-by-alvamind
```

原因：

- `tyme4ts` 和 `lunar` 系列同源，许可证友好，历法能力强。
- `lunar` 系列更成熟，适合作为基准验证。
- `lunisolar` 功能强，但 GPL-3.0 不适合作为闭源商业产品依赖。
- 直接八字分析库虽然方便，但成熟度和算法可信度需要更重验证。

## 13. 下一步执行清单

1. 创建一个 `spikes/calculation-libraries/` 实验目录。
2. 安装 `tyme4ts` 和 `lunar-typescript`。
3. 编写同一输入的四柱输出脚本。
4. 准备 5 个第一批样例：
   - 普通日期 2 个。
   - 立春前后 2 个。
   - 出生时间不明 1 个。
5. 比较输出差异。
6. 再扩展到 `CALCULATION_SPEC.md` 要求的 20 个样例。

## 14. 参考来源

- `tyme4ts` GitHub: https://github.com/6tail/tyme4ts
- `tyme4ts` npm: https://www.npmjs.com/package/tyme4ts
- `lunar-javascript` GitHub: https://github.com/6tail/lunar-javascript
- `lunar-typescript` GitHub: https://github.com/6tail/lunar-typescript
- `lunar-javascript` npm: https://www.npmjs.com/package/lunar-javascript
- `lunisolar` GitHub: https://github.com/waterbeside/lunisolar
- `lunisolar` npm: https://www.npmjs.com/package/lunisolar
- `bazi-calculator-by-alvamind` GitHub: https://github.com/alvamind/bazi-calculator-by-alvamind
- `@aharris02/bazi-calculator-by-alvamind` npm: https://www.npmjs.com/package/@aharris02/bazi-calculator-by-alvamind
- `dantalion` GitHub: https://github.com/kurone-kito/dantalion
- `@kurone-kito/dantalion-core` npm: https://www.npmjs.com/package/@kurone-kito/dantalion-core

