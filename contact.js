(() => {
  "use strict";

  const container = document.querySelector("#contact-content");
  const entries = window.PORTFOLIO_CONTACT?.links;
  if (!container || !Array.isArray(entries)) return;

  const links = entries.filter((entry) => {
    if (typeof entry?.label !== "string" || !entry.label.trim() || typeof entry?.url !== "string") return false;
    try {
      const url = new URL(entry.url, location.href);
      return ["http:", "https:", "mailto:"].includes(url.protocol);
    } catch {
      return false;
    }
  });
  if (!links.length) return;

  const list = document.createElement("div");
  list.className = "contact-links";
  links.forEach((entry) => {
    const url = new URL(entry.url, location.href);
    const link = document.createElement("a");
    link.className = "contact-link";
    link.href = url.href;
    if (url.protocol === "http:" || url.protocol === "https:") {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    const label = document.createElement("strong");
    label.textContent = entry.label.trim();
    const value = document.createElement("span");
    value.textContent = typeof entry.value === "string" && entry.value.trim() ? entry.value.trim() : entry.url;
    link.append(label, value);
    list.append(link);
  });
  container.replaceChildren(list);
})();
