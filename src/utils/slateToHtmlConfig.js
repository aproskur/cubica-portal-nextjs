import { Element } from 'domhandler';

const ELEMENT_NAME_TAG_MAP = {
  paragraph: 'p',
  'list-item': 'li',
  quote: 'blockquote',
  // REMOVE: list, heading – handled in elementTransforms below
};

const MARK_ELEMENT_TAG_MAP = {
  bold: ['strong'],
  italic: ['em'],
  underline: ['u'],
  strikethrough: ['s'],
  code: ['code'],
};

export const slateToHtmlConfig = {
  elementMap: ELEMENT_NAME_TAG_MAP,
  markMap: MARK_ELEMENT_TAG_MAP,
  elementTransforms: {
    heading: ({ node, children = [] }) => {
      const level = node.level || 2;
      return new Element(`h${level}`, {}, children);
    },
    list: ({ node, children = [] }) => {
      const tag = node.format === 'unordered' ? 'ul' : 'ol';
      return new Element(tag, {}, children);
    },
    quote: ({ children = [] }) => {
      const p = new Element('p', {}, children);
      return new Element('blockquote', {}, [p]);
    },
    link: ({ node, children = [] }) => {
      const attrs = {
        href: node.url,
      };
      if (node.newTab) {
        attrs.target = '_blank';
      }
      return new Element('a', attrs, children);
    },
  },
  encodeEntities: false,
  alwaysEncodeBreakingEntities: true,
  alwaysEncodeCodeEntities: false,
  convertLineBreakToBr: false,
};
