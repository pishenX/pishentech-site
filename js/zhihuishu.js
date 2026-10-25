/* ==========================================================================
   zhihuishu.js —— 详情页终端演示
   只是视觉演示，不会连接任何服务
   ========================================================================== */

(function () {
  "use strict";

  const terminal = document.querySelector("[data-terminal]");
  const lines = Array.from(document.querySelectorAll("[data-term-line]"));
  const replay = document.querySelector("[data-demo-replay]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer = null;

  if (!lines.length) return;

  function showAll() {
    if (terminal) terminal.classList.remove("is-animating");
    lines.forEach((line) => line.classList.add("is-on"));
  }

  function play() {
    window.clearTimeout(timer);

    if (reduceMotion || !terminal) {
      showAll();
      return;
    }

    terminal.classList.add("is-animating");
    lines.forEach((line) => line.classList.remove("is-on"));
    let index = 0;

    function step() {
      if (index >= lines.length) {
        terminal.classList.remove("is-animating");
        return;
      }
      lines[index].classList.add("is-on");
      index += 1;
      timer = window.setTimeout(step, 420);
    }

    step();
  }

  if (replay) {
    replay.addEventListener("click", play);
  }

  // 首次打开直接展示完整日志，点击“重播演示”才逐行播放
  showAll();
})();
