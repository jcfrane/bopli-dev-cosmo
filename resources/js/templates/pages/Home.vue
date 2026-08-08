<bopli lang="json">
{
    "name": "Cosmic Terminal home",
    "slots": {
        "featured_post": { "name": "Featured post" },
        "recent_posts": { "name": "Recent posts" },
        "featured_projects": { "name": "Featured projects" }
    }
}
</bopli>

<script setup lang="ts">
import { computed } from 'vue';

import SiteLayout from '../../components/SiteLayout.vue';
import TerminalWindow from '../../components/TerminalWindow.vue';
import TreeListing from '../../components/TreeListing.vue';
import { groupEntries, isoDate, primaryCategory } from '../../types';

type Term = { name: string; slug: string };
type EntryImage = {
    url: string;
    alt: string | null;
    width: number | null;
    height: number | null;
};
type Entry = {
    title: string;
    slug: string;
    url: string | null;
    publishedAt: string | null;
    terms: Record<string, Term[]>;
    excerpt?: string;
    readTime?: number;
    featureImage?: EntryImage | null;
};

type HomeProps = {
    site: {
        name: string;
        handle: string;
        tagline?: string | null;
        description?: string | null;
        socialLinks?: Array<{ label: string; url: string }>;
        canonicalUrl: string;
    };
    page: {
        title: string;
        path: string;
        fields: Record<string, unknown>;
        seoTitle: string | null;
        seoDescription: string | null;
    };
    slots: {
        featured_post?: Entry[];
        recent_posts?: Entry[];
        featured_projects?: Entry[];
    };
    preview?: boolean;
};

const props = defineProps<HomeProps>();

const featuredPost = computed(() => props.slots.featured_post?.[0]);
const recentGroups = computed(() =>
    groupEntries(props.slots.recent_posts ?? []),
);
const featuredCategory = computed(() =>
    featuredPost.value ? primaryCategory(featuredPost.value) : undefined,
);
</script>

<template>
    <SiteLayout :site="site" current-page="home">
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
                        --category={{
                            featuredCategory?.slug ?? 'uncategorized'
                        }}
                    </span>
                    <h1>
                        {{
                            featuredPost?.title ??
                            site.tagline ??
                            'The next transmission is on its way.'
                        }}
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
                        }}<template v-if="featuredPost.readTime">
                            · {{ featuredPost.readTime }} min</template
                        >
                    </div>
                    <a
                        v-if="featuredPost?.url"
                        class="button-link"
                        :href="featuredPost.url"
                        >read --more →</a
                    >
                </div>
                <img
                    v-if="featuredPost?.featureImage"
                    class="hero-cover"
                    :src="featuredPost.featureImage.url"
                    :alt="featuredPost.featureImage.alt ?? featuredPost.title"
                    :width="featuredPost.featureImage.width ?? 840"
                    :height="featuredPost.featureImage.height ?? 600"
                />
            </div>
        </header>

        <main class="latest-section">
            <h2 class="section-title"><span>$</span> latest posts</h2>
            <p class="section-intro">
                Recent writing, straight from the filesystem. Directories are
                categories — click to collapse.
            </p>
            <TerminalWindow :title="`${site.handle}@voyager: ~/blog`">
                <TreeListing
                    v-if="recentGroups.length"
                    :groups="recentGroups"
                    root="~/blog --latest"
                />
                <p v-else class="empty-state">
                    0 files matched — the first transmission is being prepared
                    <span>▌</span>
                </p>
            </TerminalWindow>
            <div class="latest-action">
                <a class="outline-link" href="/blog"
                    >cd ~/blog · view all posts →</a
                >
            </div>
        </main>
    </SiteLayout>
</template>
