import { cleanQuillHtml } from '@/utils/slateTransformHelpers';

describe('cleanQuillHtml', () => {
  it('removes ql-ui spans', () => {
    const input = '<p><span class="ql-ui"></span>Text</p>';
    const result = cleanQuillHtml(input);
    expect(result).not.toContain('ql-ui');
  });

  it('converts <ol><li data-list="bullet"> to <ul>', () => {
    const input = '<ol><li data-list="bullet">Item</li></ol>';
    const result = cleanQuillHtml(input);
    expect(result).toContain('<ul>');
    expect(result).not.toContain('data-list="bullet"');
  });

  it('removes multiple ql-ui spans', () => {
    const input = '<li><span class="ql-ui"></span>One</li><li><span class="ql-ui"></span>Two</li>';
    const result = cleanQuillHtml(input);
    expect(result).not.toContain('ql-ui');
  });

  it('splits mixed data-list types into separate lists', () => {
    const input = `
      <ol>
        <li data-list="bullet">Unordered 1</li>
        <li data-list="bullet">Unordered 2</li>
        <li data-list="ordered">Ordered 1</li>
        <li data-list="ordered">Ordered 2</li>
      </ol>
    `;
    const result = cleanQuillHtml(input);
  
    // Expect both <ul> and <ol> to be present after fix
    expect(result).toContain('<ul>');
    expect(result).toContain('<ol>');
    expect(result).not.toContain('data-list');
  });

  it('removes data-list from ordered list items', () => {
    const input = '<ol><li data-list="ordered">Item</li></ol>';
    const result = cleanQuillHtml(input);
    expect(result).not.toContain('data-list');
  });
    
  it('keeps the text content untouched', () => {
    const input = '<p>Hello <strong>world</strong></p>';
    const result = cleanQuillHtml(input);
    expect(result).toContain('<p>');
    expect(result).toContain('Hello');
    expect(result).toContain('<strong>world</strong>');
  });
  
  
});
