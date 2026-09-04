<script setup lang="ts">
import { defineFooter, field, setting } from '@bopli/theme-sdk/authoring';

import SocialIcon from '../SocialIcon.vue';
import type { ThemeFooter } from '../../.bopli/types';

type SocialLink = { label: string; url: string };

defineFooter({
  settings: {
    show_social_links: setting.boolean({
      name: 'Show social links',
      description: 'Display the social links configured for this site.',
      default: true,
    }),
  },
  fields: {
    message: field.text({ label: 'Footer message', required: true }),
    links: field.list(
      {
        label: field.text({ required: true }),
        url: field.url({ required: true }),
      },
      { label: 'Custom links', maxItems: 8 },
    ),
  },
  defaults: {
    message: 'powered by an open-source cms · theme: cosmic-terminal',
    links: [],
  },
});

defineProps<{ footer: ThemeFooter; socialLinks?: SocialLink[] }>();

function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-links">
        <template v-if="footer.settings.show_social_links">
          <a
            v-for="link in socialLinks ?? []"
            :key="`social:${link.url}`"
            :href="link.url"
            rel="me noreferrer"
            target="_blank"
            ><SocialIcon :label="link.label" /><span>{{ link.label.toLowerCase() }}</span></a
          >
        </template>
        <a
          v-for="link in footer.content.links"
          :key="`custom:${link.url}`"
          :href="link.url"
          :rel="isExternal(link.url) ? 'noopener noreferrer' : undefined"
          :target="isExternal(link.url) ? '_blank' : undefined"
          >{{ link.label }}</a
        >
      </div>
      <p>{{ footer.content.message }}</p>
    </div>
  </footer>
</template>
