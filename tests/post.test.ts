import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

describe('Dev Cosmo Blog post presentation', () => {
  it('renders the optional standfirst between the title and post metadata', async () => {
    const template = await readFile(
      resolve(process.cwd(), 'resources/js/templates/entries/Post.vue'),
      'utf8',
    );

    const title = template.indexOf('<h1 class="post-title">');
    const standfirst = template.indexOf('<p v-if="post.excerpt" class="post-standfirst">');
    const metadata = template.indexOf('<div class="post-meta-row">');

    expect(title).toBeGreaterThan(-1);
    expect(standfirst).toBeGreaterThan(title);
    expect(metadata).toBeGreaterThan(standfirst);
  });
});
