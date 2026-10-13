(() => {
  const categories = window.PORTFOLIO_SKILLS;
  const container = document.getElementById("skill-grid");

  if (!container || !Array.isArray(categories)) return;

  categories.forEach(({ category, items }) => {
    const card = document.createElement("article");
    card.className = "info-card skill-card reveal";

    const heading = document.createElement("h3");
    heading.textContent = category;

    const list = document.createElement("ul");
    list.className = "skill-items";

    items.forEach(({ name, icon = "" }) => {
      const row = document.createElement("li");
      const iconSlot = document.createElement("span");
      iconSlot.className = "skill-icon";
      iconSlot.setAttribute("aria-hidden", "true");

      if (icon) {
        const image = document.createElement("img");
        image.src = icon;
        image.alt = "";
        image.loading = "lazy";
        iconSlot.append(image);
        iconSlot.classList.add("has-image");
      } else {
        iconSlot.textContent = "画像";
      }

      const label = document.createElement("span");
      label.className = "skill-name";
      label.textContent = name;

      row.append(iconSlot, label);
      list.append(row);
    });

    card.append(heading, list);
    container.append(card);
  });
})();
