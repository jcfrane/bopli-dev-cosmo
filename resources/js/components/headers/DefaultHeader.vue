<script setup lang="ts">
import { useBopliColorMode } from '@bopli/theme-sdk';

defineProps<{
  site: { name: string; handle: string };
  currentPage: 'home' | 'about' | 'blog' | null;
  showThemeToggle: boolean;
}>();

const { mode, modes, setMode } = useBopliColorMode();

function toggleTheme(): void {
  const current = modes.indexOf(mode.value);
  const next = modes[(current + 1) % modes.length];

  if (next) setMode(next);
}
</script>

<template>
  <nav class="site-nav" aria-label="Primary">
    <a class="wordmark" href="/" :aria-label="`${site.name} home`">
      <span>~</span>/{{ site.handle }}
    </a>
    <div class="nav-actions">
      <div class="nav-links">
        <a href="/" :aria-current="currentPage === 'home' ? 'page' : undefined">Home</a>
        <a href="/about" :aria-current="currentPage === 'about' ? 'page' : undefined">About</a>
        <a href="/blog" :aria-current="currentPage === 'blog' ? 'page' : undefined">Blogs</a>
      </div>
      <button
        v-if="showThemeToggle"
        class="theme-toggle"
        type="button"
        :aria-label="`Switch from ${mode} color mode`"
        @click="toggleTheme"
      >
        --theme={{ mode }}
      </button>
    </div>
  </nav>
</template>
