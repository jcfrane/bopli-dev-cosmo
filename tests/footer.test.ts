import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const footerPath = resolve(process.cwd(), 'resources/js/components/footers/DefaultFooter.vue');
const socialIconPath = resolve(process.cwd(), 'resources/js/components/SocialIcon.vue');

describe('Dev Cosmo customizable footer', () => {
  it('declares the current credit and an empty custom-link list as defaults', async () => {
    const source = await readFile(footerPath, 'utf8');

    expect(source).toContain("message: 'powered by an open-source cms · theme: cosmic-terminal'");
    expect(source).toContain('links: []');
    expect(source).toContain('show_social_links: setting.boolean');
    expect(source).toContain('default: true');
  });

  it('gates Site social links and protects only external custom links', async () => {
    const source = await readFile(footerPath, 'utf8');

    expect(source).toContain('v-if="footer.settings.show_social_links"');
    expect(source).toContain(':target="isExternal(link.url) ? \'_blank\' : undefined"');
    expect(source).toContain(':rel="isExternal(link.url) ? \'noopener noreferrer\' : undefined"');
    expect(source).toContain('rel="me noreferrer"');
  });

  it('renders recognizable Facebook and Instagram icons with accessible text labels', async () => {
    const footer = await readFile(footerPath, 'utf8');
    const icons = await readFile(socialIconPath, 'utf8');

    expect(footer).toContain('<SocialIcon :label="link.label" />');
    expect(icons).toContain("label === 'Facebook'");
    expect(icons).toContain("label === 'Instagram'");
    expect(icons).toContain('aria-hidden="true"');
  });

  it('passes typed footer data through every public template', async () => {
    const templates = [
      'resources/js/templates/pages/About.vue',
      'resources/js/templates/pages/Blog.vue',
      'resources/js/templates/pages/Home.vue',
      'resources/js/templates/pages/Page.vue',
      'resources/js/templates/entries/Post.vue',
      'resources/js/templates/entries/Project.vue',
    ];

    for (const template of templates) {
      expect(await readFile(resolve(process.cwd(), template), 'utf8')).toContain(
        ':footer="footer"',
      );
    }
  });
});
