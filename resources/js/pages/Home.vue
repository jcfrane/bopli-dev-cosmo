<script setup lang="ts">
import { Head } from "@inertiajs/vue3";

type SocialLink = { label: string; url: string };
type Term = { name: string; slug: string };
type Entry = {
  title: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
  readTime?: number;
  summary?: string;
  url?: string;
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
    featured_post?: Entry[];
    recent_posts?: Entry[];
    featured_projects?: Entry[];
  };
}>();

const year = new Date().getFullYear();
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
  <Head :title="page.seoTitle ?? site.name">
    <meta
      v-if="page.seoDescription ?? site.description"
      head-key="description"
      name="description"
      :content="page.seoDescription ?? site.description"
    />
    <link
      head-key="canonical"
      rel="canonical"
      :href="site.canonicalUrl + page.path"
    />
  </Head>
  <div class="cosmo-shell">
    <div class="stars" aria-hidden="true" />
    <header class="site-header">
      <a class="brand" href="/"
        ><span class="brand-mark">◉</span>{{ site.name }}</a
      >
      <nav aria-label="Primary">
        <a href="#writing">Writing</a><a href="#projects">Projects</a
        ><a href="#about">About</a>
      </nav>
    </header>

    <main>
      <section class="hero" id="about">
        <div class="hero-copy">
          <p class="eyebrow">Hello from orbit / {{ site.handle }}</p>
          <h1>{{ site.tagline ?? "Building useful things in the open." }}</h1>
          <p class="lede">
            {{
              site.description ??
              "Notes from a developer exploring software, systems, and the wide space between an idea and a shipped product."
            }}
          </p>
          <a class="primary-action" href="#writing"
            >Explore the signal <span>↘</span></a
          >
        </div>
        <div class="orbit" aria-hidden="true">
          <div class="planet"><span /></div>
          <i class="moon moon-one" /><i class="moon moon-two" />
        </div>
      </section>

      <section class="signal" id="writing">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Latest transmission</p>
            <h2>Writing</h2>
          </div>
          <span class="frequency">88.04 MHz</span>
        </div>
        <a
          v-if="slots.featured_post?.[0]"
          class="featured-post"
          :href="slots.featured_post[0].url"
        >
          <div>
            <p class="meta">
              {{ date(slots.featured_post[0].publishedAt)
              }}<template v-if="slots.featured_post[0].readTime">
                · {{ slots.featured_post[0].readTime }} min read</template
              >
            </p>
            <h3>{{ slots.featured_post[0].title }}</h3>
            <p>{{ slots.featured_post[0].excerpt }}</p>
          </div>
          <span class="arrow">↗</span>
        </a>
        <div v-else class="empty-signal">
          <span>···</span>
          <p>The first transmission is being prepared.</p>
        </div>
        <div v-if="slots.recent_posts?.length" class="post-grid">
          <a
            v-for="post in slots.recent_posts"
            :key="post.slug"
            :href="post.url"
          >
            <p class="meta">{{ date(post.publishedAt) }}</p>
            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt }}</p>
            <div class="term-row">
              <span v-for="term in post.terms?.tag ?? []" :key="term.slug">{{
                term.name
              }}</span>
            </div>
          </a>
        </div>
      </section>

      <section class="projects" id="projects">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Selected coordinates</p>
            <h2>Projects</h2>
          </div>
        </div>
        <div v-if="slots.featured_projects?.length" class="project-grid">
          <a
            v-for="(project, index) in slots.featured_projects"
            :key="project.slug"
            :href="project.url || '#projects'"
            :target="project.url ? '_blank' : undefined"
            :rel="project.url ? 'noreferrer' : undefined"
            ><span class="project-number">0{{ index + 1 }}</span>
            <h3>{{ project.title }}</h3>
            <p>{{ project.summary }}</p>
            <span class="project-link">View coordinate ↗</span></a
          >
        </div>
        <div v-else class="empty-signal">
          <span>⌁</span>
          <p>Projects will materialize here soon.</p>
        </div>
      </section>
    </main>

    <footer>
      <p>© {{ year }} {{ site.name }}. Powered by Bopli.</p>
      <div>
        <a
          v-for="link in site.socialLinks"
          :key="link.url"
          :href="link.url"
          rel="me noreferrer"
          target="_blank"
          >{{ link.label }}</a
        >
      </div>
    </footer>
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
      circle at 78% 11%,
      rgba(119, 33, 111, 0.3),
      transparent 28rem
    ),
    linear-gradient(160deg, #10091e 0%, var(--ink) 44%, #0d0718 100%);
}
.stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
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
.site-header,
main,
footer {
  position: relative;
  z-index: 1;
  width: min(1160px, calc(100% - 40px));
  margin-inline: auto;
}
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
.site-header nav {
  display: flex;
  gap: 30px;
}
.site-header nav a {
  color: #bcb3c5;
  font-size: 0.85rem;
  text-decoration: none;
}
.site-header nav a:hover {
  color: white;
}
.hero {
  min-height: 690px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 50px;
}
.hero-copy {
  max-width: 720px;
}
.eyebrow,
.meta,
.frequency {
  color: #d48ccc;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.17em;
}
.hero h1 {
  max-width: 780px;
  margin: 20px 0;
  font-size: clamp(3.4rem, 8vw, 7.2rem);
  line-height: 0.91;
  letter-spacing: -0.065em;
}
.lede {
  max-width: 620px;
  color: #bcb3c5;
  font-size: clamp(1.05rem, 2vw, 1.3rem);
  line-height: 1.65;
}
.primary-action {
  display: inline-flex;
  gap: 18px;
  align-items: center;
  margin-top: 24px;
  padding: 14px 18px;
  color: #fff;
  background: var(--orange);
  border-radius: 3px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 16px 50px rgba(233, 84, 32, 0.25);
}
.orbit {
  position: relative;
  width: min(35vw, 390px);
  aspect-ratio: 1;
  justify-self: center;
  border: 1px solid rgba(233, 84, 32, 0.22);
  border-radius: 50%;
  transform: rotate(-18deg);
}
.orbit::before,
.orbit::after {
  content: "";
  position: absolute;
  inset: 14%;
  border: 1px solid rgba(212, 140, 204, 0.15);
  border-radius: 50%;
}
.orbit::after {
  inset: -13%;
  border-style: dashed;
}
.planet {
  position: absolute;
  inset: 27%;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 30%,
    #ffbd89,
    var(--orange) 30%,
    #77216f 72%,
    #211029
  );
  box-shadow:
    -24px 30px 70px #000,
    0 0 70px rgba(233, 84, 32, 0.25);
  transform: rotate(18deg);
}
.planet span {
  width: 130%;
  height: 25%;
  border: 2px solid rgba(255, 255, 255, 0.32);
  border-radius: 50%;
  transform: rotate(-17deg);
}
.moon {
  position: absolute;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #f2c94c;
  box-shadow: 0 0 18px #f2c94c;
}
.moon-one {
  top: 3%;
  left: 25%;
}
.moon-two {
  right: 2%;
  bottom: 28%;
  width: 8px;
  height: 8px;
  background: #d48ccc;
}
.signal,
.projects {
  padding: 110px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 35px;
}
.section-heading h2 {
  margin: 7px 0 0;
  font-size: clamp(2.2rem, 5vw, 4.5rem);
  letter-spacing: -0.05em;
}
.featured-post {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  padding: clamp(28px, 5vw, 55px);
  background: linear-gradient(
    135deg,
    rgba(119, 33, 111, 0.47),
    rgba(233, 84, 32, 0.12)
  );
  border: 1px solid rgba(212, 140, 204, 0.25);
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.2s,
    transform 0.2s;
}
.featured-post:hover {
  border-color: rgba(233, 84, 32, 0.7);
  transform: translateY(-3px);
}
.featured-post h3 {
  max-width: 770px;
  margin: 12px 0;
  font-size: clamp(2rem, 4vw, 4rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
}
.featured-post p:not(.meta),
.post-grid p,
.project-grid p {
  color: #bcb3c5;
  line-height: 1.65;
}
.arrow {
  color: var(--orange);
  font-size: 2rem;
}
.post-grid,
.project-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  margin-top: 1px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.post-grid a,
.project-grid a {
  min-height: 260px;
  padding: 28px;
  background: #0e0919;
}
.post-grid a {
  color: inherit;
  text-decoration: none;
  transition: background 0.2s;
}
.post-grid a:hover {
  background: #1a0d25;
}
.post-grid h3,
.project-grid h3 {
  margin: 10px 0;
  font-size: 1.45rem;
}
.term-row {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 20px;
}
.term-row span {
  padding: 4px 8px;
  color: #d48ccc;
  border: 1px solid rgba(212, 140, 204, 0.3);
  font-size: 0.7rem;
}
.project-grid a {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  transition:
    background 0.2s,
    transform 0.2s;
}
.project-grid a:hover {
  z-index: 2;
  background: #1a0d25;
  transform: translateY(-4px);
}
.project-number {
  color: var(--orange);
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
}
.project-link {
  margin-top: auto;
  color: #d48ccc;
  font-size: 0.85rem;
}
.empty-signal {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 45px;
  color: #8f8499;
  border: 1px dashed rgba(255, 255, 255, 0.18);
}
.empty-signal span {
  color: var(--orange);
}
footer {
  display: flex;
  justify-content: space-between;
  gap: 25px;
  padding: 40px 0;
  color: #8f8499;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.82rem;
}
footer div {
  display: flex;
  gap: 20px;
}
footer a {
  text-decoration: none;
}
@media (max-width: 800px) {
  .site-header nav {
    display: none;
  }
  .hero {
    min-height: auto;
    grid-template-columns: 1fr;
    padding: 100px 0;
  }
  .hero h1 {
    font-size: clamp(3.1rem, 15vw, 5.5rem);
  }
  .orbit {
    position: absolute;
    z-index: -1;
    right: -38%;
    top: 110px;
    width: 80vw;
    opacity: 0.4;
  }
  .post-grid,
  .project-grid {
    grid-template-columns: 1fr;
  }
  .signal,
  .projects {
    padding: 75px 0;
  }
  .frequency {
    display: none;
  }
  footer {
    flex-direction: column;
  }
}
</style>
