(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const works = (window.PORTFOLIO_WORKS ?? [])
    .map((work, sourceOrder) => ({ work, sourceOrder }))
    .sort((a, b) => {
      const indexA = Number.isInteger(a.work.index) && a.work.index >= 0 ? a.work.index : Number.MAX_SAFE_INTEGER;
      const indexB = Number.isInteger(b.work.index) && b.work.index >= 0 ? b.work.index : Number.MAX_SAFE_INTEGER;
      return indexA - indexB || a.sourceOrder - b.sourceOrder;
    })
    .map(({ work }) => work);
  const stage = document.querySelector("#carousel-stage");
  const carousel = document.querySelector(".carousel");
  const detail = document.querySelector("#work-details");
  const dialog = document.querySelector("#work-dialog");
  const dialogContent = document.querySelector("#dialog-content");
  const previous = document.querySelector("#previous-work");
  const next = document.querySelector("#next-work");
  const slots = [];
  let current = 0;
  let target = 0;
  let centerStep = 0;
  let trackPosition = 0;
  let trackVelocity = 0;
  let moving = false;
  let previousFrameTime = 0;
  let gesture = null;
  let suppressClickUntil = 0;
  let dialogClosing = false;
  let dialogOpener = null;

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const wrapIndex = (index) => ((index % works.length) + works.length) % works.length;
  const number = (value) => String(value).padStart(2, "0");
  const workURL = (work) => {
    const url = new URL(window.location.href);
    url.searchParams.delete("preview");
    url.searchParams.set("work", work.id);
    url.hash = "works";
    return url;
  };
  const tags = (work) => (work.technologies ?? []).map((technology) => `<span class="tech-tag">${escapeHTML(technology)}</span>`).join("");
  const categoryTag = (work) => work.category ? `<p class="work-category">${escapeHTML(work.category)}</p>` : "";
  const sampleLabel = (work) => work.isSample ? '<p class="sample-note">仮作品</p>' : "";
  const medalLabels = { gold: "金賞", silver: "銀賞", bronze: "銅賞" };

  function awardsMarkup(awards) {
    if (!Array.isArray(awards)) return "";
    const entries = awards.filter((award) => typeof award?.competition === "string" && award.competition.trim());
    if (!entries.length) return "";

    return `<ul class="award-list">${entries.map((award) => {
      const medal = Object.hasOwn(medalLabels, award.medal) ? award.medal : "";
      const result = typeof award.result === "string" && award.result.trim() ? award.result : medalLabels[medal] || "受賞";
      const icon = medal ? `<svg class="award-medal-icon award-medal-icon--${medal}" viewBox="0 0 32 40" aria-hidden="true" focusable="false"><path class="award-ribbon" d="M6 2h8l4 13h-9L6 2Zm12 0h8l-3 13h-9l4-13Z"/><circle class="award-medal" cx="16" cy="25" r="10"/><path class="award-star" d="m16 18 2 4 4.5.7-3.2 3.1.8 4.4-4.1-2.1-4.1 2.1.8-4.4-3.2-3.1 4.5-.7 2-4Z"/></svg>` : "";
      const year = typeof award.year === "string" && award.year.trim() ? `<span class="award-year">${escapeHTML(award.year)}</span>` : "";
      return `<li class="award-item${medal ? ` award-item--${medal}` : ""}"><span class="award-copy"><span class="award-competition">${escapeHTML(award.competition)}</span>${year}</span><span class="award-result-group${medal ? ` award-result-group--${medal}` : ""}">${icon}<strong class="award-result">${escapeHTML(result)}</strong></span></li>`;
    }).join("")}</ul>`;
  }

  function safeURL(value, image = false) {
    try {
      const url = new URL(value, location.href);
      const allowed = ["https:", "http:"];
      if (image) allowed.push("file:");
      return allowed.includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function externalTarget(value) {
    try {
      return new URL(value, location.href).origin !== location.origin
        ? 'target="_blank" rel="noopener noreferrer"'
        : "";
    } catch {
      return "";
    }
  }

  function youtubeVideoId(value) {
    try {
      const url = new URL(value);
      const host = url.hostname.toLowerCase();
      if (!["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(host)) return "";

      let id = "";
      if (host === "youtu.be") id = url.pathname.split("/").filter(Boolean)[0] ?? "";
      else if (url.pathname === "/watch") id = url.searchParams.get("v") ?? "";
      else id = url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] ?? "";

      return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : "";
    } catch {
      return "";
    }
  }

  function workMedia(work) {
    const media = work.media;
    const imageURL = safeURL(work.image, true) || "assets/work-placeholder.svg";
    const imageAlt = escapeHTML(work.imageAlt || work.title);
    const title = escapeHTML(work.title);

    if (media?.type === "video") {
      const source = safeURL(media.src, true);
      if (source) {
        return `<video class="dialog-video" src="${escapeHTML(source)}" poster="${escapeHTML(imageURL)}" controls playsinline preload="metadata" aria-label="${title} の動画"></video>`;
      }
    }

    if (media?.type === "youtube") {
      const videoId = youtubeVideoId(media.url);
      if (videoId) {
        const youtubeURL = `https://www.youtube.com/watch?v=${videoId}`;
        return `<div class="dialog-video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=1&playsinline=1" title="${title} の動画" loading="eager" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><a class="text-link dialog-video-link" href="${youtubeURL}" target="_blank" rel="noopener noreferrer">YouTubeで見る <span aria-hidden="true">↗</span></a>`;
      }
    }

    return `<img class="dialog-image" src="${escapeHTML(imageURL)}" alt="${imageAlt}" width="960" height="540">`;
  }

  function hasPlayableMedia(work) {
    if (work.media?.type === "video") return Boolean(safeURL(work.media.src, true));
    if (work.media?.type === "youtube") return Boolean(youtubeVideoId(work.media.url));
    return false;
  }

  function setupImages(root) {
    root.querySelectorAll("img").forEach((image) => {
      image.addEventListener("error", () => {
        image.src = "assets/work-placeholder.svg";
        image.alt = "作品画像は準備中です";
      }, { once: true });
    });
  }

  function fillPanel(slot) {
    const workIndex = wrapIndex(centerStep + slot.position);
    if (slot.workIndex === workIndex) return;
    slot.workIndex = workIndex;
    const work = works[workIndex];
    const mediaBadge = hasPlayableMedia(work) ? "is-video" : "";
    const openIcon = hasPlayableMedia(work) ? "▶" : "↗";
    slot.element.innerHTML = `<span class="panel-heading"><span class="panel-title">${escapeHTML(work.title)}</span></span><span class="panel-image"><img src="${escapeHTML(safeURL(work.image, true) || "assets/work-placeholder.svg")}" alt="${escapeHTML(work.imageAlt || work.title)}" width="960" height="540" draggable="false"><span class="panel-open ${mediaBadge}" aria-hidden="true">${openIcon}</span></span>`;
    setupImages(slot.element);
  }

  function positionPanel(slot, drag = 0, fraction = trackPosition - centerStep) {
    const relativePosition = slot.position - fraction;
    const distance = Math.abs(relativePosition);
    const width = slot.element.offsetWidth;
    const scale = distance <= 1 ? 1 - distance * .28 : Math.max(.56, .72 - (distance - 1) * .16);
    const opacity = distance <= 1 ? 1 - distance * .58 : .42 * Math.max(0, 2 - distance);
    const x = relativePosition * width * .89 + drag;
    slot.element.style.transform = `translateX(calc(-50% + ${x}px)) scale(${scale})`;
    slot.element.style.opacity = String(opacity);
    slot.element.style.zIndex = String(Math.max(0, Math.round((2.5 - distance) * 10)));
    slot.element.style.pointerEvents = !moving && distance <= 1 ? "auto" : "none";
    slot.element.dataset.position = slot.position;
    slot.element.tabIndex = !moving && slot.position === 0 ? 0 : -1;
    slot.element.setAttribute("aria-hidden", String(distance > 1));
    slot.element.setAttribute("aria-label", `${works[wrapIndex(centerStep + slot.position)].title} ${slot.position === 0 ? "の詳細を開く" : "を選択"}`);
  }

  function renderDetails(animate = true) {
    const work = works[current];
    const awards = awardsMarkup(work.awards);
    detail.innerHTML = `<div class="work-summary">${categoryTag(work)}<h3>${escapeHTML(work.tagline || work.title)}</h3><p>${escapeHTML(work.summary)}</p><button class="text-link detail-link" type="button">作品詳細を見る <span class="circle-arrow" aria-hidden="true">↗</span></button></div><dl class="work-meta"><div><dt>担当</dt><dd>${escapeHTML(work.role)}</dd></div><div><dt>使用技術</dt><dd class="tech-tags">${tags(work)}</dd></div><div><dt>ポイント</dt><dd>${(work.points ?? []).map(escapeHTML).join("<br>")}</dd></div>${awards ? `<div><dt>受賞歴</dt><dd>${awards}</dd></div>` : ""}</dl>`;
    detail.querySelector("button").addEventListener("click", openDialog);
    if (animate && !reducedMotion.matches) {
      detail.getAnimations().forEach((animation) => animation.cancel());
      detail.animate([{ opacity: .25, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 400, easing: "cubic-bezier(.22,1,.36,1)" });
    }
    document.querySelector("#work-current").textContent = number(current + 1);
    document.querySelector("#carousel-status").textContent = `${works.length}作品中 ${current + 1}作品目、${work.title}`;
  }

  function goTo(index) {
    if (works.length < 2 || dialog.open) return;
    target = index;
    const destination = wrapIndex(target);
    if (destination !== current) {
      current = destination;
      renderDetails(!moving);
    }
    if (moving) return;

    moving = true;
    stage.setAttribute("aria-busy", "true");
    slots.forEach((slot) => {
      slot.element.classList.add("is-repositioning");
      positionPanel(slot);
    });
    if (reducedMotion.matches) {
      trackPosition = target;
      trackVelocity = 0;
      updatePanelWindow(Math.round(trackPosition));
      finishMovement();
      return;
    }
    previousFrameTime = 0;
    requestAnimationFrame(animateMovement);
  }

  function updatePanelWindow(nextCenterStep) {
    const shift = nextCenterStep - centerStep;
    if (!shift) return;
    centerStep = nextCenterStep;
    slots.forEach((slot) => {
      slot.position -= shift;
      while (slot.position < -2) slot.position += 5;
      while (slot.position > 2) slot.position -= 5;
      fillPanel(slot);
    });
  }

  function finishMovement() {
    trackPosition = target;
    trackVelocity = 0;
    updatePanelWindow(target);
    moving = false;
    stage.removeAttribute("aria-busy");
    slots.forEach((slot) => {
      slot.element.classList.remove("is-repositioning");
      positionPanel(slot, 0, 0);
    });
  }

  function animateMovement(time) {
    if (!moving) return;
    const deltaTime = previousFrameTime ? Math.min((time - previousFrameTime) / 1000, .032) : 1 / 60;
    previousFrameTime = time;

    // 目標が更新されても開始時刻を戻さず、現在の速度を保って追従します。
    trackVelocity += (target - trackPosition) * 180 * deltaTime;
    trackVelocity *= Math.exp(-25 * deltaTime);
    trackVelocity = Math.max(-6, Math.min(6, trackVelocity));
    trackPosition += trackVelocity * deltaTime;

    updatePanelWindow(Math.round(trackPosition));
    const fraction = trackPosition - centerStep;
    slots.forEach((slot) => positionPanel(slot, 0, fraction));

    if (Math.abs(target - trackPosition) < .003 && Math.abs(trackVelocity) < .025) {
      finishMovement();
      return;
    }
    requestAnimationFrame(animateMovement);
  }

  function nearestTarget(index) {
    const destination = wrapIndex(index);
    const cycle = Math.round((target - destination) / works.length);
    return destination + cycle * works.length;
  }

  function openDialog(event, updateURL = true) {
    if (moving || dialog.open || !works.length) return;
    const work = works[current];
    dialogOpener = event?.currentTarget ?? slots.find((slot) => slot.position === 0)?.element ?? document.activeElement;
    clearTimeout(shareStatusTimer);
    shareStatus.classList.remove("is-visible");
    shareStatus.textContent = "";
    if (updateURL) {
      history.pushState({ ...(history.state ?? {}), portfolioWork: work.id }, "", workURL(work));
    }
    const links = (work.links ?? []).filter((link) => safeURL(link.url));
    const downloads = (work.downloads ?? []).filter((item) => typeof item.url === "string" && item.url.trim() && safeURL(item.url, true));
    const awards = awardsMarkup(work.awards);
    dialogContent.innerHTML = `
      ${sampleLabel(work)}
      <h2 id="dialog-title" class="dialog-title">${escapeHTML(work.title)}</h2>
      ${categoryTag(work)}
      <p class="dialog-summary">${escapeHTML(work.summary)}</p>
      ${workMedia(work)}
      <dl class="work-meta dialog-facts">
        <div><dt>担当</dt><dd>${escapeHTML(work.role)}</dd></div>
        <div><dt>使用技術</dt><dd class="tech-tags">${tags(work)}</dd></div>
        <div><dt>制作期間</dt><dd>${escapeHTML(work.period || "未設定")}</dd></div>
        <div><dt>開発体制</dt><dd>${escapeHTML(work.team || "未設定")}</dd></div>
        <div><dt>対象環境</dt><dd>${escapeHTML(work.platform || "未設定")}</dd></div>
        ${awards ? `<div><dt>受賞歴</dt><dd>${awards}</dd></div>` : ""}
      </dl>
      <section class="dialog-block">
        <h3>作品のポイント</h3>
        <ul>${(work.points ?? []).map((point) => `<li>${escapeHTML(point)}</li>`).join("")}</ul>
      </section>
      ${(work.details ?? []).map((block) => `<section class="dialog-block"><h3>${escapeHTML(block.heading)}</h3><p>${escapeHTML(block.text)}</p></section>`).join("")}
      ${downloads.length ? `<section class="dialog-block"><h3>ダウンロード</h3><div class="dialog-downloads">${downloads.map((item) => { const url = safeURL(item.url, true); return `<a class="download-link" href="${escapeHTML(url)}" ${externalTarget(url)} download="${escapeHTML(item.filename ?? "")}"><span aria-hidden="true">↓</span>${escapeHTML(item.label || "実行ファイルをダウンロード")}</a>`; }).join("")}</div></section>` : ""}
      ${links.length ? `<div class="dialog-block dialog-links">${links.map((link) => `<a class="text-link" href="${escapeHTML(safeURL(link.url))}" target="_blank" rel="noopener noreferrer">${escapeHTML(link.label)} <span aria-hidden="true">↗</span></a>`).join("")}</div>` : ""}
    `;
    setupImages(dialogContent);
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.classList.add("modal-open");
    dialog.showModal();
    dialog.scrollTop = 0;
    void dialog.offsetWidth;
    dialog.classList.add("is-open");
    dialog.querySelector(".dialog-close").focus({ preventScroll: true });
  }

  function showWorkFromURL() {
    const requestedId = new URL(window.location.href).searchParams.get("work");
    if (!requestedId) {
      closeDialog(true);
      return;
    }

    const workIndex = works.findIndex((work) => work.id === requestedId);
    if (workIndex < 0) {
      const url = new URL(window.location.href);
      url.searchParams.delete("work");
      history.replaceState(history.state, "", url);
      closeDialog(true);
      return;
    }
    if (dialog.open) return;

    current = workIndex;
    target = workIndex;
    trackPosition = workIndex;
    trackVelocity = 0;
    updatePanelWindow(workIndex);
    slots.forEach((slot) => positionPanel(slot, 0, 0));
    renderDetails(false);
    openDialog(undefined, false);
  }

  function closeDialog(fromHistory = false) {
    if (dialogClosing || !dialog.open) return;
    dialogClosing = true;
    dialog.classList.remove("is-open");
    dialogContent.querySelectorAll("video").forEach((video) => video.pause());
    dialogContent.querySelectorAll("iframe").forEach((frame) => { frame.src = "about:blank"; });
    if (!fromHistory) {
      const url = new URL(window.location.href);
      const workId = url.searchParams.get("work");
      if (workId && history.state?.portfolioWork === workId) history.back();
      else if (workId) {
        url.searchParams.delete("work");
        history.replaceState(history.state, "", url);
      }
    }
    window.setTimeout(() => {
      dialog.close();
      document.body.classList.remove("modal-open");
      document.body.style.paddingRight = "";
      dialogOpener?.focus({ preventScroll: true });
      dialogClosing = false;
    }, reducedMotion.matches ? 0 : 280);
  }

  dialog.querySelector(".dialog-close").addEventListener("click", () => closeDialog());
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeDialog(); });
  window.addEventListener("popstate", showWorkFromURL);

  async function copyShareURL(url) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        return true;
      } catch {}
    }

    const field = document.createElement("textarea");
    field.value = url;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    return copied;
  }

  const shareButton = dialog.querySelector(".dialog-share");
  const shareStatus = dialog.querySelector(".dialog-share-status");
  let shareStatusTimer;
  shareButton.addEventListener("click", async () => {
    const work = works[current];
    const url = workURL(work).href;
    const copied = await copyShareURL(url);
    shareStatus.textContent = copied ? "リンクをコピーしました！" : "コピーに失敗しました";
    shareStatus.classList.add("is-visible");
    clearTimeout(shareStatusTimer);
    shareStatusTimer = window.setTimeout(() => {
      shareStatus.classList.remove("is-visible");
    }, 2400);
  });

  let backdropPressed = false;
  const outsideDialog = (event) => {
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  };
  dialog.addEventListener("pointerdown", (event) => { backdropPressed = outsideDialog(event); });
  dialog.addEventListener("click", (event) => { if (backdropPressed && outsideDialog(event)) closeDialog(); });

  if (works.length) {
    const positions = works.length === 1 ? [0] : [-2, -1, 0, 1, 2];
    positions.forEach((position) => {
      const element = document.createElement("button");
      element.type = "button";
      element.className = "work-panel";
      const slot = { element, position };
      slots.push(slot);
      fillPanel(slot);
      stage.append(element);
      positionPanel(slot);
      element.addEventListener("click", (event) => {
        if (performance.now() < suppressClickUntil || moving) return;
        if (slot.position === 0) openDialog(event);
        else goTo(centerStep + slot.position);
      });
    });
    renderDetails(false);
  } else {
    detail.textContent = "作品は準備中です。";
    document.querySelector("#work-current").textContent = "00";
  }
  previous.disabled = next.disabled = works.length < 2;
  document.querySelector("#work-total").textContent = number(works.length);
  if (works.length) {
    const heroImage = document.querySelector(".hero-visual img");
    heroImage.src = safeURL(works[0].image, true) || "assets/work-placeholder.svg";
    heroImage.alt = works[0].imageAlt || works[0].title;
    document.querySelector(".hero-image-note").textContent = works[0].isSample ? "仮作品のイメージ" : works[0].title;
  }
  setupImages(document.querySelector(".hero-visual"));
  const sampleCount = works.filter((work) => work.isSample).length;
  const collectionLabel = document.querySelector("#collection-label");
  collectionLabel.hidden = sampleCount === 0;
  collectionLabel.textContent = sampleCount === works.length ? "掲載中の作品は仮データです。" : "仮作品を含みます。";
  previous.addEventListener("click", () => goTo(target - 1));
  next.addEventListener("click", () => goTo(target + 1));
  carousel.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") goTo(nearestTarget(0));
    else if (event.key === "End") goTo(nearestTarget(works.length - 1));
    else goTo(target + (event.key === "ArrowRight" ? 1 : -1));
  });

  stage.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0 || moving || works.length < 2) return;
    const centerPanel = slots.find((slot) => slot.position === 0);
    const stepWidth = (centerPanel?.element.offsetWidth ?? stage.clientWidth) * .89;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, startPosition: target, stepWidth, dragging: false };
  });
  stage.addEventListener("pointermove", (event) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.dragging && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) { gesture = null; return; }
    if (!gesture.dragging && Math.abs(dx) > 8) {
      gesture.dragging = true;
      stage.setPointerCapture(event.pointerId);
      stage.classList.add("is-dragging");
      slots.forEach((slot) => slot.element.classList.add("is-repositioning"));
    }
    if (gesture.dragging) {
      gesture.dx = dx;
      trackPosition = gesture.startPosition - dx / gesture.stepWidth;
      updatePanelWindow(Math.round(trackPosition));
      slots.forEach((slot) => positionPanel(slot, 0, trackPosition - centerStep));
    }
  });

  function endGesture(event) {
    if (!gesture || gesture.id !== event.pointerId) return;
    const completed = gesture;
    gesture = null;
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    stage.classList.remove("is-dragging");
    if (completed.dragging) {
      suppressClickUntil = performance.now() + 400;
      if (event.type === "pointerup") completed.dx = event.clientX - completed.x;
      trackPosition = completed.startPosition - completed.dx / completed.stepWidth;
      updatePanelWindow(Math.round(trackPosition));
      slots.forEach((slot) => positionPanel(slot, 0, trackPosition - centerStep));

      const threshold = Math.min(60, stage.clientWidth * .1);
      const shouldAdvance = event.type === "pointerup" && Math.abs(completed.dx) > threshold;
      const steps = shouldAdvance ? Math.max(1, Math.round(Math.abs(completed.dx) / completed.stepWidth)) : 0;
      const destination = completed.startPosition + (completed.dx < 0 ? steps : -steps);

      // 解放位置から、現在または移動先の作品中央へ吸着させます。
      goTo(destination);
    } else {
      slots.forEach((slot) => slot.element.classList.remove("is-repositioning"));
    }
  }

  stage.addEventListener("pointerup", endGesture);
  stage.addEventListener("pointercancel", endGesture);
  // タッチの暗黙キャプチャを子画像から移す際のイベントは終了扱いにしません。
  stage.addEventListener("lostpointercapture", (event) => {
    if (event.target === stage) endGesture(event);
  });
  stage.addEventListener("dragstart", (event) => event.preventDefault());
  // 題名の折り返しや画面幅の変化にも追従し、操作ボタンとの重なりを防ぎます。
  const panelObserver = new ResizeObserver(() => {
    if (slots.length) stage.style.height = `${Math.max(...slots.map((slot) => slot.element.offsetHeight)) + 8}px`;
    slots.forEach((slot) => positionPanel(slot));
  });
  panelObserver.observe(stage);
  slots.forEach((slot) => panelObserver.observe(slot.element));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("is-pending");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("is-pending");
      observer.observe(element);
    });
  }

  const sections = [...document.querySelectorAll("main > section[id]")];
  const navLinks = [...document.querySelectorAll(".nav a")];
  const nav = document.querySelector("#site-nav");
  const menuToggle = document.querySelector("#menu-toggle");
  const progress = document.querySelector(".reading-progress");
  let scrollQueued = false;

  function closeNavigationMenu(restoreFocus = false) {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "メニューを開く");
    if (restoreFocus) menuToggle.focus();
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    nav.classList.toggle("is-open", !isOpen);
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "メニューを開く" : "メニューを閉じる");
  });

  navLinks.forEach((link) => link.addEventListener("click", () => closeNavigationMenu(true)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeNavigationMenu(true);
    }
  });
  document.addEventListener("click", (event) => {
    if (menuToggle.getAttribute("aria-expanded") === "true" && !nav.contains(event.target) && !menuToggle.contains(event.target)) {
      closeNavigationMenu();
    }
  });

  function updateScroll() {
    if (window.innerWidth > 700 && menuToggle.getAttribute("aria-expanded") === "true") closeNavigationMenu();
    const headerHeight = document.querySelector(".site-header").offsetHeight;
    let active = sections[0].id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= headerHeight + 100) active = section.id;
    }
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0 && window.scrollY >= maxScroll - 5) active = sections.at(-1).id;
    navLinks.forEach((link) => {
      if (link.hash === `#${active}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    progress.style.transform = `scaleX(${maxScroll > 0 ? window.scrollY / maxScroll : 0})`;
    scrollQueued = false;
  }

  window.addEventListener("scroll", () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  window.addEventListener("resize", updateScroll);
  const copyrightYear = document.querySelector("#copyright-year");
  if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();
  const initialWorkId = new URL(window.location.href).searchParams.get("work");
  if (initialWorkId && history.state?.portfolioWork === initialWorkId) {
    const state = { ...history.state };
    delete state.portfolioWork;
    history.replaceState(state, "", window.location.href);
  }
  showWorkFromURL();
  updateScroll();
})();
