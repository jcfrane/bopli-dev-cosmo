<script setup lang="ts">
import { computed } from "vue";

import "../theme.css";
import type { CosmoSettings } from "../types";
import SiteFooter from "./SiteFooter.vue";
import SiteHeader from "./SiteHeader.vue";

const props = defineProps<{
  site: {
    name: string;
    handle: string;
    tagline?: string | null;
    description?: string | null;
    socialLinks?: Array<{ label: string; url: string }>;
    canonicalUrl: string;
  };
  settings: CosmoSettings;
  currentPage: "home" | "about" | "blog" | null;
}>();

const themeStyle = computed(() => ({
  "--color-accent": props.settings.accent_color,
}));
</script>

<template>
  <div class="cosmo-page" :style="themeStyle">
    <SiteHeader
      :site="site"
      :current-page="currentPage"
      :show-theme-toggle="settings.show_theme_toggle"
    />
    <slot />
    <SiteFooter
      :social-links="site.socialLinks"
      :footer-text="settings.footer_text"
    />
  </div>
</template>
