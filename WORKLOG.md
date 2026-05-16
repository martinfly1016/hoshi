# 星の命式 工作日志

用于记录项目开发过程中的关键进展、需求决策、Case study、问题排查和经验教训。

## 协作机制

- 主 agent 负责整体规划、需求拆解、调度、进度跟踪、验收、发布和对外进度反馈。
- 具体执行可按任务拆给 Dev、QA、UI/UE、Algorithm 等专业子代理并行推进，避免多个需求长期串行堵塞。
- 子代理需要有明确任务边界和文件/职责范围，不能互相覆盖修改；结果由主 agent 汇总、复核、发布。
- 详细机制见 `AGENT_WORKFLOW.md`。

## 版本记录

| 版本 | 更新时间 | 类型 | 页面/范围 | 主要内容 | 新版地址 | 对比/归档地址 | 提交 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| v0.1.0 | 2026-05-14 23:00 JST | 功能发布 | 用户首页 `/index.html` | 接入后台验证页同一套 `calculateShichusuimei()`，显示真实四柱、日主、五行、十神、藏干、纳音、空亡、地势、自坐和真太阳时信息 | `/index.html?v=20260514-usercalc-3` | `/archive/pre-usercalc-20260514/index.html?v=20260514-archive-2` | main `bb5bea4` / gh-pages `1c26458` |
| v0.1.1 | 2026-05-14 23:05 JST | 归档 | 用户首页旧版 | 发布用户页接入算法前的旧版快照，便于对比 | `/index.html?v=20260514-usercalc-3` | `/archive/pre-usercalc-20260514/index.html?v=20260514-archive-2` | main `2cc0875` / gh-pages `f3accd8` |
| v0.1.2 | 2026-05-14 23:13 JST | 视觉修正 | 用户首页移动端 | 优化手机端顶部、结果卡、命式要点与命式详情表格窄屏展示 | `/index.html?v=20260514-mobilefix-2` | `/archive/pre-mobilefix-20260514/index.html?v=20260514-pre-mobilefix-2` | main `aed7d6b` / gh-pages `b89280f` |
| v0.1.3 | 2026-05-14 23:19 JST | 视觉修正 | 用户首页移动端四柱 | 修正手机端基础八字四柱从 2×2 改回横向一排四列展示 | `/index.html?v=20260514-fourpillar-row-1` | `/archive/pre-fourpillar-row-20260514/index.html?v=20260514-pre-fourpillar-row-1` | main `128478a` / gh-pages `37c6d26` |
| v0.2.0 | 2026-05-14 23:51 JST | 后台算法 | 后台验证页 `/shichusuimei/free/index.html` | 增加日主/五行/十神基础解说文；新增性别输入；加入大运、流年、流月、流日初版排盘展示 | `/shichusuimei/free/index.html?v=20260514-reading-luck-1` | `/archive/pre-backend-reading-luck-20260514/shichusuimei/free/index.html?v=20260514-pre-reading-luck-1` | main `5390de2` / gh-pages `86371c1` |
| v0.2.1 | 2026-05-15 00:02 JST | 用户首页 | 首页 `/index.html` | 按产品需求文档调整用户结果体验：姓名/性别改为非必填；结果先显示日文摘要、关键标签、日主/性格/恋爱/仕事解说，再显示五行和专业命式表 | `/index.html?v=20260515-user-reading-1` | `/archive/pre-user-reading-prd-20260514/index.html?v=20260515-pre-user-reading-1` | main `84e62b1` / gh-pages `bd167e1` |
| v0.2.2 | 2026-05-15 00:08 JST | 用户首页 | 首页结果区 `/index.html` | 将后台已算出的四柱、五行、十神进一步转成图文解说：新增四柱时间层级卡、五行强弱状态卡、十神角色卡 | `/index.html?v=20260515-visual-reading-1` | `/archive/pre-user-visual-reading-20260515/index.html?v=20260515-pre-visual-reading-1` | main `201e714` / gh-pages `6c66d14` |
| v0.2.3 | 2026-05-15 00:15 JST | 用户首页 | 首页结果区 `/index.html` | 在用户页加入大运、流年初版计算展示与解说；未选性别时提示大运需性别，流年直接展示今年起的年度干支主题 | `/index.html?v=20260515-luck-reading-1` | `/archive/pre-user-luck-reading-20260515/index.html?v=20260515-pre-luck-reading-1` | main `b80da28` / gh-pages `ea3d0fd` |
| v0.2.4 | 2026-05-15 00:20 JST | 用户首页 | 首页结果区 `/index.html` | 增强当前十年大运解说：自动识别当前年份所在大运并高亮，补充工作、财运、恋爱/对人、读法四维说明 | `/index.html?v=20260515-current-decade-1` | `/archive/pre-current-decade-reading-20260515/index.html?v=20260515-pre-current-decade-1` | main `49b08e8` / gh-pages `b1d1bfe` |
| v0.2.5 | 2026-05-15 00:26 JST | 用户首页 | 首页移动端首屏 `/index.html` | 根据手机截图修正首屏 UI：CTA 文案改为清晰日文、按钮不再挤字，说明文案避免异常断行，手机端顶部仅保留可用导航项 | `/index.html?v=20260515-mobile-hero-1` | `/archive/pre-mobile-hero-ui-20260515/index.html?v=20260515-pre-mobile-hero-1` | main `82eca01` / gh-pages `533cfbb` |
| v0.2.6 | 2026-05-16 18:44 JST | 后台验证页 | `/shichusuimei/free/index.html` 五行结果区 | 按反馈将五行关系图移到构成比前面，新增“偏多/补五行”说明与按月令计算的旺相休囚死状态卡，并修正中窄屏下解说卡两列过窄的问题 | `/shichusuimei/free/index.html?v=free-20260516-elements-1` | `/archive/pre-five-elements-reading-20260516/shichusuimei/free/index.html?v=free-20260514-luck-1` | main `f36116f` / gh-pages `2076dce` |
| v0.2.7 | 2026-05-16 18:58 JST | 后台验证页 | `/shichusuimei/free/index.html` 詳解区 | 新增日柱/婚姻宮详解：按日支、藏干/支神、日主与日支五行关系展开亲密关系读法；手机端结果 tab 改为换行显示避免裁切 | `/shichusuimei/free/index.html?v=free-20260516-marriage-1` | `/archive/pre-marriage-palace-reading-20260516/shichusuimei/free/index.html?v=free-20260516-elements-1` | main `b11d1e5` / gh-pages `2ca1eaf` |
| v0.2.8 | 2026-05-16 19:04 JST | 后台验证页 | `/shichusuimei/free/index.html` 詳解区 | 将四柱坐从单独日柱扩展为年柱/月柱/日柱/时柱四张详解卡，解释各柱坐支、藏干/支神、自坐十二运和人生领域含义 | `/shichusuimei/free/index.html?v=free-20260516-seats-1` | `/archive/pre-four-pillar-seat-reading-20260516/shichusuimei/free/index.html?v=free-20260516-marriage-1` | main `ee240ab` / gh-pages `cea4a52` |
| v0.2.9 | 2026-05-16 19:10 JST | 后台验证页 | `/shichusuimei/free/index.html` 詳解区 | 新增四柱读取位置可视化：将每柱拆成天干/地支并标注来源含义，突出「日柱・地支＝婚姻宮」以说明解读依据 | `/shichusuimei/free/index.html?v=free-20260516-source-map-1` | `/archive/pre-reading-source-map-20260516/shichusuimei/free/index.html?v=free-20260516-seats-1` | main `0d389b1` / gh-pages `8c69d70` |
| v0.3.0 | 2026-05-16 19:16 JST | 后台验证页 | `/shichusuimei/free/index.html` 结果信息架构 | 将结果区从多个细分 tab 重组为三页：「命式」「命式詳細」「大運流年」；保留旧 section 参数兼容映射 | `/shichusuimei/free/index.html?v=free-20260516-three-pages-1` | `/archive/pre-three-result-pages-20260516/shichusuimei/free/index.html?v=free-20260516-source-map-1` | main `226eede` / gh-pages `f8469db` |
| v0.3.1 | 2026-05-16 19:21 JST | 后台验证页 | 三页初版页面 | 在三页拆分基础上补齐页面头与页面级说明：完善「命式」总览卡，同时给「命式詳細」「大運流年」制作可独立阅读的初版页面开头 | `/shichusuimei/free/index.html?v=free-20260516-three-page-drafts-1` | `/archive/pre-three-page-first-drafts-20260516/shichusuimei/free/index.html?v=free-20260516-three-pages-1` | main `2f8651a` / gh-pages `1938d5d` |
| v0.3.2 | 2026-05-16 19:34 JST | 后台算法 / 三页可视化 | `/shichusuimei/free/index.html` 五行算法与三页结果 | 五行统计从展示用整数升级为 raw points、构成比、主导/弱项/缺项、平衡分和计算根拠；「命式」显示平衡摘要，「命式詳細」新增五行計算の根拠卡，「大運流年」新增当前大运/流年/流月/流日概览卡 | `/shichusuimei/free/index.html?v=free-20260516-accuracy-visual-1` | `/archive/pre-algorithm-visual-20260516/shichusuimei/free/index.html?v=free-20260516-three-page-drafts-1` | main `c0fc22b` / gh-pages `5e0d13e` |
| v0.3.3 | 2026-05-16 19:40 JST | 后台验证页 | 标签体系 / 三页可视化 | 优化标签应用：新增「命式タグ」总览，把日主、读取根拠、性质、强五行、补/缺五行、十神、婚姻宮定位做成结构化彩色标签；详解里的日主/十神标签也改用统一组件 | `/shichusuimei/free/index.html?v=free-20260516-tags-1` | `/archive/pre-tag-optimization-20260516/shichusuimei/free/index.html?v=free-20260516-accuracy-visual-1` | main `52019fd` / gh-pages `b57da43` |
| v0.3.4 | 2026-05-16 19:48 JST | 后台验证页 | 标签索引 / 详解跳转 | 将命式标签从关键词升级为可点击索引：新增格局、身强身弱、性格、强五行、补/缺五行、好运来源、主要课题、婚姻宮、运势走势等标签；每个标签显示依据和简短说明，点击可跳转到对应详解模块 | `/shichusuimei/free/index.html?v=free-20260516-linked-tags-1` | `/archive/pre-linked-tags-20260516/shichusuimei/free/index.html?v=free-20260516-tags-1` | main `282fd58` / gh-pages `85b164c` |
| v0.3.5 | 2026-05-16 19:57 JST | 用户首页 | `/index.html` 结果页 | 将后台已整理的信息同步到面向用户页面：新增命式标签索引与解释卡，承接格局、身强身弱、性格、五行强弱、补/缺五行、好运来源、主要课题、婚姻宫与走势；五行条改用后台百分比，用户页 calculation bridge 更新到最新算法缓存 | `/index.html?v=20260516-user-sync-1` | `/archive/pre-user-backend-sync-20260516/index.html?v=free-20260516-linked-tags-1` | main `45bb66d` / gh-pages `f92ab29` |
| v0.3.6 | 2026-05-16 20:02 JST | 用户首页 | `/index.html` 四柱说明 | 在用户页四柱排盘下新增四柱含义说明卡，解释年柱、月柱、日柱、时柱分别代表的家系/环境、社会/仕事、本人/婚姻宫、未来/内面等领域；点击说明卡可高亮对应四柱 | `/index.html?v=20260516-user-pillars-1` | `/archive/pre-user-backend-sync-20260516/index.html?v=20260516-user-sync-1` | main `aa46bf4` / gh-pages `47fab33` |
| v0.3.7 | 2026-05-16 20:05 JST | 用户首页 | `/index.html` 命盘整体状态 | 在四柱说明下新增「命盤状態」模块，把后台已有格局、身强身弱、五行偏向、平衡分和用神整理成用户可读的整体状态判断，并标注每项读取来源 | `/index.html?v=20260516-user-state-1` | `/archive/pre-user-chart-state-20260516/index.html?v=20260516-user-pillars-1` | main `28ada62` / gh-pages `47d25d0` |
| v0.3.8 | 2026-05-16 20:15 JST | 用户首页 | `/index.html` 命式構造表 | 将后台验证页的四柱矩阵显示模式同步到用户页，在排盘区新增「命式構造表」，按年柱/月柱/日柱/时柱横向展示干神、天干、地支、藏干、支神、纳音，并在手机端限制为表格内部横向滚动 | `/index.html?v=20260516-user-board-1` | `/archive/pre-user-bazi-board-20260516/index.html?v=20260516-user-state-1` | main `5a49188` / gh-pages `d448149` |
| v0.3.9 | 2026-05-16 20:20 JST | 用户首页 | `/index.html` 命式主展示 | 将用户页「命式」区改为直接使用四柱矩阵表作为主展示，移除原四张竖卡重复展示；表格补充空亡、地勢、自坐，并支持点击/说明卡联动高亮对应柱 | `/index.html?v=20260516-user-table-1` | `/archive/pre-user-table-primary-20260516/index.html?v=20260516-user-board-1` | main `7c9a016` / gh-pages `0c18688` |
| v0.3.10 | 2026-05-16 20:45 JST | 用户首页 | `/index.html` 后台信息同步 | 将后台已计算出的详细信息继续同步到用户页：「命式詳細」新增格局/身强身弱/用神、五行计算根拠与旺相休囚死、十神占比/藏干重叠、四柱坐与日支婚姻宫定位；「大運流年」新增大运、流年、流月、流日表格，并修正手机返回按钮与横向溢出 | `/index.html?v=20260516-user-backend-1` | `/archive/pre-user-backend-detail-sync-20260516/index.html?v=20260516-user-table-1` | main `d166441` / gh-pages `34ab812` |

> 后续每次代码或页面发布，都追加一行版本记录，包含日期时间、版本号、修改范围、新版地址、归档/对比地址和提交号。

## 2026-05-14

- 初始化协作上下文：项目仓库已拉取到本地 `/Users/cathy/.openclaw/workspace/hoshi`。
- 已确认线上 GitHub Pages 地址对应 `gh-pages` 分支；当前线上页面内容与本地 `site3` 目录一致。
- 后续开发约定：在 `main` 分支进行修改，发布时将 `site3` 内容同步到 `gh-pages` 分支根目录。
- 工作日志约定：重大进展、上线记录、Case study、踩坑与经验教训需要及时补充到本文档。
- 协作角色：ByteAD 介绍 Wreal 为项目产品负责人，后续页面修改需求、优先级和验收预期可由 Wreal 直接沟通。
- 产品澄清：`/shichusuimei/free/index.html` 当前可作为八字/四柱命盘推算算法验证与结果参考页面；实际用户优先看到的是右上角“首頁”链接进入的站点首页 `/index.html`。
- 算法状态：产品侧已初步确认后台验证页所使用的八字/四柱命盘推算算法“大致正确”，后续用户页可优先复用该计算核心并围绕展示体验优化。
- 用户页同步：将 `/index.html` 首页接入后台验证页同一套 `calculateShichusuimei()` 计算核心；提交后展示真实四柱、日主、五行比例、主要十神、藏干、纳音、空亡、地势、自坐和真太阳时补正信息。此版本先保证用户页可用作后续需求确认入口，UI 和文案仍待产品侧继续验收与调整。
- 发布记录：`main` 提交 `bb5bea4`，`gh-pages` 发布提交 `1c26458`。线上验证通过，带缓存参数的测试地址为 `/index.html?v=20260514-usercalc-3`。
- 归档约定：产品侧要求后续每次操作都留下修改日志，并在页面大改时保留旧版页面供对比。本次已从 `b365f80` 恢复用户页改造前的 `site3` 快照到 `site3/archive/pre-usercalc-20260514/`，并发布到 `gh-pages` 提交 `f3accd8`。旧版首页可通过 `/archive/pre-usercalc-20260514/index.html?v=20260514-archive-2` 对比。
- 响应式要求：后续更新面向用户的页面时，需要自动适配 PC 浏览器和智能手机浏览器两个版本；用户页相关改动应同时检查桌面与手机视口，避免只按单一屏幕尺寸验收。
- 移动端视觉修正：根据产品截图反馈，当前用户页虽能自适应手机浏览器，但结果区仍有视觉问题。已先归档修正前版本到 `site3/archive/pre-mobilefix-20260514/`；随后优化手机端顶部安全区、导航横向拥挤、结果卡标题贴边、命式要点长文本和 `命式詳細` 表格在窄屏只能看到部分列的问题。
- 四柱移动端排列修正：产品反馈手机端基础八字四柱应保持同一行展示，不应自动变为上下两排。已归档修正前版本到 `site3/archive/pre-fourpillar-row-20260514/`，并调整移动端 `.pillars` 为四列紧凑布局。
- 领域规则：八字 / 四柱推命的基础命盘展示中，四柱横向并列成一排是领域表达要求，不只是视觉偏好。后续无论 PC 或手机端，基础四柱命盘都应优先保持同一横排；如窄屏空间不足，应通过压缩字号/间距或局部横向滚动解决，而不是改成 2×2 或纵向排列。
- 响应式视觉原则：类似手机端四柱换行、导航拥挤、表格溢出等问题，后续应按页面/浏览器尺寸自动调整字号、间距、卡片密度和滚动方式；但不能牺牲领域表达结构，例如基础四柱横排展示。
- 双轨推进原则：后续项目同时推进“面向用户 UI 界面”和“后台算法更新”两条主线。后台算法页负责验证排盘计算正确性，用户页负责把已验证的信息以可理解、可用、可适配 PC/手机的方式展示。算法字段变化时要同步检查用户页展示；用户页新增展示需求时要确认后台算法是否已有可靠字段支撑。
- Agent 协作机制：产品侧建议主 agent 负责规划协调、调度、进度跟踪、验收和反馈，Dev、QA、UI/UE、算法验证等执行任务分别建立专业子代理，避免长时间无响应和多需求串行阻塞。已新增 `AGENT_WORKFLOW.md` 记录主 agent 与各专业子代理职责、日志位置和发布规则。
- 后台算法更新 v0.2.0：根据产品需求，先在后台验证页新增排盘后的规则化解说模块，覆盖日主阴阳五行、五行构成与补充建议、十神/藏干引出的性格、工作、恋爱、财运等初版文案；同时新增性别输入并接入 tyme4ts 的 `ChildLimit` 计算大运，补充流年、流月、流日干支排盘。旧版后台页已归档到 `site3/archive/pre-backend-reading-luck-20260514/`。
- v0.2.0 验证记录：`node --check` 通过；样例 `1990-06-15 12:00` 男性返回第一步大运 `癸未`、8-17 岁、1997-2006，2026 流年 `丙午`，2026-05-14 流日 `戊子`。浏览器可视化验证受当前 Browser 工具策略限制，已用本地 HTTP 与静态检查确认资源可访问，发布后仍需产品侧线上目测验收。
- 用户首页 v0.2.1：按照产品需求文档把结果页从“后台字段展示”进一步改成面向日本普通用户的阅读体验。输入侧降低门槛，姓名和性别均为非必填，性别只在后续大运顺逆计算中使用；结果侧按“摘要 → 四柱 → 命式要点 → 日主/性格/恋爱/仕事 → 五行 → 专业命式表 → 后续入口”的顺序组织。旧版用户首页已归档到 `site3/archive/pre-user-reading-prd-20260514/`。
- v0.2.1 验证记录：本地用 `capture-website` 生成桌面和手机端截图，并通过脚本填写 `1990-06-15` 后成功生成结果卡；手机端四柱保持一排横向显示，结果摘要和解说模块可见。`.jsx` 文件无法用 `node --check` 直接检查扩展名，改用浏览器/Babel 实际渲染验证。
- 用户首页 v0.2.2：根据“把后台页面已计算出来的八字、五行、十神反应为可理解图文解说”的反馈，新增三类图文模块：四柱时间层级卡（年柱/根、月柱/场、日柱/我、时柱/芽）、五行强弱状态卡（强/弱/缺与生活补充提示）、十神角色卡（自分轴、表达、财富、责任、学习等角色化解释）。旧版用户首页已归档到 `site3/archive/pre-user-visual-reading-20260515/`。
- v0.2.2 验证记录：本地用 `capture-website` 生成桌面和手机端结果卡截图，脚本填写 `1990-06-15` 后成功生成结果；手机端四柱仍保持一排横向展示，新图文卡片在结果中可见。
- 用户首页 v0.2.3：将后台已有 `luckCycles` 字段同步到用户页结果区，新增“大運・流年を見る”模块。流年展示从今年开始的年度干支、五行和通变星主题；大运展示前四步十年运。如果用户性别为“無 / 不問”，大运区域提示需要选择性别，因为顺逆计算依赖性别。
- v0.2.3 验证记录：本地样例 `1990-06-15` 中，未选性别返回大运 `requires_gender` 且流年 `2026 丙午` 正常展示；选择男性后第一步大运为 `癸未`。用 `capture-website` 分别生成未选性别和男性两种手机端结果截图，确认大运/流年模块可见。
- 用户首页 v0.2.4：根据“针对当年的大运十年，命主的运势如何”的反馈，新增当前十年大运解说。页面会根据当前流年年份匹配所在大运，高亮当前大运，并给出“这10年主题”、工作、财运、恋爱/对人、读法四个维度的说明。
- v0.2.4 验证记录：本地样例 `1990-06-15` 男性，2026 年匹配当前大运 `乙酉`（2017-2026），十神主题为 `偏财`；手机端截图确认“現在の大運”卡片可见。
- 用户首页 v0.2.5：根据产品侧手机截图，修正移动端首屏按钮和说明文案的可读性问题。CTA 从偏古雅且易挤压的「無料にて卜を乞う」调整为「無料で命式を見る」，印章字改为「命」；首屏说明文案改成更清晰的现代日文，并在窄屏降低字距，避免单字被挤到下一行。手机导航隐藏暂未可用的后两项，减少顶部拥挤。
- v0.2.5 验证记录：本地用 `capture-website` 生成 390×844 手机端和 1365×900 桌面首屏截图，确认手机端 CTA 文案完整、说明文案正常换行，顶部导航不再挤满屏幕。
- 后台验证页 v0.2.6：根据 Wreal 对五行构成区的反馈，五行关系图现在先于构成比展示；新增自动生成的五行偏多/补足说明，并加入传统“旺相休囚死”月令状态。规则按月支判断：寅卯木旺、巳午火旺、申酉金旺、亥子水旺，辰未戌丑按土用土旺处理。
- v0.2.6 验证记录：`node --check site3/shichusuimei/free/page.js` 通过；本地 `capture-website` 生成桌面与手机截图，五行关系图、构成比、说明文与旺相休囚死卡片均无重叠或裁切。追加按 Wreal 截图检查 760px 与 390px 解说区，`婚姻の視点` / `事業の視点` 卡片已改为中窄屏单列，避免标题和正文被压窄。
- 后台验证页 v0.2.7：按 Wreal 反馈，把「日柱婚姻宫」放进詳解区单独展开。新增读取日支、日柱藏干/支神、日支五行与日主五行关系的规则化文案，说明亲密关系里的距离感、安心材料和摩擦点，不直接断定婚姻有无。
- v0.2.7 验证记录：`node --check site3/shichusuimei/free/page.js` 通过；本地手机全页截图确认日柱/婚姻宮区无重叠和裁切，结果 tab 在手机端改为两行完整显示。
- 后台验证页 v0.2.8：按 Wreal 反馈，详解区新增「四柱それぞれの坐」模块，不再只解释日柱。年柱对应家系/幼少期，月柱对应仕事环境/社会性，日柱对应本人居所/婚姻宫，时柱对应未来/晩年/表达芽；每柱展示坐支、主支神、藏干、自坐十二运和解释文。
- v0.2.8 验证记录：`node --check site3/shichusuimei/free/page.js` 通过；本地 390px 手机全页截图确认四柱坐详解卡无重叠、无裁切，结果 tab 可见。
- 后台验证页 v0.2.9：按 Wreal 反馈，详解区新增「読み取り位置」可视化定位图，四柱拆成天干/地支两层，并对每个位置标注来源含义。日柱地支额外高亮并加「婚姻宮」标签，说明婚姻/亲密关系读法来自四柱中的具体位置。
- v0.2.9 验证记录：`node --check site3/shichusuimei/free/page.js` 通过；本地 390px 手机全页截图确认定位图、婚姻宮标签无重叠、无裁切。
- 后台验证页 v0.3.0：按 Wreal 要求，先将结果信息拆成三个主页面：「命式」承载基础命盘和日主概览；「命式詳細」承载五行、十神、读取位置、四柱坐、婚姻宫等详细解释；「大運流年」承载大运、流年、流月、流日。旧的 `section=reading/elements/structure/meta` 会映射到命式詳細，`section=day-master/chart` 映射到命式，`section=luck` 映射到大運流年。
- v0.3.0 验证记录：`node --check site3/shichusuimei/free/page.js` 通过；本地 390px 手机截图分别检查 `section=meishiki/detail/luck`，三页 tab 高亮正确、内容不混页、无明显重叠或裁切。
- 后台验证页 v0.3.1：继续完善三页初版。新增通用页面头 `PAGE 1 / MEISHIKI`、`PAGE 2 / DETAIL`、`PAGE 3 / LUCK`；命式页新增日主、主导五行、出生地/时刻总览卡；命式詳細与大運流年页补充页面级说明和本页内容摘要。
- v0.3.1 验证记录：`node --check site3/shichusuimei/free/page.js` 通过；本地 390px 手机截图分别检查三页，页面头和摘要卡可见，无明显重叠或裁切。
- 后台验证页 v0.3.2：按 Wreal 对“完善后台算法，提高准确性，同时做好三个页面可视化”的反馈，先强化五行算法输出。后台现在保留 raw points，用天干、地支藏干、月柱季节权重和月柱倍率生成构成比，并输出主导五行、弱项、缺项、总点数和平衡分，避免前端只依赖四舍五入后的显示整数。
- v0.3.2 三页可视化：命式页的主导五行卡补充平衡分；命式詳細页在五行区加入“五行計算の根拠”，展示五行百分比、raw point、count 和月支/月柱倍率/天干基礎点/藏干基礎点；大運流年页新增当前大运、流年、流月、流日四张概览卡，再进入表格细节。
- v0.3.2 验证记录：`node --check site3/calculation-lab.js` 和 `node --check site3/shichusuimei/free/page.js` 通过；Node 样例 `1990-06-15 10:30 male` 返回 `庚午 / 壬午 / 辛亥 / 癸巳`，五行 raw points、百分比、平衡分和大运均正常；本地 390px 手机截图检查 `section=meishiki/detail/luck`，三页结果可见，无明显重叠或裁切。
- 后台验证页 v0.3.3：按 Wreal 对标签应用的反馈，将标签从单纯性格词升级为结构化阅读入口。命式页新增「命式タグ」总览，按日主、根拠、性質、強、補/缺、十神、定位分类；标签颜色与类别绑定，帮助用户快速知道“这个结论来自哪里、属于哪类信息、该关注什么”。
- v0.3.3 验证记录：`node --check site3/shichusuimei/free/page.js` 通过；本地 390px 手机截图检查 `section=meishiki/detail`，命式标签和详解标签无明显重叠、裁切，长标签增加留白后可读性正常。
- 后台验证页 v0.3.4：按 Wreal 对“标签要连接其他解析部分”的反馈，将「命式タグ」改为可点击索引。标签现在覆盖格局、身强身弱、性格特点、五行强弱、补/缺五行、好运来源、人生主要课题、婚姻宫定位、人生运势走势；每个标签下方新增解释卡，显示该标签的依据与说明。
- v0.3.4 详解承接：命式詳細页新增「格局 / 身強身弱 / 用神」说明区，承接格局、身强身弱和好运来源标签；五行、人生课题、婚姻宫和大运走势标签分别跳转到五行详解、人生主题、婚姻宫、大運流年概览。点击后会切换到目标页面并滚动到对应模块。
- v0.3.4 验证记录：`node --check site3/shichusuimei/free/page.js` 通过；本地 390px 手机截图检查命式标签索引，标签、说明卡和「詳解へ」按钮无明显重叠或裁切。
- 用户首页 v0.3.5：开始把后台验证页已经确认的信息同步到面向用户页面。结果页新增「命式タグ索引」，标签覆盖格局、身强身弱、性格、强五行、补/缺五行、好运来源、主要课题、婚姻宫与走势；每个标签有简短解释和依据，点击可跳到用户页已有的命式、五行、详解或大运页面。
- v0.3.5 展示同步：用户页五行条改用后台 `fiveElements.percentages`，保留原有命式、日主、婚姻/事业、五行图和大运页面；`calculation-bridge.js` 缓存参数更新，确保用户页使用最新算法字段。
- v0.3.5 验证记录：本地 Playwright 以 390px 手机视口完成从首页进入表单、输入 `1990-06-15 巳时`、提交生成结果；确认用户页出现「命式タグ索引」、格局、身强身弱、好运来源、走势等标签。手机全页截图无明显重叠或裁切，但标签解释卡较多，后续应继续压缩首屏信息密度。
- 用户首页 v0.3.6：按 Wreal 对“四柱代表的意思”的反馈，在用户页四柱排盘下新增四柱含义说明卡。年柱说明家系/幼少期/外部印象，月柱说明社会性/工作环境，日柱说明本人核心/日主/婚姻宫，时柱说明内面/未来/晩年/子ども縁。说明卡点击后可高亮对应四柱。
- v0.3.6 验证记录：本地 Playwright 以 390px 手机视口完整跑通首页 → 表单 → 结果，确认四柱含义卡、婚姻宫说明和标签索引均出现；手机截图检查四柱说明卡无明显重叠或裁切。
