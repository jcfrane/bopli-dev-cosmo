<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), {
  title: '~/blog',
});
</script>

<template>
  <div class="terminal-window">
    <div class="terminal-bar">
      <span class="terminal-dot terminal-dot-orange" />
      <span class="terminal-dot terminal-dot-light" />
      <span class="terminal-dot terminal-dot-mid" />
      <span class="terminal-title">{{ title }}</span>
    </div>
    <div class="terminal-body"><slot /></div>
  </div>
</template>
