/**
 * 全站统一导航。
 * 六个页面都只引这一个文件 —— 条目、位置、行为只有一处定义，改一次全站生效。
 */
(function () {
  var ITEMS = [
    ['style-index.html', '首页'],
    ['style-1-novel.html', '① 立绘对话'],
    ['style-2-table.html', '② 桌面俯视'],
    ['style-3-terminal.html', '③ 终端'],
    ['style-4-cards.html', '④ 手牌'],
    ['style-5-dossier.html', '⑤ 卷宗'],
    ['style-6-persona.html', '⑥ 心之怪盗'],
    ['style-7-seven-days.html', '⑦ 七日'],
  ];

  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  // 发布到根目录时首页文件名是 index.html，本地是 style-index.html —— 两个都认
  if (here === 'index.html' || here === '') here = 'style-index.html';

  var parts = ITEMS.map(function (it) {
    var on = it[0] === here ? ' class="on"' : '';
    return '<a href="' + it[0] + '"' + on + '>' + it[1] + '</a>';
  });

  var nav = document.createElement('nav');
  nav.id = 'topnav';
  nav.innerHTML =
    '<span class="brand">股神异闻录</span>' +
    parts.join('') +
    '<span class="sp"></span>' +
    '<a class="home" href="style-index.html">← 回首页</a>';

  function mount() {
    document.body.insertBefore(nav, document.body.firstChild);
    // 页面按这个高度让位：固定定位的舞台往下挪，等比缩放也要少算这一条
    document.documentElement.style.setProperty('--navh', '46px');
    window.__NAVH = 46;
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);

  // Esc = 回首页，和"点导航"是同一件事
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') location.href = 'style-index.html';
  });
})();
