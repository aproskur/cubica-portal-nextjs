  export function cleanQuillHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
  
    const fixMixedList = (parentList) => {
      const newListBlocks = [];
      let currentList = null;
      let currentFormat = null;
  
      Array.from(parentList.children).forEach((li) => {
        const listType = li.getAttribute("data-list") || "ordered"; // default fallback
  
        if (listType !== currentFormat) {
          // Start a new list block
          currentFormat = listType;
          currentList = document.createElement(listType === "bullet" ? "ul" : "ol");
          newListBlocks.push(currentList);
        }
  
        li.removeAttribute("data-list");
        currentList.appendChild(li);
      });
  
      // Replace old parentList with new split lists
      newListBlocks.forEach((newList) => {
        parentList.parentNode.insertBefore(newList, parentList);
      });
      parentList.remove();
    };
  
    // Fix all <ol> or <ul> that contain mixed data-list
    doc.querySelectorAll("ol, ul").forEach((list) => {
      const hasMixedTypes = new Set(
        Array.from(list.children).map((li) => li.getAttribute("data-list") || "ordered")
      );
      if (hasMixedTypes.size > 1) {
        fixMixedList(list);
      } else {
        // Simple case: all same type
        const correctTag = hasMixedTypes.has("bullet") ? "ul" : "ol";
        if (list.tagName.toLowerCase() !== correctTag) {
          const replacement = document.createElement(correctTag);
          Array.from(list.children).forEach((li) => {
            li.removeAttribute("data-list");
            replacement.appendChild(li);
          });
          list.replaceWith(replacement);
        }
      }
    });
  
    // Remove ql-ui spans
    doc.querySelectorAll("span.ql-ui").forEach((el) => el.remove());

    // catch any missed data-list
doc.querySelectorAll("li[data-list]").forEach((li) => {
    li.removeAttribute("data-list");
  });
  
    return doc.body.innerHTML;
  }
  
    export function normalizeSlateForStrapi(blocks) {
      const normalized = [];
    
      for (let i = 0; i < blocks.length; i++) {
        const current = blocks[i];
        const prev = normalized[normalized.length - 1];
    
        if (
          current.type === "list" &&
          prev?.type === "list"
        ) {
          normalized.push({
            type: "paragraph",
            children: [{ type: "text", text: "" }]
          });
        }
    
        normalized.push(current);
      }
    
      return normalized;
    }
  
    export function ensureTextNodesHaveType(nodes) {
      return nodes.map((node) => {
        if (node.text !== undefined) {
          return {
            type: "text", // required by Strapi's internal Slate
            ...node,
          };
        }
    
        if (node.children) {
          return {
            ...node,
            children: ensureTextNodesHaveType(node.children),
          };
        }
    
        return node;
      });
    }