(function () {
  "use strict";

  const escapeHTML = (value) => value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);

  function renderInline(content) {
    let html = "";
    let offset = 0;
    for (const match of content.matchAll(/\[([^\]\n]+)\]\(([^()\s]+)\)/g)) {
      const [original, label, destination] = match;
      const absolute = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(destination);
      html += escapeHTML(content.slice(offset, match.index));
      if (/[\x00-\x20\\]/.test(destination) || (absolute && !/^https?:\/\//i.test(destination))) {
        html += escapeHTML(original);
      } else {
        const target = absolute ? ' target="_blank" rel="noopener noreferrer"' : "";
        html += `<a href="${escapeHTML(destination)}"${target}>${escapeHTML(label)}</a>`;
      }
      offset = match.index + original.length;
    }
    return html + escapeHTML(content.slice(offset));
  }

  function renderBlocks(sectionLines) {
    const blocks = [];
    let lines = [];
    let isList = false;

    function flush() {
      if (!lines.length) return;
      if (isList) {
        const items = lines.map((item) => `<li>${renderInline(item)}</li>`);
        blocks.push(`<ul>${items.join("")}</ul>`);
      } else {
        blocks.push(`<p>${lines.map(renderInline).join("<br>")}</p>`);
      }
      lines = [];
    }

    for (const line of sectionLines) {
      if (!line.trim()) {
        if (!isList) flush();
        continue;
      }

      const item = line.match(/^ {0,3}-[ \t]+(\S.*)$/);
      const nextIsList = Boolean(item);
      if (nextIsList !== isList) flush();
      isList = nextIsList;
      lines.push(item ? item[1] : line);
    }

    flush();
    return blocks.join("");
  }

  function renderWorkDetails(markdown) {
    const source = markdown.trim();
    if (!/^##[ \t]+\S/.test(source)) throw new Error("詳細の見出しがありません");

    return source.split(/(?=^##[ \t]+)/m).map((section) => {
      const [heading, ...lines] = section.split(/\r?\n/);
      return `<section class="dialog-block"><h3>${escapeHTML(heading.slice(2).trim())}</h3>${renderBlocks(lines)}</section>`;
    }).join("\n");
  }

  if (typeof module === "object" && module.exports) module.exports = renderWorkDetails;
  else window.renderWorkDetails = renderWorkDetails;
})();
