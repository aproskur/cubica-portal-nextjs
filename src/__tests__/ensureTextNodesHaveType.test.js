import { ensureTextNodesHaveType } from '@/utils/slateTransformHelpers';

describe('ensureTextNodesHaveType', () => {
  it('adds type: "text" to a plain text node', () => {
    const input = [{ text: 'Hello' }];
    const result = ensureTextNodesHaveType(input);

    expect(result[0].type).toBe('text');
    expect(result[0].text).toBe('Hello');
  });

  it('leaves existing text nodes with type untouched', () => {
    const input = [{ type: 'text', text: 'Already typed' }];
    const result = ensureTextNodesHaveType(input);

    expect(result[0]).toEqual({ type: 'text', text: 'Already typed' });
  });

  it('recursively adds type: "text" to nested text nodes', () => {
    const input = [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Nested content'
          }
        ]
      }
    ];

    const result = ensureTextNodesHaveType(input);

    expect(result[0].type).toBe('paragraph');
    expect(result[0].children[0].type).toBe('text');
    expect(result[0].children[0].text).toBe('Nested content');
  });

  it('does not modify block nodes without text', () => {
    const input = [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Valid' }]
      }
    ];

    const result = ensureTextNodesHaveType(input);

    expect(result).toEqual(input); // unchanged
  });

  it('ignores empty nodes without text or children', () => {
    const input = [{ type: 'divider' }];
    const result = ensureTextNodesHaveType(input);

    expect(result).toEqual(input); // nothing to fix
  });
});
