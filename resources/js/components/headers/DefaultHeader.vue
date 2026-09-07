<script setup lang="ts">
import FileText from '@lucide/vue/dist/esm/icons/file-text.mjs';
import House from '@lucide/vue/dist/esm/icons/house.mjs';
import Moon from '@lucide/vue/dist/esm/icons/moon.mjs';
import Sun from '@lucide/vue/dist/esm/icons/sun.mjs';
import UserRound from '@lucide/vue/dist/esm/icons/user-round.mjs';
import { useBopliColorMode } from '@bopli/theme-sdk';
import { ref, watch } from 'vue';

defineProps<{
  site: { name: string; handle: string };
  currentPage: 'home' | 'about' | 'blog' | null;
  showThemeToggle: boolean;
}>();

const { mode, modes, setMode } = useBopliColorMode();
const activeMode = ref(mode.value);

watch(mode, (nextMode) => {
  activeMode.value = nextMode;
});

function toggleTheme(): void {
  const nextMode = activeMode.value === 'dark' ? 'light' : 'dark';

  if (!modes.includes(nextMode)) return;

  activeMode.value = nextMode;
  setMode(nextMode);
}
</script>

<template>
  <header class="site-header">
    <div class="site-nav">
      <a class="wordmark" href="/" :aria-label="`${site.name} home`">
        <span>~</span>/{{ site.handle }}
      </a>
      <div class="nav-actions">
        <nav class="desktop-navigation" aria-label="Primary">
          <a href="/" :aria-current="currentPage === 'home' ? 'page' : undefined">Home</a>
          <a href="/about" :aria-current="currentPage === 'about' ? 'page' : undefined">About</a>
          <a href="/blog" :aria-current="currentPage === 'blog' ? 'page' : undefined">Blogs</a>
        </nav>
        <button
          v-if="showThemeToggle"
          class="theme-toggle"
          type="button"
          role="switch"
          :aria-checked="activeMode === 'dark'"
          :aria-label="
            activeMode === 'dark' ? 'Switch to light color mode' : 'Switch to dark color mode'
          "
          :data-mode="activeMode"
          @click="toggleTheme"
        >
          <span class="theme-toggle-thumb" aria-hidden="true" />
          <Sun
            class="theme-toggle-icon theme-toggle-sun"
            aria-hidden="true"
            :size="17"
            :stroke-width="2"
          />
          <Moon
            class="theme-toggle-icon theme-toggle-moon"
            aria-hidden="true"
            :size="17"
            :stroke-width="2"
          />
        </button>
      </div>
    </div>

    <nav class="mobile-tabbar" aria-label="Primary">
      <a
        class="mobile-tabbar-link"
        href="/"
        :aria-current="currentPage === 'home' ? 'page' : undefined"
      >
        <House aria-hidden="true" :size="19" :stroke-width="2" />
        <span>Home</span>
      </a>
      <a
        class="mobile-tabbar-link"
        href="/about"
        :aria-current="currentPage === 'about' ? 'page' : undefined"
      >
        <UserRound aria-hidden="true" :size="19" :stroke-width="2" />
        <span>About</span>
      </a>
      <a
        class="mobile-tabbar-link"
        href="/blog"
        :aria-current="currentPage === 'blog' ? 'page' : undefined"
      >
        <FileText aria-hidden="true" :size="19" :stroke-width="2" />
        <span>Blogs</span>
      </a>
    </nav>
  </header>
</template>
