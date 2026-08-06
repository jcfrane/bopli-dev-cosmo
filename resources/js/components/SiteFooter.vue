<script setup lang="ts">
type SocialLink = { label: string; url: string };

defineProps<{ siteName: string; socialLinks?: SocialLink[] }>();

const year = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <p>© {{ year }} {{ siteName }}. Powered by Bopli.</p>
    <div v-if="socialLinks?.length">
      <a
        v-for="link in socialLinks"
        :key="link.url"
        :href="link.url"
        rel="me noreferrer"
        target="_blank"
        >{{ link.label }}</a
      >
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 25px;
  width: min(1160px, calc(100% - 40px));
  margin-inline: auto;
  padding: 40px 0;
  color: #8f8499;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.82rem;
}
.site-footer div {
  display: flex;
  gap: 20px;
}
.site-footer a {
  text-decoration: none;
}
@media (max-width: 800px) {
  .site-footer {
    flex-direction: column;
  }
}
</style>
