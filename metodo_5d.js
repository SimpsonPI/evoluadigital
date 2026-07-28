const tabs = document.querySelectorAll('.nav-tab');
const sections = document.querySelectorAll('.content-section');

function showSection(sectionId) {
    sections.forEach((section) => {
        section.hidden = section.id !== sectionId;
    });

    tabs.forEach((tab) => {
        const isActive = tab.dataset.section === sectionId;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
    });
}

tabs.forEach((tab) => {
    tab.addEventListener('click', () => showSection(tab.dataset.section));
});
