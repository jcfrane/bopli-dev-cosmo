<script setup lang="ts">
import { defineBlogIndexTemplate } from '@bopli/theme-sdk/authoring';
import { computed, ref } from 'vue';

import SiteLayout from '../../components/SiteLayout.vue';
import TerminalWindow from '../../components/TerminalWindow.vue';
import TreeListing from '../../components/TreeListing.vue';
import type { BlogProps } from '../../.bopli/types';
import { groupEntries, postFileName } from '../../types';

defineBlogIndexTemplate({
  name: 'Cosmic Terminal blog',
  default: true,
});

const props = defineProps<BlogProps>();

const query = ref(props.filters.q);
const groups = computed(() => groupEntries(props.posts.data));
const treeRoot = computed(() => {
  const flags = [
    props.filters.category ? `--category=${props.filters.category}` : null,
    props.filters.tag ? `--tag=${props.filters.tag}` : null,
    props.filters.q ? `--grep="${props.filters.q.toLowerCase()}"` : null,
  ].filter(Boolean);

  return `~/blog${flags.length ? ` ${flags.join(' ')}` : ''}`;
});

function filterUrl(changes: Partial<{ q: string; category: string; tag: string }>): string {
  const filters = { ...props.filters, ...changes };
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }

  return `/blog${params.size ? `?${params.toString()}` : ''}`;
}

function search(): void {
  window.location.assign(filterUrl({ q: query.value.trim() }));
}
</script>

<template>
  <SiteLayout :site="site" :settings="settings" :footer="footer" current-page="blog">
    <main class="archive-main">
      <h1 class="page-title">{{ blog.title || 'All posts' }}</h1>
      <p class="archive-intro">
        The whole archive, laid out the way it lives on disk. Search or pass a tag flag to prune the
        tree.
      </p>

      <div class="archive-controls">
        <form class="search-wrap" action="/blog" method="get" @submit.prevent="search">
          <span class="search-sigil">/</span>
          <input
            v-model="query"
            name="q"
            type="search"
            aria-label="Search posts"
            placeholder='grep -ri "query" ~/blog'
          />
          <input v-if="filters.category" type="hidden" name="category" :value="filters.category" />
          <input v-if="filters.tag" type="hidden" name="tag" :value="filters.tag" />
        </form>
        <div v-if="categories.length" class="tag-row">
          <span class="tag-label">category:</span>
          <a
            v-for="category in categories"
            :key="category.slug"
            class="tag-button"
            :class="{ 'tag-button-active': filters.category === category.slug }"
            :href="filterUrl({ category: filters.category === category.slug ? '' : category.slug })"
            >--category={{ category.slug }}</a
          >
        </div>
        <div v-if="tags.length" class="tag-row">
          <span class="tag-label">filter:</span>
          <a
            v-for="tag in tags"
            :key="tag.slug"
            class="tag-button"
            :class="{ 'tag-button-active': filters.tag === tag.slug }"
            :href="filterUrl({ tag: filters.tag === tag.slug ? '' : tag.slug })"
          >
            <span>--tag=</span>{{ tag.slug }}
          </a>
        </div>
      </div>

      <TerminalWindow :title="`${site.handle}@voyager: ~/blog`">
        <TreeListing v-if="groups.length" :groups="groups" :root="treeRoot" />
        <div v-else>
          <p class="terminal-prompt"><span>$</span> tree {{ treeRoot }}</p>
          <p class="empty-state">
            0 files matched — try <span>--tag=all</span> or clear the query ▌
          </p>
        </div>
      </TerminalWindow>

      <p class="archive-results">
        {{ posts.total }}
        {{ posts.total === 1 ? 'file' : 'files' }},
        {{ groups.length }}
        {{ groups.length === 1 ? 'directory' : 'directories' }}
        <template v-if="posts.data[0]?.url">
          ·
          <a :href="posts.data[0].url"
            >cat {{ groups[0]?.name }}/{{ postFileName(posts.data[0]) }} →</a
          >
        </template>
      </p>
      <nav v-if="posts.lastPage > 1" class="archive-results" aria-label="Blog pages">
        <a v-if="posts.previousUrl" :href="posts.previousUrl">← newer</a>
        <span>page {{ posts.currentPage }} / {{ posts.lastPage }}</span>
        <a v-if="posts.nextUrl" :href="posts.nextUrl">older →</a>
      </nav>
    </main>
  </SiteLayout>
</template>
