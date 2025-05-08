import { getAttributeValue } from 'domutils';

export const htmlToSlateConfig = {
  elementTags: {
    p: () => ({ type: 'paragraph' }),
    h1: () => ({ type: 'heading', level: 1 }),
    h2: () => ({ type: 'heading', level: 2 }),
    h3: () => ({ type: 'heading', level: 3 }),
    h4: () => ({ type: 'heading', level: 4 }),
    h5: () => ({ type: 'heading', level: 5 }),
    h6: () => ({ type: 'heading', level: 6 }),
    ul: () => ({ type: 'list', format: 'unordered' }),
    ol: (el) => {
      // Quill sometimes uses <ol><li data-list="bullet">...
      const isBulletList = Array.from(el.children || []).some(
        (li) => getAttributeValue(li, 'data-list') === 'bullet'
      );
      return {
        type: 'list',
        format: isBulletList ? 'unordered' : 'ordered',
      };
    },
    li: () => ({ type: 'list-item' }),
    blockquote: () => ({ type: 'quote' }),
    a: (el) => ({
      type: 'link',
      url: getAttributeValue(el, 'href'),
      newTab: getAttributeValue(el, 'target') === '_blank',
    }),
  },
  textTags: {
    strong: () => ({ bold: true }),
    b: () => ({ bold: true }),
    em: () => ({ italic: true }),
    i: () => ({ italic: true }),
    u: () => ({ underline: true }),
    s: () => ({ strikethrough: true }),
    del: () => ({ strikethrough: true }),
    code: () => ({ code: true }),
    pre: () => ({ code: true }),
  },
  htmlPreProcessString: (html) => {
    // Clean up weird Quill spans and ensure proper <ul> for bullets
    return html
      .replace(/<span class="ql-ui"[^>]*><\/span>/g, '') // remove Quill UI spans
      .replace(/<ol([^>]*)data-list="bullet"([^>]*)>/gi, '<ul$1$2>'); // fix bullets
  },
  filterWhitespaceNodes: true,
  convertBrToLineBreak: true,
  trimWhiteSpace: true,
};
