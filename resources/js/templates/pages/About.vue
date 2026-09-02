<script setup lang="ts">
import { computed } from 'vue';

import SiteLayout from '../../components/SiteLayout.vue';
import type { AboutProps } from '../../.bopli/types';

const props = defineProps<AboutProps>();

const biography = computed(() => String(props.page.fields.body ?? '').trim());
const hasBiography = computed(
  () =>
    biography.value
      .replace(/<[^>]*>/g, '')
      .replaceAll('&nbsp;', ' ')
      .trim() !== '',
);
const skills = computed(() =>
  (props.page.fields.skills ?? []).filter((skill) => skill.label.trim() !== ''),
);
const timeline = computed(() =>
  (props.page.fields.timeline ?? []).filter(
    (item) => item.year.trim() !== '' || item.description.trim() !== '',
  ),
);

function timelineGlyph(index: number): string {
  if (timeline.value.length === 1) {
    return '──';
  }

  if (index === 0) {
    return '┌─';
  }

  return index === timeline.value.length - 1 ? '└─' : '├─';
}

function displayUrl(url: string): string {
  return url
    .replace(/^mailto:/, '')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}
</script>

<template>
  <SiteLayout :site="site" :settings="settings" current-page="about">
    <main class="about-main">
      <header class="about-header">
        <div class="about-heading">
          <p class="about-prompt"><span>$</span> whoami</p>
          <h1>{{ page.title }}</h1>
        </div>
      </header>

      <div v-if="hasBiography" class="about-bio" v-html="biography" />
      <p v-else class="about-bio">Add your biography from the Bopli Page editor.</p>

      <template v-if="skills.length">
        <hr class="comet-divider" />
        <h2 class="section-title"><span>$</span> what i work with</h2>
        <div class="skill-list">
          <span v-for="skill in skills" :key="skill.label" class="skill-pill">
            --tag={{ skill.label.toLowerCase().replace(/\s+/g, '-') }}
          </span>
        </div>
      </template>

      <template v-if="timeline.length">
        <hr class="comet-divider" />
        <h2 class="section-title"><span>$</span> git log --oneline</h2>
        <p class="timeline-intro">A few highlights, newest first.</p>
        <div class="timeline">
          <div
            v-for="(item, index) in timeline"
            :key="`${item.year}-${index}`"
            class="timeline-row"
          >
            <span class="timeline-glyph">{{ timelineGlyph(index) }}</span>
            <span class="timeline-year">{{ item.year }}</span>
            <span class="timeline-copy">{{ item.description }}</span>
          </div>
        </div>
      </template>

      <template v-if="site.socialLinks?.length">
        <hr class="comet-divider" />
        <h2 class="section-title"><span>$</span> say hello</h2>
        <div class="contact-list">
          <div v-for="link in site.socialLinks" :key="link.url">
            <span class="contact-label">{{ link.label.toLowerCase() }}</span>
            <a :href="link.url" rel="me noreferrer" target="_blank">{{ displayUrl(link.url) }}</a>
          </div>
        </div>
      </template>
    </main>
  </SiteLayout>
</template>
