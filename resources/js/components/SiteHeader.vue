<script setup lang="ts">
defineProps<{ siteName: string }>();
</script>

<template>
  <header class="site-header">
    <a class="brand" href="/"
      ><span class="brand-mark">◉</span>{{ siteName }}</a
    >
    <nav aria-label="Primary"><slot /></nav>
  </header>
</template>

<style scoped>
.site-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1160px, calc(100% - 40px));
  margin-inline: auto;
  padding: 30px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.brand {
  display: flex;
  gap: 10px;
  align-items: center;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: -0.02em;
}
.brand-mark {
  color: var(--orange);
  text-shadow: 0 0 20px var(--orange);
}
nav {
  display: flex;
  gap: 30px;
}
nav :deep(a) {
  color: #bcb3c5;
  font-size: 0.85rem;
  text-decoration: none;
}
nav :deep(a:hover) {
  color: white;
}
@media (max-width: 800px) {
  nav {
    gap: 16px;
  }
}
</style>
