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

  function renderValues() {
    const values = entriesWithName(about.values, "title");
    if (!values.length) return;
    const fragment = document.createDocumentFragment();
    values.forEach((value) => {
      const article = document.createElement("article");
      article.className = "info-card principle-card reveal";
      const body = document.createElement("div");
      body.append(textElement("h4", "", value.title));
      if (value.description) body.append(textElement("p", "", value.description));
      article.append(body);
      fragment.append(article);
    });
    document.querySelector("#values-list").replaceChildren(fragment);
    document.querySelector("#values-draft-note").hidden = !about.valuesAreDraft;
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

  renderPersonalList("#hobbies-list", about.hobbies);
  renderPersonalList("#interests-list", about.interests);
  renderValues();
  renderQualifications();
})();
