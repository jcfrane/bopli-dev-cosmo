<bopli lang="json">
{
  "name": "Cosmic Terminal about",
  "slots": {}
}
</bopli>

<script setup lang="ts">
import { computed } from "vue";

import AuthorPortrait from "../../components/AuthorPortrait.vue";
import SiteLayout from "../../components/SiteLayout.vue";
import type { CosmoPageProps } from "../../types";

const props = defineProps<CosmoPageProps>();

const paragraphs = computed(() =>
  String(props.page.fields.body ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean),
);

function displayUrl(url: string): string {
  return url
    .replace(/^mailto:/, "")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}
</script>

<template>
  <SiteLayout :site="site" current-page="about">
    <main class="about-main">
      <header class="about-header">
        <AuthorPortrait :alt="`Illustrated portrait of ${site.name}`" />
        <div class="about-heading">
          <p class="about-prompt"><span>$</span> whoami</p>
          <h1>{{ page.title }}</h1>
        </div>
      </header>

      <div class="about-bio">
        <p v-for="paragraph in paragraphs" :key="paragraph">
          {{ paragraph }}
        </p>
        <p v-if="paragraphs.length === 0">
          Add your biography from the Bopli Page editor.
        </p>
      </div>

      <template v-if="site.socialLinks?.length">
        <hr class="comet-divider" />
        <h2 class="section-title"><span>$</span> say hello</h2>
        <div class="contact-list">
          <div v-for="link in site.socialLinks" :key="link.url">
            <span class="contact-label">{{ link.label.toLowerCase() }}</span>
            <a :href="link.url" rel="me noreferrer" target="_blank">{{
              displayUrl(link.url)
            }}</a>
          </div>
        </div>
      </template>
    </main>
  </SiteLayout>
</template>
