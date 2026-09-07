import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const headerPath = resolve(process.cwd(), 'resources/js/components/headers/DefaultHeader.vue');
const stylesheetPath = resolve(process.cwd(), 'resources/js/theme.css');

describe('Dev Cosmo responsive header', () => {
  it('keeps desktop links and exposes the same destinations in the mobile dock', async () => {
    const source = await readFile(headerPath, 'utf8');

    expect(source.match(/href="\/"/g)).toHaveLength(3);
    expect(source.match(/href="\/about"/g)).toHaveLength(2);
    expect(source.match(/href="\/blog"/g)).toHaveLength(2);
    expect(source).toContain('class="desktop-navigation"');
    expect(source).toContain('class="mobile-tabbar"');
    expect(source).toContain("currentPage === 'home'");
    expect(source).toContain("currentPage === 'about'");
    expect(source).toContain("currentPage === 'blog'");
  });

  it('renders an optional accessible light and dark mode switch', async () => {
    const source = await readFile(headerPath, 'utf8');

    expect(source).toContain('v-if="showThemeToggle"');
    expect(source).toContain('role="switch"');
    expect(source).toContain(':aria-checked="activeMode === \'dark\'"');
    expect(source).toContain("'Switch to light color mode'");
    expect(source).toContain("'Switch to dark color mode'");
    expect(source).toContain("activeMode.value === 'dark' ? 'light' : 'dark'");
    expect(source).toContain('activeMode.value = nextMode');
    expect(source).toContain('setMode(nextMode)');
    expect(source).toMatch(/<Sun\s+class="theme-toggle-icon theme-toggle-sun"/);
    expect(source).toMatch(/<Moon\s+class="theme-toggle-icon theme-toggle-moon"/);
  });

  it('pins the mobile dock above the safe area and reserves scrolling clearance', async () => {
    const stylesheet = await readFile(stylesheetPath, 'utf8');

    expect(stylesheet).toContain('@media (max-width: 640px)');
    expect(stylesheet).toMatch(/\.mobile-tabbar \{[\s\S]*position: fixed;/);
    expect(stylesheet).toContain('bottom: calc(12px + env(safe-area-inset-bottom, 0px));');
    expect(stylesheet).toContain('width: min(calc(100% - 32px), 420px);');
    expect(stylesheet).toContain('padding-bottom: calc(90px + env(safe-area-inset-bottom, 0px));');
    expect(stylesheet).toContain('.mobile-tabbar {\n  display: none;\n}');
    expect(stylesheet).toContain('.desktop-navigation {\n    display: none;');
  });

  it('animates the color-mode control and gives the dock responsive glass tokens', async () => {
    const stylesheet = await readFile(stylesheetPath, 'utf8');

    expect(stylesheet).toContain('transition: transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1);');
    expect(stylesheet).toContain('.theme-toggle-sun {');
    expect(stylesheet).toContain('.theme-toggle-moon {');
    expect(stylesheet).toContain(".theme-toggle[data-mode='dark'] .theme-toggle-moon");
    expect(stylesheet).toContain('--color-tabbar-bg: rgba(255, 255, 255, 0.72);');
    expect(stylesheet).toContain('--color-tabbar-bg: rgba(44, 0, 30, 0.68);');
    expect(stylesheet).toContain('backdrop-filter: blur(20px) saturate(145%);');
    expect(stylesheet).toContain('@media (prefers-reduced-motion: reduce)');
  });
});
