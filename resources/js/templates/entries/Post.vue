<script setup lang="ts">
import type { BopliImage } from '@bopli/theme-sdk';
import { defineBlogPostTemplate } from '@bopli/theme-sdk/authoring';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import SiteLayout from '../../components/SiteLayout.vue';
import type { PostProps } from '../../.bopli/types';
import { isoDate, postFileName, primaryCategory } from '../../types';

defineBlogPostTemplate({
  name: 'Cosmic Terminal post',
  default: true,
});

// Optional host extension until the published SDK includes creator profiles.
type PostAuthor = {
  name: string;
  profileImage: BopliImage | null;
  bio: string | null;
  bioHtml?: string | null;
  link: { url: string; label: string } | null;
};
const props = defineProps<PostProps>();
const author = computed(
  () => (props.post as PostProps['post'] & { author?: PostAuthor | null }).author,
);

const progress = ref(0);
const articleBody = ref<HTMLElement | null>(null);
const category = computed(() => primaryCategory(props.post));
const authorInitials = computed(
  () =>
    author.value?.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() ?? '',
);
let disposeCodeBlocks = (): void => {};
let codeObserver: IntersectionObserver | undefined;
let enhancementRun = 0;

async function scheduleArticleCode(): Promise<void> {
  const run = ++enhancementRun;
  codeObserver?.disconnect();
  codeObserver = undefined;
  disposeCodeBlocks();
  disposeCodeBlocks = (): void => {};
  await nextTick();

  const firstBlock = articleBody.value?.querySelector('pre');
  if (!firstBlock || run !== enhancementRun) return;

  if (!('IntersectionObserver' in window)) {
    await enhanceArticleCode(run);

    return;
  }

  codeObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;

      codeObserver?.disconnect();
      codeObserver = undefined;
      void enhanceArticleCode(run);
    },
    { rootMargin: '300px 0px' },
  );
  codeObserver.observe(firstBlock);
}

async function enhanceArticleCode(run: number): Promise<void> {
  if (!articleBody.value || run !== enhancementRun) return;

  const { enhanceCodeBlocks } = await import('../../code-highlighting');
  if (run !== enhancementRun) return;

  const dispose = await enhanceCodeBlocks(articleBody.value);

  if (run === enhancementRun) {
    disposeCodeBlocks = dispose;
  } else {
    dispose();
  }
}

function updateProgress(): void {
  const root = document.documentElement;
  const scrollable = root.scrollHeight - root.clientHeight;
  progress.value = scrollable > 0 ? Math.min(100, (root.scrollTop / scrollable) * 100) : 0;
}

onMounted(() => {
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  void scheduleArticleCode();
});

watch(
  () => props.post.body,
  () => void scheduleArticleCode(),
);

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateProgress);
  enhancementRun += 1;
  codeObserver?.disconnect();
  disposeCodeBlocks();
});
</script>

<template>
  <SiteLayout :site="site" :settings="settings" :footer="footer" current-page="blog">
    <div
      class="reading-progress"
      role="progressbar"
      aria-label="Reading progress"
      :aria-valuenow="Math.round(progress)"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <span :style="{ width: `${progress}%` }" />
    </div>

    <main class="post-main">
      <article class="post-article">
        <div class="breadcrumb">
          <a href="/blog">~/blog</a> / {{ category?.slug ?? 'uncategorized' }} /
          <span class="breadcrumb-current">{{ postFileName(post) }}</span>
        </div>

        <h1 class="post-title">{{ post.title }}</h1>
        <p v-if="post.excerpt" class="post-standfirst">{{ post.excerpt }}</p>
        <div class="post-meta-row">
          <div class="post-meta">
            {{ isoDate(post.publishedAt)
            }}<template v-if="post.readingTimeMinutes">
              · {{ post.readingTimeMinutes }} min</template
            >
          </div>
          <div v-if="post.tags.length" class="post-tags">
            <span v-for="term in post.tags" :key="term.slug" class="post-tag"
              >--tag={{ term.slug }}</span
            >
          </div>
        </div>

        <figure v-if="post.coverImage" class="post-figure">
          <img
            class="post-cover"
            :src="post.coverImage.url"
            :alt="post.coverImage.alt ?? post.title ?? ''"
            :width="post.coverImage.width ?? 1360"
            :height="post.coverImage.height ?? 680"
            fetchpriority="high"
          />
          <figcaption v-if="post.coverImage.alt">
            fig 1 — {{ post.coverImage.alt.toLowerCase() }}
          </figcaption>
        </figure>

        <div ref="articleBody" class="article-body" v-html="post.body" />

        <hr class="comet-divider" />

        <div v-if="author" class="author-card">
          <img
            v-if="author.profileImage"
            class="author-portrait author-portrait-avatar"
            :src="author.profileImage.url"
            :alt="author.profileImage.alt ?? author.name"
          />
          <span
            v-else
            class="author-portrait author-portrait-avatar author-initials"
            aria-hidden="true"
            >{{ authorInitials }}</span
          >
          <div class="author-card-copy">
            <strong>Written by {{ author.name }}</strong>
            <div v-if="author.bio || author.link">
              <div v-if="author.bioHtml" class="author-bio" v-html="author.bioHtml" />
              <span v-else-if="author.bio" class="author-bio">{{ author.bio }}</span>
              <a v-if="author.link" :href="author.link.url">{{ author.link.label }} →</a>
            </div>
          </div>
        </div>

        <nav v-if="post.previous || post.next" class="post-pager" aria-label="Adjacent posts">
          <a v-if="post.previous" class="pager-link" :href="post.previous.url ?? '/blog'">
            <span>‹ prev</span>
            <span>{{ post.previous.slug }}.md</span>
          </a>
          <span v-else />
          <a v-if="post.next" class="pager-link pager-link-next" :href="post.next.url ?? '/blog'">
            <span>next ›</span>
            <span>{{ post.next.slug }}.md</span>
          </a>
        </nav>
      </article>
    </main>
  </SiteLayout>
</template>

<style scoped>
.author-bio :deep(p + p) {
  margin-top: 0.5em;
}
.author-bio :deep(ul) {
  list-style: disc;
  padding-left: 1.5em;
}
.author-bio :deep(ol) {
  list-style: decimal;
  padding-left: 1.5em;
}
.author-bio :deep(strong) {
  font-weight: 700;
}
.author-bio :deep(em) {
  font-style: italic;
}
</style>
