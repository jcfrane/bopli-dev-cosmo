<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <svg
    v-if="label === 'Facebook'"
    class="social-icon"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M14 8h3V4h-3a6 6 0 0 0-6 6v2H5v4h3v8h4v-8h4l1-4h-5v-2a2 2 0 0 1 2-2Z" />
  </svg>
  <svg
    v-else-if="label === 'Instagram'"
    class="social-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
</template>
