(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const works = window.PORTFOLIO_WORKS ?? [];
  const stage = document.querySelector("#carousel-stage");
  const carousel = document.querySelector(".carousel");
  const detail = document.querySelector("#work-details");
  const pagination = document.querySelector("#carousel-pagination");
  const dialog = document.querySelector("#work-dialog");
  const dialogContent = document.querySelector("#dialog-content");
  const previous = document.querySelector("#previous-work");
  const next = document.querySelector("#next-work");
  const slots = [];
  let current = 0;
  let target = 0;
  let preferredDirection = 1;
  let moving = false;
  let gesture = null;
  let suppressClickUntil = 0;
  let dialogClosing = false;
  let dialogOpener = null;

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const wrapIndex = (index) => ((index % works.length) + works.length) % works.length;
  const number = (value) => String(value).padStart(2, "0");
  const tags = (work) => (work.technologies ?? []).map((technology) => `<span class="tech-tag">${escapeHTML(technology)}</span>`).join("");
  const sampleLabel = (work) => work.isSample ? "SAMPLE PROJECT / 仮作品" : "PROJECT";

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

  function setupImages(root) {
    root.querySelectorAll("img").forEach((image) => {
      image.addEventListener("error", () => {
        image.src = "assets/work-placeholder.svg";
        image.alt = "作品画像は準備中です";
      }, { once: true });
    });
  }

  function fillPanel(slot) {
    const work = works[wrapIndex(current + slot.position)];
    slot.element.innerHTML = `<span class="panel-heading"><span class="panel-title">${escapeHTML(work.title)}</span><span class="panel-category">${escapeHTML(work.category)}</span></span><span class="panel-image"><img src="${escapeHTML(safeURL(work.image, true) || "assets/work-placeholder.svg")}" alt="${escapeHTML(work.imageAlt || work.title)}" width="960" height="540" draggable="false"><span class="panel-open" aria-hidden="true">↗</span></span>`;
    setupImages(slot.element);
  }

  function positionPanel(slot, drag = 0) {
    const distance = Math.abs(slot.position);
    const width = slot.element.offsetWidth;
    const scale = distance === 0 ? 1 : distance === 1 ? .72 : .56;
    const x = slot.position * width * .89 + drag;
    slot.element.style.transform = `translateX(calc(-50% + ${x}px)) scale(${scale})`;
    slot.element.style.opacity = distance === 0 ? "1" : distance === 1 ? ".42" : "0";
    slot.element.style.zIndex = distance === 0 ? "3" : distance === 1 ? "2" : "0";
    slot.element.style.pointerEvents = distance <= 1 ? "auto" : "none";
    slot.element.dataset.position = slot.position;
    slot.element.tabIndex = distance === 0 ? 0 : -1;
    slot.element.setAttribute("aria-hidden", String(distance > 1));
    slot.element.setAttribute("aria-label", `${works[wrapIndex(current + slot.position)].title} ${distance === 0 ? "の詳細を開く" : "を選択"}`);
  }

  function renderDetails(animate = true) {
    const work = works[current];
    detail.innerHTML = `<div class="work-summary"><p class="eyebrow">${number(current + 1)} / ${sampleLabel(work)}</p><h3>${escapeHTML(work.tagline || work.title)}</h3><p>${escapeHTML(work.summary)}</p><button class="text-link detail-link" type="button">詳しく見る <span class="circle-arrow" aria-hidden="true">↗</span></button></div><dl class="work-meta"><div><dt>担当</dt><dd>${escapeHTML(work.role)}</dd></div><div><dt>使用技術</dt><dd class="tech-tags">${tags(work)}</dd></div><div><dt>ポイント</dt><dd>${(work.points ?? []).map(escapeHTML).join("<br>")}</dd></div></dl>`;
    detail.querySelector("button").addEventListener("click", openDialog);
    if (animate && !reducedMotion.matches) {
      detail.getAnimations().forEach((animation) => animation.cancel());
      detail.animate([{ opacity: .25, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 400, easing: "cubic-bezier(.22,1,.36,1)" });
    }
    document.querySelector("#work-current").textContent = number(current + 1);
    document.querySelector("#carousel-status").textContent = `${works.length}作品中 ${current + 1}作品目、${work.title}`;
    [...pagination.children].forEach((button, index) => button.setAttribute("aria-current", String(index === current)));
  }

  function goTo(index) {
    if (works.length < 2 || dialog.open) return;
    preferredDirection = index < target ? -1 : 1;
    target = wrapIndex(index);
    if (!moving) moveTowardTarget();
  }

  function moveTowardTarget() {
    if (current === target) return;
    moving = true;
    const distance = wrapIndex(target - current);
    const direction = distance === works.length / 2 ? preferredDirection : distance < works.length / 2 ? 1 : -1;
    current = wrapIndex(current + direction);
    slots.forEach((slot) => {
      slot.position -= direction;
      positionPanel(slot);
    });
    renderDetails();

    // 画面外に抜けたパネルだけ反対側へ移し、ループ境界での逆走を防ぎます。
    window.setTimeout(() => {
      slots.forEach((slot) => {
        if (Math.abs(slot.position) > 2) {
          slot.position = direction > 0 ? 2 : -2;
          slot.element.classList.add("is-repositioning");
          fillPanel(slot);
          positionPanel(slot);
          void slot.element.offsetWidth;
          slot.element.classList.remove("is-repositioning");
        }
      });
      moving = false;
      moveTowardTarget();
    }, reducedMotion.matches ? 0 : 680);
  }

  function openDialog(event) {
    if (moving || dialog.open || !works.length) return;
    const work = works[current];
    dialogOpener = event?.currentTarget ?? document.activeElement;
    const links = (work.links ?? []).filter((link) => safeURL(link.url));
    dialogContent.innerHTML = `<p class="eyebrow">${sampleLabel(work)}</p><h2 id="dialog-title" class="dialog-title">${escapeHTML(work.title)}</h2><p class="dialog-summary">${escapeHTML(work.summary)}</p><img class="dialog-image" src="${escapeHTML(safeURL(work.image, true) || "assets/work-placeholder.svg")}" alt="${escapeHTML(work.imageAlt || work.title)}" width="960" height="540"><dl class="work-meta dialog-facts"><div><dt>担当</dt><dd>${escapeHTML(work.role)}</dd></div><div><dt>使用技術</dt><dd class="tech-tags">${tags(work)}</dd></div><div><dt>制作期間</dt><dd>${escapeHTML(work.period || "未設定")}</dd></div><div><dt>開発体制</dt><dd>${escapeHTML(work.team || "未設定")}</dd></div><div><dt>対象環境</dt><dd>${escapeHTML(work.platform || "未設定")}</dd></div></dl><section class="dialog-block"><h3>作品のポイント</h3><ul>${(work.points ?? []).map((point) => `<li>${escapeHTML(point)}</li>`).join("")}</ul></section>${(work.details ?? []).map((block) => `<section class="dialog-block"><h3>${escapeHTML(block.heading)}</h3><p>${escapeHTML(block.text)}</p></section>`).join("")}${links.length ? `<div class="dialog-block dialog-links">${links.map((link) => `<a class="text-link" href="${escapeHTML(safeURL(link.url))}" target="_blank" rel="noopener noreferrer">${escapeHTML(link.label)} <span aria-hidden="true">↗</span></a>`).join("")}</div>` : ""}`;
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

  function closeDialog() {
    if (dialogClosing || !dialog.open) return;
    dialogClosing = true;
    dialog.classList.remove("is-open");
    window.setTimeout(() => {
      dialog.close();
      document.body.classList.remove("modal-open");
      document.body.style.paddingRight = "";
      dialogOpener?.focus({ preventScroll: true });
      dialogClosing = false;
    }, reducedMotion.matches ? 0 : 280);
  }

  dialog.querySelector(".dialog-close").addEventListener("click", closeDialog);
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeDialog(); });
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
        else goTo(current + slot.position);
      });
    });
    works.forEach((work, index) => {
      const button = document.createElement("button");
      button.className = "pagination-dot";
      button.type = "button";
      button.setAttribute("aria-label", `${work.title}を表示`);
      button.addEventListener("click", () => goTo(index));
      pagination.append(button);
    });
    renderDetails(false);
  } else {
    detail.textContent = "作品は準備中です。";
    document.querySelector("#work-current").textContent = "00";
  }
  previous.disabled = next.disabled = works.length < 2;
  document.querySelector("#work-total").textContent = number(works.length);
  document.querySelector(".visual-topline > span:last-child").textContent = `${works.length ? "01" : "00"} — ${number(works.length)}`;
  if (works.length) {
    const heroImage = document.querySelector(".hero-visual img");
    heroImage.src = safeURL(works[0].image, true) || "assets/work-placeholder.svg";
    heroImage.alt = works[0].imageAlt || works[0].title;
    document.querySelector(".visual-caption .tiny-label").innerHTML = `${works[0].isSample ? "SAMPLE VISUAL" : "PROJECT PREVIEW"} <span aria-hidden="true">↗</span>`;
  }
  setupImages(document.querySelector(".hero-visual"));
  const sampleCount = works.filter((work) => work.isSample).length;
  document.querySelector("#collection-label").textContent = sampleCount === works.length && sampleCount ? `DEMO COLLECTION / 仮作品${sampleCount}件` : `PROJECT COLLECTION / ${works.length}作品`;
  previous.addEventListener("click", () => goTo(target - 1));
  next.addEventListener("click", () => goTo(target + 1));
  carousel.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") goTo(0);
    else if (event.key === "End") goTo(works.length - 1);
    else goTo(target + (event.key === "ArrowRight" ? 1 : -1));
  });

  stage.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0 || moving || works.length < 2) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, dragging: false };
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
      const limit = stage.clientWidth * .25;
      slots.forEach((slot) => positionPanel(slot, Math.max(-limit, Math.min(limit, dx))));
    }
  });

  function endGesture(event) {
    if (!gesture || gesture.id !== event.pointerId) return;
    const completed = gesture;
    gesture = null;
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    stage.classList.remove("is-dragging");
    slots.forEach((slot) => slot.element.classList.remove("is-repositioning"));
    if (completed.dragging) {
      suppressClickUntil = performance.now() + 400;
      if (event.type === "pointerup" && Math.abs(completed.dx) > Math.min(60, stage.clientWidth * .1)) goTo(current + (completed.dx < 0 ? 1 : -1));
      else slots.forEach((slot) => positionPanel(slot));
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
  const progress = document.querySelector(".reading-progress");
  let scrollQueued = false;

  function updateScroll() {
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
  document.querySelector("#copyright-year").textContent = new Date().getFullYear();
  updateScroll();
})();
