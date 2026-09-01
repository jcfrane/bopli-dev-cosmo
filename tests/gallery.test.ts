import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

let themeStyle: HTMLStyleElement;

beforeAll(async () => {
  themeStyle = document.createElement('style');
  themeStyle.textContent = await readFile(resolve(process.cwd(), 'resources/js/theme.css'), 'utf8');
  document.head.append(themeStyle);
});

afterAll(() => themeStyle.remove());

function galleryFixture(): HTMLElement {
  const article = document.createElement('article');
  article.className = 'article-body';
  article.innerHTML = `
        <figure class="bopli-gallery">
            <div class="bopli-gallery__row bopli-gallery__row--3">
                <div class="bopli-gallery__image"><img src="/one.jpg" alt="One"></div>
                <div class="bopli-gallery__image"><img src="/two.jpg" alt="Two"></div>
                <div class="bopli-gallery__image"><img src="/three.jpg" alt="Three"></div>
            </div>
            <figcaption>A gallery caption</figcaption>
        </figure>
    `;

  return article;
}

describe('Dev Cosmo gallery presentation', () => {
  it('matches the stable gallery markup emitted by Bopli', () => {
    const fixture = galleryFixture();

    expect(fixture.querySelectorAll('.bopli-gallery__row--3 img')).toHaveLength(3);
    expect(fixture.querySelector('figcaption')?.textContent).toContain('A gallery caption');
  });

  it('computes the wide, cropped gallery presentation', () => {
    const fixture = galleryFixture();
    document.body.append(fixture);
    const gallery = fixture.querySelector<HTMLElement>('.bopli-gallery');
    const row = fixture.querySelector<HTMLElement>('.bopli-gallery__row--3');
    const image = fixture.querySelector<HTMLImageElement>('.bopli-gallery__image img');

    expect(gallery).not.toBeNull();
    expect(row).not.toBeNull();
    expect(image).not.toBeNull();
    expect(getComputedStyle(gallery!).width).toBe(`${Math.min(1200, window.innerWidth - 48)}px`);
    expect(getComputedStyle(row!).display).toBe('grid');
    expect(getComputedStyle(row!).gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
    expect(getComputedStyle(image!).objectFit).toBe('cover');
    expect(getComputedStyle(image!).getPropertyValue('aspect-ratio')).toBe('4 / 3');
    fixture.remove();
  });
});
