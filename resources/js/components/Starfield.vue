<script setup lang="ts">
withDefaults(defineProps<{ variant?: "dense" | "subtle" }>(), {
  variant: "dense",
});
</script>

<template>
  <div class="stars" :class="variant" aria-hidden="true" />
</template>

<style scoped>
.stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.dense {
  opacity: 0.5;
  background-image:
    radial-gradient(#fff 0.7px, transparent 0.8px),
    radial-gradient(#e7bcff 0.6px, transparent 0.7px);
  background-position:
    0 0,
    18px 24px;
  background-size:
    63px 63px,
    91px 91px;
  mask-image: linear-gradient(to bottom, #000, transparent 72%);
}
.subtle {
  position: fixed;
  opacity: 0.22;
  background-image: radial-gradient(#fff 0.7px, transparent 0.7px);
  background-size: 34px 34px;
}
</style>
