const COLORS = {
  1: "#e74c3c",
  2: "#e67e22",
  3: "#d4ac0d",
  4: "#2ecc71",
  5: "#1abc9c",
  6: "#9b59b6",
};

const SIDE_OFFSET = {
  top: (node) => ({ x: node.x + node.width / 2, y: node.y }),
  right: (node) => ({ x: node.x + node.width, y: node.y + node.height / 2 }),
  bottom: (node) => ({ x: node.x + node.width / 2, y: node.y + node.height }),
  left: (node) => ({ x: node.x, y: node.y + node.height / 2 }),
};

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderMarkdown(text) {
  const lines = text.split("\n");
  const parts = [];
  let inList = false;
  let inTable = false;
  let inCode = false;
  let codeLines = [];

  function closeList() {
    if (inList) {
      parts.push("</ul>");
      inList = false;
    }
  }

  function closeTable() {
    inTable = false;
  }

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCode) {
        parts.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
        inCode = false;
      } else {
        closeList();
        closeTable();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (line.startsWith("|")) {
      closeList();
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim());
      if (cells.every((cell) => /^-+$/.test(cell))) {
        continue;
      }
      if (!inTable) {
        parts.push("<table><tr>" + cells.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join("") + "</tr>");
        inTable = true;
        continue;
      }
      parts.push("<tr>" + cells.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("") + "</tr>");
      continue;
    }

    closeTable();

    if (line.startsWith("# ")) {
      closeList();
      parts.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith("## ")) {
      closeList();
      parts.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("### ")) {
      closeList();
      parts.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("- ")) {
      if (!inList) {
        parts.push("<ul>");
        inList = true;
      }
      parts.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
      continue;
    }

    closeList();
    if (line.trim() === "") {
      parts.push("<p></p>");
    } else {
      parts.push(`<p>${inlineMarkdown(line)}</p>`);
    }
  }

  closeList();
  if (inTable) {
    parts.push("</table>");
  }
  if (inCode) {
    parts.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }

  return parts.join("");
}

function inlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function renderCanvas(canvas) {
  const stage = document.getElementById("stage");
  const edgesLayer = document.getElementById("edges");
  const nodeMap = new Map(canvas.nodes.map((node) => [node.id, node]));

  for (const node of canvas.nodes) {
    const el = document.createElement("div");
    el.className = `node node--${node.type}`;
    el.style.left = `${node.x}px`;
    el.style.top = `${node.y}px`;
    el.style.width = `${node.width}px`;
    el.style.height = `${node.height}px`;
    if (node.color) {
      el.dataset.color = node.color;
    }

    if (node.type === "group") {
      const label = document.createElement("div");
      label.className = "node__label";
      label.textContent = node.label || "";
      el.appendChild(label);
    }

    if (node.type === "text" && node.text) {
      el.innerHTML = renderMarkdown(node.text);
    }

    stage.appendChild(el);
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "edges");
  const minX = Math.min(...canvas.nodes.map((node) => node.x)) - 40;
  const minY = Math.min(...canvas.nodes.map((node) => node.y)) - 40;
  const maxX = Math.max(...canvas.nodes.map((node) => node.x + node.width)) + 40;
  const maxY = Math.max(...canvas.nodes.map((node) => node.y + node.height)) + 40;
  svg.setAttribute("width", String(maxX - minX));
  svg.setAttribute("height", String(maxY - minY));
  svg.style.left = `${minX}px`;
  svg.style.top = `${minY}px`;

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#5b9cf5"></path>
    </marker>
  `;
  svg.appendChild(defs);

  for (const edge of canvas.edges || []) {
    const from = nodeMap.get(edge.fromNode);
    const to = nodeMap.get(edge.toNode);
    if (!from || !to) {
      continue;
    }

    const start = SIDE_OFFSET[edge.fromSide || "right"](from);
    const end = SIDE_OFFSET[edge.toSide || "left"](to);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const dx = Math.abs(end.x - start.x) * 0.35;
    const d = `M ${start.x - minX} ${start.y - minY} C ${start.x - minX + dx} ${start.y - minY}, ${end.x - minX - dx} ${end.y - minY}, ${end.x - minX} ${end.y - minY}`;
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", COLORS[edge.color] || "#5b9cf5");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("marker-end", edge.toEnd === "none" ? "" : "url(#arrow)");
    svg.appendChild(path);

    if (edge.label) {
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", String((start.x + end.x) / 2 - minX));
      label.setAttribute("y", String((start.y + end.y) / 2 - minY - 6));
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", "edge-label");
      label.textContent = edge.label;
      svg.appendChild(label);
    }
  }

  stage.appendChild(svg);
  return { minX, minY, maxX, maxY };
}

function setupPanZoom(bounds) {
  const viewport = document.getElementById("viewport");
  const stage = document.getElementById("stage");
  let scale = 0.85;
  let offsetX = 40;
  let offsetY = 20;
  let panning = false;
  let lastX = 0;
  let lastY = 0;

  function applyTransform() {
    stage.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  }

  function fit() {
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    const padding = 48;
    const sx = (viewport.clientWidth - padding * 2) / width;
    const sy = (viewport.clientHeight - padding * 2) / height;
    scale = Math.min(1, sx, sy);
    offsetX = (viewport.clientWidth - width * scale) / 2 - bounds.minX * scale;
    offsetY = (viewport.clientHeight - height * scale) / 2 - bounds.minY * scale;
    applyTransform();
  }

  viewport.addEventListener("wheel", (event) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 1.08 : 0.92;
    const rect = viewport.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const worldX = (mouseX - offsetX) / scale;
    const worldY = (mouseY - offsetY) / scale;
    scale = Math.min(2.5, Math.max(0.25, scale * delta));
    offsetX = mouseX - worldX * scale;
    offsetY = mouseY - worldY * scale;
    applyTransform();
  }, { passive: false });

  viewport.addEventListener("pointerdown", (event) => {
    panning = true;
    lastX = event.clientX;
    lastY = event.clientY;
    viewport.classList.add("is-panning");
    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!panning) {
      return;
    }
    offsetX += event.clientX - lastX;
    offsetY += event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    applyTransform();
  });

  viewport.addEventListener("pointerup", () => {
    panning = false;
    viewport.classList.remove("is-panning");
  });

  document.getElementById("fit-btn").addEventListener("click", fit);
  document.getElementById("zoom-in-btn").addEventListener("click", () => {
    scale = Math.min(2.5, scale * 1.15);
    applyTransform();
  });
  document.getElementById("zoom-out-btn").addEventListener("click", () => {
    scale = Math.max(0.25, scale / 1.15);
    applyTransform();
  });

  window.addEventListener("resize", fit);
  fit();
}

async function loadCanvas() {
  const sources = ["./canvas.json", "../" + encodeURIComponent("项目结构.canvas")];
  for (const source of sources) {
    try {
      const response = await fetch(source);
      if (response.ok) {
        return response.json();
      }
    } catch (_) {
      /* 本地 file:// 打开时 fetch 会失败，继续尝试下一个来源 */
    }
  }
  throw new Error("请通过本地服务器或 GitHub Pages 打开本页");
}

async function init() {
  const canvas = await loadCanvas();
  const bounds = renderCanvas(canvas);
  setupPanZoom(bounds);
}

init().catch((error) => {
  const viewport = document.getElementById("viewport");
  viewport.innerHTML = `<div style="padding:24px;line-height:1.6;">
    <p style="color:#f88;margin:0 0 12px;">加载画布失败：${error.message}</p>
    <p style="color:#8b9cb3;margin:0;">在项目根目录运行 <code>python3 -m http.server 8080</code>，然后访问
    <a href="http://localhost:8080/project-structure/" style="color:#5b9cf5;">http://localhost:8080/project-structure/</a></p>
  </div>`;
});
