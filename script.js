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
