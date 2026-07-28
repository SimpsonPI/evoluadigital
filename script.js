/* ============================================================
   UTILITÁRIOS COMPARTILHADOS
============================================================ */

const selectAll = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const setActiveState = (elements, activeElement, { className, attribute, activeValue }) => {
    elements.forEach((element) => {
        const isActive = element === activeElement;

        if (className) element.classList.toggle(className, isActive);

        if (attribute && isActive) {
            element.setAttribute(attribute, activeValue);
        } else if (attribute) {
            element.removeAttribute(attribute);
        }
    });
};

const onEscape = (callback) => {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') callback();
    });
};


/* ============================================================
   MENU MOBILE
============================================================ */

const initMobileMenu = () => {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (!mobileToggle || !mainNav) return;

    const setMenuState = (isOpen) => {
        mainNav.classList.toggle('active', isOpen);
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
        mobileToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');

        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars', !isOpen);
            icon.classList.toggle('fa-times', isOpen);
        }
    };

    mobileToggle.addEventListener('click', () => {
        setMenuState(!mainNav.classList.contains('active'));
    });

    selectAll('.nav-link').forEach((link) => link.addEventListener('click', () => setMenuState(false)));
    onEscape(() => setMenuState(false));
};


/* ============================================================
   DESTAQUE DO LINK DE NAVEGAÇÃO ATIVO
============================================================ */

const initCurrentNavLink = () => {
    const navLinks = selectAll('.nav-link');
    const setCurrentNavLink = (currentLink) => {
        setActiveState(navLinks, currentLink, { attribute: 'aria-current', activeValue: 'page' });
    };

    const methodLink = navLinks.find((link) => link.getAttribute('href') === 'metodo_5d.html');
    if (window.location.pathname.endsWith('metodo_5d.html') && methodLink) {
        setCurrentNavLink(methodLink);
        return;
    }

    const sections = navLinks
        .filter((link) => link.getAttribute('href')?.startsWith('#'))
        .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
        .filter(({ section }) => section);

    if (!('IntersectionObserver' in window) || !sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        const visibleEntry = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) return;

        const match = sections.find(({ section }) => section === visibleEntry.target);
        if (match) setCurrentNavLink(match.link);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.1, 0.5] });

    sections.forEach(({ section }) => observer.observe(section));
};


/* ============================================================
   ROLAGEM SUAVE PARA ÂNCORAS
============================================================ */

const initSmoothScroll = () => {
    selectAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });
};


/* ============================================================
   ABAS (usado no guia do Método 5D®)
============================================================ */

const initTabs = () => {
    const tabs = selectAll('[role="tablist"] [role="tab"][data-section]');
    if (!tabs.length) return;

    const panels = selectAll('.content-section');

    const showSection = (sectionId) => {
        panels.forEach((panel) => {
            panel.hidden = panel.id !== sectionId;
        });

        tabs.forEach((tab) => {
            const isActive = tab.dataset.section === sectionId;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
            tab.tabIndex = isActive ? 0 : -1;
        });
    };

    tabs.forEach((tab) => tab.addEventListener('click', () => showSection(tab.dataset.section)));
};


/* ============================================================
   RODAPÉ
============================================================ */

const initCurrentYear = () => {
    const year = document.getElementById('current-year');
    if (year) year.textContent = new Date().getFullYear();
};


document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initCurrentNavLink();
    initSmoothScroll();
    initTabs();
    initCurrentYear();
});
