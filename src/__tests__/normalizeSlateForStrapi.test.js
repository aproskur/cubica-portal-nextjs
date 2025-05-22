import { normalizeSlateForStrapi } from '@/utils/slateTransformHelpers';

describe('normalizeSlateForStrapi', () => {
  it('inserts a paragraph between two adjacent list blocks', () => {
    const input = [
      { type: 'list', format: 'unordered', children: [{ type: 'list-item', children: [{ text: 'Item 1' }] }] },
      { type: 'list', format: 'ordered', children: [{ type: 'list-item', children: [{ text: 'Item 2' }] }] },
    ];

    const result = normalizeSlateForStrapi(input);

    expect(result.length).toBe(3);
    expect(result[1].type).toBe('paragraph');
    expect(result[1].children[0].text).toBe('');
  });

  it('does not modify blocks when lists are not adjacent', () => {
    const input = [
      { type: 'list', format: 'unordered', children: [{ type: 'list-item', children: [{ text: 'Item 1' }] }] },
      { type: 'paragraph', children: [{ text: 'Some text' }] },
      { type: 'list', format: 'ordered', children: [{ type: 'list-item', children: [{ text: 'Item 2' }] }] },
    ];

    const result = normalizeSlateForStrapi(input);

    expect(result).toEqual(input); // nothing should change
  });

  it('handles empty input safely', () => {
    const result = normalizeSlateForStrapi([]);
    expect(result).toEqual([]);
  });
});
