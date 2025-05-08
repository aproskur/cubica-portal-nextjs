export const slateToHtml = (nodes = []) => {
    if (!Array.isArray(nodes)) {
        console.warn("Invalid nodes passed to slateToHtml:", nodes);
        return "";
    }
    let html = "";

    const applyInlineStyles = (child) => {
        let text = child.text || "";

        if (child.bold) text = `<strong>${text}</strong>`;
        if (child.italic) text = `<em>${text}</em>`;
        if (child.underline) text = `<u>${text}</u>`;
        if (child.strikethrough) text = `<s>${text}</s>`;

        return text;
    };

    for (const node of nodes) {
        const children = (node.children || []).map(applyInlineStyles).join("");

        switch (node.type) {
            case "heading":
                html += `<h${node.level || 2}>${children}</h${node.level || 2}>`;
                break;

            case "list":
                const listTag = node.format === "unordered" ? "ul" : "ol";
                html += `<${listTag}>` +
                    node.children.map((item) => {
                        const listContent = (item.children || [])
                            .map(applyInlineStyles)
                            .join("");
                        return `<li>${listContent}</li>`;
                    }).join("") +
                    `</${listTag}>`;
                break;

            case "paragraph":
            default:
                html += `<p>${children}</p>`;
                break;
        }
    }

    return html;
};

export const htmlToSlate = (html) => {
    const container = document.createElement("div");
    container.innerHTML = html;

    const deserializeChildren = (node, inheritedMarks = {}) => {
        const results = [];

        node.childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent;
                if (text && text.trim() !== "") {
                    results.push({ text, ...inheritedMarks });
                }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const tag = child.nodeName;
                const unsupportedTags = [
                    "CODE", "SPAN", "PRE", "MARK", "KBD",
                    "BLOCKQUOTE", "TABLE", "IMG", "SCRIPT", "IFRAME", "A"
                ];

                if (unsupportedTags.includes(tag)) {
                    return; //  block this child and its subtree
                }

                const newMarks = { ...inheritedMarks };

                if (["STRONG", "B"].includes(tag)) newMarks.bold = true;
                if (["EM", "I"].includes(tag)) newMarks.italic = true;
                if (tag === "U") newMarks.underline = true;
                if (["S", "DEL"].includes(tag)) newMarks.strikethrough = true;

                const deserialized = deserializeChildren(child, newMarks);
                results.push(...deserialized);
            }
        });

        return results.length > 0 ? results : [{ text: "" }];
    };


    const deserializeElement = (node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return null;
        const tag = node.nodeName;

        if (tag === "OL") {
            const isBullet = Array.from(node.children).some((li) =>
                li.getAttribute("data-list") === "bullet"
            );

            const format = isBullet ? "unordered" : "ordered";

            const items = Array.from(node.children)
                .filter((child) => child.nodeName === "LI")
                .map((li) => ({
                    type: "list-item",
                    children: deserializeChildren(li),
                }));

            return {
                type: "list",
                format,
                children: items,
            };
        }

        if (/^H[1-6]$/.test(tag)) {
            return {
                type: "heading",
                level: parseInt(tag[1], 10),
                children: deserializeChildren(node),
            };
        }

        if (tag === "LI") {
            return {
                type: "list-item",
                children: deserializeChildren(node),
            };
        }

        if (tag === "P") {
            return {
                type: "paragraph",
                children: deserializeChildren(node),
            };
        }

        return {
            type: "paragraph",
            children: deserializeChildren(node),
        };
    };

    const slateNodes = [];

    container.childNodes.forEach((node) => {
        const parsed = deserializeElement(node);
        if (parsed) slateNodes.push(parsed);
    });

    return slateNodes.length > 0
        ? slateNodes
        : [{ type: "paragraph", children: [{ text: "" }] }];
};

const normalizeTextChildren = (children = []) => {
    const cleaned = children
        .filter(
            (child) =>
                typeof child.text === "string" && child.text.trim() !== "" ||
                child.bold || child.italic || child.underline || child.strikethrough
        )
        .map((child) => ({
            type: "text",
            text: child.text || "",
            ...(child.bold ? { bold: true } : {}),
            ...(child.italic ? { italic: true } : {}),
            ...(child.underline ? { underline: true } : {}),
            ...(child.strikethrough ? { strikethrough: true } : {})
        }));

    return cleaned.length > 0 ? cleaned : [{ type: "text", text: "" }];
};

export const normalizeSlateForStrapi = (nodes) => {
    if (!Array.isArray(nodes)) return [];

    const normalizedNodes = [];
    let consecutiveEmptyBlocks = 0;

    for (const node of nodes) {
        let normalized = { ...node };
        const originalType = node.type;

        const tagMap = {
            'p': 'paragraph',
            'h1': 'heading',
            'h2': 'heading',
            'h3': 'heading',
            'ol': 'list',
            'ul': 'list',
            'li': 'list-item',
        };

        if (tagMap[originalType]) {
            normalized.type = tagMap[originalType];
        }

        if (/^h[1-6]$/.test(originalType)) {
            normalized.level = parseInt(originalType[1], 10);
        }

        // Handle list blocks directly
        if (normalized.type === 'list' && Array.isArray(normalized.children)) {
            const format = normalized.format || 'unordered';

            const listItems = normalized.children
                .filter((item) => item.type === 'list-item')
                .map((item) => ({
                    type: 'list-item',
                    children: normalizeTextChildren(item.children)
                }));

            if (listItems.length > 0) {
                normalizedNodes.push({
                    type: 'list',
                    format,
                    children: listItems
                });
            }

            continue; // move to next block
        }

        // Normalize all other block types
        normalized.children = normalizeTextChildren(normalized.children);

        const firstChild = normalized.children[0] || {};
        const isEmptyBlock =
            normalized.children.length === 1 &&
            typeof firstChild.text === "string" &&
            firstChild.text.trim() === "" &&
            !firstChild.bold &&
            !firstChild.italic &&
            !firstChild.underline &&
            !firstChild.strikethrough;

        if (isEmptyBlock) {
            consecutiveEmptyBlocks++;
            if (consecutiveEmptyBlocks <= 2) {
                normalizedNodes.push({
                    type: 'paragraph',
                    children: [{ type: "text", text: "" }]
                });
            }
            continue;
        } else {
            consecutiveEmptyBlocks = 0;
        }

        normalizedNodes.push(normalized);
    }

    return normalizedNodes;
};




