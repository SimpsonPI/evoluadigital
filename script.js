document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    const setMenuState = (isOpen) => {
        if (!mobileToggle || !mainNav) return;

        mainNav.classList.toggle('active', isOpen);
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
        mobileToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');

        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars', !isOpen);
            icon.classList.toggle('fa-times', isOpen);
        }
    };

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            setMenuState(!mainNav.classList.contains('active'));
        });

        navLinks.forEach((link) => link.addEventListener('click', () => setMenuState(false)));

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') setMenuState(false);
        });
    }

    const setCurrentNavLink = (currentLink) => {
        navLinks.forEach((link) => {
            if (link === currentLink) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const methodLink = Array.from(navLinks).find((link) => link.getAttribute('href') === 'metodo_5d.html');
    if (window.location.pathname.endsWith('metodo_5d.html') && methodLink) {
        setCurrentNavLink(methodLink);
    } else {
        const sectionLinks = Array.from(navLinks).filter((link) => link.getAttribute('href')?.startsWith('#'));
        const sections = sectionLinks
            .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
            .filter(({ section }) => section);

        if ('IntersectionObserver' in window && sections.length) {
            const observer = new IntersectionObserver((entries) => {
                const visibleEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (!visibleEntry) return;

                const match = sections.find(({ section }) => section === visibleEntry.target);
                if (match) setCurrentNavLink(match.link);
            }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.1, 0.5] });

            sections.forEach(({ section }) => observer.observe(section));
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            const target = targetId ? document.querySelector(targetId) : null;

            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });

    const year = document.getElementById('current-year');
    if (year) year.textContent = new Date().getFullYear();
});
