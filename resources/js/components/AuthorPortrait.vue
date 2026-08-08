<script setup lang="ts">
import portraitUrl from '../../images/cosmic-author-portrait.jpg';

withDefaults(defineProps<{ size?: 'avatar' | 'portrait'; alt?: string }>(), {
    size: 'portrait',
    alt: 'Illustrated portrait of the site author',
});
</script>

<template>
    <img
        class="author-portrait"
        :class="`author-portrait-${size}`"
        :src="portraitUrl"
        :alt="alt"
    />
</template>
