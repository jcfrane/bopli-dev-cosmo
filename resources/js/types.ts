import type {
    BopliImage,
    BopliPublicEntry,
    BopliSite,
    BopliTerm,
} from '@bopli/theme-sdk';

export type CosmoEntry = BopliPublicEntry<{
    excerpt?: string;
    readTime?: number;
    featureImage?: BopliImage | null;
}>;

export type CosmoPostEntry = CosmoEntry & {
    canonicalPath: string;
    seoTitle: string | null;
    seoDescription: unknown;
    body: string;
};

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
    return `${entry.slug}.md`;
}

export function groupEntries(entries: CosmoEntry[]): TreeGroup[] {
    const groups = new Map<string, TreeGroup>();

    for (const entry of entries) {
        const category = entry.terms.category?.[0];
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
    return entry.terms.category?.[0];
}

export function socialLink(
    site: BopliSite,
    label: string,
): { label: string; url: string } | undefined {
    return site.socialLinks?.find(
        (link) => link.label.toLowerCase() === label.toLowerCase(),
    );
}
