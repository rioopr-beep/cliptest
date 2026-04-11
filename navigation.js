/* navigation.js */

class NavigationController {
    constructor() {
        this.nav = document.getElementById('main-nav');
        this.links = document.querySelectorAll('.nav-item');
        this.lastScroll = 0;
        
        this.init();
    }

    init() {
        if (!this.nav) return;

        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        this.links.forEach(link => {
            link.addEventListener('mouseenter', (e) => this.handleHover(e, true));
            link.addEventListener('mouseleave', (e) => this.handleHover(e, false));
        });
    }

    handleScroll() {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50 && currentScroll > this.lastScroll) {
            this.nav.style.transform = 'translateY(-100%)';
            this.nav.style.transition = 'transform 0.4s var(--ease-wodniack)';
        } else {
            this.nav.style.transform = 'translateY(0)';
        }
        
        this.lastScroll = currentScroll;
    }

    handleHover(e, isEnter) {
        const target = e.target;
        if (isEnter) {
            target.style.color = 'var(--color-neon)';
            target.style.transform = 'translateY(-2px)';
        } else {
            target.style.color = '';
            target.style.transform = 'translateY(0)';
        }
        target.style.transition = 'color 0.3s ease, transform 0.3s var(--ease-wodniack)';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NavigationController();
});
