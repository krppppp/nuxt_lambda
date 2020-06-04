// Webviewとして機能するフォルダ全体のviewについて
// jsでユーザーからのイベントを抑制するファイル

/* "passive" が使えるかどうかを検出 */
var passiveSupported = false;
try {
  document.addEventListener(
    "test",
    null,
    Object.defineProperty({}, "passive", {
      get: function() {
        return (passiveSupported = true);
      }
    })
  );
} catch (err) {
  console.log("err :", err);
}

// 二本指でスームができる現象の抑制
document.addEventListener(
  "touchstart",
  event => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  },
  passiveSupported ? { passive: false } : false
);

// ダブルタップの抑制 (0.25秒設定)
let lastTouch = 0;
document.addEventListener(
  "touchend",
  event => {
    const now = window.performance.now();
    if (now - lastTouch <= 250) {
      event.preventDefault();
    }
    lastTouch = now;
  },
  passiveSupported ? { passive: false } : false
);
