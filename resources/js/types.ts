import type {
    BopliBlogIndexProps,
    BopliBlogPostProps,
    BopliBlogPostSummary,
    BopliEntryProps,
    BopliImage,
    BopliPageProps,
    BopliPublicEntry,
    BopliSite,
    BopliTerm,
    BopliThemeSettings,
} from '@bopli/theme-sdk';

export type CosmoEntry = BopliBlogPostSummary;
export type CosmoSettings = BopliThemeSettings & {
    accent_color: string;
    show_theme_toggle: boolean;
    homepage_post_count: string;
    author_portrait: BopliImage | null;
};
export type CosmoBlogIndexProps = BopliBlogIndexProps & { settings: CosmoSettings };
export type CosmoBlogPostProps = BopliBlogPostProps & { settings: CosmoSettings };

export type CosmoPostEntry = CosmoEntry & {
    canonicalPath: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    body: string;
};

export type CosmoPageProps = BopliPageProps<{ body?: string }> & { settings: CosmoSettings };

export type CosmoProjectEntry = BopliPublicEntry<{
    summary: string;
    externalUrl?: string | null;
}> & {
    canonicalPath: string;
    seoTitle: string;
    seoDescription: string | null;
};

export type CosmoProjectProps = BopliEntryProps<CosmoProjectEntry> & { settings: CosmoSettings };

export type CosmoHomeProps = BopliPageProps<{ body?: string }> & { settings: CosmoSettings };

export type TreeGroup = {
    name: string;
    label: string;
    entries: CosmoEntry[];
};

export type { BopliImage, BopliSite, BopliTerm };

export function isoDate(value?: string | null): string {
    return value?.slice(0, 10) ?? '';
}

export function postFileName(entry: CosmoEntry): string {
    return `${entry.slug ?? 'untitled'}.md`;
}

export function groupEntries(entries: CosmoEntry[]): TreeGroup[] {
    const groups = new Map<string, TreeGroup>();

    for (const entry of entries) {
        const category = entry.categories[0];
        const name = category?.slug || 'uncategorized';
        const current = groups.get(name) ?? {
            name,
            label: category?.name || 'Uncategorized',
            entries: [],
        };

        current.entries.push(entry);
        groups.set(name, current);
    }

    return Array.from(groups.values());
}

export function primaryCategory(entry: CosmoEntry): BopliTerm | undefined {
    return entry.categories[0];
}

export function socialLink(
    site: BopliSite,
    label: string,
): { label: string; url: string } | undefined {
    return site.socialLinks?.find(
        (link) => link.label.toLowerCase() === label.toLowerCase(),
    );
}
