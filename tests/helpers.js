import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { vi } from 'vitest';

const projectRoot = join(import.meta.dirname, '..');
const methodPageSource = readFileSync(join(projectRoot, 'metodo_5d.html'), 'utf8');

const inlineScripts = (html) =>
    Array.from(html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)).map((match) => match[1]);

// script.js only registers a DOMContentLoaded callback, which is captured here so each test can
// re-evaluate the script against a fresh DOM without previous runs re-registering on the shared document.
export const runSiteScript = async () => {
    const addEventListener = document.addEventListener.bind(document);
    let onReady;

    document.addEventListener = (type, listener, options) => {
        if (type === 'DOMContentLoaded') {
            onReady = listener;
            return;
        }

        addEventListener(type, listener, options);
    };

    try {
        vi.resetModules();
        await import('../script.js');
    } finally {
        document.addEventListener = addEventListener;
    }

    onReady(new window.Event('DOMContentLoaded'));
};

export const runMethodPageInlineScripts = () => {
    inlineScripts(methodPageSource).forEach((source) => new Function(source)());
};

export const methodPageBody = () => methodPageSource.replace(/[\s\S]*<body[^>]*>/, '').replace(/<\/body>[\s\S]*/, '');

export const setHeader = ({ withToggle = true, links = ['#inicio', '#sobre', 'metodo_5d.html'] } = {}) => {
    document.body.innerHTML = `
        ${withToggle ? '<button class="mobile-toggle" aria-label="Abrir menu" aria-expanded="false"><i class="fas fa-bars"></i></button>' : ''}
        <nav class="main-nav">
            <ul>
                ${links.map((href) => `<li><a href="${href}" class="nav-link">${href}</a></li>`).join('')}
            </ul>
        </nav>
        <section id="inicio">Início</section>
        <section id="sobre">Sobre</section>
        <span id="current-year"></span>
    `;

    return {
        toggle: document.querySelector('.mobile-toggle'),
        nav: document.querySelector('.main-nav'),
        navLinks: Array.from(document.querySelectorAll('.nav-link')),
    };
};
