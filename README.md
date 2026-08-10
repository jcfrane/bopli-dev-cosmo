# Dev Cosmo

Dev Cosmo is the first public-facing theme for Bopli and the initial theme for jcfrane's personal site. It is deliberately independent from Bopli's fixed administration interface. Version 0.7 implements the protocol-v1 Page, Entry, theme-query, settings, starter-content, native Blog, and public Site Owner contracts with the responsive Cosmic Terminal design system: Ubuntu typography, light and aubergine-dark modes, terminal-style content discovery, and an editorial article surface.

## Develop locally

Install the exact public toolkit versions declared by this repository:

```bash
npm install
```

Then, with the Bopli Docker stack running:

```bash
npm run dev
```

The script uses the installed `@bopli/theme-cli` watch server and registers a local-only development release through the PHP container. Source stays in this repository; it is never copied into `bopli-app` and the application Vite build does not compile it.

During an incompatible pre-production v1 contract change, the application verifies and stages the development release while leaving the active release unchanged. Keep `npm run dev` running and execute the printed `bopli:local-reset --first-theme=…` command in another terminal; the reset explicitly registers that live descriptor while rebuilding the Site from its starter recipe.

For a production-shaped release:

```bash
npm run types:check
npm run validate
npm run build
```

All Vue components use `<script setup lang="ts">`; shared public-contract extensions live in `resources/js/types.ts`. `types:check` runs strict `vue-tsc`, and `build` runs the same check before writing self-contained ESM, CSS, an artifact inventory, and protocol-v1 `theme.json` with runtime ABI v1 to ignored `dist/`. Tagged releases use the pinned toolkit workflow to upload that directory to an immutable CDN prefix. Bopli then registers the resulting HTTPS descriptor URL with `bopli:theme:install`.

## Theme conventions (protocol v1)

There is no manifest file. The platform derives everything from the repository:

- **Identity and settings** come from `package.json`: normal package fields own the version, description, and author, while `bopli` declares the stable handle, display name, supported Bopli version, color modes, and presentation settings.
- Templates live only in `pages` and `entries`. Those directories infer ordinary Page and Entry kinds; native Blog templates opt in with `"kind": "blog_index"` or `"kind": "blog_post"` metadata in the matching directory. The template handle is the snake_case filename.
- **Template metadata** lives in a `<bopli lang="json">` custom block. Generic Entries declare `fields`; native Blog templates declare their special kind. Page and Entry kinds are required and each has one default; Blog archive/post support is optional and paired. Slot declarations are not part of protocol v1.
- **Starter content** lives in `resources/bopli/starter.json`. Its v1 recipe declares the Projects model and public route, three Project entries, published Home/About Pages, and Blog enablement.
- Anything under `resources/js/components/` is shared presentation code imported with relative paths; it is never a template.
- Theme code may import relative modules, `vue`, and `@bopli/theme-sdk`. Inertia, Bopli application modules, arbitrary packages, remote imports, and Node built-ins are outside the public theme boundary.

## Templates

- `templates/pages/Home.vue` (`home`) — featured-post hero and a collapsible filesystem-style latest-post tree driven by direct `blog.posts` queries.
- `templates/pages/Page.vue` (`page`) — default general-purpose Page layout.
- `templates/pages/Blog.vue` (`blog`, `blog_index`) — URL-driven search, category, tag, and paginated archive grouped by projected Categories.
- `templates/pages/About.vue` (`about`) — Bopli-authored Page title and body in the Cosmic Terminal layout.
- `templates/entries/Project.vue` (`project`) — default generic Entry layout using `summary` and `externalUrl` projections.
- `templates/entries/Post.vue` (`post`, `blog_post`) — reading progress, cover image, server-sanitized rich-text body, author card, and adjacent-post navigation.

Every template receives resolved tenant `settings` alongside its normal public props. `SiteLayout` supplies theme-owned default header and footer components through scoped slots, so a template can replace either composition without adding manifest settings. The layout applies the configured accent and toggle visibility. Author portraits resolve from the optional uploaded theme override, then the projected Site Owner profile image, then Cosmo's bundled illustration. Home uses `useBopliQuery<BopliBlogPostSummary>()` for featured and recent posts; native templates use `BopliBlogIndexProps` and `BopliBlogPostProps`. No component imports or depends on admin application code.
