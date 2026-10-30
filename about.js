(() => {
  "use strict";

  const about = window.PORTFOLIO_ABOUT ?? {};

  function textElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function entriesWithName(entries, key) {
    return Array.isArray(entries) ? entries.filter((entry) => typeof entry?.[key] === "string" && entry[key].trim()) : [];
  }

  function renderPersonalList(selector, entries) {
    const items = entriesWithName(entries, "title");
    if (!items.length) return;
    const list = document.createElement("ul");
    list.className = "personal-list";
    for (const item of items) {
      const row = document.createElement("li");
      row.className = item.description ? "personal-item has-description" : "personal-item";
      row.append(textElement("p", "personal-item-title", item.title));
      if (item.description) row.append(textElement("p", "", item.description));
      list.append(row);
    }
    document.querySelector(selector).replaceChildren(list);
  }

  function renderHobbies() {
    const hobbies = entriesWithName(about.hobbies, "title");
    const container = document.querySelector("#hobby-features");
    for (const hobby of hobbies.filter((item) => item.photos?.length)) {
      const article = document.createElement("article");
      article.className = "info-card hobby-feature reveal";
      const copy = document.createElement("div");
      copy.className = "hobby-feature-copy";
      copy.append(textElement("p", "hobby-feature-label", "趣味"));
      copy.append(textElement("h3", "", hobby.title));
      if (hobby.lead) copy.append(textElement("p", "hobby-feature-lead", hobby.lead));
      if (hobby.description) copy.append(textElement("p", "hobby-feature-description", hobby.description));
      article.append(copy);

      hobby.photos.forEach((photo, index) => {
        const figure = document.createElement("figure");
        figure.className = index === 0 ? "hobby-photo hobby-photo-main" : "hobby-photo hobby-photo-detail";
        const image = document.createElement("img");
        image.src = photo.src;
        image.alt = photo.alt;
        image.width = photo.width;
        image.height = photo.height;
        image.loading = "lazy";
        figure.append(image);
        if (photo.caption) figure.append(textElement("figcaption", "", photo.caption));
        article.append(figure);
      });
      container.append(article);
    }
    renderPersonalList("#hobbies-list", hobbies.filter((item) => !item.photos?.length));
  }

  function renderQualifications() {
    const qualifications = entriesWithName(about.qualifications, "name");
    const list = document.querySelector("#qualification-list");
    list.hidden = qualifications.length === 0;
    document.querySelector("#qualification-empty").hidden = qualifications.length > 0;
    if (!qualifications.length) return;

    const fragment = document.createDocumentFragment();
    qualifications.forEach((qualification) => {
      const item = document.createElement("li");
      item.className = "qualification-card reveal";
      const meta = document.createElement("div");
      meta.className = "qualification-meta";
      if (qualification.acquired || qualification.status) {
        const dateLabel = [qualification.acquired, qualification.status || "取得"].filter(Boolean).join(" ");
        meta.append(textElement("span", "qualification-date", dateLabel));
      }
      item.append(textElement("h4", "", qualification.name));
      if (meta.childElementCount) item.append(meta);
      if (qualification.issuer) item.append(textElement("p", "qualification-issuer", qualification.issuer));
      if (qualification.note) item.append(textElement("p", "qualification-note", qualification.note));
      fragment.append(item);
    });
    list.replaceChildren(fragment);
  }

  renderHobbies();
  renderPersonalList("#interests-list", about.interests);
  renderQualifications();
})();
