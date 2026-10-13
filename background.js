(() => {
  "use strict";

  const main = document.querySelector("main");
  if (!main) return;

  const settings = {
    // 配置・配色
    seed: 0x48594f59,
    compactWidth: 700,
    rowSpacing: 520,
    columnSpacing: 480,
    density: .8,
    minimumGap: 48,
    compactMinimumGap: 24,
    driftDistance: 52,
    compactDriftDistance: 32,
    placementCandidates: 64,
    ringSizeMinimum: 110,
    ringSizeRange: 110,
    compactRingSizeMinimum: 80,
    compactRingSizeRange: 65,
    ringWidthRatio: .075,
    colors: ["--cyan", "--ring-green", "--ring-yellow"],

    // 漂いの周期は秒単位
    driftDurationMinimum: 6,
    driftDurationRange: 7,
    driftDistanceMinimumRatio: .7,

    // 波紋のサイズ・太さはpx、時間はms単位
    rippleSize: 160,
    compactRippleSize: 128,
    rippleWidth: 8,
    rippleScaleRandomRange: { min: .8, max: 1.2 },
    rippleDuration: 800,
    rippleStartScale: .08,
    rippleEndScale: 1.65,
    rippleOpacity: .28,
    rippleEasing: "cubic-bezier(.16, 1, .3, 1)",

    // クリック・タップとドラッグ・長押しを区別する閾値
    pointerMovementThreshold: 8,
    maximumPressDuration: 600,
  };
  const layer = document.createElement("div");
  layer.className = "background-rings";
  layer.setAttribute("aria-hidden", "true");
  main.prepend(layer);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const rippleLayer = document.createElement("div");
  rippleLayer.className = "click-rings";
  rippleLayer.setAttribute("aria-hidden", "true");
  main.append(rippleLayer);
  const activeRipples = new Map();
  const rippleRandom = seededRandom(settings.seed ^ 0x72697070);
  let press = null;

  let previousWidth = 0;
  let previousHeight = 0;
  let frame = 0;

  function seededRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      return (state >>> 0) / 4294967296;
    };
  }

  function randomRange(range, random) {
    return range.min + (range.max - range.min) * random();
  }

  function renderRings() {
    frame = 0;
    const width = main.clientWidth;
    const height = main.offsetHeight;
    if (width === previousWidth && height === previousHeight) return;
    previousWidth = width;
    previousHeight = height;

    const random = seededRandom(settings.seed);
    const driftRandom = seededRandom(settings.seed ^ 0x64726966);
    const compact = width <= settings.compactWidth;
    const columns = Math.max(2, Math.min(4, Math.round(width / settings.columnSpacing)));
    const rows = Math.max(1, Math.ceil(height / settings.rowSpacing));
    const count = Math.max(1, Math.round(rows * columns * settings.density));
    const driftDistance = compact ? settings.compactDriftDistance : settings.driftDistance;
    const gap = (compact ? settings.compactMinimumGap : settings.minimumGap) + driftDistance * 2;
    const fragment = document.createDocumentFragment();
    const placed = [];

    // 全域から候補を選び、既存のリングから最も余裕がある位置で偏りを抑える
    for (let index = 0; index < count; index++) {
      const size = Math.round((compact ? settings.compactRingSizeMinimum : settings.ringSizeMinimum) + random() * (compact ? settings.compactRingSizeRange : settings.ringSizeRange));
      let best = null;
      for (let attempt = 0; attempt < (placed.length ? settings.placementCandidates : 1); attempt++) {
        const x = random() * width;
        const y = 24 + random() * Math.max(0, height - 48);
        const clearance = placed.reduce((nearest, ring) => Math.min(nearest, Math.hypot(x - ring.x, y - ring.y) - (size + ring.size) / 2), Infinity);
        if (!best || clearance > best.clearance) best = { x, y, clearance };
      }
      if (best.clearance < gap) continue;
      const { x, y } = best;
      placed.push({ x, y, size });
      const color = settings.colors[Math.floor(random() * settings.colors.length)];

      const ring = document.createElement("span");
      ring.className = "background-ring";
      ring.style.left = `${(x - size / 2).toFixed(2)}px`;
      ring.style.top = `${(y - size / 2).toFixed(2)}px`;
      ring.style.setProperty("--ring-size", `${size}px`);
      ring.style.setProperty("--ring-width", `${Math.round(size * settings.ringWidthRatio)}px`);
      ring.style.setProperty("--ring-color", `var(${color})`);
      const angle = driftRandom() * Math.PI * 2;
      const distance = driftDistance * (settings.driftDistanceMinimumRatio + driftRandom() * (1 - settings.driftDistanceMinimumRatio));
      const duration = settings.driftDurationMinimum + driftRandom() * settings.driftDurationRange;
      ring.style.setProperty("--drift-x", `${(Math.cos(angle) * distance).toFixed(2)}px`);
      ring.style.setProperty("--drift-y", `${(Math.sin(angle) * distance).toFixed(2)}px`);
      ring.style.setProperty("--drift-duration", `${duration.toFixed(2)}s`);
      ring.style.setProperty("--drift-delay", `${(-driftRandom() * duration * 2).toFixed(2)}s`);
      fragment.append(ring);
    }
    layer.replaceChildren(fragment);
  }

  function clearRipples() {
    for (const [ring, animation] of activeRipples) {
      animation.cancel();
      ring.remove();
    }
    activeRipples.clear();
  }

  function showRipple(x, y) {
    if (reducedMotion.matches || document.hidden) return;

    const ring = document.createElement("span");
    ring.className = "click-ring";
    const mainBounds = main.getBoundingClientRect();
    ring.style.left = `${x - mainBounds.left}px`;
    ring.style.top = `${y - mainBounds.top}px`;
    ring.style.setProperty("--ripple-size", `${window.innerWidth <= settings.compactWidth ? settings.compactRippleSize : settings.rippleSize}px`);
    ring.style.setProperty("--ripple-width", `${settings.rippleWidth}px`);
    ring.style.setProperty("--ripple-scale", `${randomRange(settings.rippleScaleRandomRange, rippleRandom)}`);
    ring.style.setProperty("--ring-color", `var(${settings.colors[Math.floor(rippleRandom() * settings.colors.length)]})`);
    rippleLayer.append(ring);

    const animation = ring.animate([
      { transform: `translate(-50%, -50%) scale(${settings.rippleStartScale})`, opacity: settings.rippleOpacity },
      { transform: `translate(-50%, -50%) scale(${settings.rippleEndScale})`, opacity: 0 },
    ], { duration: settings.rippleDuration, easing: settings.rippleEasing });
    const remove = () => {
      activeRipples.delete(ring);
      ring.remove();
    };
    animation.onfinish = remove;
    animation.oncancel = remove;
    activeRipples.set(ring, animation);
  }

  // 操作を妨げず、ドラッグ・スクロール・長押しを波紋の対象から除く
  document.addEventListener("pointerdown", event => {
    press = null;
    if (reducedMotion.matches || !event.isPrimary || event.button !== 0 || event.target.closest("dialog") || document.body.classList.contains("modal-open")) return;
    press = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now() };
  }, { capture: true, passive: true });

  document.addEventListener("pointermove", event => {
    if (press && event.pointerId === press.id && Math.hypot(event.clientX - press.x, event.clientY - press.y) > settings.pointerMovementThreshold) press = null;
  }, { capture: true, passive: true });

  document.addEventListener("pointerup", event => {
    const completed = press;
    press = null;
    if (!completed || event.pointerId !== completed.id || performance.now() - completed.time > settings.maximumPressDuration) return;
    if (Math.hypot(event.clientX - completed.x, event.clientY - completed.y) > settings.pointerMovementThreshold) return;
    showRipple(event.clientX, event.clientY);
  }, { capture: true, passive: true });

  const cancelPress = () => { press = null; };
  document.addEventListener("pointercancel", cancelPress, { capture: true, passive: true });
  document.addEventListener("scroll", cancelPress, { capture: true, passive: true });
  document.addEventListener("contextmenu", cancelPress, { capture: true });
  window.addEventListener("blur", cancelPress);

  document.addEventListener("visibilitychange", () => {
    layer.classList.toggle("is-paused", document.hidden);
    if (document.hidden) {
      cancelPress();
      clearRipples();
    }
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      cancelPress();
      clearRipples();
    }
  });
  layer.classList.toggle("is-paused", document.hidden);

  // 内容追加や画像読み込みでページの長さが変わった場合も分布を更新する
  const observer = new ResizeObserver(() => {
    if (!frame) frame = requestAnimationFrame(renderRings);
  });
  observer.observe(main);
  renderRings();
})();
