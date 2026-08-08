<bopli lang="json">
{
    "name": "Cosmic Terminal post",
    "fields": {
        "excerpt": { "name": "Excerpt", "type": "long_text", "required": true },
        "body": { "name": "Body", "type": "rich_text", "required": true },
        "readTime": { "name": "Read time", "type": "number" },
        "featureImage": { "name": "Feature image", "type": "image" }
    }
}
</bopli>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import AuthorPortrait from '../../components/AuthorPortrait.vue';
import SiteLayout from '../../components/SiteLayout.vue';
import { isoDate, postFileName, primaryCategory } from '../../types';

type AdjacentEntry = {
    title: string;
    slug: string;
    url: string;
};

type Term = { name: string; slug: string };
type PostProps = {
    site: {
        name: string;
        handle: string;
        tagline?: string | null;
        description?: string | null;
        socialLinks?: Array<{ label: string; url: string }>;
        canonicalUrl: string;
    };
    entry: {
        title: string;
        slug: string;
        url: string | null;
        canonicalPath: string;
        publishedAt: string | null;
        terms: Record<string, Term[]>;
        seoTitle: string | null;
        seoDescription: unknown;
        excerpt: string;
        body: string;
        readTime?: number;
        featureImage?: {
            url: string;
            alt: string | null;
            width: number | null;
            height: number | null;
        } | null;
        previous?: AdjacentEntry | null;
        next?: AdjacentEntry | null;
    };
    preview?: boolean;
};

const props = defineProps<PostProps>();

const progress = ref(0);
const category = computed(() => primaryCategory(props.entry));

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
    <SiteLayout :site="site" current-page="blog">
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
                        postFileName(entry)
                    }}</span>
                </div>

                <h1 class="post-title">{{ entry.title }}</h1>
                <div class="post-meta-row">
                    <div class="post-meta">
                        {{ isoDate(entry.publishedAt)
                        }}<template v-if="entry.readTime">
                            · {{ entry.readTime }} min</template
                        >
                    </div>
                    <div v-if="entry.terms.tag?.length" class="post-tags">
                        <span
                            v-for="term in entry.terms.tag"
                            :key="term.slug"
                            class="post-tag"
                            >--tag={{ term.slug }}</span
                        >
                    </div>
                </div>

                <figure v-if="entry.featureImage" class="post-figure">
                    <img
                        class="post-cover"
                        :src="entry.featureImage.url"
                        :alt="entry.featureImage.alt ?? entry.title"
                        :width="entry.featureImage.width ?? 1360"
                        :height="entry.featureImage.height ?? 680"
                    />
                    <figcaption v-if="entry.featureImage.alt">
                        fig 1 — {{ entry.featureImage.alt.toLowerCase() }}
                    </figcaption>
                </figure>

                <div class="article-body" v-html="entry.body" />

                <hr class="comet-divider" />

                <div class="author-card">
                    <AuthorPortrait
                        size="avatar"
                        :alt="`Illustrated portrait of ${site.name}`"
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
                    v-if="entry.previous || entry.next"
                    class="post-pager"
                    aria-label="Adjacent posts"
                >
                    <a
                        v-if="entry.previous"
                        class="pager-link"
                        :href="entry.previous.url"
                    >
                        <span>‹ prev</span>
                        <span>{{ entry.previous.slug }}.md</span>
                    </a>
                    <span v-else />
                    <a
                        v-if="entry.next"
                        class="pager-link pager-link-next"
                        :href="entry.next.url"
                    >
                        <span>next ›</span>
                        <span>{{ entry.next.slug }}.md</span>
                    </a>
                </nav>
            </article>
        </main>
    </SiteLayout>
</template>
