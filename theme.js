(() => {
  "use strict";

  const storageKey = "portfolio-theme";
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  let preference = null;

  // 保存が禁止されている環境でも、そのページ内では切り替えられる
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") preference = saved;
  } catch {}

  function applyTheme() {
    const theme = preference ?? (systemTheme.matches ? "dark" : "light");
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = isDark ? "#15171e" : "#ffffff";

    const logo = document.querySelector(".brand-mark");
    if (logo) logo.src = `assets/favicon-${theme}.svg`;

    const button = document.querySelector("#theme-toggle");
    if (button) {
      const label = isDark ? "ライトテーマに切り替える" : "ダークテーマに切り替える";
      button.setAttribute("aria-label", label);
      button.setAttribute("aria-pressed", String(isDark));
      button.title = label;
    }
  }

  // スタイルの読み込み前に適用し、初回表示の白いちらつきを防ぐ
  applyTheme();

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    document.querySelector("#theme-toggle").addEventListener("click", () => {
      preference = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(storageKey, preference); } catch {}
      applyTheme();
    });
  });

  systemTheme.addEventListener("change", () => {
    if (preference === null) applyTheme();
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    preference = event.newValue === "light" || event.newValue === "dark" ? event.newValue : null;
    applyTheme();
  });
})();
