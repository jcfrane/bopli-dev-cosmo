<script setup lang="ts">
import { definePageTemplate, field } from '@bopli/theme-sdk/authoring';
import { computed } from 'vue';
import { useBopliQuery } from '@bopli/theme-sdk';

import SiteLayout from '../../components/SiteLayout.vue';
import TerminalWindow from '../../components/TerminalWindow.vue';
import TreeListing from '../../components/TreeListing.vue';
import type { HomeProps } from '../../.bopli/types';
import { groupEntries, isoDate, primaryCategory } from '../../types';
import type { CosmoEntry } from '../../types';

definePageTemplate({
  name: 'Cosmic Terminal home',
  fields: {
    body: field.longText(),
  },
});

const props = defineProps<HomeProps>();

const featuredQuery = useBopliQuery<CosmoEntry>({
  source: 'blog.posts',
  filter: { featured: true },
  sort: '-published_at',
  limit: 1,
});
const recentQuery = useBopliQuery<CosmoEntry>({
  source: 'blog.posts',
  sort: '-published_at',
  limit: Number(props.settings.homepage_post_count ?? 10),
});
const featuredPost = computed(() => featuredQuery.data.value[0] ?? recentQuery.data.value[0]);
const recentGroups = computed(() => groupEntries(recentQuery.data.value));
const featuredCategory = computed(() =>
  featuredPost.value ? primaryCategory(featuredPost.value) : undefined,
);
</script>

<template>
  <SiteLayout :site="site" :settings="settings" :footer="footer" current-page="home">
    <header class="home-hero">
      <div class="hero-starfield" />
      <div class="hero-orbit" />
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="prompt-line">
            <span>$</span>
            cat ~/blog/{{ featuredCategory?.slug ?? 'latest' }}/{{
              featuredPost?.slug ?? 'pending'
            }}.md
          </p>
          <span class="category-pill">
            --category={{ featuredCategory?.slug ?? 'uncategorized' }}
          </span>
          <h1>
            {{ featuredPost?.title ?? site.tagline ?? 'The next transmission is on its way.' }}
          </h1>
          <p class="hero-deck">
            {{
              featuredPost?.excerpt ??
              site.description ??
              'Writing about software, systems, and the craft of building useful things.'
            }}
          </p>
          <div v-if="featuredPost" class="hero-meta">
            {{ isoDate(featuredPost.publishedAt)
            }}<template v-if="featuredPost.readingTimeMinutes">
              · {{ featuredPost.readingTimeMinutes }} min</template
            >
          </div>
          <a v-if="featuredPost?.url" class="button-link" :href="featuredPost.url">read --more →</a>
        </div>
        <img
          v-if="featuredPost?.coverImage"
          class="hero-cover"
          :src="featuredPost.coverImage.url"
          :alt="featuredPost.coverImage.alt ?? featuredPost.title ?? ''"
          :width="featuredPost.coverImage.width ?? 840"
          :height="featuredPost.coverImage.height ?? 600"
          fetchpriority="high"
        />
      </div>
    </header>

    <main class="latest-section">
      <h2 class="section-title"><span>$</span> latest posts</h2>
      <p class="section-intro">
        Recent writing, straight from the filesystem. Directories are categories — click to
        collapse.
      </p>
      <TerminalWindow :title="`${site.handle}@voyager: ~/blog`">
        <TreeListing v-if="recentGroups.length" :groups="recentGroups" root="~/blog --latest" />
        <p v-else-if="recentQuery.loading.value" class="empty-state">
          scanning ~/blog for recent transmissions <span>▌</span>
        </p>
        <p v-else-if="recentQuery.error.value" class="empty-state">
          query failed — retry when the uplink is restored
        </p>
        <p v-else class="empty-state">
          0 files matched — the first transmission is being prepared
          <span>▌</span>
        </p>
      </TerminalWindow>
      <div class="latest-action">
        <a class="outline-link" href="/blog">cd ~/blog · view all posts →</a>
      </div>
    </main>
  </SiteLayout>
</template>
