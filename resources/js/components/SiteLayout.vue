<script setup lang="ts">
import '../theme.css';
import SiteFooter from './SiteFooter.vue';
import SiteHeader from './SiteHeader.vue';

defineProps<{
    site: {
        name: string;
        handle: string;
        tagline?: string | null;
        description?: string | null;
        socialLinks?: Array<{ label: string; url: string }>;
        canonicalUrl: string;
    };
    currentPage: 'home' | 'about' | 'blog';
}>();
</script>

<template>
    <div class="cosmo-page">
        <SiteHeader :current-page="currentPage" />
        <slot />
        <SiteFooter :social-links="site.socialLinks" />
    </div>
</template>
