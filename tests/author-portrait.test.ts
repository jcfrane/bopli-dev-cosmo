import type { BopliSite } from '@bopli/theme-sdk';
import { describe, expect, it } from 'vitest';

import { resolveAuthorPortrait } from '../resources/js/types';

function siteWithOwnerPortrait(): BopliSite {
  return {
    name: 'Cosmo Signals',
    handle: 'cosmo',
    tagline: null,
    description: null,
    socialLinks: [],
    canonicalUrl: 'https://cosmo.example.test',
    owner: {
      name: 'Cosmo Owner',
      profileImage: {
        url: 'https://media.example.test/owner.webp',
        alt: 'Cosmo Owner profile photo',
        width: 512,
        height: 512,
      },
    },
  };
}

describe('Dev Cosmo author portrait', () => {
  it('uses the Site Owner profile image by default', () => {
    expect(resolveAuthorPortrait(siteWithOwnerPortrait())).toEqual({
      source: 'https://media.example.test/owner.webp',
      alt: 'Cosmo Owner profile photo',
    });
  });

  it('lets the theme portrait setting override the Site Owner image', () => {
    expect(
      resolveAuthorPortrait(siteWithOwnerPortrait(), {
        url: 'https://media.example.test/theme.webp',
        alt: 'Portrait among stars',
        width: 512,
        height: 512,
      }),
    ).toEqual({
      source: 'https://media.example.test/theme.webp',
      alt: 'Portrait among stars',
    });
  });

  it('leaves the source empty so the portrait component can use its bundled fallback', () => {
    expect(
      resolveAuthorPortrait({
        ...siteWithOwnerPortrait(),
        owner: null,
      }),
    ).toEqual({
      source: undefined,
      alt: 'Illustrated portrait of Cosmo Signals',
    });
  });
});
