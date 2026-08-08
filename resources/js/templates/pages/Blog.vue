<bopli lang="json">
{
    "name": "Cosmic Terminal blog",
    "slots": {
        "posts": { "name": "Posts" }
    }
}
</bopli>

<script setup lang="ts">
import { computed, ref } from 'vue';

import SiteLayout from '../../components/SiteLayout.vue';
import TerminalWindow from '../../components/TerminalWindow.vue';
import TreeListing from '../../components/TreeListing.vue';
import { groupEntries, postFileName } from '../../types';

type Term = { name: string; slug: string };
type Entry = {
    title: string;
    slug: string;
    url: string | null;
    publishedAt: string | null;
    terms: Record<string, Term[]>;
    excerpt?: string;
    readTime?: number;
    featureImage?: {
        url: string;
        alt: string | null;
        width: number | null;
        height: number | null;
    } | null;
};

type BlogProps = {
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
    slots: { posts?: Entry[] };
    preview?: boolean;
};

const props = defineProps<BlogProps>();

const query = ref('');
const activeTag = ref<string | null>(null);

const tags = computed(() =>
    Array.from(
        new Set(
            (props.slots.posts ?? []).flatMap((entry) =>
                (entry.terms.tag ?? []).map((term) => term.slug),
            ),
        ),
    ).sort(),
);

const filteredPosts = computed(() => {
    const search = query.value.trim().toLowerCase();

    return (props.slots.posts ?? []).filter((entry) => {
        const matchesQuery =
            search === '' ||
            postFileName(entry).toLowerCase().includes(search) ||
            entry.title.toLowerCase().includes(search);
        const matchesTag =
            activeTag.value === null ||
            (entry.terms.tag ?? []).some(
                (term) => term.slug === activeTag.value,
            );

        return matchesQuery && matchesTag;
    });
});

const filteredGroups = computed(() => groupEntries(filteredPosts.value));
const treeRoot = computed(() => {
    const flags = [
        activeTag.value ? `--tag=${activeTag.value}` : null,
        query.value.trim()
            ? `--grep="${query.value.trim().toLowerCase()}"`
            : null,
    ].filter(Boolean);

    return `~/blog${flags.length ? ` ${flags.join(' ')}` : ''}`;
});

function toggleTag(tag: string): void {
    activeTag.value = activeTag.value === tag ? null : tag;
}
</script>

<template>
    <SiteLayout :site="site" current-page="blog">
        <main class="archive-main">
            <h1 class="page-title">{{ page.title || 'All posts' }}</h1>
            <p class="archive-intro">
                The whole archive, laid out the way it lives on disk. Search or
                pass a tag flag to prune the tree.
            </p>

            <div class="archive-controls">
                <label class="search-wrap">
                    <span class="search-sigil">/</span>
                    <input
                        v-model="query"
                        type="search"
                        aria-label="Search posts"
                        placeholder='grep -ri "query" ~/blog'
                    />
                </label>
                <div v-if="tags.length" class="tag-row">
                    <span class="tag-label">filter:</span>
                    <button
                        v-for="tag in tags"
                        :key="tag"
                        class="tag-button"
                        :class="{ 'tag-button-active': activeTag === tag }"
                        type="button"
                        :aria-pressed="activeTag === tag"
                        @click="toggleTag(tag)"
                    >
                        <span>--tag=</span>{{ tag }}
                    </button>
                </div>
            </div>

            <TerminalWindow :title="`${site.handle}@voyager: ~/blog`">
                <TreeListing
                    v-if="filteredGroups.length"
                    :groups="filteredGroups"
                    :root="treeRoot"
                />
                <div v-else>
                    <p class="terminal-prompt">
                        <span>$</span> tree {{ treeRoot }}
                    </p>
                    <p class="empty-state">
                        0 files matched — try <span>--tag=all</span> or clear
                        the query ▌
                    </p>
                </div>
            </TerminalWindow>

            <p class="archive-results">
                {{ filteredPosts.length }}
                {{ filteredPosts.length === 1 ? 'file' : 'files' }},
                {{ filteredGroups.length }}
                {{ filteredGroups.length === 1 ? 'directory' : 'directories' }}
                <template v-if="filteredPosts[0]?.url">
                    ·
                    <a :href="filteredPosts[0].url"
                        >cat {{ filteredGroups[0]?.name }}/{{
                            postFileName(filteredPosts[0])
                        }}
                        →</a
                    >
                </template>
            </p>
        </main>
    </SiteLayout>
</template>
