export const slateToHtml = (nodes = []) => {
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
                const newMarks = { ...inheritedMarks };
                const tag = child.nodeName;

                if (["STRONG", "B"].includes(tag)) newMarks.bold = true;
                if (["EM", "I"].includes(tag)) newMarks.italic = true;
                if (tag === "U") newMarks.underline = true;
                if (["S", "DEL"].includes(tag)) newMarks.strikethrough = true;

                results.push(...deserializeChildren(child, newMarks));
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

export const normalizeSlateForStrapi = (nodes) => {
    if (!Array.isArray(nodes)) return [];

    const normalizedNodes = [];
    let pendingListItems = [];

    const flushPendingList = (format = 'unordered') => {
        if (pendingListItems.length > 0) {
            normalizedNodes.push({
                type: 'list',
                format,
                children: [...pendingListItems],
            });
            pendingListItems = [];
        }
    };

    for (const node of nodes) {
        const originalType = node.type;
        let normalized = { ...node };

        // Assign format early and store it directly
        let formatFromType = null;
        if (originalType === 'ol') formatFromType = 'ordered';
        if (originalType === 'ul') formatFromType = 'unordered';

        // Map HTML-like tags to Strapi block types
        const tagMap = {
            'p': 'paragraph',
            'h1': 'heading',
            'h2': 'heading',
            'h3': 'heading',
            'ol': 'list',
            'ul': 'list',
            'li': 'list-item'
        };

        if (tagMap[originalType]) {
            normalized.type = tagMap[originalType];
        }

        // Set heading level if heading
        if (/^h[1-6]$/.test(originalType)) {
            normalized.level = parseInt(originalType[1], 10);
        }

        // Explicitly assign format
        if (normalized.type === 'list' && formatFromType) {
            normalized.format = formatFromType;
        }

        // Normalize and clean children
        if (Array.isArray(normalized.children)) {
            normalized.children = normalized.children
                .map((child) => {
                    if (
                        typeof child.text === "string" &&
                        child.text.trim() === "" &&
                        !child.bold &&
                        !child.italic &&
                        !child.underline &&
                        !child.strikethrough
                    ) {
                        return null;
                    }
                    return child;
                })
                .filter(Boolean);
        }

        if (normalized.type === 'list-item') {
            pendingListItems.push(normalized);
        } else {
            flushPendingList(); // Flush any pending list-items
            normalizedNodes.push(normalized);
        }
    }

    flushPendingList(); // Final flush

    return normalizedNodes;
};