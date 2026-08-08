<script setup lang="ts">
type SocialLink = { label: string; url: string };

defineProps<{ socialLinks?: SocialLink[] }>();
</script>

<template>
    <footer class="site-footer">
        <div class="footer-inner">
            <div class="footer-links">
                <a
                    v-for="link in socialLinks ?? []"
                    :key="link.url"
                    :href="link.url"
                    rel="me noreferrer"
                    target="_blank"
                    >{{ link.label.toLowerCase() }}</a
                >
            </div>
            <p>powered by an open-source cms · theme: cosmic-terminal</p>
        </div>
    </footer>
</template>
