<bopli lang="json">
{
  "name": "Cosmic Terminal page",
  "default": true
}
</bopli>

<script setup lang="ts">
import { computed } from "vue";

import SiteLayout from "../../components/SiteLayout.vue";
import type { CosmoPageProps } from "../../types";

const props = defineProps<CosmoPageProps>();
const paragraphs = computed(() =>
  String(props.page.fields.body ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean),
);
</script>

<template>
  <SiteLayout :site="site" :settings="settings" :current-page="null">
    <main class="about-main">
      <p class="about-prompt"><span>$</span> cat {{ page.path }}</p>
      <h1 class="page-title">{{ page.title }}</h1>
      <div class="about-bio">
        <p v-for="paragraph in paragraphs" :key="paragraph">
          {{ paragraph }}
        </p>
        <p v-if="paragraphs.length === 0">
          This page is ready for content from Bopli.
        </p>
      </div>
    </main>
  </SiteLayout>
</template>
