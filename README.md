# Dev Cosmo

Dev Cosmo is the first public-facing theme for Bopli and the initial theme for jcfrane's personal site. It is deliberately independent from Bopli's fixed administration interface.

## Install locally

From `bopli-app`:

```bash
php artisan bopli:theme:install ../dev-cosmo --force
npm run build
```

The installer validates `bopli-theme.json`, rejects symbolic links, copies only the declared theme surface, and records the installed snapshot. Restart Vite after installing during local development.

## Theme contract

`resources/js/pages/Home.vue` receives Bopli's public page contract: `site`, `page`, and projected `slots`. `resources/js/pages/Post.vue` receives `site` and a projected `entry`, including server-sanitized body HTML and its canonical route. Neither component imports or depends on admin application code.
