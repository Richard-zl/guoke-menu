// 订单数据配置（静态）
// 分类 Tab：全部分类 + 特色体验单 / 护航单 / 陪玩单 / 趣味单 / 大红对赌单 / 跑刀专区
// orderType：experience | escort_formal | escort_prison | playmate_map | playmate_female |
//   fun_escort_day | fun_ai_gun | fun_demon_streak | fun_sand_safe | fun_sand_match |
//   fun_home_temptation | fun_space_order | fun_dam_king | fun_twelve_gold | fun_full_load |
//   fun_infinite_refill | fun_cattle_horse | fun_quality | fun_heaven_havoc | fun_love_diary | bigred |
//   knife_run_tier

const mkPricing = (rawText, priceValue, priceUnit, guaranteeValue, guaranteeUnit) => ({
  rawText,
  priceValue,
  priceUnit,
  guaranteeValue,
  guaranteeUnit
})

/**
 * public 目录静态资源 URL（拼接 Vite BASE_URL）。
 * 部署在子路径时，避免 /images/xxx 误指向站点根导致 404。
 */
function asset(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

/** 生成陪玩三档时薪（每张地图可不同） */
function mkPlaymateTiers(jianBing, zhanJiang, wangPai) {
  return [
    { level: '尖兵', pricePerHour: jianBing, unit: 'R/h' },
    { level: '战将', pricePerHour: zhanJiang, unit: 'R/h' },
    { level: '王牌', pricePerHour: wangPai, unit: 'R/h' }
  ]
}

// 六张地图各自价目（尖兵 / 战将 / 王牌，单位 R/h）— 可按你方最新价目表改数字
const PLAYMATE_TIERS_JIMI_DABA = mkPlaymateTiers(50, 60, 80) // 机密大坝
const PLAYMATE_TIERS_JIMI_BAKESHI = mkPlaymateTiers(60, 80, 100) // 机密巴克什
const PLAYMATE_TIERS_JIMI_HANGTIAN = mkPlaymateTiers(60, 80, 100) // 机密航天
const PLAYMATE_TIERS_JUEMI_BAKESHI = mkPlaymateTiers(80, 100, 120) // 绝密巴克什
const PLAYMATE_TIERS_JUEMI_HANGTIAN = mkPlaymateTiers(80, 100, 120) // 绝密航天
const PLAYMATE_TIERS_JUEMI_JIANYU = mkPlaymateTiers(100, 120, 140) // 绝密监狱

/** 正式护航单：绝密巴克什 / 绝密航天 */
const ESCORT_FORMAL_TIERS = [
  { priceR: 128, guaranteeWan: 688 },
  { priceR: 228, guaranteeWan: 1288 },
  { priceR: 328, guaranteeWan: 1888 },
  { priceR: 488, guaranteeWan: 2688 },
  { priceR: 888, guaranteeWan: 4888 }
]

/** 监狱护航单：绝密监狱 */
const ESCORT_PRISON_TIERS = [
  { priceR: 158, guaranteeWan: 688 },
  { priceR: 268, guaranteeWan: 1288 },
  { priceR: 388, guaranteeWan: 1888 }
]

function playmateMapProduct(id, mapLabel, tiers, imageIdx, priority) {
  const t = tiers
  const priceSummary = `尖兵${t[0].pricePerHour}/h · 战将${t[1].pricePerHour}/h · 王牌${t[2].pricePerHour}/h`
  const ruleTierText = `尖兵${t[0].pricePerHour}/h、战将${t[1].pricePerHour}/h、王牌${t[2].pricePerHour}/h`
  return {
    id,
    categoryId: 'playmate',
    orderType: 'playmate_map',
    series: '陪玩单',
    title: `陪玩 · ${mapLabel}`,
    subtitle: '按小时计费，尖兵 / 战将 / 王牌三档可选（本图价格见详情）。',
    tags: ['陪玩单', mapLabel, '时薪'],
    image: asset(`images/rules/order-${String(imageIdx).padStart(2, '0')}.webp`),
    heroImage: asset(`images/rules/order-${String(imageIdx).padStart(2, '0')}.webp`),
    heroTitle: mapLabel,
    heroSubtitle: '果壳电竞',
    playmateMeta: { mapLabel },
    playmateTiers: tiers,
    pricing: mkPricing(priceSummary, t[0].pricePerHour, 'R/h', null, null),
    details: `
计费说明（本图）：
  尖兵 ${t[0].pricePerHour}/h
  战将 ${t[1].pricePerHour}/h
  王牌 ${t[2].pricePerHour}/h

单陪说明：
  1.默认没有撤离率，包C不包撤，战将一小时最低击杀6个。王牌一小时最低击杀8个，如陪玩时间内未完成击杀，则不予结单，直至达成人头数，并完成当局游戏。
  2.若遇（外挂）或游戏内BUG，则当局正常计算在总时长中。

双陪说明：
  1.老板可卡战备进图--需带枪。
  2.战将及王牌一小时包撤一把，如果一小时内撒不出来的话不算入陪玩。
  3.若连续三把未撒出，可以联系客服后根据俱乐部人员情况更换车队。
其他：
  若遇（外挂）或游戏内BUG，则当局不计算时长，老板可提供死亡回放给客服进行核实
  具体单双陪与细则以客服/打手确认为准。
    `.trim(),
    ruleItems: [
      { title: '三档时薪', content: ruleTierText },
      { title: '地图', content: mapLabel }
    ],
    priority,
    isHot: false,
    showInList: true,
    views: 1000 + priority
  }
}

/** 点单说明（展示在「特色体验单」「护航单」详情底部，全文一处维护） */
const ORDERING_NOTICE = `
1）护航单
  地图由打手优先选择，模式须为绝密。

2）炸单说明
  撤离失败且本局带出物资价值小于 60W：计为炸单。
  带出价值在 60W～100W：一般不计炸单、不计入保底（以店内细则为准）。
  带出价值大于 100W：超出 100W 的部分可计入保底。
  机密地图：炸单补偿 30W/局；绝密地图：炸单补偿 60W/局。

3）丢包撤离
  丢包撤不视为炸单。

4）连续炸单
  连续三局炸单可联系客服，申请按保底规则处理或更换车队（以客服答复为准）。

5）私联与报备
  打手以任何方式索要老板私人联系方式，老板应在结单前向客服报备；核实后可按店规处理（如免单等，以客服为准）。

6）指挥与售后
  老板不听从打手指挥导致失败、撤离失败等，本单可按结单处理，不提供售后。

7）恶意行为
  发现打手恶意卡保底、态度恶劣等，请录屏并联系售后。

8）战备与损失
  老板仅需按约定携带战备进图；若自行携带过高价值装备导致损失，俱乐部不承担责任。

9）双倒
  打手与老板同时倒地（双倒）不计为炸单。

— 最终解释权归果壳电竞所有 —
`.trim()

/** 特色体验单「零号大坝（机密）」专用点单说明（与全局点单说明互斥展示） */
const ORDERING_NOTICE_ZERO_DAM = `
1）护航单
  地图由打手优先选择，模式须为机密。

2）炸单说明
  撤离失败且本局带出物资价值小于 20W：计为炸单。
  带出价值在 20W 及以上：不计炸单、计入保底（以店内细则为准）。
  炸单补偿 20W/局。

— 最终解释权归果壳电竞所有 —
`.trim()

export default {
  /** 供详情页底部展示 */
  orderingNotice: ORDERING_NOTICE,
  categories: [
    { id: 'all', name: '全部分类' },
    { id: 'experience', name: '特色体验单' },
    { id: 'escort', name: '护航单' },
    { id: 'playmate', name: '陪玩单' },
    { id: 'fun', name: '趣味单' },
    { id: 'bigred', name: '大红对赌单' },
    { id: 'knife_run', name: '跑刀专区' }
  ],
  merchant: {
    name: '果壳电竞',
    avatar: asset('images/merchant-avatar.png'),
    followers: 25000
  },
  products: [
    // --- 特色体验单（3 条：仅价格 + 地图/模式不同）---
    {
      id: 'exp-zero-dam',
      categoryId: 'experience',
      orderType: 'experience',
      series: '特色体验单',
      title: '48r 双护累计238万 · 零号大坝（机密）',
      subtitle: '每人限一单 · 双护累计目标以单内说明为准',
      tags: ['特色体验单', '零号大坝', '机密'],
      image: asset('images/rules/order-01.webp'),
      heroImage: asset('images/rules/order-01.webp'),
      heroTitle: '零号大坝体验',
      heroSubtitle: '果壳电竞',
      experienceMeta: {
        mapKey: 'zero_dam',
        priceR: 48,
        guaranteeWan: 238,
        label: '零号大坝（机密）'
      },
      pricing: mkPricing('48r 双护累计238万', 48, 'R', 238, '万'),
      details: `
特色体验单（每人限一单）
地图/模式：零号大坝 · 机密
价格与累计：48r，双护累计 238 万（哈夫币/带出价值以店内约定为准）。

下单时请说明本体验单类型，避免与正式护航混淆。
      `.trim(),
      ruleItems: [{ title: '限制', content: '每人限一单' }],
      /** 本单详情页底部「点单说明」单独文案，不沿用全局 ORDERING_NOTICE */
      orderingNoticeOverride: ORDERING_NOTICE_ZERO_DAM,
      priority: 100,
      isHot: true,
      showInList: true,
      views: 2100
    },
    {
      id: 'exp-top-no-prison',
      categoryId: 'experience',
      orderType: 'experience',
      series: '特色体验单',
      title: '98r 双护累计588万 · 绝密（监狱除外）',
      subtitle: '每人限一单 · 绝密地图不含监狱',
      tags: ['特色体验单', '绝密', '监狱除外'],
      image: asset('images/rules/order-02.webp'),
      heroImage: asset('images/rules/order-02.webp'),
      heroTitle: '绝密体验（不含监狱）',
      heroSubtitle: '果壳电竞',
      experienceMeta: {
        mapKey: 'top_secret_no_prison',
        priceR: 98,
        guaranteeWan: 588,
        label: '绝密（监狱除外）'
      },
      pricing: mkPricing('98r 双护累计588万', 98, 'R', 588, '万'),
      details: `
特色体验单（每人限一单）
模式：绝密（监狱地图除外）
价格与累计：98r，双护累计 588 万。
      `.trim(),
      ruleItems: [{ title: '地图范围', content: '绝密地图，不含监狱' }],
      priority: 99,
      isHot: true,
      showInList: true,
      views: 2050
    },
    {
      id: 'exp-prison-trial',
      categoryId: 'experience',
      orderType: 'experience',
      series: '特色体验单',
      title: '128r 双护累计588万 · 监狱体验单',
      subtitle: '每人限一单 · 监狱专项体验',
      tags: ['特色体验单', '监狱', '体验'],
      image: asset('images/rules/order-03.webp'),
      heroImage: asset('images/rules/order-03.webp'),
      heroTitle: '监狱体验单',
      heroSubtitle: '果壳电竞',
      experienceMeta: {
        mapKey: 'prison_trial',
        priceR: 128,
        guaranteeWan: 588,
        label: '监狱体验单'
      },
      pricing: mkPricing('128r 双护累计588万', 128, 'R', 588, '万'),
      details: `
特色体验单（每人限一单）
类型：监狱体验单
价格与累计：128r，双护累计 588 万。
      `.trim(),
      ruleItems: [{ title: '说明', content: '监狱专项体验档位' }],
      priority: 98,
      isHot: true,
      showInList: true,
      views: 2000
    },

    // --- 护航单：正式（2 条 product）---
    {
      id: 'escort-formal',
      categoryId: 'escort',
      orderType: 'escort_formal',
      series: '护航单',
      title: '正式护航单（绝密巴克什 / 绝密航天）',
      subtitle: '多档保底，地图：绝密巴克什、绝密航天',
      tags: ['护航单', '正式护航', '保底'],
      image: asset('images/rules/order-09.webp'),
      heroImage: asset('images/rules/order-09.webp'),
      heroTitle: '正式护航',
      heroSubtitle: '果壳电竞',
      escortMeta: {
        variant: 'formal',
        maps: ['绝密巴克什', '绝密航天'],
        tiers: ESCORT_FORMAL_TIERS
      },
      pricing: mkPricing('128r 保688万起', 128, 'R', 688, '万'),
      details: `
适用地图：绝密巴克什、绝密航天

各档位（人民币 / 保底带出，单位：万）：
  128r → 保底 688 万
  228r → 保底 1288 万
  328r → 保底 1888 万
  488r → 保底 2688 万
  888r → 保底 4888 万

具体结算与炸单规则见「点单说明」或客服确认。
      `.trim(),
      ruleItems: ESCORT_FORMAL_TIERS.map((t) => ({
        title: `${t.priceR}r`,
        content: `保底 ${t.guaranteeWan} 万`
      })),
      priority: 95,
      isHot: true,
      showInList: true,
      views: 3200
    },
    {
      id: 'escort-prison',
      categoryId: 'escort',
      orderType: 'escort_prison',
      series: '护航单',
      title: '监狱护航单（绝密监狱）',
      subtitle: '监狱专项档位，与正式护航价格体系不同',
      tags: ['护航单', '监狱', '保底'],
      image: asset('images/rules/order-10.webp'),
      heroImage: asset('images/rules/order-10.webp'),
      heroTitle: '监狱护航',
      heroSubtitle: '果壳电竞',
      escortMeta: {
        variant: 'prison',
        maps: ['绝密监狱'],
        tiers: ESCORT_PRISON_TIERS
      },
      pricing: mkPricing('158r 保688万起', 158, 'R', 688, '万'),
      details: `
适用地图：绝密监狱

各档位（人民币 / 保底带出，单位：万）：
  158r → 保底 688 万
  268r → 保底 1288 万
  388r → 保底 1888 万
      `.trim(),
      ruleItems: ESCORT_PRISON_TIERS.map((t) => ({
        title: `${t.priceR}r`,
        content: `保底 ${t.guaranteeWan} 万`
      })),
      priority: 94,
      isHot: true,
      showInList: true,
      views: 3000
    },

    // --- 陪玩单：6 地图（各图三档价不同）+ 女陪 ---
    playmateMapProduct('playmate-jimi-daba', '机密大坝', PLAYMATE_TIERS_JIMI_DABA, 7, 90),
    playmateMapProduct('playmate-jimi-bakeshi', '机密巴克什', PLAYMATE_TIERS_JIMI_BAKESHI, 7, 89),
    playmateMapProduct('playmate-jimi-hangtian', '机密航天', PLAYMATE_TIERS_JIMI_HANGTIAN, 7, 88),
    playmateMapProduct('playmate-juemi-bakeshi', '绝密巴克什', PLAYMATE_TIERS_JUEMI_BAKESHI, 7, 87),
    playmateMapProduct('playmate-juemi-hangtian', '绝密航天', PLAYMATE_TIERS_JUEMI_HANGTIAN, 7, 86),
    playmateMapProduct('playmate-juemi-jianyu', '绝密监狱', PLAYMATE_TIERS_JUEMI_JIANYU, 7, 85),
    {
      id: 'playmate-female',
      categoryId: 'playmate',
      orderType: 'playmate_female',
      series: '陪玩单',
      title: '女陪 · 娱乐类',
      subtitle: '统一 60/h，不参与三档地图表',
      tags: ['陪玩单', '女陪', '娱乐'],
      image: asset('images/rules/order-07.webp'),
      heroImage: asset('images/rules/order-07.webp'),
      heroTitle: '女陪',
      heroSubtitle: '果壳电竞',
      playmateMeta: { mapLabel: '女陪（娱乐类）' },
      playmateTiers: [{ level: '女陪', pricePerHour: 60, unit: 'R/h' }],
      pricing: mkPricing('女陪 60/h', 60, 'R/h', null, null),
      details: `
女陪（娱乐类）统一计价：60/h

说明：与「按地图分档」的尖兵/战将/王牌体系独立，下单时请备注女陪娱乐类。
      `.trim(),
      ruleItems: [{ title: '单价', content: '60 R/h' }],
      priority: 84,
      isHot: false,
      showInList: true,
      views: 2800
    },

    // --- 趣味单（5 条独立玩法）---
    {
      id: 'fun-escort-day-1888',
      categoryId: 'fun',
      orderType: 'fun_escort_day',
      series: '趣味单',
      title: '1888R 护航的一天',
      subtitle: '十步流程任务单，含地图熟悉度、保底与房卡收工',
      tags: ['趣味单', '护航的一天', '流程任务'],
      image: asset('images/rules/order-01.webp'),
      heroImage: asset('images/rules/order-01.webp'),
      heroTitle: '护航的一天',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('1888R · 累积保底2888W', 1888, 'R', 2888, 'W'),
      details: `
1888R 护航的一天 — 具体规则如下：

1. 找寻电脑
   护航上班需要一台笔记本电脑，或组装一台电脑（CPU、高速固态硬盘、电脑主板、内存条、液晶显示器、电源、鼠标、键盘）。

2. 寻找武器
   护航上班需要趁手的武器：局内缴获一把满改 70W 以上的枪，并累计 3 发 AWM 子弹。

3. 寻找装备
   护航需要装备：局内缴获 100 以上耐久的六甲，以及 40 以上耐久的六头。

4. 寻找老板
   护航需要找到老板：累计击杀一次敌方「老板」——定义为没带枪的医生，或背红包的医生。

5. 熟悉地图
   护航需要对地图很熟悉：
   · 机密大坝或夜间大坝：单局 300W
   · 绝密巴克什：单局 600W
   · 绝密航天：单局 600W

6. 工资
   任意对局，完成一次 10000 以上的行动报酬。

7. 老板奖励
   老板很满意，给护航一些奖励：需摸到香槟、鱼子酱、金条、高级咖啡豆中任意三个。

8. 记录时间
   护航需要记录时间计价：摸到劳力士或怀表。

9. 保底
   老板想要爽吃：累积保底 2888W。

10. 下班回家
    愉快的一天结束了，护航回家：需要一张 50W 以上的房卡。
      `.trim(),
      ruleItems: [
        { title: '1', content: '找寻电脑（笔记本或组装机全套配件）' },
        { title: '2', content: '满改 70W+ 枪 + 累计 3 发 AWM' },
        { title: '3', content: '六甲 100+ 耐久、六头 40+ 耐久' },
        { title: '4', content: '击杀敌方老板（医生规则）' },
        { title: '5', content: '地图单局：机坝/夜坝 300W；绝密巴/航各 600W' },
        { title: '6', content: '行动报酬 10000+' },
        { title: '7', content: '香槟/鱼子酱/金条/咖啡豆 任意三个' },
        { title: '8', content: '劳力士或怀表' },
        { title: '9', content: '累积保底 2888W' },
        { title: '10', content: '50W+ 房卡收工' }
      ],
      priority: 82,
      isHot: true,
      showInList: true,
      views: 3600
    },
    {
      id: 'fun-ai-gun-288',
      categoryId: 'fun',
      orderType: 'fun_ai_gun',
      series: '趣味单',
      title: 'AI改枪单 · 288R 保底888W',
      subtitle: '豆包随机两枪+改枪码，打手必须按码执行',
      tags: ['趣味单', 'AI改枪', '豆包'],
      image: asset('images/rules/order-11.webp'),
      heroImage: asset('images/rules/order-11.webp'),
      heroTitle: 'AI改枪单',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('288R 保底888W', 288, 'R', 888, 'W'),
      details: `
AI改枪单

价格：288R，保底 888W。

开局流程：
老板需要询问豆包（示例话术）：
「我现在要玩趣味单，你帮我从三角洲行动中随机抽取两把枪给打手用，并给出改枪码。」

执行要求：
打手必须使用豆包随机给出的两把枪及其改枪码完成本单。
      `.trim(),
      ruleItems: [
        { title: '价格/保底', content: '288R，保底 888W' },
        { title: '核心规则', content: '豆包随机两枪 + 改枪码，打手严格执行' }
      ],
      priority: 81,
      isHot: true,
      showInList: true,
      views: 3100
    },
    {
      id: 'fun-demon-streak',
      categoryId: 'fun',
      orderType: 'fun_demon_streak',
      series: '趣味单',
      title: '魔王连连撤 · 888R / 1888R',
      subtitle: '普通版三局500W撤离；魔王版三局清图，失败重计',
      tags: ['趣味单', '魔王连连撤', '连撤'],
      image: asset('images/rules/order-06.webp'),
      heroImage: asset('images/rules/order-06.webp'),
      heroTitle: '魔王连连撤',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('888R普通 / 1888R魔王', 888, 'R', null, null),
      details: `
魔王连连撤

普通版：888R
  需连续三局，每局 500W 撤离成功。

魔王版：1888R
  需连续三局清图。

失败规则：
中途任意一局失败，需从头开始计数。
      `.trim(),
      ruleItems: [
        { title: '普通版 888R', content: '连续三局，每局 500W 撤离' },
        { title: '魔王版 1888R', content: '连续三局清图' },
        { title: '失败', content: '中途失败从头计数' }
      ],
      priority: 80,
      isHot: true,
      showInList: true,
      views: 2900
    },
    {
      id: 'fun-sand-safe-588',
      categoryId: 'fun',
      orderType: 'fun_sand_safe',
      series: '趣味单',
      title: '沙色保险箱趣味单 · 588R',
      subtitle: '塔主目标至少爽吃2000W，含总裁卡与沙色保险等',
      tags: ['趣味单', '沙色保险', '塔主'],
      image: asset('images/rules/order-10.webp'),
      heroImage: asset('images/rules/order-10.webp'),
      heroTitle: '沙色保险箱',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('588R · 塔主至少2000W', 588, 'R', 2000, 'W'),
      details: `
沙色保险箱趣味单

价格：588R

塔主大人目标：至少爽吃 2000W！！

规则摘要：
· 基础保底 99W + 刷爆 1 整张总裁卡 + 9 个沙色大保险 + 20 次塔内房卡（总裁除外）
· 当局需带老板：查看医疗器械（踩点 relink）、侦察海洋监测厅（踩点海洋）、进入 B3 及一号审讯室审问打手（踩点花园）——其中两处即可

加成：
· 每多开启一个沙色大保险：额外 +99W 保底
· 每摸到一个三幻神：额外 +199W 保底
· 撤离成功但未完成踩点：单局 +99W 保底

板板须知：
· 撤离成功时，沙色保险才计数；房卡开了即计数。
      `.trim(),
      ruleItems: [
        { title: '价格', content: '588R' },
        { title: '目标', content: '至少爽吃 2000W' },
        { title: '计数', content: '沙色保险须撤离成功才计；房卡开了就计' }
      ],
      priority: 79,
      isHot: false,
      showInList: true,
      views: 2700
    },
    {
      id: 'fun-sand-match',
      categoryId: 'fun',
      orderType: 'fun_sand_match',
      series: '趣味单',
      title: '沙保连连看 · 158R / 588R / 1188R',
      subtitle: '多档连撤与许愿加成，详见正文计数规则',
      tags: ['趣味单', '沙保连连看', '多档位'],
      image: asset('images/rules/order-05.webp'),
      heroImage: asset('images/rules/order-05.webp'),
      heroTitle: '沙保连连看',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('158R / 588R / 1188R 三档', 158, 'R', null, null),
      details: `
沙保连连看 — 一直开一直爽

【158R 档】
单局 2 个 + 累计 688W。

【588R 档】
连撤两局，共 4 个，每局 688W。
板板可许愿：万金泪冠、纵横其中之一；若出许愿目标，+688W 保底（须提前许愿）。

【1188R 档】
连撤三局，共 6 个，每局 688W，最低保底 3088W。
板板可许愿：万金泪冠、纵横其中之一；若出许愿目标，+1288W 保底（须提前许愿）。

重要说明：
· 撤离成功但未完成任务或未打够保底：保留连撤资格。
· 撤离成功且带出物资价值大于 400 万时，沙色保险才计数；房卡开了即计数。
      `.trim(),
      ruleItems: [
        { title: '158R', content: '单局 2 个 + 累计 688W' },
        { title: '588R', content: '连撤两局 4 个，每局 688W，可许愿 +688W' },
        { title: '1188R', content: '连撤三局 6 个，每局 688W，最低保底 3088W，可许愿 +1288W' },
        { title: '计数', content: '>400W 带出时沙色保险计数；房卡开了就计' }
      ],
      priority: 78,
      isHot: false,
      showInList: true,
      views: 2650
    },
    {
      id: 'fun-home-temptation-1288',
      categoryId: 'fun',
      orderType: 'fun_home_temptation',
      series: '趣味单',
      title: '回家的诱惑 · 1288R 保底4688W',
      subtitle: '须用刀击杀航天 Boss 共 3 次',
      tags: ['趣味单', '回家的诱惑', '刀杀Boss'],
      image: asset('images/rules/order-04.webp'),
      heroImage: asset('images/rules/order-04.webp'),
      heroTitle: '回家的诱惑',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('1288R 保底4688W', 1288, 'R', 4688, 'W'),
      details: `
回家的诱惑

价格：1288R，保底 4688W。

任务要求：须使用近战刀击杀航天 Boss 共 3 次。
      `.trim(),
      ruleItems: [
        { title: '价格/保底', content: '1288R · 保底 4688W' },
        { title: '击杀', content: '刀杀航天 Boss ×3' }
      ],
      priority: 77,
      isHot: false,
      showInList: true,
      views: 2400
    },
    {
      id: 'fun-space-order-688',
      categoryId: 'fun',
      orderType: 'fun_space_order',
      series: '趣味单',
      title: '维护航天秩序人人有责 · 688R 保底3288W',
      subtitle: '击杀 6 个乌鲁鲁（撤离失败也算击杀）',
      tags: ['趣味单', '航天', '乌鲁鲁'],
      image: asset('images/rules/order-06.webp'),
      heroImage: asset('images/rules/order-06.webp'),
      heroTitle: '维护航天秩序',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('688R 保底3288W', 688, 'R', 3288, 'W'),
      details: `
维护航天秩序人人有责

价格：688R，保底 3288W。

任务要求：累计击杀 6 个乌鲁鲁。

注：撤离失败也算击杀。
      `.trim(),
      ruleItems: [
        { title: '价格/保底', content: '688R · 保底 3288W' },
        { title: '任务', content: '击杀乌鲁鲁 ×6' },
        { title: '注', content: '撤离失败也算击杀' }
      ],
      priority: 76,
      isHot: false,
      showInList: true,
      views: 2380
    },
    {
      id: 'fun-dam-king-228',
      categoryId: 'fun',
      orderType: 'fun_dam_king',
      series: '趣味单',
      title: '谁是大坝KING？ · 228R',
      subtitle: '累计撤离 5 把，每把不低于 238W',
      tags: ['趣味单', '大坝', '连撤'],
      image: asset('images/rules/order-07.webp'),
      heroImage: asset('images/rules/order-07.webp'),
      heroTitle: '谁是大坝KING',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('228R · 五把撤离', 228, 'R', null, null),
      details: `
谁是大坝KING？

价格：228R。

任务要求：累计成功撤离 5 把，每把带出物资价值不低于 238W。
      `.trim(),
      ruleItems: [{ title: '规则', content: '累计 5 次撤离，每次 ≥238W' }],
      priority: 75,
      isHot: false,
      showInList: true,
      views: 2360
    },
    {
      id: 'fun-twelve-gold-228',
      categoryId: 'fun',
      orderType: 'fun_twelve_gold',
      series: '趣味单',
      title: '十二金宵 · 228R 保底888W',
      subtitle: '单局须带出 12 个小金（大金按规则折算）',
      tags: ['趣味单', '十二金宵', '小金'],
      image: asset('images/rules/order-09.webp'),
      heroImage: asset('images/rules/order-09.webp'),
      heroTitle: '十二金宵',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('228R 保底888W', 228, 'R', 888, 'W'),
      details: `
十二金宵

价格：228R，保底 888W。

任务要求：单局须成功带出 12 个「小金」。

折算规则：
· 高价值大金：按 2 个小金计
· 低价值大金：不计入
      `.trim(),
      ruleItems: [
        { title: '核心', content: '单局带出 12 个小金' },
        { title: '折算', content: '高价值大金=2 小金；低价值大金不计' }
      ],
      priority: 74,
      isHot: false,
      showInList: true,
      views: 2340
    },
    {
      id: 'fun-full-load-888',
      categoryId: 'fun',
      orderType: 'fun_full_load',
      series: '趣味单',
      title: '满载而归 · 888R 单局',
      subtitle: '金+红装满 40 格大红包撤离（详见计数规则）',
      tags: ['趣味单', '满载而归', '红包'],
      image: asset('images/rules/order-10.webp'),
      heroImage: asset('images/rules/order-10.webp'),
      heroTitle: '满载而归',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('888R 单局', 888, 'R', null, null),
      details: `
满载而归

价格：888R，单局结算。

任务要求：使用金与红色物资装满 40 格大红包并成功撤离。

计数说明：
· 头、甲、枪、零件不算入格
· 金弹：一组 60 发算 1 格

板板须知：游戏过程中老板不得故意丢弃对应物资；若发现故意丢弃，直接结单。
      `.trim(),
      ruleItems: [
        { title: '装载', content: '金+红装满 40 格大红包撤离' },
        { title: '不计', content: '头/甲/枪/零件不计格' },
        { title: '金弹', content: '60 发一组计 1 格' },
        { title: '违规', content: '老板故意丢物资 → 直接结单' }
      ],
      priority: 73,
      isHot: false,
      showInList: true,
      views: 2320
    },
    {
      id: 'fun-infinite-refill-568',
      categoryId: 'fun',
      orderType: 'fun_infinite_refill',
      series: '趣味单',
      title: '无限续杯单 · 568R',
      subtitle: '单局 708W 结单；指定 5 红链式续杯',
      tags: ['趣味单', '无限续杯', '指定红'],
      image: asset('images/rules/order-11.webp'),
      heroImage: asset('images/rules/order-11.webp'),
      heroTitle: '无限续杯单',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('568R · 单局708W结单', 568, 'R', 708, 'W'),
      details: `
无限续杯单

价格：568R。

结单条件：单局达到 708W 即算结单。

流程：
1. 先与打手确认地图。
2. 确认后，由老板指定 5 个红色物资作为「续杯池」。
3. 本单结单后，若当局战利品中包含上述 5 红中任意一个，则自动续下一单。
4. 若续单结算时仍包含这 5 红中任意一个，则继续续单。
5. 直到某一单结单时，战利品中不再包含这 5 红中的任意一个，续杯结束。
      `.trim(),
      ruleItems: [
        { title: '结单', content: '单局 708W 算结单' },
        { title: '流程', content: '先确认地图 → 老板指定 5 红' },
        { title: '续杯', content: '结单后若有 5 红之一则续单，直至结单时无这 5 红' }
      ],
      priority: 72,
      isHot: false,
      showInList: true,
      views: 2300
    },
    {
      id: 'fun-cattle-horse-288',
      categoryId: 'fun',
      orderType: 'fun_cattle_horse',
      series: '趣味单',
      title: '牛马单 · 288R 保底888W',
      subtitle: '首把撤离成功：出金/红有加价（打手带出也算）',
      tags: ['趣味单', '牛马单'],
      image: asset('images/rules/order-02.webp'),
      heroImage: asset('images/rules/order-02.webp'),
      heroTitle: '牛马单',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('288R 保底888W', 288, 'R', 888, 'W'),
      details: `
牛马单

价格：288R，保底 888W。

首把撤离成功时的加价：
· 出一个金：+50W
· 出一个红：+100W
（打手带出的金/红也计入。）
      `.trim(),
      ruleItems: [
        { title: '基础', content: '288R · 保底 888W' },
        { title: '首把撤离加价', content: '金 +50W · 红 +100W（打手带出也算）' }
      ],
      priority: 71,
      isHot: false,
      showInList: true,
      views: 2280
    },
    {
      id: 'fun-quality-298',
      categoryId: 'fun',
      orderType: 'fun_quality',
      series: '趣味单',
      title: '素质单 · 298R 保底888W',
      subtitle: '搬盒+话术、禁脏话、闭麦与违规加保底',
      tags: ['趣味单', '素质单', '服务'],
      image: asset('images/rules/order-03.webp'),
      heroImage: asset('images/rules/order-03.webp'),
      heroTitle: '素质单',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('298R 保底888W', 298, 'R', 888, 'W'),
      details: `
素质单

价格：298R，保底 888W。

服务要求：
1. 打手击杀小兵（仅限特殊兵种）或敌人后，须将盒子搬到老板面前，并说「老板请吃饭」。
2. 打手全程不得说脏话。
3. 除打架与需要听信息的情况外，其他时间若打手闭麦超过 30 秒：+20W。

违规结算：以上行为每违反一次，+20W 保底。
      `.trim(),
      ruleItems: [
        { title: '搬盒', content: '击杀后搬盒到老板面前并说「老板请吃饭」' },
        { title: '文明', content: '全程不说脏话' },
        { title: '闭麦', content: '非战斗/听信息时闭麦超 30 秒 → +20W' },
        { title: '违规', content: '上述行为违反一次 → +20W 保底' }
      ],
      priority: 70,
      isHot: false,
      showInList: true,
      views: 2260
    },
    {
      id: 'fun-heaven-havoc-398',
      categoryId: 'fun',
      orderType: 'fun_heaven_havoc',
      series: '趣味单',
      title: '大闹天宫单 · 398R 保底1588W',
      subtitle: '师徒角色扮演、喊话与击杀任务（撤离失败不计击杀）',
      tags: ['趣味单', '大闹天宫', '角色扮演'],
      image: asset('images/rules/order-01.webp'),
      heroImage: asset('images/rules/order-01.webp'),
      heroTitle: '大闹天宫单',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('398R 保底1588W', 398, 'R', 1588, 'W'),
      details: `
大闹天宫单

价格：398R，保底 1588W。

角色：老板为师傅；两名打手分别为大师兄、二师弟（具体角色由板板指定）。

称呼与互动：
· 打手全程称呼板板为「师傅」；板板可称呼打手悟空、八戒、呆子等西游记称呼。
· 大师兄释放大招（X 技能）时须大喊：「吃俺老孙一棒」；喊错或不喊：+50W。
· 二师兄释放大招（X 技能）时须大喊：「吃俺老猪一耙」；喊错或不喊：+50W。
· 师傅倒地时，二师弟须大喊：「大师兄，师傅被妖怪抓走了」；喊错或不喊：+50W。
· 打手倒地并被师傅救起时须大喊：「佛光普照」；喊错或不喊：+50W。
· 被师傅救一次：+50W 保底。

击杀任务（悟空与八戒累计）：
· 天兵天将：10 个普通小兵、盾兵/狙击兵/喷火兵/机枪兵各 3 个
· 并击杀特殊 Boss 一次：航天老太 / 哈德森 / 巴克什飞机

注：撤离失败默认不计算击杀数。

注：若因老板原因未成功撤离，按结单处理。最终解释权归果壳电竞所有。
      `.trim(),
      ruleItems: [
        { title: '角色', content: '师傅 + 大师兄 + 二师弟（板板指定）' },
        { title: '喊话加价', content: '大招/倒地/被救等喊话，错或不喊各 +50W' },
        { title: '被救', content: '被师傅救一次 +50W' },
        { title: '击杀任务', content: '天兵天将累计 + 特殊 Boss×1（见正文）' },
        { title: '撤离', content: '撤离失败不计击杀数' },
        { title: '结单', content: '老板原因未撤离按结单；解释权归果壳电竞' }
      ],
      priority: 69,
      isHot: false,
      showInList: true,
      views: 2240
    },
    // 恋爱日记：正文「癫子」为口述原文，疑为「垫子」等业务谐音，请按需替换文案
    {
      id: 'fun-love-diary',
      categoryId: 'fun',
      orderType: 'fun_love_diary',
      series: '趣味单',
      title: '恋爱日记 · 520R / 1314R',
      subtitle: '双档累积：五金彩礼房子婚服车子（见正文）',
      tags: ['趣味单', '恋爱日记', '双档位'],
      image: asset('images/rules/order-08.webp'),
      heroImage: asset('images/rules/order-08.webp'),
      heroTitle: '恋爱日记',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('520R / 1314R 双档', 520, 'R', null, null),
      details: `
恋爱日记

【520R 档】
基础保底 1314W，上限保底 5200W。

需累积完成：
· 五金：五个不同的金色收集品
· 彩礼：18.8W
· 房子：＞50W 房卡一张
· 婚服：六套一身（头＞35、甲＞100）或五套两身（头＞30、甲＞100）
· 车子：坦克 / 步战车

注：百万以上大红或红卡为「癫子」可任意替代（口语整理，可与店内术语对齐）。

【1314R 档】
基础保底 3344W，上限保底 13140W。

需累积完成：
· 五金：五个不同红色收集品
· 彩礼：38.8W
· 房子：＞100W 房卡一张
· 婚服：六套两身（头＞35、甲＞100）或五套四身（头＞30、甲＞100）
· 车子：坦克 / 步战车

注：百万以上大红或红卡为「癫子」可任意替代（口语整理，可与店内术语对齐）。

注：若因老板原因未成功撤离，按结单处理。最终解释权归果壳电竞所有。
      `.trim(),
      ruleItems: [
        {
          title: '520R 档',
          content: '基础 1314W · 上限 5200W · 五金/彩礼/房/婚服/车（见正文）'
        },
        {
          title: '1314R 档',
          content: '基础 3344W · 上限 13140W · 五金为五红等（见正文）'
        },
        { title: '补充', content: '老板原因未撤离按结单；解释权归果壳电竞' }
      ],
      priority: 68,
      isHot: false,
      showInList: true,
      views: 2220
    },
    {
      id: 'bigred-catalog',
      categoryId: 'bigred',
      orderType: 'bigred',
      series: '大红对赌单',
      title: '大红对赌单 · 388R～12888R',
      subtitle: '指定价位须出对应资源，且累计保底达到约定数',
      tags: ['大红对赌', '多档位', '资源+累计'],
      image: asset('images/rules/order-08.webp'),
      heroImage: asset('images/rules/order-08.webp'),
      heroTitle: '大红对赌单',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('388R～12888R · 九档对赌', 388, 'R', null, null),
      details: `
大红对赌单规则：对应价格必须出指定资源，且累计保底达到约定万数。

1. 388R：卫星锅，并且累计 1088 万
2. 688R：火箭燃料，并且累计 1688 万
3. 888R：浮力设备，并且累计 2088 万
4. 2888R：雷明顿打字机，并且累计 6888 万
5. 2888R：巴克什三幻神（三出一），并且累计 6888 万
6. 8888R：巴克什三幻神（全出），并且累计 20888 万
7. 8888R：复苏呼吸机，并且累计 22888 万
8. 10888R：非洲之心，并且累计 28888 万
9. 12888R：海洋之泪，并且累计 32888 万

注：对赌单不适用于折扣券。若因老板原因未成功撤离，按结单处理。最终解释权归果壳电竞所有。
      `.trim(),
      ruleItems: [
        { title: '388R', content: '卫星锅 · 累计 1088 万' },
        { title: '688R', content: '火箭燃料 · 累计 1688 万' },
        { title: '888R', content: '浮力设备 · 累计 2088 万' },
        { title: '2888R · 雷明顿', content: '雷明顿打字机 · 累计 6888 万' },
        { title: '2888R · 三幻神三出一', content: '巴克什三幻神（三出一）· 累计 6888 万' },
        { title: '8888R · 三幻神全出', content: '巴克什三幻神（全出）· 累计 20888 万' },
        { title: '8888R · 复苏呼吸机', content: '复苏呼吸机 · 累计 22888 万' },
        { title: '10888R', content: '非洲之心 · 累计 28888 万' },
        { title: '12888R', content: '海洋之泪 · 累计 32888 万' },
        {
          title: '补充说明',
          content: '对赌单不适用于折扣券；若因老板原因未成功撤离，按结单处理。最终解释权归果壳电竞所有。'
        }
      ],
      priority: 49,
      isHot: true,
      showInList: true,
      views: 1200
    },
    // --- 跑刀专区（保险箱档位：九格 / 六格 / 四格）---
    {
      id: 'knife-run-9grid',
      categoryId: 'knife_run',
      orderType: 'knife_run_tier',
      series: '跑刀专区',
      title: '跑刀 · 九格保险 · 60R=1000W',
      subtitle: '适用九格安全箱 · 保底 1000 万（哈夫币/带出价值以店内约定为准）',
      tags: ['跑刀专区', '九格保险', '保底'],
      image: asset('images/rules/order-12.webp'),
      heroImage: asset('images/rules/order-12.webp'),
      heroTitle: '九格保险跑刀',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('60R 保底1000W', 60, 'R', 1000, 'W'),
      details: `
跑刀专区 · 九格保险

价格：60R，保底 1000W（万）。

适用说明：
· 本单按「九格安全箱」档位计价与履约；下单时请说明当前账号保险箱为九格。

玩法说明：
· 跑刀为低战备进图、以搜刮与撤离为主的玩法；具体地图、模式与结单规则以客服/打手确认为准。
      `.trim(),
      ruleItems: [
        { title: '档位', content: '九格保险' },
        { title: '价格/保底', content: '60R = 1000W' },
        { title: '备注', content: '细则以店内与客服确认为准' }
      ],
      priority: 48,
      isHot: false,
      showInList: true,
      views: 1180
    },
    {
      id: 'knife-run-6grid',
      categoryId: 'knife_run',
      orderType: 'knife_run_tier',
      series: '跑刀专区',
      title: '跑刀 · 六格保险 · 70R=1000W',
      subtitle: '适用六格安全箱 · 保底 1000 万（哈夫币/带出价值以店内约定为准）',
      tags: ['跑刀专区', '六格保险', '保底'],
      image: asset('images/rules/order-13.webp'),
      heroImage: asset('images/rules/order-13.webp'),
      heroTitle: '六格保险跑刀',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('70R 保底1000W', 70, 'R', 1000, 'W'),
      details: `
跑刀专区 · 六格保险

价格：70R，保底 1000W（万）。

适用说明：
· 本单按「六格安全箱」档位计价与履约；下单时请说明当前账号保险箱为六格。

玩法说明：
· 跑刀为低战备进图、以搜刮与撤离为主的玩法；具体地图、模式与结单规则以客服/打手确认为准。
      `.trim(),
      ruleItems: [
        { title: '档位', content: '六格保险' },
        { title: '价格/保底', content: '70R = 1000W' },
        { title: '备注', content: '细则以店内与客服确认为准' }
      ],
      priority: 47,
      isHot: false,
      showInList: true,
      views: 1170
    },
    {
      id: 'knife-run-4grid',
      categoryId: 'knife_run',
      orderType: 'knife_run_tier',
      series: '跑刀专区',
      title: '跑刀 · 四格保险 · 80R=1000W',
      subtitle: '适用四格安全箱 · 保底 1000 万（哈夫币/带出价值以店内约定为准）',
      tags: ['跑刀专区', '四格保险', '保底'],
      image: asset('images/rules/order-14.webp'),
      heroImage: asset('images/rules/order-14.webp'),
      heroTitle: '四格保险跑刀',
      heroSubtitle: '果壳电竞',
      pricing: mkPricing('80R 保底1000W', 80, 'R', 1000, 'W'),
      details: `
跑刀专区 · 四格保险

价格：80R，保底 1000W（万）。

适用说明：
· 本单按「四格安全箱」档位计价与履约；下单时请说明当前账号保险箱为四格。

玩法说明：
· 跑刀为低战备进图、以搜刮与撤离为主的玩法；具体地图、模式与结单规则以客服/打手确认为准。
      `.trim(),
      ruleItems: [
        { title: '档位', content: '四格保险' },
        { title: '价格/保底', content: '80R = 1000W' },
        { title: '备注', content: '细则以店内与客服确认为准' }
      ],
      priority: 46,
      isHot: false,
      showInList: true,
      views: 1160
    }
  ]
}
