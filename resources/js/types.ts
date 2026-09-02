import type { BopliBlogPostSummary, BopliImage, BopliSite, BopliTerm } from '@bopli/theme-sdk';

export type CosmoEntry = BopliBlogPostSummary;

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

export function resolveAuthorPortrait(
  site: BopliSite,
  override?: BopliImage | null,
): { source?: string; alt: string } {
  return {
    source: override?.url ?? site.owner?.profileImage?.url,
    alt: override?.alt ?? site.owner?.profileImage?.alt ?? `Illustrated portrait of ${site.name}`,
  };
}
