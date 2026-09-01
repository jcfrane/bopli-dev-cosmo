import { describe, expect, it, vi } from 'vitest';

import { enhanceCodeBlocks } from '../resources/js/code-highlighting';

function article(html: string): HTMLElement {
  const root = document.createElement('article');
  root.innerHTML = html;

  return root;
}

describe('enhanceCodeBlocks', () => {
  it('highlights a supported language and prevents duplicate enhancement', async () => {
    const root = article(
      '<pre data-language="typescript"><code class="language-typescript">const answer: number = 42;</code></pre>',
    );

    const dispose = await enhanceCodeBlocks(root, {
      writeText: vi.fn(),
    });
    await enhanceCodeBlocks(root, { writeText: vi.fn() });

    expect(root.querySelectorAll('.code-block')).toHaveLength(1);
    expect(root.querySelector('pre.shiki')).not.toBeNull();
    expect(root.querySelector('.code-block')?.getAttribute('data-language')).toBe('typescript');
    expect(root.querySelectorAll('.code-block__window-control')).toHaveLength(3);
    expect(root.querySelector('.code-block__window-controls')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
    expect(root.querySelector('.code-block__title')?.textContent).toBe('~/code—typescript');
    expect(root.textContent).toContain('const answer: number = 42;');
    dispose();
  });

  it('keeps unknown languages readable as plain text', async () => {
    const root = article(
      '<pre data-language="unknown"><code class="language-unknown">literal &lt;value&gt;</code></pre>',
    );

    const dispose = await enhanceCodeBlocks(root, {
      writeText: vi.fn(),
    });

    expect(root.querySelector('pre')?.dataset.language).toBe('txt');
    expect(root.querySelector('code')?.textContent).toBe('literal <value>');
    expect(root.querySelector('pre.shiki')).toBeNull();
    dispose();
  });

  it('copies the original code and reports success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const root = article('<pre data-language="txt"><code>first line\nsecond line</code></pre>');
    const dispose = await enhanceCodeBlocks(root, { writeText });
    const button = root.querySelector<HTMLButtonElement>('.code-block__copy');

    expect(button).not.toBeNull();
    button?.click();
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledOnce());

    expect(writeText).toHaveBeenCalledWith('first line\nsecond line');
    expect(button?.textContent).toBe('Copied');
    expect(button?.dataset.state).toBe('success');
    dispose();
  });
});
