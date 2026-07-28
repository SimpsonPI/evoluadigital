import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
    document.body.innerHTML = '';
    delete window.IntersectionObserver;
    Element.prototype.scrollIntoView = vi.fn();
    window.history.pushState({}, '', '/index.html');
});

afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});
