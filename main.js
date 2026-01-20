const itemMap = {};
data.forEach(entry => {
    const outputName = entry[3];
    if(!itemMap[outputName]) itemMap[outputName] = [];
    itemMap[outputName].push(entry);
});
// =====================================================================
const listEl = document.getElementById("item-list");
const searchEl = document.getElementById("search");

function renderList(filter = "") {
    listEl.innerHTML = "";
    Object.keys(itemMap)
        .filter(name => name.toLowerCase().includes(filter.toLowerCase()))
        .forEach(name => {
            const entries = itemMap[name];
            entries.forEach((entry, idx) => {
                const div = document.createElement("div");
                div.textContent = entries.length > 1 ? `${name} (${idx+1})` : name;
                div.onclick = () => {
                    treeRoot.innerHTML = "";
                    createTreeNode(name, treeRoot);
                };
                listEl.appendChild(div);
            });
        });
}

searchEl.addEventListener("input", e => renderList(e.target.value));
renderList();

// =====================================================================
const treeRoot = document.getElementById("tree");
function createTreeNode(itemName, container) {
    if (container.querySelector(`[data-item-name="${itemName}"]`)) return;

    const entries = itemMap[itemName];
    if (!entries) return;

    entries.forEach((entry, idx) => {
        const node = document.createElement("div");
        node.className = "tree-node";
        node.dataset.itemName = itemName;

        const box = document.createElement("div");
        box.className = "node-box";

        const title = entries.length > 1 ? `${itemName} (${idx+1})` : itemName;

        box.innerHTML = `
            <strong>${title}</strong>
            <div class="section-title">ingredients</div>
            ${renderItems(entry[0])}
            <div class="section-title">tools</div>
            ${renderItems(entry[1])}
            <div class="section-title">etc</div>
            ${renderItems(entry[2])}`;

        node.appendChild(box);

        const children = document.createElement("div");
        children.className = "children";
        node.appendChild(children);

        container.appendChild(node);
    });

    normalizeHeight(container);
}
// =====================================================================
function normalizeItemName(str) {
    return str.replace(/\s*×\s*\d+/g, "").trim();
}
function renderItems(group) {
    return group.map(i => {
        const clean = normalizeItemName(i);
        const clickable = itemMap[clean];

        return `
    <div class="item ${clickable ? "" : "disabled"}"
        onclick="${clickable ? `event.stopPropagation(); createTreeNode('${clean}', this.closest('.tree-node').querySelector('.children'))` : ""}">
    ${i}
    </div>`;
    }).join("");
}

// =====================================================================
function normalizeHeight(container) {
    const boxes = container.querySelectorAll(":scope > .tree-node > .node-box");
    let max = 0;

    boxes.forEach(b => {
        b.style.height = "auto";
        max = Math.max(max, b.offsetHeight);
    });

    boxes.forEach(b => {
        b.style.height = max + "px";
    });
}