<script setup lang="ts">
import { defineEntryTemplate, field } from '@bopli/theme-sdk/authoring';
import SiteLayout from '../../components/SiteLayout.vue';
import type { ProjectProps } from '../../.bopli/types';

defineEntryTemplate({
  name: 'Cosmic Terminal project',
  default: true,
  fields: {
    summary: field.longText({ required: true }),
    externalUrl: field.text({ label: 'External URL' }),
  },
});

defineProps<ProjectProps>();
</script>

<template>
  <SiteLayout :site="site" :settings="settings" :current-page="null">
    <main class="about-main">
      <p class="about-prompt"><span>$</span> project --show</p>
      <h1 class="page-title">{{ entry.title }}</h1>
      <div class="about-bio">
        <p>{{ entry.summary }}</p>
      </div>
      <a v-if="entry.externalUrl" class="button-link" :href="entry.externalUrl" rel="noreferrer"
        >open --project →</a
      >
    </main>
  </SiteLayout>
</template>
