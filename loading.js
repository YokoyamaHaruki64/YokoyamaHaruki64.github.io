// loading.js: 初期表示に必要な素材を待ち、ローディング画面を終了します。
(() => {
  "use strict";

  const root = document.documentElement;
  const loader = document.querySelector(".site-loader");
  if (!loader || !root.hasAttribute("data-site-loading")) return;

  const disc = loader.querySelector(".site-loader-disc");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const fillDurationMs = 180;
  const assetTimeoutMs = 1800;
  let progress = 0;

  function updateProgress(value) {
    progress = Math.min(value, 100);
    disc.style.setProperty("--loading-fill", progress * 3.6 + "deg");
  }

  function finishLoading() {
    if (!root.hasAttribute("data-site-loading")) return;
    delete root.dataset.siteLoading;
    document.dispatchEvent(new Event("portfolio:ready"));
  }

  // 着地を合図に波紋とフェードを同時に開始し、波紋が消えたら演出を終了する。
  loader.addEventListener("animationend", (event) => {
    const phase = root.dataset.siteLoading;
    if (phase === "drop" && event.animationName === "site-loader-drop") {
      root.dataset.siteLoading = "wave";
    } else if (phase === "wave" && event.animationName === "site-loader-wave") {
      finishLoading();
    }
  });

  function watchAsset(readiness, weight) {
    // 読めない素材も待機を終了する。表示はブラウザ側の代替画像やフォントに任せる。
    return Promise.resolve(readiness).catch(() => {}).then(() => {
      if (root.dataset.siteLoading === "progress") updateProgress(progress + weight);
    });
  }

  disc.style.setProperty("--loading-fill-duration", fillDurationMs + "ms");
  requestAnimationFrame(() => requestAnimationFrame(async () => {
    if (root.dataset.siteLoading !== "progress") return;
    updateProgress(25);
    const poster = document.querySelector(".hero-poster");
    const assets = Promise.all([
      watchAsset(poster?.decode(), 35),
      watchAsset(document.fonts?.ready, 40),
    ]);
    let deadline;
    const timeout = new Promise((resolve) => { deadline = window.setTimeout(resolve, assetTimeoutMs); });
    await Promise.race([assets, timeout]);
    window.clearTimeout(deadline);
    if (root.dataset.siteLoading !== "progress") return;

    updateProgress(100);
    if (reducedMotion.matches) {
      finishLoading();
      return;
    }
    window.setTimeout(() => {
      if (root.dataset.siteLoading === "progress") root.dataset.siteLoading = "drop";
    }, fillDurationMs);
  }));
})();
