import { beforeEach, describe, expect, it } from 'vitest';
import { methodPageBody, runMethodPageInlineScripts } from './helpers.js';

const tabs = () => Array.from(document.querySelectorAll('.nav-tab'));
const sections = () => Array.from(document.querySelectorAll('.content-section'));

describe('Método 5D tabs', () => {
    beforeEach(() => {
        document.body.innerHTML = methodPageBody();
        runMethodPageInlineScripts();
    });

    it('renders one tab per content section', () => {
        expect(tabs().length).toBeGreaterThan(1);
        expect(tabs().map((tab) => tab.dataset.section).sort()).toEqual(sections().map((section) => section.id).sort());
    });

    it('shows only the clicked section', () => {
        const target = tabs()[1];
        target.click();

        sections().forEach((section) => {
            expect(section.hidden).toBe(section.id !== target.dataset.section);
        });
    });

    it('moves the selected and focusable state to the clicked tab', () => {
        const target = tabs()[1];
        target.click();

        tabs().forEach((tab) => {
            const isActive = tab === target;
            expect(tab.classList.contains('active')).toBe(isActive);
            expect(tab.getAttribute('aria-selected')).toBe(String(isActive));
            expect(tab.tabIndex).toBe(isActive ? 0 : -1);
        });
    });

    it('hides every section when the requested id does not exist', () => {
        const orphan = tabs()[0];
        orphan.dataset.section = 'secao-inexistente';
        orphan.click();

        expect(sections().every((section) => section.hidden)).toBe(true);
        expect(orphan.getAttribute('aria-selected')).toBe('true');
        expect(tabs().slice(1).every((tab) => tab.getAttribute('aria-selected') === 'false')).toBe(true);
    });
});
