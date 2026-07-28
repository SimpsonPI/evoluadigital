import { beforeEach, describe, expect, it, vi } from 'vitest';
import { runSiteScript, setHeader } from './helpers.js';

describe('mobile menu', () => {
    let toggle;
    let nav;
    let navLinks;

    beforeEach(async () => {
        ({ toggle, nav, navLinks } = setHeader());
        await runSiteScript();
    });

    it('opens the menu and updates accessibility attributes', () => {
        toggle.click();

        expect(nav.classList.contains('active')).toBe(true);
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        expect(toggle.getAttribute('aria-label')).toBe('Fechar menu');
        expect(toggle.querySelector('i').classList.contains('fa-times')).toBe(true);
        expect(toggle.querySelector('i').classList.contains('fa-bars')).toBe(false);
    });

    it('closes the menu on a second click', () => {
        toggle.click();
        toggle.click();

        expect(nav.classList.contains('active')).toBe(false);
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
        expect(toggle.getAttribute('aria-label')).toBe('Abrir menu');
        expect(toggle.querySelector('i').classList.contains('fa-bars')).toBe(true);
    });

    it('closes the menu when a navigation link is clicked', () => {
        toggle.click();
        navLinks[0].click();

        expect(nav.classList.contains('active')).toBe(false);
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
    });

    it('closes the menu on Escape and ignores other keys', () => {
        toggle.click();
        document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter' }));
        expect(nav.classList.contains('active')).toBe(true);

        document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
        expect(nav.classList.contains('active')).toBe(false);
    });

    it('keeps working when the toggle has no icon', async () => {
        setHeader();
        document.querySelector('.mobile-toggle').innerHTML = '';
        await runSiteScript();

        document.querySelector('.mobile-toggle').click();
        expect(document.querySelector('.main-nav').classList.contains('active')).toBe(true);
    });
});

describe('mobile menu without a toggle button', () => {
    it('does not throw and leaves the navigation untouched', async () => {
        const { nav } = setHeader({ withToggle: false });
        await expect(runSiteScript()).resolves.toBeUndefined();

        document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
        expect(nav.classList.contains('active')).toBe(false);
    });
});

describe('current navigation link', () => {
    it('marks the Método 5D link as current on the method page', async () => {
        window.history.pushState({}, '', '/metodo_5d.html');
        const { navLinks } = setHeader();

        await runSiteScript();

        const methodLink = navLinks.find((link) => link.getAttribute('href') === 'metodo_5d.html');
        expect(methodLink.getAttribute('aria-current')).toBe('page');
        expect(navLinks.filter((link) => link.hasAttribute('aria-current'))).toHaveLength(1);
    });

    it('observes in-page sections and marks the most visible one', async () => {
        const observed = [];
        let callback;
        window.IntersectionObserver = class {
            constructor(fn, options) {
                callback = fn;
                this.options = options;
            }

            observe(target) {
                observed.push(target);
            }
        };

        const { navLinks } = setHeader();
        await runSiteScript();

        expect(observed.map((section) => section.id)).toEqual(['inicio', 'sobre']);

        callback([
            { target: document.getElementById('inicio'), isIntersecting: true, intersectionRatio: 0.2 },
            { target: document.getElementById('sobre'), isIntersecting: true, intersectionRatio: 0.8 },
        ]);

        expect(navLinks[1].getAttribute('aria-current')).toBe('page');
        expect(navLinks[0].hasAttribute('aria-current')).toBe(false);

        callback([{ target: document.getElementById('inicio'), isIntersecting: true, intersectionRatio: 0.9 }]);
        expect(navLinks[0].getAttribute('aria-current')).toBe('page');
        expect(navLinks[1].hasAttribute('aria-current')).toBe(false);
    });

    it('keeps the current link when no section is intersecting', async () => {
        let callback;
        window.IntersectionObserver = class {
            constructor(fn) {
                callback = fn;
            }

            observe() {}
        };

        const { navLinks } = setHeader();
        await runSiteScript();

        callback([{ target: document.getElementById('inicio'), isIntersecting: true, intersectionRatio: 0.5 }]);
        callback([{ target: document.getElementById('sobre'), isIntersecting: false, intersectionRatio: 0 }]);

        expect(navLinks[0].getAttribute('aria-current')).toBe('page');
    });

    it('ignores entries whose target is not a tracked section', async () => {
        let callback;
        window.IntersectionObserver = class {
            constructor(fn) {
                callback = fn;
            }

            observe() {}
        };

        const { navLinks } = setHeader();
        await runSiteScript();

        callback([{ target: document.body, isIntersecting: true, intersectionRatio: 1 }]);

        expect(navLinks.some((link) => link.hasAttribute('aria-current'))).toBe(false);
    });

    it('skips section tracking when IntersectionObserver is unavailable', async () => {
        const { navLinks } = setHeader();

        await expect(runSiteScript()).resolves.toBeUndefined();
        expect(navLinks.some((link) => link.hasAttribute('aria-current'))).toBe(false);
    });

    it('skips section tracking when no anchor target exists', async () => {
        window.IntersectionObserver = vi.fn();
        setHeader({ links: ['#inexistente'] });

        await runSiteScript();

        expect(window.IntersectionObserver).not.toHaveBeenCalled();
    });
});

describe('smooth scrolling anchors', () => {
    beforeEach(async () => {
        setHeader();
        await runSiteScript();
    });

    it('scrolls to and focuses the target section', () => {
        const target = document.getElementById('sobre');
        target.focus = vi.fn();

        const event = new window.MouseEvent('click', { bubbles: true, cancelable: true });
        document.querySelector('a[href="#sobre"]').dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
        expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
        expect(target.getAttribute('tabindex')).toBe('-1');
        expect(target.focus).toHaveBeenCalledWith({ preventScroll: true });
    });

    it('does nothing when the anchor target is missing', async () => {
        setHeader({ links: ['#ausente'] });
        await runSiteScript();

        const event = new window.MouseEvent('click', { bubbles: true, cancelable: true });
        document.querySelector('a[href="#ausente"]').dispatchEvent(event);

        expect(event.defaultPrevented).toBe(false);
        expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    });
});

describe('footer year', () => {
    it('fills the current year', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2031-02-03T00:00:00Z'));
        setHeader();

        await runSiteScript();

        expect(document.getElementById('current-year').textContent).toBe('2031');
    });

    it('does not throw when the year placeholder is absent', async () => {
        setHeader();
        document.getElementById('current-year').remove();

        await expect(runSiteScript()).resolves.toBeUndefined();
    });
});
