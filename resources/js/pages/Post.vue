<script setup lang="ts">
import { Head } from "@inertiajs/vue3";

type SocialLink = { label: string; url: string };
type Term = { name: string; slug: string };

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
  };
}>();

const year = new Date().getFullYear();
const publishedDate = props.entry.publishedAt
  ? new Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(props.entry.publishedAt))
  : "";
</script>

<template>
  <Head :title="entry.seoTitle ?? entry.title">
    <meta
      v-if="entry.seoDescription"
      head-key="description"
      name="description"
      :content="entry.seoDescription"
    />
    <link
      head-key="canonical"
      rel="canonical"
      :href="site.canonicalUrl + entry.canonicalPath"
    />
  </Head>
  <div class="cosmo-shell">
    <div class="stars" aria-hidden="true" />
    <header>
      <a class="brand" href="/"><span>◉</span>{{ site.name }}</a>
      <a class="back" href="/">← Return to orbit</a>
    </header>
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
        <div class="body" v-html="entry.body" />
      </article>
    </main>
    <footer>© {{ year }} {{ site.name }}. Powered by Bopli.</footer>
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
.stars {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.22;
  background-image: radial-gradient(#fff 0.7px, transparent 0.7px);
  background-size: 34px 34px;
}
header,
main,
footer {
  position: relative;
  z-index: 1;
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.brand,
.back {
  text-decoration: none;
}
.brand {
  display: flex;
  gap: 10px;
  font-weight: 700;
}
.brand span,
.eyebrow {
  color: var(--orange);
}
.back {
  color: #c9bfce;
  font-size: 0.9rem;
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
footer {
  padding: 35px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  color: #8f8597;
  font-size: 0.82rem;
}
@media (max-width: 640px) {
  .back {
    font-size: 0;
  }
  .back::after {
    content: "← Home";
    font-size: 0.85rem;
  }
}
</style>
