<bopli lang="json">
{
    "name": "Cosmic Terminal post",
    "kind": "blog_post",
    "default": true
}
</bopli>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import AuthorPortrait from '../../components/AuthorPortrait.vue';
import SiteLayout from '../../components/SiteLayout.vue';
import { isoDate, postFileName, primaryCategory } from '../../types';
import type { CosmoBlogPostProps } from '../../types';

const props = defineProps<CosmoBlogPostProps>();

const progress = ref(0);
const category = computed(() => primaryCategory(props.post));

function updateProgress(): void {
    const root = document.documentElement;
    const scrollable = root.scrollHeight - root.clientHeight;
    progress.value =
        scrollable > 0 ? Math.min(100, (root.scrollTop / scrollable) * 100) : 0;
}

onMounted(() => {
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateProgress);
});
</script>

<template>
    <SiteLayout :site="site" :settings="settings" current-page="blog">
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
                    <a href="/blog">~/blog</a> /
                    {{ category?.slug ?? 'uncategorized' }} /
                    <span class="breadcrumb-current">{{
                    postFileName(post)
                    }}</span>
                </div>

                <h1 class="post-title">{{ post.title }}</h1>
                <div class="post-meta-row">
                    <div class="post-meta">
                        {{ isoDate(post.publishedAt)
                        }}<template v-if="post.readingTimeMinutes">
                            · {{ post.readingTimeMinutes }} min</template
                        >
                    </div>
                    <div v-if="post.tags.length" class="post-tags">
                        <span
                            v-for="term in post.tags"
                            :key="term.slug"
                            class="post-tag"
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
                    />
                    <figcaption v-if="post.coverImage.alt">
                        fig 1 — {{ post.coverImage.alt.toLowerCase() }}
                    </figcaption>
                </figure>

                <div class="article-body" v-html="post.body" />

                <hr class="comet-divider" />

                <div class="author-card">
                    <AuthorPortrait
                        size="avatar"
                        :source="settings.author_portrait?.url ?? site.owner?.profileImage?.url"
                        :alt="settings.author_portrait?.alt ?? site.owner?.profileImage?.alt ?? `Illustrated portrait of ${site.name}`"
                    />
                    <div class="author-card-copy">
                        <strong
                            >Written by the resident of
                            <span><span>~</span>/blog</span></strong
                        >
                        <p>
                            {{
                                site.description ??
                                'Backend engineer, amateur astronomer, dotfiles archivist.'
                            }}
                            <a href="/about">more --about →</a>
                        </p>
                    </div>
                </div>

                <nav
                    v-if="post.previous || post.next"
                    class="post-pager"
                    aria-label="Adjacent posts"
                >
                    <a
                        v-if="post.previous"
                        class="pager-link"
                        :href="post.previous.url ?? '/blog'"
                    >
                        <span>‹ prev</span>
                        <span>{{ post.previous.slug }}.md</span>
                    </a>
                    <span v-else />
                    <a
                        v-if="post.next"
                        class="pager-link pager-link-next"
                        :href="post.next.url ?? '/blog'"
                    >
                        <span>next ›</span>
                        <span>{{ post.next.slug }}.md</span>
                    </a>
                </nav>
            </article>
        </main>
    </SiteLayout>
</template>
