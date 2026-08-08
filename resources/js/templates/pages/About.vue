<bopli lang="json">
{
    "name": "Cosmic Terminal about",
    "slots": {}
}
</bopli>

<script setup lang="ts">
import AuthorPortrait from '../../components/AuthorPortrait.vue';
import SiteLayout from '../../components/SiteLayout.vue';

defineProps<{
    site: {
        name: string;
        handle: string;
        tagline?: string | null;
        description?: string | null;
        socialLinks?: Array<{ label: string; url: string }>;
        canonicalUrl: string;
    };
    page: {
        title: string;
        path: string;
        fields: Record<string, unknown>;
        seoTitle: string | null;
        seoDescription: string | null;
    };
    slots: Record<string, never[]>;
    preview?: boolean;
}>();

const skills = [
    'go',
    'rust',
    'postgres',
    'linux',
    'kubernetes',
    'message-queues',
    'typescript',
    'systemd',
];

const timeline = [
    { year: '2026', text: 'started open-sourcing this blog and its CMS' },
    {
        year: '2024',
        text: 'led the rewrite of a billing pipeline handling 40M events/day',
    },
    {
        year: '2022',
        text: 'gave a first conference talk on backpressure, from a terminal',
    },
    {
        year: '2019',
        text: 'joined a small infrastructure team; still there, still shipping',
    },
    {
        year: '2011',
        text: 'installed Ubuntu, ruined a perfectly good Windows laptop, never looked back',
    },
];

function displayUrl(url: string): string {
    return url
        .replace(/^mailto:/, '')
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '');
}
</script>

<template>
    <SiteLayout :site="site" current-page="about">
        <main class="about-main">
            <header class="about-header">
                <AuthorPortrait :alt="`Illustrated portrait of ${site.name}`" />
                <div class="about-heading">
                    <p class="about-prompt"><span>$</span> whoami</p>
                    <h1>
                        Hi, I'm a software engineer who never really closes the
                        terminal.
                    </h1>
                </div>
            </header>

            <div class="about-bio">
                <p>
                    I build backend systems for a living and side projects for
                    fun — mostly things that move data around quietly and
                    reliably. This blog is where I write about both, plus the
                    occasional detour into Linux desktop arcana and why my
                    dotfiles repository has more commits than some actual
                    projects.
                </p>
                <p>
                    Away from the keyboard I'm usually outside after dark with a
                    pair of binoculars.
                  Stargazing and systems engineering
                    scratch the same itch: big, quiet machinery that mostly
                    works, occasionally surprises you, and rewards paying close
                    attention.
                </p>
                <p>
                    Everything here — the site and the CMS it runs on — is being
                    built in the open. If something looks freshly shipped, it
                    probably is.
                </p>
            </div>

            <hr class="comet-divider" />

            <h2 class="section-title"><span>$</span> what i work with</h2>
            <div class="skill-list">
                <span v-for="skill in skills" :key="skill" class="skill-pill"
                    >--tag={{ skill }}</span
                >
            </div>

            <hr class="comet-divider" />

            <h2 class="section-title"><span>$</span> git log --oneline</h2>
            <p class="timeline-intro">A few highlights, newest first.</p>
            <div class="timeline">
                <div
                    v-for="(item, index) in timeline"
                    :key="item.year"
                    class="timeline-row"
                >
                    <span class="timeline-glyph">{{
                        index === timeline.length - 1 ? '└──' : '├──'
                    }}</span>
                    <span class="timeline-year">{{ item.year }}</span>
                    <span class="timeline-copy">{{ item.text }}</span>
                </div>
            </div>

            <template v-if="site.socialLinks?.length">
                <hr class="comet-divider" />
                <h2 class="section-title"><span>$</span> say hello</h2>
                <div class="contact-list">
                    <div v-for="link in site.socialLinks" :key="link.url">
                        <span class="contact-label">{{
                            link.label.toLowerCase()
                        }}</span>
                        <a
                            :href="link.url"
                            rel="me noreferrer"
                            target="_blank"
                            >{{ displayUrl(link.url) }}</a
                        >
                    </div>
                </div>
            </template>
        </main>
    </SiteLayout>
</template>
