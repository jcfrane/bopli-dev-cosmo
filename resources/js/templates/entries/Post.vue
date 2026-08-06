<bopli lang="json">
{
  "name": "Cosmo post",
  "fields": {
    "excerpt": { "name": "Excerpt", "type": "long_text", "required": true },
    "body": { "name": "Body", "type": "rich_text", "required": true },
    "readTime": { "name": "Read time", "type": "number" },
    "featureImage": { "name": "Feature image", "type": "image" }
  }
}
</bopli>

<script setup lang="ts">
import SiteFooter from "../../components/SiteFooter.vue";
import SiteHeader from "../../components/SiteHeader.vue";
import Starfield from "../../components/Starfield.vue";

type SocialLink = { label: string; url: string };
type Term = { name: string; slug: string };
type EntryImage = {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
};

const props = defineProps<{
  site: {
    name: string;
    handle: string;
    tagline?: string;
    description?: string;
    socialLinks: SocialLink[];
    canonicalUrl: string;
  };
  entry: {
    title: string;
    slug: string;
    url: string;
    canonicalPath: string;
    publishedAt?: string;
    terms: Record<string, Term[]>;
    seoTitle?: string;
    seoDescription?: string;
    excerpt: string;
    body: string;
    readTime?: number;
    featureImage?: EntryImage | null;
  };
}>();

const publishedDate = props.entry.publishedAt
  ? new Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(props.entry.publishedAt))
  : "";
</script>

<template>
  <div class="cosmo-shell">
    <Starfield variant="subtle" />
    <SiteHeader :site-name="site.name">
      <a href="/blog">Writing</a><a class="back" href="/">← Return to orbit</a>
    </SiteHeader>
    <main>
      <article>
        <div class="post-heading">
          <p class="eyebrow">Transmission / {{ site.handle }}</p>
          <h1>{{ entry.title }}</h1>
          <p class="excerpt">{{ entry.excerpt }}</p>
          <div class="meta">
            <span>{{ publishedDate }}</span>
            <span v-if="entry.readTime">{{ entry.readTime }} min read</span>
          </div>
          <div v-if="entry.terms?.tag?.length" class="terms">
            <span v-for="term in entry.terms.tag" :key="term.slug">
              {{ term.name }}
            </span>
          </div>
        </div>
        <img
          v-if="entry.featureImage"
          class="hero-image"
          :src="entry.featureImage.url"
          :alt="entry.featureImage.alt ?? ''"
        />
        <div class="body" v-html="entry.body" />
      </article>
    </main>
    <SiteFooter :site-name="site.name" :social-links="site.socialLinks" />
  </div>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}
:global(html) {
  background: #08050f;
}
:global(body) {
  margin: 0;
  color: #f8f3fa;
  background: #08050f;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}
:global(a) {
  color: inherit;
}
.cosmo-shell {
  --orange: #e95420;
  --violet: #77216f;
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 80% 8%,
      rgba(119, 33, 111, 0.35),
      transparent 35%
    ),
    #08050f;
}
main {
  position: relative;
  z-index: 1;
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
}
.back {
  color: #c9bfce;
}
article {
  padding: clamp(70px, 10vw, 130px) 0;
}
.post-heading,
.body {
  width: min(780px, 100%);
  margin: 0 auto;
}
.eyebrow {
  color: var(--orange);
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
h1 {
  margin: 22px 0;
  font-size: clamp(3rem, 8vw, 6.8rem);
  line-height: 0.96;
  letter-spacing: -0.06em;
}
.excerpt {
  max-width: 680px;
  color: #c9bfce;
  font-size: clamp(1.15rem, 2.3vw, 1.5rem);
  line-height: 1.6;
}
.meta,
.terms {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  margin-top: 24px;
  color: #9f93a8;
  font-family: ui-monospace, monospace;
  font-size: 0.78rem;
}
.terms span {
  padding: 5px 9px;
  color: #d48ccc;
  border: 1px solid rgba(212, 140, 204, 0.3);
}
.hero-image {
  display: block;
  width: min(980px, 100%);
  margin: clamp(45px, 6vw, 75px) auto 0;
  aspect-ratio: 1200 / 630;
  object-fit: cover;
  border: 1px solid rgba(212, 140, 204, 0.3);
}
.body {
  margin-top: clamp(55px, 8vw, 90px);
  color: #ded6e2;
  font-size: 1.08rem;
  line-height: 1.85;
}
.body :deep(h2),
.body :deep(h3) {
  margin: 2.2em 0 0.7em;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.03em;
}
.body :deep(h2) {
  font-size: 2.2rem;
}
.body :deep(a) {
  color: #f08b66;
}
.body :deep(blockquote) {
  margin: 2em 0;
  padding-left: 22px;
  border-left: 3px solid var(--orange);
  color: #c9bfce;
}
.body :deep(code) {
  padding: 0.15em 0.35em;
  border-radius: 4px;
  background: rgba(119, 33, 111, 0.35);
}
.body :deep(pre) {
  padding: 20px;
  overflow-x: auto;
  background: #120a1d;
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.body :deep(pre code) {
  padding: 0;
  background: none;
}
.body :deep(hr) {
  margin: 3em auto;
  width: 120px;
  border: 0;
  border-top: 1px solid rgba(212, 140, 204, 0.4);
}
.body :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 2em 0;
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.body :deep(s) {
  color: #9f93a8;
}
</style>
