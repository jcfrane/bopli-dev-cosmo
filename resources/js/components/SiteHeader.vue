<script setup lang="ts">
import { onMounted, ref } from "vue";

type Theme = "light" | "dark";

defineProps<{
  site: { name: string; handle: string };
  currentPage: "home" | "about" | "blog" | null;
}>();

const theme = ref<Theme>("light");

function applyTheme(nextTheme: Theme): void {
  theme.value = nextTheme;
  document.documentElement.dataset.theme = nextTheme;
}

function toggleTheme(): void {
  const nextTheme = theme.value === "dark" ? "light" : "dark";
  localStorage.setItem("blog-theme", nextTheme);
  applyTheme(nextTheme);
}

onMounted(() => {
  const savedTheme = localStorage.getItem("blog-theme");
  applyTheme(savedTheme === "dark" ? "dark" : "light");
});
</script>

<template>
  <nav class="site-nav" aria-label="Primary">
    <a class="wordmark" href="/" :aria-label="`${site.name} home`">
      <span>~</span>/{{ site.handle }}
    </a>
    <div class="nav-actions">
      <div class="nav-links">
        <a href="/" :aria-current="currentPage === 'home' ? 'page' : undefined"
          >Home</a
        >
        <a
          href="/about"
          :aria-current="currentPage === 'about' ? 'page' : undefined"
          >About</a
        >
        <a
          href="/blog"
          :aria-current="currentPage === 'blog' ? 'page' : undefined"
          >Blogs</a
        >
      </div>
      <button
        class="theme-toggle"
        type="button"
        :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`"
        @click="toggleTheme"
      >
        --theme={{ theme }}
      </button>
    </div>
  </nav>
</template>
