(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sourceWorks = window.PORTFOLIO_WORKS ?? [];
  function sortWorks(order) {
    const indexKey = order === "chronological" ? "chronologicalIndex" : "index";
    return sourceWorks
      .map((work, sourceOrder) => ({ work, sourceOrder }))
      .sort((a, b) => {
        const hasIndexA = Number.isInteger(a.work[indexKey]) && a.work[indexKey] >= 0;
        const hasIndexB = Number.isInteger(b.work[indexKey]) && b.work[indexKey] >= 0;
        if (hasIndexA !== hasIndexB) return hasIndexA ? -1 : 1;
        if (!hasIndexA) return a.sourceOrder - b.sourceOrder;

        const indexDifference = order === "chronological"
          ? b.work[indexKey] - a.work[indexKey]
          : a.work[indexKey] - b.work[indexKey];
        return indexDifference || a.sourceOrder - b.sourceOrder;
      })
      .map(({ work }) => work);
  }
  let sortOrder = "recommended";
  let works = sortWorks(sortOrder);
  const worksGrid = document.querySelector("#works-grid");
  const dialog = document.querySelector("#work-dialog");
  const dialogContent = document.querySelector("#dialog-content");
  let current = 0;
  let dialogClosing = false;
  let dialogOpener = null;

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
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

  function periodRowsMarkup(period, fallback = "") {
    const fields = [
      ["期間", typeof period?.duration === "string" ? period.duration.trim() : ""],
      ["時期", typeof period?.timing === "string" ? period.timing.trim() : ""],
    ];
    return fields.map(([label, value]) => {
      const displayValue = value || fallback;
      return displayValue ? `<div><dt>${label}</dt><dd>${escapeHTML(displayValue)}</dd></div>` : "";
    }).join("");
  }

  function medalIconMarkup(medal, extraClass = "") {
    return `<svg class="award-medal-icon award-medal-icon--${medal} ${extraClass}" viewBox="0 0 32 40" aria-hidden="true" focusable="false"><path class="award-ribbon" d="M6 2h8l4 13h-9L6 2Zm12 0h8l-3 13h-9l4-13Z"/><circle class="award-medal" cx="16" cy="25" r="10"/><path class="award-star" d="m16 18 2 4 4.5.7-3.2 3.1.8 4.4-4.1-2.1-4.1 2.1.8-4.4-3.2-3.1 4.5-.7 2-4Z"/></svg>`;
  }

  function awardsMarkup(awards) {
    if (!Array.isArray(awards)) return "";
    const entries = awards.filter((award) => typeof award?.competition === "string" && award.competition.trim());
    if (!entries.length) return "";

    return `<ul class="award-list">${entries.map((award) => {
      const medal = Object.hasOwn(medalLabels, award.medal) ? award.medal : "";
      const result = typeof award.result === "string" && award.result.trim() ? award.result : medalLabels[medal] || "受賞";
      const icon = medal ? medalIconMarkup(medal) : "";
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
        return `<div class="dialog-video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&controls=1&playsinline=1" title="${title} の動画" loading="eager" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><a class="text-link dialog-video-link" href="${youtubeURL}" target="_blank" rel="noopener noreferrer">YouTubeで見る <span aria-hidden="true">↗</span></a>`;
      }
    }

    return `<img class="dialog-image" src="${escapeHTML(imageURL)}" alt="${imageAlt}" width="960" height="540">`;
  }

  function hasPlayableMedia(work) {
    if (work.media?.type === "video") return Boolean(safeURL(work.media.src, true));
    if (work.media?.type === "youtube") return Boolean(youtubeVideoId(work.media.url));
    return false;
  }

  function cardAwardsMarkup(awards) {
    if (!Array.isArray(awards)) return "";
    const entries = awards.filter((award) => typeof award?.competition === "string" && award.competition.trim());
    if (!entries.length) return "";

    return `<span class="work-card-awards">${entries.map((award) => {
      const medal = Object.hasOwn(medalLabels, award.medal) ? award.medal : "";
      const result = typeof award.result === "string" && award.result.trim() ? award.result : medalLabels[medal] || "受賞";
      const year = typeof award.year === "string" && award.year.trim() ? `<span class="work-card-award-year">${escapeHTML(award.year)}</span>` : "";
      return `<span class="work-card-award${medal ? ` work-card-award--${medal}` : ""}"><span class="work-card-award-copy"><span class="work-card-award-name">${escapeHTML(award.competition)}</span>${year}</span><span class="work-card-award-result">${medal ? medalIconMarkup(medal, "work-card-medal") : ""}<span>${escapeHTML(result)}</span></span></span>`;
    }).join("")}</span>`;
  }

  function workCardMarkup(work, index) {
    const image = escapeHTML(safeURL(work.image, true) || "assets/work-placeholder.svg");
    const imageAlt = escapeHTML(work.imageAlt || work.title);
    const title = escapeHTML(work.title);
    const category = work.category ? `<span class="work-category">${escapeHTML(work.category)}</span>` : "";
    const sample = work.isSample ? '<span class="work-card-sample">仮作品</span>' : "";
    const media = hasPlayableMedia(work) ? '<span class="work-card-media">動画あり</span>' : "";
    const awards = cardAwardsMarkup(work.awards);
    const productionTag = typeof work.isTeam === "boolean"
      ? `<li class="work-card-tag work-card-tag--production work-card-tag--production-${work.isTeam ? "team" : "individual"}">${work.isTeam ? "チーム制作" : "個人制作"}</li>`
      : "";
    const toolTags = Array.isArray(work.mainTools)
      ? work.mainTools
        .filter((tool) => typeof tool === "string" && tool.trim())
        .map((tool) => `<li class="work-card-tag">${escapeHTML(tool)}</li>`)
        .join("")
      : "";
    const workTagsMarkup = productionTag || toolTags
      ? `<ul class="work-card-tags" aria-label="制作形態と主な開発環境">${productionTag}${toolTags}</ul>`
      : "";
    const periodRows = periodRowsMarkup(work.period);
    const periodMarkup = periodRows ? `<dl class="work-card-period">${periodRows}</dl>` : "";

    return `<a class="work-card reveal" href="${escapeHTML(workURL(work).href)}" data-work-index="${index}" aria-haspopup="dialog" aria-label="${title}の詳細を開く">
      <span class="work-card-image"><img src="${image}" alt="${imageAlt}" width="960" height="540" loading="lazy" draggable="false">${media}<span class="work-card-image-arrow" aria-hidden="true">↗</span></span>
      <div class="work-card-body">
        <span class="work-card-labels">${category}${sample}</span>
        <h3 class="work-card-title">${title}</h3>
        ${workTagsMarkup}${periodMarkup}
        <p class="work-card-summary">${escapeHTML(work.summary)}</p>
        <span class="work-card-footer">${awards}<span class="work-card-more">詳しく見る <span aria-hidden="true">↗</span></span></span>
      </div>
    </a>`;
  }

  function setupImages(root) {
    root.querySelectorAll("img").forEach((image) => {
      image.addEventListener("error", () => {
        image.src = "assets/work-placeholder.svg";
        image.alt = "作品画像は準備中です";
      }, { once: true });
    });
  }

  function openDialog(event, updateURL = true) {
    if (dialog.open || !works.length) return;
    const work = works[current];
    dialogOpener = event?.currentTarget ?? worksGrid.querySelector(`[data-work-index="${current}"]`) ?? document.activeElement;
    dialog.classList.toggle("is-pointer-open", event?.inputMode === "pointer");
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
        <div><dt>制作期間</dt><dd><dl class="dialog-period">${periodRowsMarkup(work.period, "未設定")}</dl></dd></div>
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
    openDialog(undefined, false);
  }

  function closeDialog(fromHistory = false) {
    if (dialogClosing || !dialog.open) return;
    dialogClosing = true;
    dialog.classList.remove("is-open");
    dialogContent.querySelectorAll("video").forEach((video) => video.pause());
    dialogContent.querySelectorAll("iframe").forEach((frame) => frame.remove());
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
      dialog.classList.remove("is-pointer-open");
      document.body.classList.remove("modal-open");
      document.body.style.paddingRight = "";
      dialogOpener?.focus({ preventScroll: true });
      dialogClosing = false;
    }, reducedMotion.matches ? 0 : 280);
  }

  dialog.querySelector(".dialog-close").addEventListener("click", () => closeDialog());
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeDialog(); });
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") dialog.classList.remove("is-pointer-open");
  });
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

  function renderWorks() {
    worksGrid.innerHTML = works.length
      ? works.map(workCardMarkup).join("")
      : '<p class="works-empty">作品は準備中です。</p>';
    setupImages(worksGrid);
  }

  renderWorks();
  const sortButtons = [...document.querySelectorAll(".works-sort-button")];
  sortButtons.forEach((button) => button.addEventListener("click", () => {
    const nextOrder = button.dataset.sortOrder;
    if (nextOrder === sortOrder || !["recommended", "chronological"].includes(nextOrder)) return;
    sortOrder = nextOrder;
    works = sortWorks(sortOrder);
    renderWorks();
    sortButtons.forEach((sortButton) => {
      sortButton.setAttribute("aria-pressed", String(sortButton.dataset.sortOrder === sortOrder));
    });
  }));

  worksGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".work-card");
    if (!card || !worksGrid.contains(card)) return;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    current = Number(card.dataset.workIndex);
    openDialog({ currentTarget: card, inputMode: event.detail > 0 ? "pointer" : "keyboard" });
  });
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
