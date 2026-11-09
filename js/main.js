/* ============================================================
 * main.js —— 渲染与交互（零依赖）
 * 原则：所有定量数字取自 window.DB（js/data.js），页面不硬编码数字。
 * 组件：口径徽章（details 实现，键盘可用）、数据卡、条形图（结论式标题 +
 *       刻度参考线 + 可展开数据表）、时间线、数字 count-up、阅读进度条、
 *       导航激活态、返回顶部、进场动画（尊重 prefers-reduced-motion）。
 * ============================================================ */
(function () {
  "use strict";
  var DB = window.DB;
  var FETCHED = "2026-10-17";
  var TIER = {
    official: { name: "官方原始", cls: "t-official" },
    relay: { name: "官方转引", cls: "t-relay" },
    platform: { name: "平台数据", cls: "t-platform" },
    media: { name: "媒体报道", cls: "t-media" }
  };
  var COMP = {
    A: "A 级 · 同来源同口径，可直接比较",
    B: "B 级 · 发布方“可比口径”，只引用其增长率",
    C: "C 级 · 口径不同，仅并列展示，不可计算"
  };
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function db(id) { return DB[id]; }
  function val(id) { var d = db(id); return d ? d.v : ""; }
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 口径徽章 ---------- */
  function badgeHTML(id) {
    var d = db(id);
    if (!d || !d.src) return "";
    var t = TIER[d.tier] || TIER.media;
    var link = d.src.u ? '<a href="' + esc(d.src.u) + '" target="_blank" rel="noopener">' + esc(d.src.p) + "《" + esc(d.src.t) + "》</a>" : esc(d.src.p) + "《" + esc(d.src.t) + "》";
    return '<details class="src ' + t.cls + '"><summary aria-label="数据来源：' + t.name + '">' + t.name + "</summary>" +
      '<div class="tip" role="tooltip">' +
      '<p class="tip-t">' + esc(d.label || "") + (d.unit ? "（" + esc(d.unit) + "）" : "") + "</p>" +
      "<p>" + link + "</p>" +
      (d.period ? '<p><b>统计期</b>' + esc(d.period) + "</p>" : "") +
      (d.caliber ? '<p><b>口径</b>' + esc(d.caliber) + "</p>" : "") +
      (d.comp ? '<p><b>可比性</b>' + COMP[d.comp] + "</p>" : "") +
      "<p><b>核验</b>检索并逐条核对于 " + FETCHED + "</p>" +
      "</div></details>";
  }

  /* ---------- 正文数字注入 ---------- */
  $$("[data-db]").forEach(function (el) {
    var d = db(el.getAttribute("data-db"));
    if (d) el.textContent = d.v;
  });
  $$("[data-src]").forEach(function (el) {
    el.innerHTML = badgeHTML(el.getAttribute("data-src"));
  });

  /* ---------- 数据卡 ---------- */
  function cardHTML(id, bigSuffix, note) {
    var d = db(id);
    if (!d) return "";
    var unit = bigSuffix || d.unit || "";
    return '<div class="stat-card">' +
      '<div class="stat-big">' + d.v + "<i>" + esc(unit) + "</i></div>" +
      '<div class="stat-label">' + esc(d.label) + "</div>" +
      (note ? '<div class="stat-note">' + esc(note) + "</div>" : "") +
      badgeHTML(id) + "</div>";
  }

  function renderCards(id, items) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = items.map(function (it) { return cardHTML(it.db, it.suffix, it.note); }).join("");
  }

  renderCards("hero-cards", [
    { db: "b1_shanxi", note: "游戏实景取景地落于山西" },
    { db: "a1_visitors", note: "2024 国庆重点监测景区接待" },
    { db: "a9_nights", note: "过夜游客平均停留" }
  ]);
  /* Hero 卡片点击：平滑滚动到对应模块并短暂高亮（真正的探究入口） */
  (function () {
    var targets = ["#m1", "#m2", "#m4"];
    $$("#hero-cards .stat-card").forEach(function (card, i) {
      var t = targets[i];
      if (!t) return;
      card.style.cursor = "pointer";
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "跳转到对应章节");
      function go() {
        var sec = document.querySelector(t);
        if (!sec) return;
        sec.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        sec.classList.add("hl-flash");
        setTimeout(function () { sec.classList.remove("hl-flash"); }, 2200);
      }
      card.addEventListener("click", go);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
      });
    });
  })();
  renderCards("m2-cards", [
    { db: "a1_visitors", note: "65 个开放（共 66 个监测景区）" },
    { db: "a2_tickets", note: "同期门票收入" }
  ]);
  renderCards("m4-cards", [
    { db: "a8_over1day", note: "出游 1 天以上的游客占比" },
    { db: "a9_nights", note: "同比 +" + db("a9_yoy").v + "%（2023 同期对比）" }
  ]);
  /* 模块五：2024 / 2025 增速切换（均为官方可比口径同比，可直接比较） */
  function renderM5Cards(year) {
    var el = document.getElementById("m5-cards");
    if (!el) return;
    var items;
    if (year === "2024") {
      items = [
        { db: "a1_yoy", suffix: "%", note: "2024 重点监测景区接待 " + db("a1_visitors").v + " 万人次" },
        { db: "a2_yoy", suffix: "%", note: "2024 重点监测景区门票收入 " + db("a2_tickets").v + " 万元" }
      ];
    } else {
      items = [
        { db: "a10_yoy", suffix: "%", note: "2025 全省接待国内游客 " + db("a10_visitors").v + " 万人次" },
        { db: "a11_yoy", suffix: "%", note: "2025 游客总花费 " + db("a11_spend").v + " 亿元" }
      ];
    }
    el.innerHTML = items.map(function (it) {
      var d = db(it.db);
      return '<div class="stat-card" style="--d:0s">' +
        '<div class="stat-big">+' + d.v + "<i>" + esc(it.suffix) + "</i></div>" +
        '<div class="stat-label">' + esc(d.label) + "</div>" +
        '<div class="stat-note">' + esc(it.note) + "</div>" +
        badgeHTML(it.db) + "</div>";
    }).join("");
    staggerD(el, ".stat-card", 0.13);
    if (el.classList.contains("in")) {
      $$(".stat-big", el).forEach(function (n) { countUp(n); });
    }
  }
  renderM5Cards("2025");
  $$(".yt-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var year = btn.getAttribute("data-year");
      $$(".yt-btn").forEach(function (b) {
        b.classList.toggle("on", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      renderM5Cards(year);
    });
  });

  /* ---------- 图表标题：结论式（takeaway）+ 描述行 + 徽章 ---------- */
  function capHTML(take, desc, badgeId) {
    return '<figcaption class="chart-cap">' +
      '<span class="chart-take">' + esc(take) + "</span>" +
      '<span class="chart-desc">' + esc(desc) + (badgeId ? badgeHTML(badgeId) : "") + "</span>" +
      "</figcaption>";
  }

  /* ---------- 可展开数据表（details 实现，键盘可达） ---------- */
  function dataTable(cols, rows) {
    return '<details class="data-toggle"><summary>查看数据表</summary><div class="dt-wrap"><table><thead><tr>' +
      cols.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") +
      "</tr></thead><tbody>" +
      rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>"; }).join("") +
      "</tbody></table></div></details>";
  }

  /* ---------- 条形图（DOM 实现，宽度由 DB 计算） ---------- */
  function barRowHTML(r, max) {
    var w = (r.v / max) * 100;
    return '<div class="bar-row">' +
      '<span class="bar-label">' + esc(r.label) + (r.tag ? ' <i class="tag ' + esc(r.tagCls || "") + '">' + esc(r.tag) + "</i>" : "") + "</span>" +
      '<span class="bar-track"><span class="bar-fill ' + esc(r.cls || "") + '" style="--w:' + w.toFixed(1) + '%"></span></span>' +
      '<span class="bar-val" data-final="' + esc(r.display) + '">' + esc(r.display) + "</span></div>";
  }

  /* 错峰：为子元素依次写入 --d（CSS 动画/过渡延迟） */
  function staggerD(el, sel, step) {
    if (!el) return;
    $$(sel, el).forEach(function (n, i) { n.style.setProperty("--d", (i * step).toFixed(2) + "s"); });
  }

  function hBarChart(el, rows, opts) {
    opts = opts || {};
    var max = opts.max || Math.max.apply(null, rows.map(function (r) { return r.v; }));
    var html = capHTML(opts.take, opts.caption, opts.badge);
    html += rows.map(function (r) { return barRowHTML(r, max); }).join("");
    if (opts.footnote) html += '<p class="chart-foot">' + opts.footnote + "</p>";
    if (opts.table) html += dataTable(opts.table[0], opts.table[1]);
    el.innerHTML = html;
  }

  /* ---------- 哑铃图：两个增速点之间的剪刀差 ---------- */
  function dumbbellChart(el, opts) {
    var a = opts.a, b = opts.b; // {label, v, color}
    var max = opts.max || 50;
    var W = 520, H = 150, padL = 56, padR = 56, axisY = 96;
    var plotW = W - padL - padR;
    function x(v) { return padL + (v / max) * plotW; }
    var gap = (a.v - b.v).toFixed(2);
    var html = capHTML(opts.take, opts.caption, opts.badge);
    html += '<div class="db-wrap"><svg class="db-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="哑铃图：' + esc(a.label) + ' +' + a.v + '%，' + esc(b.label) + ' +' + b.v + '%，剪刀差 ' + gap + ' 个百分点">';
    /* 连接线（剪刀差） */
    html += '<line class="db-gap" x1="' + x(b.v).toFixed(1) + '" y1="' + axisY + '" x2="' + x(a.v).toFixed(1) + '" y2="' + axisY + '" />';
    html += '<text class="db-gap-txt" x="' + ((x(a.v) + x(b.v)) / 2).toFixed(1) + '" y="' + (axisY - 14) + '" text-anchor="middle">剪刀差 ' + gap + ' pp</text>';
    /* 门票点（低，mineral） */
    html += '<circle class="db-dot db-mineral" cx="' + x(b.v).toFixed(1) + '" cy="' + axisY + '" r="11" />';
    html += '<text class="db-lab" x="' + x(b.v).toFixed(1) + '" y="' + (axisY - 26) + '" text-anchor="middle">' + esc(b.label) + '</text>';
    html += '<text class="db-val db-val-mineral" x="' + x(b.v).toFixed(1) + '" y="' + (axisY + 32) + '" text-anchor="middle">+' + b.v + '%</text>';
    /* 人次点（高，cinnabar） */
    html += '<circle class="db-dot db-cinnabar" cx="' + x(a.v).toFixed(1) + '" cy="' + axisY + '" r="11" />';
    html += '<text class="db-lab" x="' + x(a.v).toFixed(1) + '" y="' + (axisY - 26) + '" text-anchor="middle">' + esc(a.label) + '</text>';
    html += '<text class="db-val" x="' + x(a.v).toFixed(1) + '" y="' + (axisY + 32) + '" text-anchor="middle">+' + a.v + '%</text>';
    /* 坐标轴与刻度 */
    html += '<line class="db-axis" x1="' + padL + '" y1="' + (axisY + 50) + '" x2="' + (W - padR) + '" y2="' + (axisY + 50) + '" />';
    [0, 25, 50].forEach(function (t) {
      var tx = x(t);
      html += '<line class="db-tick" x1="' + tx + '" y1="' + (axisY + 50) + '" x2="' + tx + '" y2="' + (axisY + 55) + '" />';
      html += '<text class="db-tick-txt" x="' + tx + '" y="' + (axisY + 68) + '" text-anchor="middle">' + t + '%</text>';
    });
    html += '</svg></div>';
    if (opts.footnote) html += '<p class="chart-foot">' + opts.footnote + "</p>";
    if (opts.table) html += dataTable(opts.table[0], opts.table[1]);
    el.innerHTML = html;
  }

  var d = db("a1_yoy"), d2 = db("a2_yoy");
  dumbbellChart($("#chart-yoy"), {
    a: { label: "接待人次同比", v: d.v, color: "cinnabar" },
    b: { label: "门票收入同比", v: d2.v, color: "mineral" },
    take: "“来了”远多于“花了”：人次增速接近门票收入增速的三倍",
    caption: "2024 国庆 · 66 个重点监测景区，官方可比口径同比",
    badge: "a1_yoy",
    footnote: "两点之间的连线即“剪刀差”——人次增速比门票收入增速高 " + (d.v - d2.v).toFixed(2) + " 个百分点。两增幅均引自官方发布原文；因上一年同期为 8 天假期，绝对量基数不可自行反推。",
    table: [["指标", "可比口径同比", "口径"], [
      ["66 个重点监测景区接待人次", "+" + d.v + "%", "官方发布可比口径（B 级）"],
      ["66 个重点监测景区门票收入", "+" + d2.v + "%", "官方发布可比口径（B 级）"]
    ]]
  });

  /* ---------- 基线对照：2023（恢复）vs 2024（悟空元年）+ 2019 参照 ---------- */
  (function () {
    var el = $("#chart-baseline");
    if (!el) return;
    var v23 = db("b9_2023_visitors"), v24 = db("a1_visitors"), t23 = db("b9_2023_tickets"), t24 = db("a2_tickets");
    var y23 = db("b9_2023_yoy"), y24 = db("a1_yoy"), v19 = db("b10_2019_visitors"), i19 = db("b10_2019_income");
    /* 日均 = 本页按官方公布总量 ÷ 假期天数计算（透明标注，非官方口径） */
    var d23 = (v23.v / 8), d24 = (v24.v / 7);
    var dt23 = (t23.v / 8), dt24 = (t24.v / 7);
    var maxV = Math.max(d23, d24), maxT = Math.max(dt23, dt24);
    var html = capHTML("恢复性增长主要发生在 2023；2024 是恢复后基数上的再增长", "66 个重点监测景区 · 日均口径对照（日均 = 官方总量 ÷ 假期天数，本页计算）", "b9_2023_visitors");
    html += '<p class="chart-sub">日均接待游客（万人次/天）</p>';
    html += barRowHTML({ label: "2023 中秋国庆（8 天 · 恢复期）", v: d23, display: d23.toFixed(1), cls: "c-mineral", tag: "总量 " + v23.v + " 万", tagCls: "tag-blue" }, maxV);
    html += barRowHTML({ label: "2024 国庆（7 天 · 悟空元年）", v: d24, display: d24.toFixed(1), cls: "c-cinnabar", tag: "总量 " + v24.v + " 万", tagCls: "tag-red" }, maxV);
    html += '<p class="chart-sub">日均门票收入（万元/天）</p>';
    html += barRowHTML({ label: "2023 中秋国庆（8 天 · 恢复期）", v: dt23, display: dt23.toFixed(0), cls: "c-mineral", tag: "总量 2.43 亿元", tagCls: "tag-blue" }, maxT);
    html += barRowHTML({ label: "2024 国庆（7 天 · 悟空元年）", v: dt24, display: dt24.toFixed(0), cls: "c-cinnabar", tag: "总量 " + t24.v + " 万元", tagCls: "tag-red" }, maxT);
    html += '<p class="chart-foot">日均口径下，2024 人次较 2023 约 +46%，与官方“可比口径 +' + y24.v + '%”互洽——说明官方增幅已剔除 8 天/7 天的假期天数差异。而 2023 年同比 +' + y23.v + '%（2022 疫情低基数）<sup class="bl-src"></sup>说明恢复性增长在 2023 已基本完成；2024 的增长是在恢复后基数上的<strong>再增长</strong>。但“悟空贡献”无法从总量中精确分离，本页只陈述：增长超出了恢复性延续所能解释的水平。</p>';
    html += '<p class="chart-foot">2019 年疫情前参照：当年国庆（7 天）<strong>全省</strong>接待旅游者 ' + v19.v + ' 万人次、旅游综合收入 ' + i19.v + ' 亿元——此为<strong>全域口径</strong>，与 66 景区口径不可直接比较，仅作时代背景记录' + badgeHTML("b10_2019_visitors") + '。</p>';
    html += dataTable(["时点", "口径", "接待人次", "门票收入", "备注"], [
      ["2019 国庆（7 天）", "全省全域", v19.v + " 万人次", i19.v + " 亿元（综合收入）", "疫情前参照，口径不可比"],
      ["2023 中秋国庆（8 天）", "66 个重点监测景区", v23.v + " 万人次", "2.43 亿元", "恢复期（同比 +" + y23.v + "%，低基数）"],
      ["2024 国庆（7 天）", "66 个重点监测景区", v24.v + " 万人次", t24.v + " 万元", "悟空元年（可比口径 +" + y24.v + "%）"]
    ]);
    el.innerHTML = html;
    var s = $(".bl-src", el);
    if (s) s.innerHTML = badgeHTML("b9_2023_yoy");
  })();

  /* ---------- 山西 11 市真实轮廓图（已披露填色，未披露斜线水印；hover 联动数据卡） ---------- */
  (function () {
    var el = $("#chart-map");
    if (!el || !window.SX_MAP) return;
    var rows = db("a6_cities").rows;
    var disclosed = {};
    rows.forEach(function (r) { disclosed[r.name] = r.v; });
    var paths = window.SX_MAP.paths, centers = window.SX_MAP.centers;
    var names = Object.keys(paths);
    var html = capHTML("已披露的三市接近：太原、运城、临汾——其余八市数据缺失，以斜线留白", "2024 国庆 · 11 市接待占比（真实行政轮廓；hover 任一市查看详情）", "a6_cities");
    html += '<div class="map-wrap map-real">';
    html += '<svg class="map-svg" viewBox="' + window.SX_MAP.viewBox + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="山西省11市真实轮廓接待占比图">';
    html += '<defs><pattern id="hatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">' +
      '<rect width="7" height="7" fill="#EFEAE0"/><line x1="0" y1="0" x2="0" y2="7" stroke="#D8D1C2" stroke-width="2.5"/></pattern></defs>';
    names.forEach(function (name) {
      var v = disclosed[name];
      var isDis = typeof v === "number";
      var fill = isDis ? "var(--cinnabar)" : "url(#hatch)";
      var op = isDis ? (0.55 + 0.45 * (v / 15)).toFixed(2) : "1";
      html += '<path class="sx-city' + (isDis ? " sx-dis" : " sx-undis") + '" data-city="' + esc(name) + '" d="' + paths[name] + '" fill="' + fill + '" fill-opacity="' + op + '"/>';
    });
    names.forEach(function (name) {
      var c = centers[name]; if (!c) return;
      var isDis = typeof disclosed[name] === "number";
      html += '<text class="sx-lab' + (isDis ? " sx-lab-dis" : "") + '" x="' + c[0] + '" y="' + c[1] + '" text-anchor="middle" pointer-events="none">' + esc(name) + '</text>';
    });
    html += '</svg>';
    /* 联动数据卡 */
    html += '<div class="map-card" id="map-card" aria-live="polite">' +
      '<p class="mc-hint">悬停或点按地图上的城市</p>' +
      '<p class="mc-sub">查看该市 2024 国庆接待占比的披露状态</p></div>';
    html += '</div>';
    html += '<ul class="map-legend"><li><i class="lg lg-dis"></i>已披露（颜色深浅随占比）</li><li><i class="lg lg-hatch"></i>斜线 = 未披露（不推算）</li></ul>';
    html += '<p class="chart-foot">底图为真实行政边界（DataV 行政区划数据，仅作数据可视化表达，不作地图出版用途）。8 市数据未在可核验文本中披露，本页不作外推。</p>';
    html += dataTable(["城市", "接待量占比", "备注"],
      rows.map(function (r) { return [r.name, r.v + "%", "发布文本披露"]; })
        .concat([["其余 8 市", "—", "未披露，不推算"]]));
    el.innerHTML = html;

    /* hover / 点按 联动数据卡（真·探索性交互） */
    var card = $("#map-card", el);
    function showCity(name) {
      var v = disclosed[name];
      if (typeof v === "number") {
        card.innerHTML = '<p class="mc-name">' + esc(name) + '</p>' +
          '<p class="mc-val">' + v + '<i>%</i></p>' +
          '<p class="mc-sub">2024 国庆游客接待量占比（发布文本披露）</p>';
      } else {
        card.innerHTML = '<p class="mc-name">' + esc(name) + '</p>' +
          '<p class="mc-val mc-none">未披露</p>' +
          '<p class="mc-sub">占比仅见于原文配图，未完成核验——本页留空，不作推算</p>';
      }
    }
    $$(".sx-city", el).forEach(function (p) {
      var name = p.getAttribute("data-city");
      p.addEventListener("mouseenter", function () { showCity(name); });
      p.addEventListener("click", function () { showCity(name); });
      p.addEventListener("focus", function () { showCity(name); });
      p.setAttribute("tabindex", "0");
    });
  })();

  hBarChart($("#chart-cities"), db("a6_cities").rows.map(function (r) {
    return { label: r.name, v: r.v, display: r.v + "%" };
  }), {
    take: "已披露的三市：太原、运城接近，临汾次之——其余八市未知",
    caption: "2024 国庆 · 各市游客接待量占比（发布文本披露部分）",
    badge: "a6_cities",
    footnote: "条形长度按已披露三市内相对比较；全省其余 8 市数据缺失，不作外推。",
    table: [["城市", "接待量占比", "备注"], db("a6_cities").rows.map(function (r) { return [r.name, r.v + "%", "发布文本披露"]; }).concat([["其余 8 市", "—", "未披露，不推算"]])]
  });

  /* 模块三：取景地 vs 全省（人次 + 门票两组并列，各自独立刻度） */
  (function () {
    var el = $("#chart-jing");
    var a4 = db("a4_jing"), a1 = db("a1_visitors"), a5 = db("a5_jing"), a2 = db("a2_tickets");
    var maxV = Math.max(a4.v, a1.v), maxT = Math.max(a5.v, a2.v);
    var html = capHTML("两组数字分属不同范围：只能并列观察，不可相除", "2024 国庆 · 27 个悟空涉晋文物景点 与 66 个重点监测景区", "a4_jing");
    html += '<p class="chart-sub">接待人次（万人次）</p>';
    html += barRowHTML({ label: "27 个悟空涉晋文物景点", v: a4.v, display: a4.v + "", cls: "c-cinnabar", tag: "涉文物景点口径", tagCls: "tag-red" }, maxV);
    html += barRowHTML({ label: "66 个重点监测景区（全省）", v: a1.v, display: a1.v + "", cls: "c-mineral", tag: "重点监测景区口径", tagCls: "tag-blue" }, maxV);
    html += '<p class="chart-sub">门票收入（万元）</p>';
    html += barRowHTML({ label: "27 个悟空涉晋文物景点", v: a5.v, display: a5.v + "", cls: "c-cinnabar", tag: "涉文物景点口径", tagCls: "tag-red" }, maxT);
    html += barRowHTML({ label: "66 个重点监测景区（全省）", v: a2.v, display: a2.v + "", cls: "c-mineral", tag: "重点监测景区口径", tagCls: "tag-blue" }, maxT);
    html += '<p class="chart-foot">两组各自的条形刻度独立（单位不同）；两套范围的包含关系官方未说明，禁止计算“取景地占全省 X%”。</p>';
    html += dataTable(["指标", "27 个涉晋文物景点", "66 个重点监测景区"], [
      ["接待人次（万人次）", a4.v + "", a1.v + ""],
      ["门票收入（万元）", a5.v + "", a2.v + ""]
    ]);
    el.innerHTML = html;
  })();

  /* 环形图：客源构成（省内 64.1% / 省外 35.9%） */
  (function () {
    var el = $("#chart-origin");
    var vin = db("a7_in"), vout = db("a7_out");
    var R = 54, C = 2 * Math.PI * R;
    var outLen = (vout.v / 100) * C;
    var inLen = C - outLen;
    var html = capHTML("每三位游客中，约有一位来自省外", "2024 国庆 · 省内 / 省外游客占比", "a7_in");
    html += '<div class="donut-wrap"><svg class="donut-svg" viewBox="0 0 160 160" role="img" aria-label="客源构成环形图：省内' + vin.v + '%，省外' + vout.v + '%">';
    /* 背景环（省内，mineral） */
    html += '<circle class="dn-track dn-in" cx="80" cy="80" r="' + R + '" stroke-dasharray="' + inLen.toFixed(2) + ' ' + C.toFixed(2) + '" />';
    /* 省外环（cinnabar），起点接在省内之后 */
    html += '<circle class="dn-track dn-out" cx="80" cy="80" r="' + R + '" stroke-dasharray="' + outLen.toFixed(2) + ' ' + C.toFixed(2) + '" stroke-dashoffset="' + (-inLen).toFixed(2) + '" />';
    html += '<text class="dn-center-txt" x="80" y="74" text-anchor="middle">省外</text>';
    html += '<text class="dn-center-num" x="80" y="98" text-anchor="middle">' + vout.v + '%</text>';
    html += '</svg><ul class="donut-legend"><li><i class="lg lg-in"></i>省内游客 ' + vin.v + '%</li><li><i class="lg lg-out"></i>省外游客 ' + vout.v + '%</li></ul></div>';
    html += '<p class="chart-foot">省外占比较上年同期提升 ' + val("a7_out_delta") + ' 个百分点——外省客源的明显进入，是“悟空流量”落地最直接的观察信号之一。</p>' +
      dataTable(["客源", "占比", "变化"], [
        ["省内游客", vin.v + "%", "—"],
        ["省外游客", vout.v + "%", "较上年同期 +" + val("a7_out_delta") + " 个百分点"]
      ]);
    el.innerHTML = html;
  })();

  /* 华夫图：停留时长 1—3 天占比 68.97%（10×10 = 100 格，69 格填充） */
  (function () {
    var el = $("#chart-stay");
    var v = db("a8_1to3");
    var filled = Math.round(v.v); /* 68.97 → 69 */
    var cells = "";
    for (var i = 0; i < 100; i++) {
      cells += '<span class="wf-cell' + (i < filled ? " wf-on" : "") + '"></span>';
    }
    el.innerHTML = capHTML("近七成游客停留 1—3 天：以中短途为主", "2024 国庆 · 出游 1—3 天的游客占比（每格代表 1%）", "a8_1to3") +
      '<div class="waffle" aria-hidden="true">' + cells + '</div>' +
      '<p class="wf-count"><strong>' + filled + '</strong> / 100 格 · ' + v.v + '%</p>' +
      '<p class="chart-foot">出游 1 天以上者' + esc(val("a8_over1day")) + "；过夜游客平均停留 " + val("a9_nights") + " 夜（同比 +" + val("a9_yoy") + "%）" + badgeHTML("a9_nights") + "</p>" +
      dataTable(["指标", "数值"], [
        ["出游 1—3 天的游客占比", v.v + "%"],
        ["出游 1 天以上的游客占比", val("a8_over1day") + "（原文表述）"],
        ["过夜游客平均停留", val("a9_nights") + " 夜（同比 +" + val("a9_yoy") + "%）"]
      ]);
  })();

  /* ---------- 时间线 ---------- */
  function timeline(el, events) {
    el.innerHTML = events.map(function (e) {
      return '<div class="tl-item reveal"><div class="tl-dot" aria-hidden="true"></div>' +
        '<div class="tl-body"><p class="tl-d">' + esc(e.d) + "</p><p class=\"tl-t\">" + esc(e.t) + "</p>" +
        '<p class="tl-x">' + e.x + "</p>" +
        (e.src ? '<span class="tl-src">' + badgeHTML(e.src) + "</span>" : "") +
        "</div></div>";
    }).join("");
  }

  timeline($("#tl-origin"), [
    { d: "2024-08-20", t: "《黑神话：悟空》上线", x: "游戏在全国取景 " + val("b1_national") + " 处，其中 " + val("b1_shanxi") + " 处在山西，横跨 " + val("b1_cities") + " 个地市。", src: "ev_launch" },
    { d: "2024-08-23", t: "上线第 3 天", x: "全省 27 个涉文物景点单日接待 " + val("b2_aug23_visitors") + " 万人次，环比 +" + val("b2_aug23_yoy") + "%；门票收入 " + val("b2_aug23_tickets") + " 万元。", src: "b2_aug23_visitors" },
    { d: "2024-09", t: "“跟着悟空游山西”铺开", x: "主题线路、打卡活动与平台联动陆续推出，“流量”开始被组织为“到访”。", src: "ev_activity" },
    { d: "2024-10-01 至 07", t: "首个“悟空国庆”", x: "66 个重点监测景区累计接待 " + val("a1_visitors") + " 万人次。", src: "a1_visitors" }
  ]);

  timeline($("#tl-xixiao"), DB.xixiao_events);

  /* ---------- 取景地 chips ---------- */
  (function () {
    var el = $("#chip-locations");
    el.innerHTML = db("b1_sample").list.map(function (p) {
      return '<span class="chip">' + esc(p[0]) + '<i>' + esc(p[1]) + "</i></span>";
    }).join("");
  })();

  /* ---------- 来源清单 ---------- */
  (function () {
    var el = $("#src-list");
    el.innerHTML = DB.sources.map(function (s) {
      return "<li><a href=\"" + esc(s.u) + '" target="_blank" rel="noopener">' + esc(s.t) + "</a>" + (s.n ? " — " + esc(s.n) : "") + "</li>";
    }).join("");
  })();

  /* ---------- 数字动画：统一 easeOutExpo ---------- */
  function easeOutExpo(p) { return p >= 1 ? 1 : 1 - Math.pow(2, -10 * p); }

  /* 数据卡大数字 count-up */
  function countUp(el) {
    if (reduce || !window.requestAnimationFrame) return;
    var node = el.firstChild;
    if (!node || node.nodeType !== 3) return;
    var m = node.nodeValue.match(/^\s*([\d]+(?:\.\d+)?)/);
    if (!m) return;
    var target = parseFloat(m[1]);
    var decimals = (m[1].split(".")[1] || "").length;
    if (!isFinite(target) || target === 0) return;
    var idx = node.nodeValue.indexOf(m[1]);
    var head = node.nodeValue.slice(0, idx);
    var tail = node.nodeValue.slice(idx + m[1].length);
    var start = null, dur = 1250;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      node.nodeValue = head + (target * easeOutExpo(p)).toFixed(decimals) + tail;
      if (p < 1) requestAnimationFrame(step);
      else node.nodeValue = head + m[1] + tail;
    }
    requestAnimationFrame(step);
  }

  /* 图表数值：与条形生长同步的 count-up（读取 data-final，支持 +/- 前缀与 % 等单位后缀） */
  function animVal(el) {
    if (reduce || !window.requestAnimationFrame) return;
    var final = el.getAttribute("data-final");
    if (!final) return;
    var m = final.match(/^([^\d]*)([\d]+(?:\.\d+)?)([\s\S]*)$/);
    if (!m) return;
    var pre = m[1], target = parseFloat(m[2]), suf = m[3];
    var decimals = (m[2].split(".")[1] || "").length;
    var delay = 0;
    var row = el.closest ? el.closest(".bar-row") : null;
    if (row) delay = (parseFloat(row.style.getPropertyValue("--d")) || 0) * 1000;
    setTimeout(function () {
      var start = null, dur = 1050;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        el.textContent = pre + (target * easeOutExpo(p)).toFixed(decimals) + suf;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = final;
      }
      requestAnimationFrame(step);
    }, delay);
  }

  /* ---------- 错峰参数注入 ---------- */
  staggerD($("#chart-yoy"), ".bar-row", 0.14);
  staggerD($("#chart-baseline"), ".bar-row", 0.12);
  staggerD($("#chart-cities"), ".bar-row", 0.14);
  staggerD($("#chart-jing"), ".bar-row", 0.1);
  staggerD($("#chip-locations"), ".chip", 0.05);
  ["hero-cards", "m2-cards", "m4-cards", "m5-cards"].forEach(function (id) {
    staggerD(document.getElementById(id), ".stat-card", 0.13);
  });
  $$(".module-no").forEach(function (el) { el.classList.add("reveal"); });
  $$("#hero-cards .stat-big").forEach(function (el) { el.setAttribute("data-odo", "1"); });

  /* ---------- 品牌徽标：古建斗拱 + 数据柱融合（纯 SVG，离线一致） ---------- */
  function logoSVG() {
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' +
      /* 屋脊 */
      '<path d="M26 30 H74 M24 30 l2 -3 M76 30 l-2 -3" />' +
      /* 翘角屋檐 */
      '<path d="M8 46 Q50 24 92 46" />' +
      '<path d="M8 46 Q1 40 4 52" />' +
      '<path d="M92 46 Q99 40 96 52" />' +
      /* 斗拱第一层（檐下枋） */
      '<path d="M20 52 H80" />' +
      '<path d="M22 52 V58 M78 52 V58" />' +
      '<rect x="20" y="56" width="6" height="4" />' +
      '<rect x="74" y="56" width="6" height="4" />' +
      '<rect x="47" y="56" width="6" height="4" />' +
      /* 斗拱第二层（含数据柱——三根上升柱，呼应"数据"） */
      '<path d="M16 62 H84" />' +
      '<path d="M18 62 V68 M82 62 V68" />' +
      '<rect x="14" y="66" width="6" height="4" />' +
      '<rect x="80" y="66" width="6" height="4" />' +
      '<path d="M38 62 V54 M44 62 V48 M50 62 V52 M56 62 V46" />' +
      /* 斗拱第三层 */
      '<path d="M22 70 H78" />' +
      '<path d="M24 70 V76 M76 70 V76" />' +
      '<rect x="22" y="74" width="5" height="3" />' +
      '<rect x="73" y="74" width="5" height="3" />' +
      /* 立柱 */
      '<path d="M44 76 V86 M56 76 V86" />' +
      /* 台基 */
      '<path d="M18 86 H82 M22 90 H78" />' +
      '</svg>';
  }
  function dgSVG() {
    return '<svg class="dg" viewBox="0 0 200 64" aria-hidden="true">' +
      /* 左翘檐 */
      '<path class="dg-path" style="--i:0" d="M10 24 Q40 8 70 24" pathLength="1" />' +
      '<path class="dg-path" style="--i:0" d="M10 24 Q3 18 6 32" pathLength="1" />' +
      /* 右翘檐 */
      '<path class="dg-path" style="--i:0" d="M130 24 Q160 8 190 24" pathLength="1" />' +
      '<path class="dg-path" style="--i:0" d="M190 24 Q197 18 194 32" pathLength="1" />' +
      /* 中间屋脊连接 */
      '<path class="dg-path" style="--i:1" d="M70 24 H130" pathLength="1" />' +
      /* 斗拱三层 */
      '<path class="dg-path" style="--i:2" d="M40 32 H160" pathLength="1" />' +
      '<path class="dg-path" style="--i:2" d="M42 32 V38 M158 32 V38" pathLength="1" />' +
      '<path class="dg-path" style="--i:3" d="M30 42 H170" pathLength="1" />' +
      '<path class="dg-path" style="--i:3" d="M32 42 V48 M168 42 V48" pathLength="1" />' +
      /* 数据柱（中层四根，点题"数据"） */
      '<path class="dg-path dg-top" style="--i:3" d="M82 42 V34 M90 42 V28 M98 42 V36 M106 42 V30 M114 42 V38" pathLength="1" />' +
      '<path class="dg-path" style="--i:4" d="M48 52 H152" pathLength="1" />' +
      '<path class="dg-path" style="--i:4" d="M50 52 V58 M150 52 V58" pathLength="1" />' +
      /* 立柱与台基 */
      '<path class="dg-path" style="--i:5" d="M92 58 V52 M108 58 V52" pathLength="1" />' +
      '<path class="dg-path" style="--i:6" d="M36 58 H164 M40 62 H160" pathLength="1" />' +
      '</svg>';
  }
  /* ---------- 斗拱构件：模块顶部木构线条，滚动描线 ---------- */
  (function () {
    $$(".module .wrap").forEach(function (w) { w.insertAdjacentHTML("afterbegin", dgSVG()); });
    var mods = $$(".module");
    if (reduce || !("IntersectionObserver" in window)) {
      mods.forEach(function (m) { m.classList.add("dg-in"); });
    } else {
      var dio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("dg-in"); dio.unobserve(en.target); }
        });
      }, { threshold: 0.06 });
      mods.forEach(function (m) { dio.observe(m); });
    }
  })();

  /* ---------- Hero：Canvas 墨点尘光（reduced-motion 下静态一帧） ---------- */
  (function () {
    var cv = document.getElementById("ink");
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d");
    var hero = cv.parentElement, W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var INKS = [[179, 58, 46], [46, 102, 118], [197, 138, 50], [32, 36, 40]];
    var parts = [], blobs = [];
    function resize() {
      W = hero.clientWidth; H = hero.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() {
      var n = Math.round(W * H / 26000), i;
      parts = []; blobs = [];
      for (i = 0; i < n; i++) {
        var c = INKS[i % 4];
        parts.push({ x: Math.random() * W, y: Math.random() * H, r: 0.7 + Math.random() * 2.1,
          vx: -0.06 - Math.random() * 0.14, vy: -0.03 - Math.random() * 0.1,
          a: 0.05 + Math.random() * 0.14, c: c, ph: Math.random() * 6.28 });
      }
      for (i = 0; i < 6; i++) {
        blobs.push({ x: Math.random() * W, y: Math.random() * H, r: 60 + Math.random() * 130,
          a: 0.022 + Math.random() * 0.02, c: INKS[i % 3] });
      }
    }
    function paint(t) {
      ctx.clearRect(0, 0, W, H);
      var i, p;
      for (i = 0; i < blobs.length; i++) {
        var b = blobs[i];
        var g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, "rgba(" + b.c[0] + "," + b.c[1] + "," + b.c[2] + "," + b.a + ")");
        g.addColorStop(1, "rgba(" + b.c[0] + "," + b.c[1] + "," + b.c[2] + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.29); ctx.fill();
      }
      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        var tw = reduce ? 1 : 0.72 + 0.28 * Math.sin(t / 1600 + p.ph);
        ctx.fillStyle = "rgba(" + p.c[0] + "," + p.c[1] + "," + p.c[2] + "," + (p.a * tw).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.29); ctx.fill();
        if (!reduce) {
          var dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
          if (d2 < 8100 && d2 > 0.01) {
            var d = Math.sqrt(d2), f = (90 - d) / 90 * 0.9;
            p.x += dx / d * f; p.y += dy / d * f;
          }
          p.x += p.vx; p.y += p.vy;
          if (p.x < -6) p.x = W + 6; if (p.y < -6) p.y = H + 6;
        }
      }
    }
    resize(); seed();
    var mx = -9999, my = -9999;
    if (!reduce && window.matchMedia && !window.matchMedia("(hover: none)").matches) {
      hero.addEventListener("mousemove", function (e) {
        var r = hero.getBoundingClientRect();
        mx = e.clientX - r.left; my = e.clientY - r.top;
      }, { passive: true });
      hero.addEventListener("mouseleave", function () { mx = -9999; my = -9999; }, { passive: true });
    }
    var running = false, raf = 0;
    function loop(t) { paint(t || 0); if (running) raf = requestAnimationFrame(loop); }
    window.addEventListener("resize", function () { resize(); seed(); if (reduce) paint(0); }, { passive: true });
    if (reduce) { paint(0); return; }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        var vis = en[0].isIntersecting;
        if (vis && !running) { running = true; raf = requestAnimationFrame(loop); }
        else if (!vis && running) { running = false; cancelAnimationFrame(raf); }
      }, { threshold: 0.02 }).observe(hero);
    } else { running = true; raf = requestAnimationFrame(loop); }
  })();

  /* ---------- 滚轮数字（Hero 数据卡；每位数字一列滚动） ---------- */
  function odometer(el) {
    if (reduce) return;
    var node = el.firstChild;
    if (!node || node.nodeType !== 3) return;
    var text = node.nodeValue;
    var m = text.match(/^\s*([\d]+(?:\.\d+)?)/);
    if (!m) return;
    var numStr = m[1];
    var frag = document.createDocumentFragment();
    var head = text.slice(0, text.indexOf(numStr));
    if (head) frag.appendChild(document.createTextNode(head));
    var cols = [];
    for (var i = 0; i < numStr.length; i++) {
      var ch = numStr[i];
      if (/\d/.test(ch)) {
        var target = parseInt(ch, 10);
        var col = document.createElement("span"); col.className = "odo-col";
        var strip = document.createElement("span"); strip.className = "odo-strip";
        var dgt;
        for (dgt = 0; dgt <= 9; dgt++) { var s1 = document.createElement("span"); s1.textContent = dgt; strip.appendChild(s1); }
        for (dgt = 0; dgt <= target; dgt++) { var s2 = document.createElement("span"); s2.textContent = dgt; strip.appendChild(s2); }
        col.appendChild(strip); frag.appendChild(col);
        cols.push({ strip: strip, target: target, i: i });
      } else {
        var st = document.createElement("span"); st.textContent = ch; frag.appendChild(st);
      }
    }
    el.insertBefore(frag, node);
    el.removeChild(node);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        cols.forEach(function (c) {
          c.strip.style.transitionDelay = (c.i * 0.09) + "s";
          c.strip.style.transform = "translateY(-" + (10 + c.target) + "em)";
        });
      });
    });
  }

  /* ---------- 数据卡：悬停 3D 微倾斜（桌面端；动画终态后解除 fill 锁定） ---------- */
  (function () {
    var noHover = window.matchMedia && window.matchMedia("(hover: none)").matches;
    $$(".stat-card").forEach(function (card) {
      card.addEventListener("animationend", function () {
        card.style.animation = "none"; card.style.opacity = "1";
      }, { once: true });
      if (reduce || noHover) return;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = e.clientX - r.left, py = e.clientY - r.top;
        card.style.setProperty("--mx", px.toFixed(0) + "px");
        card.style.setProperty("--my", py.toFixed(0) + "px");
        var rx = (py / r.height - 0.5) * -4.5;
        var ry = (px / r.width - 0.5) * 4.5;
        card.style.transform = "translateY(-3px) perspective(640px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  })();

  /* ---------- 大问句：逐字弹入（reduced-motion 保持整句入场） ---------- */
  (function () {
    if (reduce) return;
    var bq = $(".big-question");
    if (!bq) return;
    var text = bq.textContent;
    bq.style.animation = "none";
    bq.textContent = "";
    var idx = 0;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (/\s/.test(ch)) { bq.appendChild(document.createTextNode(ch)); continue; }
      var s = document.createElement("span");
      s.className = "bq-ch";
      s.textContent = ch;
      s.style.setProperty("--d", (0.35 + idx * 0.045).toFixed(2) + "s");
      bq.appendChild(s);
      idx++;
    }
  })();

  /* ---------- 模块标题：字距收缩入场 ---------- */
  $$(".module h2").forEach(function (el) { el.classList.add("reveal"); });

  /* ---------- 滚动驱动：Hero 视差淡出 + 模块巨号序数漂移 ---------- */
  (function () {
    var NUMS = ["壹", "贰", "叁", "肆", "伍"];
    var mods = $$(".module");
    mods.forEach(function (m, i) { m.setAttribute("data-num", NUMS[i] || ""); });
    if (reduce || !window.requestAnimationFrame) return;
    var heroWrap = $(".hero .wrap"), hero = $(".hero");
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var sy = window.scrollY || window.pageYOffset || 0;
        if (heroWrap && hero) {
          var hh = hero.offsetHeight || 1;
          if (sy < hh) {
            heroWrap.style.transform = "translateY(" + (sy * 0.22).toFixed(1) + "px)";
            heroWrap.style.opacity = Math.max(1 - sy / (hh * 0.92), 0).toFixed(3);
          }
        }
        var vh = window.innerHeight || 1;
        for (var i = 0; i < mods.length; i++) {
          var r = mods[i].getBoundingClientRect();
          if (r.bottom > -120 && r.top < vh + 120) {
            var prog = (r.top + r.height / 2 - vh / 2) / vh;
            mods[i].style.setProperty("--py", (prog * -46).toFixed(1) + "px");
          }
        }
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* ---------- 进场动画 + 数字动画触发（尊重 reduced-motion） ---------- */
  var targets = $$(".reveal, .chart, .timeline, .stat-cards");
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          $$(".stat-big", en.target).forEach(function (el) {
            if (el.hasAttribute("data-odo")) odometer(el); else countUp(el);
          });
          $$("[data-final]", en.target).forEach(animVal);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 阅读进度条 ---------- */
  var progress = $("#progress");
  if (progress) {
    var ticking = false;
    var onScrollP = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        progress.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScrollP, { passive: true });
    onScrollP();
  }

  /* ---------- 导航激活态 ---------- */
  (function () {
    var links = $$(".head-nav a");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.remove("on"); });
          var a = map[en.target.id];
          if (a) a.classList.add("on");
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    ["m1", "m2", "m3", "m4", "m5", "method"].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) nio.observe(s);
    });
  })();

  /* ---------- 返回顶部 ---------- */
  (function () {
    var btn = $("#toTop");
    if (!btn) return;
    var show = false;
    window.addEventListener("scroll", function () {
      var should = window.scrollY > 600;
      if (should !== show) { show = should; btn.classList.toggle("show", show); }
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  })();
})();
