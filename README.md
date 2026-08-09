# Dev Cosmo

Dev Cosmo is the first public-facing theme for Bopli and the initial theme for jcfrane's personal site. It is deliberately independent from Bopli's fixed administration interface. Version 0.5 implements the protocol-v4 native Blog contract with the responsive Cosmic Terminal design system: Ubuntu typography, light and aubergine-dark modes, terminal-style content discovery, and an editorial article surface.

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

During an incompatible protocol transition, the application verifies and stages the development release while leaving the active release unchanged. Keep `npm run dev` running and execute the printed `bopli:local-reset --first-theme=…` command in another terminal; the reset explicitly registers that live descriptor while rebuilding the native Blog fixture.

For a production-shaped release:

```bash
npm run validate
npm run build
```

`build` writes self-contained ESM, CSS, an artifact inventory, and protocol-v4 `theme.json` with runtime ABI v1 to ignored `dist/`. Tagged releases use the pinned toolkit workflow to upload that directory to an immutable CDN prefix. Bopli then registers the resulting HTTPS descriptor URL with `bopli:theme:install`.

## Theme conventions (protocol v4)

There is no manifest file. The platform derives everything from the repository:

- **Identity** comes from `composer.json`: `type` must be `bopli-theme`, and `extra.bopli` declares `handle`, `name`, and the supported Bopli version `constraint`. `version` is the theme version.
- Template directories define kind: `pages` → Page, `entries` → generic Entry, `blogs` → native Blog archive, and `posts` → native Blog post. The template handle is the snake_case filename.
- **Template metadata** lives in a `<bopli lang="json">` custom block. Pages declare `slots`, generic Entries declare `fields`, and native Blog templates declare neither. Blog archive/post support is paired and each kind has one default.
- Anything under `resources/js/components/` is shared presentation code imported with relative paths; it is never a template.
- Theme code may import relative modules, `vue`, and `@bopli/theme-sdk`. Inertia, Bopli application modules, arbitrary packages, remote imports, and Node built-ins are outside the public theme boundary.

## Templates

- `templates/pages/Home.vue` (`home`) — featured-post hero and a collapsible filesystem-style latest-post tree. The legacy `featured_projects` slot remains declared for release compatibility.
- `templates/blogs/Blog.vue` (`blog`) — URL-driven search, category, tag, and paginated archive grouped by projected Categories.
- `templates/pages/About.vue` (`about`) — author profile, skill flags, timeline, and public social links.
- `templates/posts/Post.vue` (`post`) — reading progress, cover image, server-sanitized rich-text body, author card, and adjacent-post navigation.

Page templates receive `site`, `page`, and projected `slots`. Home's Blog slots use `BopliBlogPostSummary`; the native templates use `BopliBlogIndexProps` and `BopliBlogPostProps`. No component imports or depends on admin application code.
