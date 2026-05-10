# 星の命式 四柱推命计算规格

版本: v0.1  
日期: 2026-05-10  
范围: 四柱推命 MVP 计算层  
状态: 规格草案，待算法选型和样例验证

## 1. 目标

本文件定义星の命式 MVP 的四柱推命计算边界、输入输出、准确性要求和验收方式。

目标不是在本文中完整描述所有命理算法，而是为工程实现设定清晰契约：

- 前端表单收集什么。
- 计算层需要返回什么。
- 哪些结果可以进入 MVP。
- 哪些能力必须等算法验证后再上线。
- 如何判断计算结果可靠。

## 2. 产品原则

四柱推命计算是本产品的信任核心。

必须遵守：

- 不使用设计样稿中的伪逻辑。
- 不用公历月份直接代替月柱。
- 不用简单年份直接代替年柱。
- 出生时间不明时，明确提示时柱和部分解释不完整。
- 所有不支持的精度能力必须在 UI 中说明。

MVP 可以先做“范围受控的准确计算”，不能做“看起来完整但不准确的计算”。

## 3. MVP 计算范围

### 3.1 MVP 必须支持

- 日本时区 `Asia/Tokyo`。
- 公历出生日期。
- 出生时间可填写，也可不明。
- 日本国内出生地，MVP 至少支持都道府县。
- 年柱。
- 月柱。
- 日柱。
- 时柱，出生时间不明时返回 `unknown`。
- 天干地支。
- 五行。
- 日主。
- 通変星。
- 基础藏干。
- 基础五行数量统计。
- 基础解释所需的结构化标签。

### 3.2 MVP 可以延后

- 大運。
- 流年。
- 真太阳时精确补正。
- 海外出生地完整处理。
- 旧历输入。
- 节气时刻的极高精度天文计算。
- 空亡、神煞、纳音等高级模块。

### 3.3 MVP 不做

- 紫微斗数计算。
- 奇门遁甲计算。
- AI 自动断语替代基础规则。
- 付费详细命书。

## 4. 输入规格

### 4.1 标准输入

```ts
type ShichusuimeiInput = {
  name?: string;
  birthDate: {
    year: number;
    month: number;
    day: number;
  };
  birthTime:
    | {
        known: true;
        hour: number;
        minute: number;
      }
    | {
        known: false;
      };
  birthplace: {
    country: "JP" | "OTHER";
    prefecture?: string;
    city?: string;
    timezone: "Asia/Tokyo";
    latitude?: number;
    longitude?: number;
  };
  gender?: "male" | "female" | "unspecified";
  options?: {
    useSolarTermMonth: true;
    useTrueSolarTime: false;
    calendar: "gregorian";
    lateZiHourMode: "pending" | "next_day" | "same_day";
  };
};
```

### 4.2 字段说明

| 字段 | MVP 要求 | 说明 |
|---|---|---|
| `birthDate` | 必填 | 公历年月日 |
| `birthTime` | 可不明 | 不明时不计算时柱 |
| `birthplace.prefecture` | 必填 | 日本都道府县 |
| `birthplace.city` | 可选 | 后续用于经纬度和真太阳时 |
| `gender` | 可选 | MVP 不应用于基础四柱，若进入大运再确认 |
| `useSolarTermMonth` | 固定 true | 月柱必须按节气处理 |
| `useTrueSolarTime` | MVP false | 暂不做真太阳时精确补正 |
| `lateZiHourMode` | 待定 | 23:00-23:59 是否按次日计算，需用外部排盘工具确认 |

## 5. 输出规格

### 5.1 标准输出

```ts
type ShichusuimeiResult = {
  inputEcho: ShichusuimeiInput;
  calculationMeta: {
    version: string;
    timezone: "Asia/Tokyo";
    calendar: "gregorian";
    solarTermMode: "verified" | "approximate";
    trueSolarTime: "not_applied" | "applied";
    birthTimeStatus: "known" | "unknown";
    warnings: CalculationWarning[];
  };
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour?: Pillar;
  };
  dayMaster: Stem;
  fiveElements: {
    counts: Record<ElementName, number>;
    dominant: ElementName[];
    weak: ElementName[];
    balanceScore?: number;
  };
  tenGods: {
    year?: TenGod;
    month?: TenGod;
    day?: TenGod;
    hour?: TenGod;
    summaryTags: string[];
  };
  hiddenStems: {
    year: Stem[];
    month: Stem[];
    day: Stem[];
    hour?: Stem[];
  };
  interpretationSeeds: {
    personalityTags: string[];
    loveTags: string[];
    workTags: string[];
    cautionTags: string[];
  };
};

type Pillar = {
  stem: Stem;
  branch: Branch;
  element: {
    stem: ElementName;
    branch: ElementName;
  };
  yinYang: {
    stem: "yin" | "yang";
    branch: "yin" | "yang";
  };
};
```

### 5.2 枚举

```ts
type Stem = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";

type Branch = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";

type ElementName = "wood" | "fire" | "earth" | "metal" | "water";

type TenGod =
  | "比肩"
  | "劫財"
  | "食神"
  | "傷官"
  | "偏財"
  | "正財"
  | "偏官"
  | "正官"
  | "偏印"
  | "印綬";

type CalculationWarning =
  | "BIRTH_TIME_UNKNOWN"
  | "TRUE_SOLAR_TIME_NOT_APPLIED"
  | "BIRTHPLACE_APPROXIMATED"
  | "LATE_ZI_HOUR_RULE_PENDING"
  | "SOLAR_TERM_BOUNDARY_NEEDS_REVIEW"
  | "OUT_OF_SUPPORTED_RANGE";
```

## 6. 计算要求

### 6.1 年柱

要求：

- 年柱切换不应简单使用公历 1 月 1 日。
- 需要按四柱推命常用规则处理立春边界。
- 立春前后出生样例必须进入测试集。

MVP 允许：

- 采用可信历法库或经过验证的节气数据表。

不允许：

- `year % 60` 直接算年柱且忽略立春。

### 6.2 月柱

要求：

- 月柱必须按节气划分。
- 不能用公历月份直接映射地支。
- 节气边界日样例必须进入测试集。

MVP 允许：

- 使用预计算节气表。
- 使用可信库输出节气时间。

### 6.3 日柱

要求：

- 日柱必须使用可靠干支日算法或可信库。
- 需要与至少两个外部可信排盘结果交叉验证。

风险：

- 日柱错误会导致日主、通変星、解释全部错误。

### 6.4 时柱

要求：

- 出生时间已知时，按时辰确定地支。
- 出生时间不明时，不输出时柱。
- 时辰边界样例必须测试。
- 23:00-23:59 的晚子时/夜子时换日规则必须显式配置，不允许隐藏在第三方库默认值里。

MVP 处理：

- 使用日本标准时间。
- 暂不做真太阳时。
- `lateZiHourMode` 在外部工具验证完成前保持 `pending`。

UI 必须提示：

```text
出生時間が不明なため、時柱を含む一部の鑑定は簡易表示です。
```

晚子时规则待确认时，计算层必须返回 warning：

```text
LATE_ZI_HOUR_RULE_PENDING
```

### 6.5 真太阳时

MVP 默认不应用。

原因：

- 需要更完整的出生地经纬度。
- 日本用户输入成本会增加。
- 第一阶段可以先以日本标准时间稳定上线。

UI 说明：

```text
出生地による真太陽時の補正は現在行っていません。
```

后续如果支持，需要：

- 城市级经纬度。
- 海外地点。
- 与排盘工具再次交叉验证。

## 7. 解释层边界

计算层只返回结构化数据和解释 seed，不直接生成长文断语。

解释层负责：

- 把日主、五行、通変星转成可读文案。
- 根据缺失信息降级说明。
- 避免绝对化和恐吓表达。

示例：

```ts
interpretationSeeds: {
  personalityTags: ["day-master-yang-fire", "fire-dominant"],
  loveTags: ["expressive", "needs-space"],
  workTags: ["creative-output", "leadership"],
  cautionTags: ["overheat", "impulsive"]
}
```

## 8. 数据与隐私

MVP 默认不保存用户出生信息到服务器。

推荐策略：

- 计算请求只用于本次生成。
- 若需要分享结果，使用匿名结果 ID 或本地生成摘要。
- 不保存姓名。
- 隐私政策中明确出生信息用途。

如果后续保存结果：

- 需要用户明确同意。
- 需要数据删除机制。
- 需要说明保存范围和保存期限。

## 9. 错误处理

计算层需要返回明确错误：

| 错误 | 说明 | UI 处理 |
|---|---|---|
| `INVALID_DATE` | 日期不存在 | 要求重新输入 |
| `FUTURE_DATE` | 未来日期 | 要求重新输入 |
| `OUT_OF_RANGE` | 超出支持年份范围 | 显示支持范围 |
| `MISSING_BIRTHPLACE` | 缺少出生地 | 要求选择都道府县 |
| `ENGINE_UNAVAILABLE` | 计算服务不可用 | 稍后重试 |
| `SOLAR_TERM_DATA_MISSING` | 节气数据缺失 | 阻止生成，不输出伪结果 |

## 10. 测试样例

### 10.1 样例格式

```ts
type CalculationFixture = {
  id: string;
  description: string;
  input: ShichusuimeiInput;
  expected: {
    year?: Pillar;
    month?: Pillar;
    day?: Pillar;
    hour?: Pillar;
    warnings?: CalculationWarning[];
  };
  source: {
    name: string;
    url?: string;
    checkedAt: string;
    notes?: string;
  };
};
```

### 10.2 必须覆盖

至少 20 组样例：

- 普通日期 8 组。
- 立春前后 4 组。
- 月节气边界前后 4 组。
- 时辰边界 2 组。
- 出生时间不明 1 组。
- 出生地缺省或简化 1 组。

### 10.3 验收标准

MVP 上线前：

- 年柱、月柱、日柱、时柱样例全部通过。
- 节气边界样例人工复核。
- 与至少两个可信排盘来源对照。
- 不通过时不得上线真实结果，只能保留表单和等待提示。

## 11. 工程接口

### 11.1 推荐函数

```ts
function calculateShichusuimei(input: ShichusuimeiInput): ShichusuimeiResult;
```

### 11.2 推荐模块

```text
lib/shichusuimei/
  calculate.ts
  calendar.ts
  pillars.ts
  ten-gods.ts
  elements.ts
  hidden-stems.ts
  warnings.ts
  types.ts
  fixtures.ts
```

### 11.3 前后端边界

MVP 可以先在服务端 API 中计算：

```text
POST /api/shichusuimei/calculate
```

请求：

```json
{
  "birthDate": { "year": 1996, "month": 8, "day": 14 },
  "birthTime": { "known": true, "hour": 9, "minute": 30 },
  "birthplace": {
    "country": "JP",
    "prefecture": "東京都",
    "timezone": "Asia/Tokyo"
  }
}
```

响应：

```json
{
  "ok": true,
  "result": {}
}
```

错误：

```json
{
  "ok": false,
  "error": {
    "code": "SOLAR_TERM_DATA_MISSING",
    "message": "節気データが不足しているため、命式を作成できません。"
  }
}
```

## 12. 选型待办

需要进一步确认：

1. 是否存在适合 TypeScript/JavaScript 的可靠四柱推命库。
2. 若无可靠库，是否使用历法库 + 自研干支规则。
3. 节气数据来源。
4. 支持年份范围。
5. 是否在 MVP 支持大運。
6. 是否在 MVP 支持真太阳时。
7. 验证样例来源和复核人。

## 13. 推荐下一步

1. 调研可用计算库。
2. 建立 `fixtures.ts` 样例格式。
3. 收集 20 组验证样例。
4. 实现最小 `calculateShichusuimei`。
5. 先输出结构化命式，不写长文解释。
6. 通过测试后再接入 `site3` 视觉体系和结果页。
