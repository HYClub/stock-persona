/**
 * 五个玩法样式共用的规则与剧本。
 * 内容完全一样 —— 变的是「怎么呈现、怎么操作」，方便横向对比。
 */
(function () {
  const ART = 'img/';

  const ITEMS = {
    refill: { name: '加注', img: ART + 'ic-refill.jpg', desc: '这次检定 +5（掷完也能用）' },
    stop: { name: '割肉', img: ART + 'ic-stop.jpg', desc: '失败改判「惨胜」，心态 -1' },
    peek: { name: '内幕', img: ART + 'ic-peek.jpg', desc: '先看骰面，再决定做不做' },
    flat: { name: '空仓', img: ART + 'ic-flat.jpg', desc: '跳过这次检定，但也拿不到东西' },
    short: { name: '反手', img: ART + 'ic-short.jpg', desc: '大失败变成功，贪婪 +2' },
    lever: { name: '融资', img: ART + 'ic-lever.jpg', desc: '属性 ×2，贪婪 +2' },
  };

  const ATTR_HINT = {
    胆量: '正面顶、硬扛',
    洞察: '看穿、发现弱点',
    定力: '忍住、抵抗贪婪',
    手速: '抢先、躲开',
    运气: '赌、改骰',
  };

  const BEATS = [
    {
      who: '主 持 人 · 大 A',
      art: ART + 'ada-hero2.jpg',
      text: '收盘后你没走。\n电梯按下 1 楼，停在了第七层 —— 这栋楼只有六层。\n它翻出一张打印纸，推到你面前。',
      aside: '纸上是某一天的分时图。你认出自己那天也在。',
      acts: [
        {
          t: '拿起那张纸', d: '你想看看那到底是哪一天 —— 但拿起来就得认。',
          attr: '胆量', dc: 10,
          ok: { tx: '你把纸拿起来了。日期是 2024 年 5 月 16 日。你记得那天。', eff: { greed: 1, chip: 1 } },
          no: { tx: '你的手停在半空，又缩了回来。\n「不急。」它说，「反正你跑不掉。」', eff: { hp: -1 } },
        },
        {
          t: '问它：这是哪一天？', d: '先搞清楚状况再动手，是活下去的第一条。',
          attr: '洞察', dc: 13,
          ok: { tx: '「你自己看。」它把纸转了个方向 —— 右下角有一行小字：请勿在收盘后逗留。', eff: { chip: 1 } },
          no: { tx: '它没有回答。你抬头的时候，屋里的灯比刚才暗了一格。', eff: { hp: -1, greed: 1 } },
        },
        {
          t: '不接，转身按电梯', d: '按钮亮着，但你不确定它会不会听你的。',
          attr: '定力', dc: 16,
          ok: { tx: '你没接。电梯门关上的那一瞬间，你听见它在里面笑了一声。\n门再开时 —— 还是第七层。', eff: { greed: -1 } },
          no: { tx: '你按了。电梯来了，空的。你走进去，门关上，抬头发现楼层显示还是 7。', eff: { hp: -2, greed: 1 } },
        },
      ],
    },
    {
      who: '异 闻 · 对 倒 幽 灵',
      art: ART + 'ada-hero3.jpg',
      obs: { cur: 5, max: 8 },
      text: '纸上的蜡烛一根一根开始动。\n「你看这根线 —— 昨天还是红的，今天怎么就成了这样？」',
      aside: '它把那张 K 线图举到你面前。它的手一直没离开过那张纸。你注意到，纸的右下角缺了一块。',
      acts: [
        {
          t: '看穿它手上那张纸', d: '它一直在动那张图 —— 答案多半就在上面。',
          attr: '洞察', dc: 13,
          ok: {
            tx: '你没看那根线，你看的是它握纸的手 —— 四根指头压着，小指却是翘的。那张图是假的。',
            crit: '它的手腕一抖，整张纸散成了灰。\n你看见了它真正的样子 —— 一堆被撕碎的委托单。',
            eff: { obs: -3, chip: 1 },
          },
          no: { tx: '你盯得太久了。等回过神，那张图已经贴在你脸上。上面的数字全是你的账户。', eff: { hp: -1, greed: 1 } },
        },
        {
          t: '正面顶上去', d: '不问、不躲，直接按住它那只手。',
          attr: '胆量', dc: 16,
          ok: { tx: '你按住它。它的手很凉，像刚被谁从水里捞出来。它愣了一下。', eff: { obs: -2 } },
          no: { tx: '你的手穿过去了。它就在你身后。', eff: { hp: -2, greed: 1 } },
        },
        {
          t: '什么都不做，看着它', d: '它想让你慌。你偏不慌。',
          attr: '定力', dc: 10,
          ok: { tx: '你把手插进兜里，靠着桌子。它说了很多话，你一句都没接。它有点烦了。', eff: { obs: -1, greed: -1 } },
          no: { tx: '你站了太久。你开始觉得它说的有道理。', eff: { hp: -1, greed: 2 } },
        },
      ],
    },
  ];

  const GAME = {
    title: '股神异闻录',
    chapter: '第一章 · 第七层',
    room: '三号厅',
    bg: ART + 'hall-night.jpg',
    name: '无名散户',
    ITEMS, ATTR_HINT, BEATS,

    newState() {
      return {
        hp: 6, hpMax: 10,
        greed: 0, greedMax: 10,
        chip: 3,
        attrs: { 胆量: 2, 洞察: 3, 定力: 1, 手速: 2, 运气: 1 },
        items: { refill: 2, stop: 1, peek: 1, flat: 0, short: 0, lever: 0 },
        beat: 0,
        obs: null,
        log: [],
      };
    },

    /** 掷一次 d20 并判定 */
    roll(state, act, forced) {
      const r = forced || (1 + Math.floor(Math.random() * 20));
      const mod = state.attrs[act.attr] || 0;
      const total = r + mod;
      const crit = r === 20, fumble = r === 1;
      const pass = crit ? true : fumble ? false : total >= act.dc;
      return { r, mod, total, dc: act.dc, attr: act.attr, crit, fumble, pass };
    },

    /** 把成败落成文本 + 数值变化 */
    outcome(state, act, res) {
      const branch = res.pass ? act.ok : act.no;
      const eff = Object.assign({}, branch.eff || {});
      if (res.crit && act.ok.crit) { if (eff.obs) eff.obs -= 1; if (!eff.chip) eff.chip = 1; }
      if (res.fumble) { eff.hp = (eff.hp || 0) - 1; eff.greed = (eff.greed || 0) + 1; }
      const text = res.crit && act.ok.crit ? act.ok.crit : branch.tx;
      return { text, eff, verdict: res.crit ? '大 成 功' : res.fumble ? '大 失 败' : res.pass ? '成 功' : '失 败' };
    },

    apply(state, eff) {
      if (eff.hp) state.hp = Math.max(0, Math.min(state.hpMax, state.hp + eff.hp));
      if (eff.greed) state.greed = Math.max(0, Math.min(state.greedMax, state.greed + eff.greed));
      if (eff.chip) state.chip = Math.max(0, state.chip + eff.chip);
      if (eff.obs && state.obs) state.obs.cur = Math.max(0, state.obs.cur + eff.obs);
    },

    effText(eff) {
      const out = [];
      if (eff.obs) out.push('执念 ' + (eff.obs > 0 ? '+' : '') + eff.obs);
      if (eff.hp) out.push('心态 ' + (eff.hp > 0 ? '+' : '') + eff.hp);
      if (eff.greed) out.push('贪婪 ' + (eff.greed > 0 ? '+' : '') + eff.greed);
      if (eff.chip) out.push('筹码 ' + (eff.chip > 0 ? '+' : '') + eff.chip);
      return out.join('   ·   ');
    },

    /** 结算这一段的结局，没有就是 null */
    ending(state) {
      if (state.hp <= 0) return { t: '你 成 了 异 闻', tone: 'bad', d: '心态归零。你坐下了 —— 坐在那个位置上。' };
      if (state.greed >= state.greedMax) return { t: '当 场 异 闻 化', tone: 'bad', d: '贪婪满了。你可以一直来了。' };
      if (state.obs && state.obs.cur <= 0) return { t: '它 散 了', tone: 'good', d: '执念归零。纸碎了一地，屋里只剩你一个人。' };
      if (state.beat >= BEATS.length) return { t: '这 一 段 走 完 了', tone: 'ok', d: '原型到这里。真游戏里，接下来是下一层 —— 那一层写着另一天。' };
      return null;
    },

    /** 播放小音效 */
    sfx(kind) {
      try {
        GAME._ac = GAME._ac || new (window.AudioContext || window.webkitAudioContext)();
        const ac = GAME._ac;
        const beep = (f, dur, type, gain, slide) => {
          const o = ac.createOscillator(), g = ac.createGain();
          o.type = type; o.frequency.setValueAtTime(f, ac.currentTime);
          if (slide) o.frequency.exponentialRampToValueAtTime(slide, ac.currentTime + dur);
          g.gain.setValueAtTime(gain, ac.currentTime);
          g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
          o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + dur + 0.02);
        };
        if (kind === 'tick') beep(1500 + Math.random() * 400, 0.015, 'square', 0.02);
        else if (kind === 'ok') { beep(784, 0.12, 'triangle', 0.07); beep(1046, 0.16, 'triangle', 0.05); }
        else if (kind === 'no') beep(180, 0.22, 'sawtooth', 0.08, 90);
        else if (kind === 'crit') [523, 659, 784, 1046, 1318].forEach((n, i) => setTimeout(() => beep(n, 0.22, 'triangle', 0.08), i * 70));
        else if (kind === 'click') beep(880, 0.05, 'square', 0.035);
      } catch (e) { /* 静音无所谓 */ }
    },
  };

  window.GAME = GAME;
})();
