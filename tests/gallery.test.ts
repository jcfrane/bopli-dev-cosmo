import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { beforeAll, describe, expect, it } from 'vitest';

let themeCss = '';

beforeAll(async () => {
    themeCss = await readFile(resolve(process.cwd(), 'resources/js/theme.css'), 'utf8');
});

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
        expect(fixture.querySelector('figcaption')?.textContent).toContain(
            'A gallery caption',
        );
    });

    it('defines wide, cropped, and responsive gallery layouts', () => {
        expect(themeCss).toContain('width: min(1200px, calc(100vw - 48px));');
        expect(themeCss).toContain('.article-body .bopli-gallery__row--3');
        expect(themeCss).toContain('.article-body .bopli-gallery__row--1');
        expect(themeCss).toContain('grid-template-columns: repeat(3, minmax(0, 1fr));');
        expect(themeCss).toContain('aspect-ratio: 16 / 9;');
        expect(themeCss).toContain('object-fit: cover;');
        expect(themeCss).toContain('@media (max-width: 860px)');
        expect(themeCss).toContain('@media (max-width: 640px)');
        expect(themeCss).toMatch(
            /\.article-body \.bopli-gallery__row--2,\s*\.article-body \.bopli-gallery__row--3 \{\s*grid-template-columns: 1fr;/,
        );
    });
});
