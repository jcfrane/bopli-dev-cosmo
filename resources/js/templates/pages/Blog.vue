<bopli lang="json">
{
  "name": "Cosmo blog",
  "slots": {
    "posts": { "name": "Posts" }
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
type Entry = {
  title: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
  readTime?: number;
  url?: string;
  featureImage?: EntryImage | null;
  terms?: Record<string, Term[]>;
};

defineProps<{
  site: {
    name: string;
    handle: string;
    tagline?: string;
    description?: string;
    socialLinks: SocialLink[];
    canonicalUrl: string;
  };
  page: {
    title: string;
    path: string;
    fields: Record<string, unknown>;
    seoTitle?: string;
    seoDescription?: string;
  };
  slots: {
    posts?: Entry[];
  };
}>();

function date(value?: string): string {
  return value
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value))
    : "";
}
</script>

<template>
  <div class="cosmo-shell">
    <Starfield variant="dense" />
    <SiteHeader :site-name="site.name">
      <a href="/blog" aria-current="page">Writing</a
      ><a href="/#projects">Projects</a><a href="/#about">About</a>
    </SiteHeader>

    <main>
      <section class="blog-heading">
        <p class="eyebrow">Transmission log / {{ site.handle }}</p>
        <h1>{{ page.title }}</h1>
        <p class="lede">
          Every signal broadcast from this corner of the galaxy, newest first.
        </p>
      </section>

      <section class="post-list" aria-label="All posts">
        <a
          v-for="post in slots.posts ?? []"
          :key="post.slug"
          class="post-row"
          :href="post.url"
        >
          <div class="post-media">
            <img
              v-if="post.featureImage"
              :src="post.featureImage.url"
              :alt="post.featureImage.alt ?? ''"
              loading="lazy"
            />
            <div v-else class="media-fallback" aria-hidden="true">⌁</div>
          </div>
          <div class="post-copy">
            <p class="meta">
              {{ date(post.publishedAt)
              }}<template v-if="post.readTime">
                · {{ post.readTime }} min read</template
              >
            </p>
            <h2>{{ post.title }}</h2>
            <p class="excerpt">{{ post.excerpt }}</p>
            <div class="term-row">
              <span v-for="term in post.terms?.tag ?? []" :key="term.slug">{{
                term.name
              }}</span>
            </div>
          </div>
          <span class="arrow" aria-hidden="true">↗</span>
        </a>
        <div v-if="!slots.posts?.length" class="empty-signal">
          <span>···</span>
          <p>The first transmission is being prepared.</p>
        </div>
      </section>
    </main>

    <SiteFooter :site-name="site.name" :social-links="site.socialLinks" />
  </div>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}
:global(html) {
  scroll-behavior: smooth;
  background: #090514;
}
:global(body) {
  margin: 0;
  color: #f7efe9;
  background: #090514;
  font-family: "Ubuntu", "Noto Sans", system-ui, sans-serif;
}
:global(a) {
  color: inherit;
}
.cosmo-shell {
  --orange: #e95420;
  --violet: #77216f;
  --ink: #090514;
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 20% 6%,
      rgba(119, 33, 111, 0.28),
      transparent 26rem
    ),
    linear-gradient(160deg, #10091e 0%, var(--ink) 44%, #0d0718 100%);
}
main {
  position: relative;
  z-index: 1;
  width: min(1160px, calc(100% - 40px));
  margin-inline: auto;
}
.eyebrow,
.meta {
  color: #d48ccc;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.17em;
}
.blog-heading {
  padding: clamp(70px, 9vw, 120px) 0 55px;
}
.blog-heading h1 {
  margin: 18px 0;
  font-size: clamp(3.2rem, 8vw, 6.4rem);
  line-height: 0.93;
  letter-spacing: -0.06em;
}
.lede {
  max-width: 560px;
  color: #bcb3c5;
  font-size: clamp(1rem, 2vw, 1.2rem);
  line-height: 1.65;
}
.post-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding-bottom: 110px;
  background: rgba(255, 255, 255, 0.12);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
.post-row {
  display: grid;
  grid-template-columns: 260px 1fr auto;
  gap: clamp(20px, 4vw, 45px);
  align-items: center;
  padding: clamp(24px, 4vw, 40px) 0;
  background:
    linear-gradient(160deg, #10091e 0%, var(--ink) 44%, #0d0718 100%);
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  transition: background 0.2s;
}
.post-row:hover {
  background: #150c22;
}
.post-media img,
.media-fallback {
  width: 260px;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border: 1px solid rgba(212, 140, 204, 0.3);
}
.media-fallback {
  display: grid;
  place-items: center;
  color: var(--orange);
  font-size: 1.6rem;
  background: linear-gradient(
    135deg,
    rgba(119, 33, 111, 0.4),
    rgba(233, 84, 32, 0.12)
  );
}
.post-copy h2 {
  margin: 10px 0;
  font-size: clamp(1.5rem, 3vw, 2.3rem);
  line-height: 1.1;
  letter-spacing: -0.035em;
}
.excerpt {
  max-width: 640px;
  margin: 0;
  color: #bcb3c5;
  line-height: 1.65;
}
.term-row {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 16px;
}
.term-row span {
  padding: 4px 8px;
  color: #d48ccc;
  border: 1px solid rgba(212, 140, 204, 0.3);
  font-size: 0.7rem;
}
.arrow {
  padding-right: 12px;
  color: var(--orange);
  font-size: 1.7rem;
}
.empty-signal {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 45px;
  color: #8f8499;
  background: var(--ink);
  border: 1px dashed rgba(255, 255, 255, 0.18);
}
.empty-signal span {
  color: var(--orange);
}
@media (max-width: 800px) {
  .post-row {
    grid-template-columns: 1fr;
  }
  .post-media img,
  .media-fallback {
    width: 100%;
  }
  .arrow {
    display: none;
  }
}
</style>
