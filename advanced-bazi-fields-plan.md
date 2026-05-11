# 星の命式 高级命式字段方案

日期: 2026-05-11  
范围: 藏干、干神、支神、神煞等高级计算字段  
状态: 需求拆解 / 待实现

## 1. 背景

当前 `calculator.html` 已经可以输出基础四柱、五行、藏干和天干十神。

新需求是：在现有计算结果上，进一步补全地支对应的藏干、干神、支神、神煞等字段，使结果更接近专业排盘工具。

这个需求需要先明确术语口径，因为不同工具对“神煞”“支神”的定义和展示方式不完全一致。

## 2. 术语口径

### 2.1 藏干

含义：

- 每个地支内部所藏的天干。
- 需要区分主气 / 中气 / 余气。

现状：

- `tyme4ts` 已能返回每个地支的藏干。
- 当前页面只输出了藏干列表，例如 `午 -> 丁、己`。

需要增强：

- 给每个藏干增加类型字段：
  - `main`：本气 / 主气
  - `middle`：中气
  - `residual`：余气
- 给每个藏干补充五行和十神。

### 2.2 干神

含义：

- 各柱天干相对于日主的十神。
- 日干本身标记为 `日主`。

现状：

- 当前 `tenGods` 字段已经实现了这一部分。
- 例如 `庚午 / 壬午 / 辛亥 / 癸巳`，日主为 `辛`，干神为：
  - 年干 `庚`：劫财
  - 月干 `壬`：伤官
  - 日干 `辛`：日主
  - 时干 `癸`：食神

需要增强：

- 将字段名从笼统的 `tenGods` 拆出更清晰的 `stemGods` / `ganGods`。
- 保留 `tenGods` 作为兼容字段也可以，但产品层建议用新字段。

### 2.3 支神

含义：

- 地支本身不能直接唯一对应一个十神。
- 更合理的做法是：通过地支藏干，计算每个藏干相对于日主的十神。

建议口径：

- `branchGods` 不输出单个字符串，而输出每个藏干的十神数组。
- 可额外提供 `primaryBranchGod`，取本气藏干对应十神，方便结果页摘要展示。

示例：

```json
{
  "branch": "巳",
  "primaryBranchGod": "正官",
  "hiddenStems": [
    { "stem": "丙", "type": "main", "tenGod": "正官" },
    { "stem": "庚", "type": "middle", "tenGod": "劫财" },
    { "stem": "戊", "type": "residual", "tenGod": "正印" }
  ]
}
```

这样可以避免把复杂地支关系误压成一个不准确的“支神”。

### 2.4 神煞

神煞最容易混淆，需要拆成两类：

#### A. 日课 / 黄历神煞

`tyme4ts` 的 `getGods()` 返回的是日神 / 黄历神煞，例如：

- 月德合
- 天恩
- 五富
- 福生
- 劫煞
- 小耗
- 重日
- 朱雀

这些更接近“择日 / 黄历宜忌”的神煞，不能直接等同于八字命盘中按四柱查出的神煞。

建议字段名：

```ts
calendarGods: {
  dayGods: CalendarGod[];
}
```

#### B. 八字命理神煞

这是用户通常理解的八字神煞，例如：

- 天乙贵人
- 太极贵人
- 文昌贵人
- 驿马
- 桃花 / 咸池
- 华盖
- 将星
- 羊刃
- 禄神
- 空亡
- 孤辰寡宿
- 劫煞
- 灾煞

这类神煞通常按日干、年干、年支、日支或三合局规则查四柱地支/干支。

`tyme4ts` 不建议直接当作完整八字神煞来源。我们应建立自有规则表，并和问真/测测等工具对照。

建议字段名：

```ts
baziShenSha: ShenSha[];
```

## 3. 推荐输出结构

建议在 `ShichusuimeiResult` 中新增：

```ts
type ExtendedPillar = Pillar & {
  stemGod: TenGod | "日主";
  branchGods: BranchGod[];
  primaryBranchGod?: TenGod;
};

type BranchGod = {
  stem: Stem;
  hiddenStemType: "main" | "middle" | "residual";
  element: ElementName;
  tenGod: TenGod;
};

type CalendarGod = {
  name: string;
  luck: "吉" | "凶";
  source: "tyme4ts_day_gods";
};

type ShenSha = {
  name: string;
  category: "auspicious" | "inauspicious" | "neutral";
  matchedPillars: Array<"year" | "month" | "day" | "hour">;
  basis: "dayStem" | "yearStem" | "dayBranch" | "yearBranch" | "pillar" | "custom";
  ruleId: string;
  confidence: "verified" | "needs_review";
};
```

推荐结果结构：

```ts
type ShichusuimeiResult = {
  pillars: {
    year: ExtendedPillar;
    month: ExtendedPillar;
    day: ExtendedPillar;
    hour: ExtendedPillar;
  };
  stemGods: {
    year: TenGod;
    month: TenGod;
    day: "日主";
    hour: TenGod;
  };
  branchGods: {
    year: BranchGod[];
    month: BranchGod[];
    day: BranchGod[];
    hour: BranchGod[];
  };
  calendarGods?: {
    dayGods: CalendarGod[];
  };
  baziShenSha?: ShenSha[];
};
```

## 4. 实现分期

### Phase 1: 结构化藏干 + 干神 + 支神

优先级最高，风险最低。

实现内容：

- 藏干增加本气 / 中气 / 余气。
- 藏干增加五行。
- 藏干增加十神。
- 新增 `stemGods`。
- 新增 `branchGods`。
- 用户工具页显示“藏干 / 支神”明细。

原因：

- `tyme4ts` 已提供藏干和十神计算能力。
- 几乎不涉及派别争议。
- 对解读功能很有价值。

### Phase 2: 日课 / 黄历神煞

实现内容：

- 使用 `tyme4ts` 的 `getGods()` 输出 `calendarGods.dayGods`。
- 明确标注为“日课神煞 / 黄历神煞”。
- 不参与八字解读主逻辑，先作为附加信息展示。

风险：

- 用户可能误以为这是完整八字神煞。
- 需要 UI 文案区分。

### Phase 3: 八字命理神煞白名单

先做 8 到 12 个常见神煞。

建议第一批：

- 天乙贵人
- 太极贵人
- 文昌贵人
- 驿马
- 桃花 / 咸池
- 华盖
- 将星
- 禄神
- 羊刃
- 空亡

要求：

- 每个神煞必须有 `ruleId`。
- 每个规则必须写测试样例。
- 必须和至少两个外部工具对照。
- 不通过回归测试前，不进入正式用户解释。

## 5. UI 展示建议

纯工具页可以先用表格：

| 柱 | 干神 | 地支 | 藏干 | 支神 |
|---|---|---|---|---|
| 年柱 | 劫财 | 午 | 丁(本气)、己(中气) | 七杀、偏印 |

神煞单独分区：

1. 八字神煞
2. 日课神煞 / 黄历神煞

不要把两类神煞合并展示。

## 6. 测试要求

新增回归样例需要覆盖：

- 四柱各地支藏干是否正确。
- 本气 / 中气 / 余气顺序是否正确。
- 干神是否以日主为基准。
- 支神是否以藏干为基准。
- 时辰不详时，时柱和时柱相关支神必须低可信。
- 23:00 子时规则切换后，日主变化时，所有干神 / 支神必须随之变化。
- 神煞必须区分 `calendarGods` 和 `baziShenSha`。

## 7. 当前判断

可以先实现 Phase 1。

不建议立刻把所有神煞一次性接进正式结果页。神煞体系有较强派别差异，如果没有白名单和对照样例，直接展示会降低可信度。

推荐下一步：

1. 先改 adapter 输出结构，补 `stemGods`、`branchGods`、结构化藏干。
2. 更新 `calculator.html` 显示支神明细。
3. 在 `calculation-lab.html` 增加回归样例字段检查。
4. 单独开神煞白名单规则表。
