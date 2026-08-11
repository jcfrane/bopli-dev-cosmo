import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import githubDark from '@shikijs/themes/github-dark';

type ClipboardWriter = Pick<Clipboard, 'writeText'>;
type Cleanup = () => void;

const languageLoaders = {
    bash: () => import('@shikijs/langs/bash'),
    'shell-session': () => import('@shikijs/langs/shellsession'),
    powershell: () => import('@shikijs/langs/powershell'),
    batch: () => import('@shikijs/langs/bat'),
    dockerfile: () => import('@shikijs/langs/dockerfile'),
    dotenv: () => import('@shikijs/langs/dotenv'),
    ini: () => import('@shikijs/langs/ini'),
    nginx: () => import('@shikijs/langs/nginx'),
    toml: () => import('@shikijs/langs/toml'),
    yaml: () => import('@shikijs/langs/yaml'),
    html: () => import('@shikijs/langs/html'),
    css: () => import('@shikijs/langs/css'),
    scss: () => import('@shikijs/langs/scss'),
    javascript: () => import('@shikijs/langs/javascript'),
    jsx: () => import('@shikijs/langs/jsx'),
    typescript: () => import('@shikijs/langs/typescript'),
    tsx: () => import('@shikijs/langs/tsx'),
    json: () => import('@shikijs/langs/json'),
    vue: () => import('@shikijs/langs/vue'),
    svelte: () => import('@shikijs/langs/svelte'),
    astro: () => import('@shikijs/langs/astro'),
    markdown: () => import('@shikijs/langs/markdown'),
    php: () => import('@shikijs/langs/php'),
    blade: () => import('@shikijs/langs/blade'),
    python: () => import('@shikijs/langs/python'),
    ruby: () => import('@shikijs/langs/ruby'),
    java: () => import('@shikijs/langs/java'),
    kotlin: () => import('@shikijs/langs/kotlin'),
    csharp: () => import('@shikijs/langs/csharp'),
    go: () => import('@shikijs/langs/go'),
    rust: () => import('@shikijs/langs/rust'),
    sql: () => import('@shikijs/langs/sql'),
    graphql: () => import('@shikijs/langs/graphql'),
    terraform: () => import('@shikijs/langs/terraform'),
    hcl: () => import('@shikijs/langs/hcl'),
    http: () => import('@shikijs/langs/http'),
    c: () => import('@shikijs/langs/c'),
    cpp: () => import('@shikijs/langs/cpp'),
    swift: () => import('@shikijs/langs/swift'),
    dart: () => import('@shikijs/langs/dart'),
    lua: () => import('@shikijs/langs/lua'),
    diff: () => import('@shikijs/langs/diff'),
} as const;

type HighlightedLanguage = keyof typeof languageLoaders;

const loadedLanguages = new Set<HighlightedLanguage>();
const highlighterPromise = createHighlighterCore({
    themes: [githubDark],
    langs: [],
    engine: createJavaScriptRegexEngine(),
});

function codeLanguage(pre: HTMLPreElement): HighlightedLanguage | 'txt' {
    const classLanguage = Array.from(pre.querySelector('code')?.classList ?? [])
        .find((className) => className.startsWith('language-'))
        ?.slice('language-'.length);
    const candidate = (pre.dataset.language || classLanguage || 'txt').trim().toLowerCase();

    return candidate in languageLoaders ? (candidate as HighlightedLanguage) : 'txt';
}

async function highlightedPre(
    source: HTMLPreElement,
    language: HighlightedLanguage | 'txt',
    code: string,
): Promise<HTMLPreElement> {
    if (language === 'txt') {
        source.dataset.language = language;
        source.querySelector('code')?.classList.add('language-txt');

        return source;
    }

    const highlighter = await highlighterPromise;

    if (!loadedLanguages.has(language)) {
        const registration = (await languageLoaders[language]()).default;
        await highlighter.loadLanguage(...registration);
        loadedLanguages.add(language);
    }

    const template = document.createElement('template');
    template.innerHTML = highlighter.codeToHtml(code, {
        lang: language,
        theme: 'github-dark',
    });
    const highlighted = template.content.querySelector('pre');

    if (!(highlighted instanceof HTMLPreElement)) {
        return source;
    }

    highlighted.dataset.language = language;
    highlighted.querySelector('code')?.classList.add(`language-${language}`);

    return highlighted;
}

function codeToolbar(
    language: string,
    code: string,
    clipboard: ClipboardWriter | undefined,
    timeouts: Set<ReturnType<typeof setTimeout>>,
): HTMLElement {
    const toolbar = document.createElement('div');
    toolbar.className = 'code-block__toolbar';

    const identity = document.createElement('div');
    identity.className = 'code-block__identity';

    const windowControls = document.createElement('span');
    windowControls.className = 'code-block__window-controls';
    windowControls.setAttribute('aria-hidden', 'true');

    for (const control of ['close', 'minimize', 'maximize']) {
        const dot = document.createElement('span');
        dot.className = `code-block__window-control code-block__window-control--${control}`;
        windowControls.append(dot);
    }

    const title = document.createElement('span');
    title.className = 'code-block__title';

    const path = document.createElement('span');
    path.className = 'code-block__path';
    path.textContent = '~/code';

    const separator = document.createElement('span');
    separator.className = 'code-block__title-separator';
    separator.textContent = '—';
    separator.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'code-block__language';
    label.textContent = language;

    title.append(path, separator, label);
    identity.append(windowControls, title);
    toolbar.append(identity);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-block__copy';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', `Copy ${language} code`);
    button.addEventListener('click', async () => {
        try {
            if (!clipboard) {
                throw new Error('Clipboard unavailable');
            }

            await clipboard.writeText(code);
            button.textContent = 'Copied';
            button.dataset.state = 'success';
        } catch {
            button.textContent = 'Unable to copy';
            button.dataset.state = 'error';
        }

        const timeout = setTimeout(() => {
            button.textContent = 'Copy';
            delete button.dataset.state;
            timeouts.delete(timeout);
        }, 2000);
        timeouts.add(timeout);
    });
    toolbar.append(button);

    return toolbar;
}

export async function enhanceCodeBlocks(
    root: HTMLElement,
    clipboard: ClipboardWriter | undefined = navigator.clipboard,
): Promise<Cleanup> {
    const timeouts = new Set<ReturnType<typeof setTimeout>>();
    const blocks = Array.from(
        root.querySelectorAll<HTMLPreElement>('pre:not([data-code-enhanced])'),
    );

    await Promise.all(
        blocks.map(async (source) => {
            source.dataset.codeEnhanced = 'loading';
            const code = source.querySelector('code')?.textContent ?? '';
            const language = codeLanguage(source);
            let rendered = source;

            try {
                rendered = await highlightedPre(source, language, code);
            } catch {
                source.dataset.language = 'txt';
                source.querySelector('code')?.classList.add('language-txt');
            }

            rendered.dataset.codeEnhanced = 'true';
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block';
            wrapper.dataset.language = rendered.dataset.language ?? 'txt';
            source.replaceWith(wrapper);
            wrapper.append(
                codeToolbar(wrapper.dataset.language, code, clipboard, timeouts),
                rendered,
            );
        }),
    );

    return () => {
        for (const timeout of timeouts) {
            clearTimeout(timeout);
        }

        timeouts.clear();
    };
}
