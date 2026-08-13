<script setup lang="ts">
import type { BopliSite } from "@bopli/theme-sdk";
import { computed } from "vue";

import "../theme.css";
import type { ThemeSettings } from "../.bopli/types";
import DefaultFooter from "./footers/DefaultFooter.vue";
import DefaultHeader from "./headers/DefaultHeader.vue";

const props = defineProps<{
  site: BopliSite;
  settings: ThemeSettings;
  currentPage: "home" | "about" | "blog" | null;
}>();

const themeStyle = computed(() => ({
  "--color-accent": props.settings.accent_color,
}));
</script>

<template>
  <div class="cosmo-page" :style="themeStyle">
    <slot
      name="header"
      :site="site"
      :current-page="currentPage"
      :show-theme-toggle="settings.show_theme_toggle"
    >
      <DefaultHeader
        :site="site"
        :current-page="currentPage"
        :show-theme-toggle="settings.show_theme_toggle"
      />
    </slot>
    <slot />
    <slot name="footer" :site="site">
      <DefaultFooter :social-links="site.socialLinks" />
    </slot>
  </div>
</template>
