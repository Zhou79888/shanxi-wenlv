/* ============================================================
 * data.js —— 全站唯一数据源
 * 规则：页面上出现的每一个定量数字都必须来自本文件。
 * tier:  official=官方原始 | relay=官方转引 | platform=平台数据 | media=媒体报道
 * comp:  A=同口径可直接比较 | B=发布方可比口径，只引用增长率 | C=不同口径仅并列
 * 核验状态与逐条来源见 docs/data_audit.md（核验日期 2026-10-17）
 * ============================================================ */
window.DB = {

  /* ---- 模块一：被看见 ---- */
  b1_national: {
    v: 36, label: "游戏全国实景取景地", unit: "处", period: "2024-08 起",
    caliber: "媒体与官方一致口径", comp: "B", tier: "relay",
    src: { p: "人民日报海外版", t: "“跟着悟空游山西”吸引海内外游客（2024-09-04）", u: "http://paper.people.com.cn/rmrbhwb/images/2024-09/04/12/rmrbhwb2024090412.pdf" }
  },
  b1_shanxi: {
    v: 27, label: "取景地在山西的数量", unit: "处", period: "2024-08 起",
    caliber: "媒体与官方一致口径；横跨 9 个地市", comp: "B", tier: "relay",
    src: { p: "人民日报海外版 / 光明网 / 山西省文旅厅", t: "多源一致报道", u: "https://m.gmw.cn/2024-09/04/content_1303838752.htm" }
  },
  b1_cities: {
    v: 9, label: "取景地覆盖山西地市数", unit: "个", period: "2024-08 起",
    caliber: "同上", comp: "B", tier: "relay",
    src: { p: "人民日报海外版", t: "同 b1_shanxi", u: "http://paper.people.com.cn/rmrbhwb/images/2024-09/04/12/rmrbhwb2024090412.pdf" }
  },
  b1_sample: {
    list: [
      ["云冈石窟", "大同"], ["悬空寺", "大同"],
      ["崇福寺", "朔州"], ["应县木塔", "朔州"],
      ["佛光寺", "忻州"],
      ["镇国寺", "晋中"], ["双林寺", "晋中"],
      ["小西天", "临汾"], ["广胜寺", "临汾"],
      ["玉皇庙", "晋城"], ["铁佛寺", "晋城"], ["西溪二仙庙", "晋城"]
    ],
    label: "官方报道点名的部分取景地", unit: "处（部分）",
    caliber: "省文旅厅官网报道明确点名者；完整名单各报道不一致，不补齐", comp: "B", tier: "relay",
    src: { p: "山西省文化和旅游厅官网（转自山西经济日报）", t: "《爆款游戏带火旅游——山西文旅怎样延续“神话”》（2024-08-28）", u: "https://wlt.shanxi.gov.cn/xwzx/wlyw/202408/t20240828_9641965.shtml" }
  },
  ev_launch: {
    v: "2024-08-20", label: "《黑神话：悟空》上线", unit: "",
    caliber: "据“上线 3 天后为 8 月 23 日”推算并与公开报道一致", comp: "B", tier: "relay",
    src: { p: "光明网 / 人民网", t: "“游戏上线 3 天后的 8 月 23 日”相关报道", u: "https://m.gmw.cn/2024-09/04/content_1303838752.htm" }
  },
  b2_aug23_visitors: {
    v: 12.66, label: "27 个涉文物景点单日接待", unit: "万人次", period: "2024-08-23（上线 3 天）",
    caliber: "省文旅厅口径，经权威媒体转引", comp: "B", tier: "relay",
    src: { p: "光明网（转引省文旅厅）", t: "“跟着悟空游山西”吸引海内外游客", u: "https://m.gmw.cn/2024-09/04/content_1303838752.htm" }
  },
  b2_aug23_yoy: {
    v: 21.86, label: "上述单日环比增幅", unit: "%", period: "2024-08-23",
    caliber: "环比（较前一日），官方口径", comp: "B", tier: "relay",
    src: { p: "光明网（转引省文旅厅）", t: "同 b2_aug23_visitors", u: "https://m.gmw.cn/2024-09/04/content_1303838752.htm" }
  },
  b2_aug23_tickets: {
    v: 552.8, label: "27 个涉文物景点当日门票收入", unit: "万元", period: "2024-08-23",
    caliber: "同上", comp: "B", tier: "relay",
    src: { p: "光明网（转引省文旅厅）", t: "同 b2_aug23_visitors", u: "https://m.gmw.cn/2024-09/04/content_1303838752.htm" }
  },
  ev_activity: {
    v: "2024-09 起", label: "“跟着悟空游山西”主题活动铺开", unit: "",
    caliber: "省文旅厅通报", comp: "B", tier: "official",
    src: { p: "山西省文化和旅游厅（供稿，新华网山西刊发）", t: "《山西文旅市场持续火热 国庆“成绩单”来了》（2024-10-11）", u: "http://www.sx.xinhuanet.com/20241011/4f0e4d7b3689469b9fc14dd28c551dc1/c.html" }
  },

  /* ---- 模块二：来了多少 ---- */
  a1_visitors: {
    v: 784.46, label: "66 个重点监测景区累计接待游客", unit: "万人次", period: "2024 国庆（7 天）",
    caliber: "省级重点监测景区口径（65 个开放，蟒河景区闭园）", comp: "B", tier: "official",
    src: { p: "山西省文化和旅游厅（供稿，新华网山西刊发）", t: "《山西文旅市场持续火热 国庆“成绩单”来了》（2024-10-11）", u: "http://www.sx.xinhuanet.com/20241011/4f0e4d7b3689469b9fc14dd28c551dc1/c.html" }
  },
  a1_open: {
    v: 65, label: "开放的重点监测景区数", unit: "个（共 66 个）", period: "2024 国庆",
    caliber: "同 a1_visitors", comp: "A", tier: "official",
    src: { p: "同 a1_visitors", t: "同 a1_visitors", u: "http://www.sx.xinhuanet.com/20241011/4f0e4d7b3689469b9fc14dd28c551dc1/c.html" }
  },
  a1_yoy: {
    v: "46.90", label: "重点监测景区接待人次同比增幅", unit: "%", period: "2024 国庆，对比 2023 同期",
    caliber: "官方发布“可比口径”，原文引用；不反推基数（2023 双节为 8 天）", comp: "B", tier: "official",
    src: { p: "山西省人民政府网", t: "《打造流量引力场 激活文旅新动能》（2024-10-09）", u: "https://www.shanxi.gov.cn/ywdt/sxyw/202410/t20241009_9669149.shtml" }
  },
  a2_tickets: {
    v: 25466.31, label: "重点监测景区门票收入", unit: "万元", period: "2024 国庆（7 天）",
    caliber: "同 a1_visitors", comp: "B", tier: "official",
    src: { p: "山西省文化和旅游厅（供稿，新华网山西刊发）", t: "同 a1_visitors", u: "http://www.sx.xinhuanet.com/20241011/4f0e4d7b3689469b9fc14dd28c551dc1/c.html" }
  },
  a2_yoy: {
    v: 17.13, label: "门票收入同比增幅", unit: "%", period: "2024 国庆，对比 2023 同期",
    caliber: "官方发布“可比口径”，原文引用", comp: "B", tier: "official",
    src: { p: "山西省人民政府网", t: "同 a1_yoy", u: "https://www.shanxi.gov.cn/ywdt/sxyw/202410/t20241009_9669149.shtml" }
  },

  /* ---- 模块三：去了哪里 ---- */
  a6_cities: {
    rows: [
      { name: "太原", v: 14.92 },
      { name: "运城", v: 14.18 },
      { name: "临汾", v: 10.98 }
    ],
    label: "市级游客接待量占比（发布文本披露部分）", unit: "%", period: "2024 国庆",
    caliber: "全省游客占比；其余 8 市未在文本中披露，不推算", comp: "A", tier: "official",
    src: { p: "山西省文化和旅游厅（供稿，新华网山西刊发）", t: "同 a1_visitors", u: "http://www.sx.xinhuanet.com/20241011/4f0e4d7b3689469b9fc14dd28c551dc1/c.html" }
  },
  a3_top3: {
    list: ["忻州古城", "大同古城", "平遥古城"], label: "接待游客人数前三景区", unit: "", period: "2024 国庆",
    caliber: "66 个重点监测景区范围内", comp: "A", tier: "official",
    src: { p: "山西省文化和旅游厅（供稿，新华网山西刊发）", t: "同 a1_visitors", u: "http://www.sx.xinhuanet.com/20241011/4f0e4d7b3689469b9fc14dd28c551dc1/c.html" }
  },
  a4_jing: {
    v: 188.54, label: "27 个悟空涉晋文物景点累计接待", unit: "万人次", period: "2024 国庆（7 天）",
    caliber: "涉文物景点集合口径；与“66 个重点监测景区”的包含关系官方未说明，两数不可相除", comp: "C", tier: "official",
    src: { p: "山西省文化和旅游厅（供稿，新华网山西刊发）", t: "同 a1_visitors", u: "http://www.sx.xinhuanet.com/20241011/4f0e4d7b3689469b9fc14dd28c551dc1/c.html" }
  },
  a5_jing: {
    v: 5616.70, label: "27 个涉晋文物景点门票收入", unit: "万元", period: "2024 国庆（7 天）",
    caliber: "同 a4_jing", comp: "C", tier: "official",
    src: { p: "山西省文化和旅游厅（供稿，新华网山西刊发）", t: "同 a1_visitors", u: "http://www.sx.xinhuanet.com/20241011/4f0e4d7b3689469b9fc14dd28c551dc1/c.html" }
  },

  /* ---- 模块四：留下与花费 ---- */
  a7_in: {
    v: 64.10, label: "省内游客占比", unit: "%", period: "2024 国庆",
    caliber: "专项调研口径", comp: "A", tier: "official",
    src: { p: "山西省文化和旅游厅（供稿，新华网山西刊发）", t: "同 a1_visitors", u: "http://www.sx.xinhuanet.com/20241011/4f0e4d7b3689469b9fc14dd28c551dc1/c.html" }
  },
  a7_out: {
    v: 35.90, label: "省外游客占比", unit: "%", period: "2024 国庆",
    caliber: "专项调研口径；较上年同期提升 6.67 个百分点", comp: "A", tier: "official",
    src: { p: "山西省文化和旅游厅（供稿，新华网山西刊发）", t: "同 a1_visitors", u: "http://www.sx.xinhuanet.com/20241011/4f0e4d7b3689469b9fc14dd28c551dc1/c.html" }
  },
  a7_out_delta: { v: 6.67, label: "省外游客占比同比提升", unit: "个百分点", tier: "official", comp: "A", src: { p: "同 a7_out", t: "同 a7_out", u: "http://www.sx.xinhuanet.com/20241011/4f0e4d7b3689469b9fc14dd28c551dc1/c.html" } },
  a8_over1day: {
    v: "近九成", label: "出游时间 1 天以上的游客占比", unit: "", period: "2024 国庆",
    caliber: "专项调研口径，原文表述", comp: "A", tier: "official",
    src: { p: "山西省文化和旅游厅（供稿，新华网山西刊发）", t: "同 a1_visitors", u: "http://www.sx.xinhuanet.com/20241011/4f0e4d7b3689469b9fc14dd28c551dc1/c.html" }
  },
  a8_1to3: {
    v: 68.97, label: "出游时间为 1—3 天的游客占比", unit: "%", period: "2024 国庆",
    caliber: "专项调研口径", comp: "A", tier: "official",
    src: { p: "山西省文化和旅游厅（供稿，新华网山西刊发）", t: "同 a1_visitors", u: "http://www.sx.xinhuanet.com/20241011/4f0e4d7b3689469b9fc14dd28c551dc1/c.html" }
  },
  a9_nights: {
    v: 1.93, label: "过夜游游客平均停留夜数", unit: "夜", period: "2024 国庆",
    caliber: "过夜游客子集口径；较 2023 年同期 +14.20%", comp: "B", tier: "official",
    src: { p: "山西省文化和旅游厅（供稿，新华网山西刊发）", t: "同 a1_visitors", u: "http://www.sx.xinhuanet.com/20241011/4f0e4d7b3689469b9fc14dd28c551dc1/c.html" }
  },
  a9_yoy: {
    v: "14.20", label: "过夜平均停留夜数同比增幅", unit: "%", period: "2024 国庆，对比 2023 同期",
    caliber: "官方发布可比表述", comp: "B", tier: "official",
    src: { p: "山西省文化和旅游厅（供稿，新华网山西刊发）", t: "同 a1_visitors", u: "http://www.sx.xinhuanet.com/20241011/4f0e4d7b3689469b9fc14dd28c551dc1/c.html" }
  },

  /* ---- 模块五：一年之后 ---- */
  a10_visitors: {
    v: 4386.40, label: "全省接待国内游客", unit: "万人次", period: "2025 国庆中秋（8 天）",
    caliber: "通讯运营商和旅游大数据联合实验室专项调研；可比口径同比 +5.16%", comp: "B", tier: "official",
    src: { p: "山西省文化和旅游厅官网（转自山西经济日报）/ 山西日报", t: "《“双节”三晋游 文旅市场精彩纷呈》（2025-10-11）", u: "https://wlt.shanxi.gov.cn/xwzx/wlxx/202510/t20251011_9973640.shtml" }
  },
  a10_yoy: {
    v: 5.16, label: "全省接待国内游客同比增幅", unit: "%", period: "2025 国庆中秋",
    caliber: "官方“可比口径”，原文引用（假期 8 天与 7 天不可并列绝对值）", comp: "B", tier: "official",
    src: { p: "同 a10_visitors", t: "同 a10_visitors", u: "https://wlt.shanxi.gov.cn/xwzx/wlxx/202510/t20251011_9973640.shtml" }
  },
  a11_spend: {
    v: 281.40, label: "游客旅游总花费", unit: "亿元", period: "2025 国庆中秋（8 天）",
    caliber: "同 a10_visitors；可比口径同比 +8.53%", comp: "B", tier: "official",
    src: { p: "同 a10_visitors", t: "同 a10_visitors", u: "https://wlt.shanxi.gov.cn/xwzx/wlxx/202510/t20251011_9973640.shtml" }
  },
  a11_yoy: {
    v: 8.53, label: "游客旅游总花费同比增幅", unit: "%", period: "2025 国庆中秋",
    caliber: "官方“可比口径”，原文引用", comp: "B", tier: "official",
    src: { p: "同 a10_visitors", t: "同 a10_visitors", u: "https://wlt.shanxi.gov.cn/xwzx/wlxx/202510/t20251011_9973640.shtml" }
  },
  c1_hotel: {
    v: 40, label: "全省酒店预订热度同比增幅（超）", unit: "%", period: "2025 国庆中秋",
    caliber: "同程旅行平台口径，与官方统计不可互算", comp: "C", tier: "platform",
    src: { p: "同程旅行（山西日报转引）", t: "《国庆中秋假期，山西省文旅市场人气旺、活力足》（2025-10-11）", u: "http://www.sx.xinhuanet.com/20251011/fdbf0058615b4e02aeff1f6fef38eb22/c.html" }
  },
  c1_datong: {
    v: 70, label: "大同酒店预订热度同比增幅（超）", unit: "%", period: "2025 国庆中秋",
    caliber: "同程旅行平台口径；增幅居全国前列", comp: "C", tier: "platform",
    src: { p: "同 c1_hotel", t: "同 c1_hotel", u: "http://www.sx.xinhuanet.com/20251011/fdbf0058615b4e02aeff1f6fef38eb22/c.html" }
  },
  c1_shx: {
    v: 50, label: "朔州、忻州酒店预订热度同比增幅（均超）", unit: "%", period: "2025 国庆中秋",
    caliber: "同程旅行平台口径", comp: "C", tier: "platform",
    src: { p: "同 c1_hotel", t: "同 c1_hotel", u: "http://www.sx.xinhuanet.com/20251011/fdbf0058615b4e02aeff1f6fef38eb22/c.html" }
  },

  /* ---- 基线对照：2019 / 2023 ---- */
  b9_2023_visitors: {
    v: 613.74, label: "2023 中秋国庆 66 个重点监测景区接待游客", unit: "万人次", period: "2023 中秋国庆（8 天）",
    caliber: "省级重点监测景区口径，与 2024 同口径；假期 8 天", comp: "A", tier: "official",
    src: { p: "文化和旅游部官网 / 山西省文旅厅", t: "《山西“双节”假期66个重点监测景区接待游客613.74万人次》（2023-10）", u: "https://www.mct.gov.cn/whzx/qgwhxxlb/sx/202310/t20231013_949112.htm" }
  },
  b9_2023_tickets: {
    v: 24300, label: "2023 中秋国庆 66 个重点监测景区门票收入", unit: "万元（原文 2.43 亿元）", period: "2023 中秋国庆（8 天）",
    caliber: "同 b9_2023_visitors", comp: "A", tier: "official",
    src: { p: "文化和旅游部官网 / 山西省文旅厅", t: "同 b9_2023_visitors", u: "https://www.mct.gov.cn/whzx/qgwhxxlb/sx/202310/t20231013_949112.htm" }
  },
  b9_2023_yoy: {
    v: 949.22, label: "2023 中秋国庆 66 景区接待人次同比增幅", unit: "%", period: "2023 中秋国庆，对比 2022 同期",
    caliber: "2022 为疫情低基数；此增幅反映恢复性增长，官方发布原文引用", comp: "B", tier: "relay",
    src: { p: "人民网山西", t: "《假日经济活力旺 山西好风光人气足》（2023-10-08）", u: "http://sx.people.com.cn/n2/2023/1008/c189153-40596285.html" }
  },
  b10_2019_visitors: {
    v: 6487.16, label: "2019 国庆全省接待旅游者", unit: "万人次", period: "2019 国庆（7 天）",
    caliber: "全省全域口径（非重点监测景区口径），与 66 景区口径不可直接比较", comp: "C", tier: "official",
    src: { p: "山西省文旅厅（文旅部官网转发）", t: "《2019年国庆假期山西省假日旅游情况分析报告》（2019-10-08）", u: "https://www.mct.gov.cn/whzx/qgwhxxlb/sx/201910/t20191008_847122.htm" }
  },
  b10_2019_income: {
    v: 422.07, label: "2019 国庆全省旅游综合收入", unit: "亿元", period: "2019 国庆（7 天）",
    caliber: "同 b10_2019_visitors", comp: "C", tier: "official",
    src: { p: "山西省文旅厅（文旅部官网转发）", t: "同 b10_2019_visitors", u: "https://www.mct.gov.cn/whzx/qgwhxxlb/sx/201910/t20191008_847122.htm" }
  },

  /* ---- 2026 时间边界（平台口径，仅记录，不作趋势判断） ---- */
  d1_2026_visitors_yoy: {
    v: 13.1, label: "2026 国庆在线旅游人次日均同比增幅", unit: "%", period: "2026 国庆",
    caliber: "平台报告口径（中新网转引）；非省级全域通报，仅作时间边界记录，不作趋势判断", comp: "C", tier: "platform",
    src: { p: "中新网山西", t: "《2026 国庆假期 山西在线旅游市场人次增速全国排名第三》（2026-10-08）", u: "https://www.sx.chinanews.com/news/2026/1008/251738.html" }
  },
  d1_2026_spend_yoy: {
    v: 3.1, label: "2026 国庆在线旅游收入日均同比增幅", unit: "%", period: "2026 国庆",
    caliber: "同上", comp: "C", tier: "platform",
    src: { p: "中新网山西", t: "同 d1_2026_visitors_yoy", u: "https://www.sx.chinanews.com/news/2026/1008/251738.html" }
  },

  /* ---- 方法页 ---- */
  b8_2020: {
    v: 5246.89, label: "2020 年国庆全省接待国内旅游者", unit: "万人次", period: "2020 国庆",
    caliber: "当年口径；仅用于口径教学案例，禁止与其他年份并列比较", comp: "C", tier: "relay",
    src: { p: "山西旅游报（2020-10）", t: "《国庆假期我省旅游综合收入 316.38 亿元》", u: "https://www.sxllnews.cn/xyllwb/pc/att/202010/10/ec408cb5-dfad-4980-9d8b-7e6d25bd238b.pdf" }
  },

  /* ---- 小西天事件时间线（B4 / A13） ---- */
  xixiao_events: [
    { d: "2024 国庆假期", t: "客流远超承载力", x: "景区空间有限、长时间排队，部分游客现场表达不满，“差评”登上网络热搜。", src: "b1_xixiao" },
    { d: "假期进行中", t: "全县“花式宠客”", x: "拓宽延长排队通道；向游客免费赠送玉露香梨；开放党政机关停车区域；警方现场疏导秩序。", src: "b1_xixiao" },
    { d: "2024-10-07", t: "《致广大游客朋友的感谢信》", x: "承诺凡当年中秋、国庆假期购票入园者，凭凭证年底前可免门票再次游览。", src: "b2_xixiao" },
    { d: "随后", t: "媒体评价“口碑逆转”", x: "新华社、央广网等以“真诚最打动人心”“口碑逆袭”报道此事件。", src: "b2_xixiao" },
    { d: "2025 国庆中秋", t: "服务延续", x: "高速口起设置志愿者，景区门口提供热饮与玉露香梨等暖心服务。", src: "b3_xixiao" }
  ],
  b1_xixiao: {
    label: "小西天差评与宠客措施", unit: "", tier: "relay", comp: "C",
    caliber: "事件性事实，据主流媒体公开报道整理",
    src: { p: "新华网 / 央广网（2024-10）", t: "《隰县小西天发文：感激每一位“天命人”》等", u: "http://www.sx.news.cn/20241009/351b83933d934ebaa0d9674cc3c98323/c.html" }
  },
  b2_xixiao: {
    label: "感谢信与口碑逆转", unit: "", tier: "relay", comp: "C",
    caliber: "同上",
    src: { p: "新华网山西 / 央广网", t: "《解决“八十一难” 曾被“差评”的隰县口碑“逆袭”！》", u: "https://news.cnr.cn/native/gd/kx/20241012/t20241012_526936426.shtml" }
  },
  b3_xixiao: {
    label: "2025 年服务延续", unit: "", tier: "official", comp: "C",
    caliber: "省文旅厅供稿报道",
    src: { p: "山西日报（新华网山西刊发）", t: "《国庆中秋假期，山西省文旅市场人气旺、活力足》（2025-10-11）", u: "http://www.sx.xinhuanet.com/20251011/fdbf0058615b4e02aeff1f6fef38eb22/c.html" }
  },

  /* ---- 来源清单（方法页） ---- */
  sources: [
    { t: "山西省文化和旅游厅（供稿）《山西文旅市场持续火热 国庆“成绩单”来了》，新华网山西，2024-10-11", u: "http://www.sx.xinhuanet.com/20241011/4f0e4d7b3689469b9fc14dd28c551dc1/c.html", n: "2024 国庆核心数据来源（全文已核）" },
    { t: "文化和旅游部《山西“双节”假期66个重点监测景区接待游客613.74万人次》，2023-10", u: "https://www.mct.gov.cn/whzx/qgwhxxlb/sx/202310/t20231013_949112.htm", n: "2023 基线（同口径，全文已核）" },
    { t: "山西省文旅厅《2019年国庆假期山西省假日旅游情况分析报告》（文旅部官网转发），2019-10-08", u: "https://www.mct.gov.cn/whzx/qgwhxxlb/sx/201910/t20191008_847122.htm", n: "2019 疫情前基线（全域口径，仅作参照）" },
    { t: "山西省人民政府网《打造流量引力场 激活文旅新动能》，2024-10-09", u: "https://www.shanxi.gov.cn/ywdt/sxyw/202410/t20241009_9669149.shtml", n: "2024 同比增幅（可比口径）" },
    { t: "山西省文化和旅游厅官网《“双节”三晋游 文旅市场精彩纷呈》，2025-10-11", u: "https://wlt.shanxi.gov.cn/xwzx/wlxx/202510/t20251011_9973640.shtml", n: "2025 全省数据（全文已核）" },
    { t: "山西日报《国庆中秋假期，山西省文旅市场人气旺、活力足》，新华网山西，2025-10-11", u: "http://www.sx.xinhuanet.com/20251011/fdbf0058615b4e02aeff1f6fef38eb22/c.html", n: "2025 数据与同程平台信号（全文已核）" },
    { t: "山西省文化和旅游厅官网《爆款游戏带火旅游——山西文旅怎样延续“神话”》，2024-08-28", u: "https://wlt.shanxi.gov.cn/xwzx/wlyw/202408/t20240828_9641965.shtml", n: "部分取景地点名报道" },
    { t: "人民日报海外版《“跟着悟空游山西”吸引海内外游客》，2024-09-04", u: "http://paper.people.com.cn/rmrbhwb/images/2024-09/04/12/rmrbhwb2024090412.pdf", n: "36/27 取景地口径" },
    { t: "光明网《“跟着悟空游山西”吸引海内外游客》，2024-09-04", u: "https://m.gmw.cn/2024-09/04/content_1303838752.htm", n: "2024-08-23 涉文物景点数据" },
    { t: "新华网山西《隰县小西天发文：感激每一位“天命人”》，2024-10-09", u: "http://www.sx.news.cn/20241009/351b83933d934ebaa0d9674cc3c98323/c.html", n: "小西天事件时间线" },
    { t: "央广网《解决“八十一难” 曾被“差评”的隰县口碑“逆袭”！》，2024-10-12", u: "https://news.cnr.cn/native/gd/kx/20241012/t20241012_526936426.shtml", n: "小西天事件时间线" },
    { t: "山西旅游报《国庆假期我省旅游综合收入 316.38 亿元》，2020-10", u: "https://www.sxllnews.cn/xyllwb/pc/att/202010/10/ec408cb5-dfad-4980-9d8b-7e6d25bd238b.pdf", n: "仅用于口径教学案例" },
    { t: "山西省文物局《关于省第十四届人大二次会议第 1491 号建议的答复》", u: "https://wwj.shanxi.gov.cn/zwgk/zfxxgk/jyta/rdjydf/202504/P020250401405859290390.pdf", n: "531 处国保（背景资料，本页未直接使用）" },
    { t: "中新网山西《2026 国庆假期 山西在线旅游市场人次增速全国排名第三》，2026-10-08", u: "https://www.sx.chinanews.com/news/2026/1008/251738.html", n: "仅作 2026 时间边界记录，不纳入分析" }
  ]
};
