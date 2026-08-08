<script setup lang="ts">
import { ref, watch } from 'vue';

import type { TreeGroup } from '../types';
import { isoDate, postFileName } from '../types';

const props = withDefaults(
    defineProps<{
        groups: TreeGroup[];
        root?: string;
    }>(),
    { root: '~/blog' },
);

const openDirectories = ref(new Set(props.groups.map((group) => group.name)));

watch(
    () => props.groups.map((group) => group.name).join('|'),
    () => {
        openDirectories.value = new Set(
            props.groups
                .map((group) => group.name)
                .filter((name) => openDirectories.value.has(name)),
        );

        if (openDirectories.value.size === 0) {
            openDirectories.value = new Set(
                props.groups.map((group) => group.name),
            );
        }
    },
);

function toggleDirectory(name: string): void {
    const next = new Set(openDirectories.value);

    if (next.has(name)) {
        next.delete(name);
    } else {
        next.add(name);
    }

    openDirectories.value = next;
}
</script>

<template>
    <div class="tree-listing">
        <p class="terminal-prompt"><span>$</span> tree {{ root }}</p>

        <template v-for="(group, groupIndex) in groups" :key="group.name">
            <button
                class="tree-row tree-directory"
                type="button"
                :aria-expanded="openDirectories.has(group.name)"
                @click="toggleDirectory(group.name)"
            >
                <span class="tree-glyph">{{
                    groupIndex === groups.length - 1 ? '└── ' : '├── '
                }}</span>
                <span class="tree-name">
                    <span class="tree-caret">{{
                        openDirectories.has(group.name) ? '▾' : '▸'
                    }}</span
                    >{{ group.name }}/
                </span>
                <span class="tree-meta"
                    >{{ group.entries.length }}
                    {{ group.entries.length === 1 ? 'item' : 'items' }}</span
                >
            </button>

            <template v-if="openDirectories.has(group.name)">
                <a
                    v-for="(entry, entryIndex) in group.entries"
                    :key="entry.slug"
                    class="tree-row tree-file"
                    :href="entry.url ?? '/blog'"
                >
                    <span class="tree-glyph"
                        >{{ groupIndex === groups.length - 1 ? '    ' : '│   '
                        }}{{
                            entryIndex === group.entries.length - 1
                                ? '└── '
                                : '├── '
                        }}</span
                    >
                    <span class="tree-name">{{ postFileName(entry) }}</span>
                    <span class="tree-meta"
                        >{{ isoDate(entry.publishedAt)
                        }}<template v-if="entry.readTime">
                            · {{ entry.readTime }} min</template
                        ></span
                    >
                </a>
            </template>
        </template>
    </div>
</template>
