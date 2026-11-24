// hero.js: Heroの動画再生、サムネイル選択、作品詳細への案内を管理します。
(() => {
  "use strict";

  const gallery = document.querySelector(".hero-gallery");
  if (!gallery) return;
  const configuredClips = Array.isArray(window.PORTFOLIO_HERO_CLIPS) ? window.PORTFOLIO_HERO_CLIPS : [];

  function mediaURL(value) {
    if (typeof value !== "string" || !value.trim() || !URL.canParse(value, location.href)) return "";
    const url = new URL(value, location.href);
    return ["http:", "https:", "file:"].includes(url.protocol) ? url.href : "";
  }

  const placeholder = "assets/work-placeholder.svg";
  const works = new Map((window.PORTFOLIO_WORKS ?? []).map((work) => [work.id, work]));
  const overrides = new Map(configuredClips.filter((entry) => entry?.workId).map((entry) => [entry.workId, entry]));
  const entries = [...works.keys()].map((workId) => overrides.get(workId) ?? { workId });
  entries.push(...configuredClips.filter((entry) => !entry?.workId));
  const clips = entries.flatMap((entry) => {
    const work = works.get(entry?.workId);
    const customTitle = typeof entry?.title === "string" ? entry.title.trim() : "";
    const title = customTitle || work?.title;
    const workVideo = work?.media?.type === "video" ? mediaURL(work.media.src) : "";
    const youtube = work?.media?.type === "youtube" ? mediaURL(work.media.url) : "";
    return title ? [{
      title,
      workId: work?.id,
      video: mediaURL(entry.video) || workVideo,
      thumbnail: mediaURL(entry.thumbnail) || mediaURL(work?.image) || placeholder,
      hasDetailVideo: Boolean(workVideo || youtube),
    }] : [];
  });
  if (!clips.length) return;

  const poster = gallery.querySelector(".hero-poster");
  const video = gallery.querySelector(".hero-video");
  const controls = gallery.querySelector(".hero-gallery-controls");
  const title = gallery.querySelector(".hero-clip-title");
  const playButton = gallery.querySelector(".hero-playback");
  const detailsLink = gallery.querySelector(".hero-detail-link");
  const thumbnailList = gallery.querySelector(".hero-thumbnails");
  const scrollButtons = gallery.querySelectorAll(".hero-scroll-button");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let selectedIndex = 0;

  // テキストと表示状態は動画要素の再生状態に合わせる。
  function updatePlaybackLabel() {
    playButton.textContent = video.paused ? "再生" : "一時停止";
  }

  function playVideo() {
    video.play().catch(updatePlaybackLabel);
  }

  function selectClip(index, autoplay) {
    selectedIndex = index;
    const clip = clips[index];
    const restart = video.hasAttribute("src");
    video.pause();
    video.hidden = true;
    poster.src = clip.thumbnail;
    poster.alt = clip.title;
    title.textContent = clip.title;
    playButton.hidden = !clip.video;
    detailsLink.hidden = Boolean(clip.video) || !clip.workId;
    detailsLink.textContent = clip.hasDetailVideo ? "作品詳細で動画を見る" : "作品詳細を見る";
    if (clip.workId) detailsLink.href = "?work=" + encodeURIComponent(clip.workId) + "#works";
    thumbnails.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));

    if (clip.video) {
      video.src = clip.video;
      video.muted = true;
      if (autoplay) playVideo();
    } else if (restart) {
      video.removeAttribute("src");
      video.load();
    }
    updatePlaybackLabel();
  }

  const thumbnails = clips.map((clip, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hero-thumbnail";
    button.setAttribute("aria-label", clip.title);
    button.setAttribute("aria-controls", "hero-stage");

    const image = document.createElement("img");
    image.src = clip.thumbnail;
    image.alt = "";
    image.loading = "lazy";
    image.addEventListener("error", () => { image.src = placeholder; }, { once: true });
    button.append(image);
    button.addEventListener("click", () => {
      if (index !== selectedIndex) selectClip(index, true);
      else if (clip.video && !video.error && video.paused) playVideo();
    });
    return button;
  });

  poster.addEventListener("error", () => {
    if (!poster.src.endsWith(placeholder)) poster.src = placeholder;
  });
  function updateScrollButtons() {
    const maxScroll = thumbnailList.scrollWidth - thumbnailList.clientWidth;
    scrollButtons[0].disabled = thumbnailList.scrollLeft <= 1;
    scrollButtons[1].disabled = thumbnailList.scrollLeft >= maxScroll - 1;
  }

  // 矢印は一覧を送るだけで、再生中の作品には触れない。
  for (const button of scrollButtons) {
    const direction = Number(button.dataset.heroScroll);
    button.addEventListener("click", () => {
      thumbnailList.scrollBy({
        left: thumbnailList.clientWidth * direction,
        behavior: reducedMotion.matches ? "instant" : "smooth",
      });
    });
  }
  thumbnailList.addEventListener("scroll", updateScrollButtons, { passive: true });
  window.addEventListener("resize", updateScrollButtons);

  playButton.addEventListener("click", () => {
    if (video.paused) playVideo();
    else video.pause();
  });
  video.addEventListener("playing", () => {
    video.hidden = false;
    updatePlaybackLabel();
  });
  video.addEventListener("play", updatePlaybackLabel);
  video.addEventListener("pause", updatePlaybackLabel);
  video.addEventListener("error", () => {
    video.hidden = true;
    playButton.hidden = true;
    detailsLink.hidden = !clips[selectedIndex].workId;
  });
  thumbnailList.append(...thumbnails);
  controls.hidden = false;
  const firstVideo = clips.findIndex((clip) => clip.video);
  selectClip(Math.max(0, firstVideo), !reducedMotion.matches);
  if (firstVideo > 0) thumbnailList.scrollLeft = thumbnails[firstVideo].offsetLeft - thumbnails[0].offsetLeft;
  updateScrollButtons();
})();
