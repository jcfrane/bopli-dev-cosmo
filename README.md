# Dev Cosmo

Dev Cosmo is the first public-facing theme for Bopli and the initial theme for jcfrane's personal site. It is deliberately independent from Bopli's fixed administration interface. Version 0.4 implements the responsive Cosmic Terminal design system: Ubuntu typography, light and aubergine-dark modes, terminal-style content discovery, and an editorial article surface.

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

For a production-shaped release:

```bash
npm run validate
npm run build
```

`build` writes self-contained ESM, CSS, an artifact inventory, and protocol-v3 `theme.json` to ignored `dist/`. Tagged releases use the pinned toolkit workflow to upload that directory to an immutable CDN prefix. Bopli then registers the resulting HTTPS descriptor URL with `bopli:theme:install`.

## Theme conventions (protocol v3)

There is no manifest file. The platform derives everything from the repository:

- **Identity** comes from `composer.json`: `type` must be `bopli-theme`, and `extra.bopli` declares `handle`, `name`, and the supported Bopli version `constraint`. `version` is the theme version.
- **Page templates** are the `.vue` files directly inside `resources/js/templates/pages/`. **Entry templates** live in `resources/js/templates/entries/`. The template handle is the snake_case file basename (`Home.vue` → `home`).
- **Template metadata** lives in a `<bopli lang="json">` custom block at the top of the component. Page templates declare `slots`; entry templates must declare `fields` (validated against Bopli's content field types). Pages may omit the block entirely.
- Anything under `resources/js/components/` is shared presentation code imported with relative paths; it is never a template.
- Theme code may import relative modules, `vue`, and `@bopli/theme-sdk`. Inertia, Bopli application modules, arbitrary packages, remote imports, and Node built-ins are outside the public theme boundary.

## Templates

- `templates/pages/Home.vue` (`home`) — featured-post hero and a collapsible filesystem-style latest-post tree. The legacy `featured_projects` slot remains declared for release compatibility.
- `templates/pages/Blog.vue` (`blog`) — searchable, single-tag-filterable archive grouped by projected Categories.
- `templates/pages/About.vue` (`about`) — author profile, skill flags, timeline, and public social links.
- `templates/entries/Post.vue` (`post`) — reading progress, feature image, server-sanitized rich-text body, author card, and adjacent-entry navigation.

Page templates receive Bopli's public page contract: `site`, `page`, and projected `slots`. Entry templates receive `site` and a projected `entry`, including server-sanitized body HTML and its canonical route. No component imports or depends on admin application code.
