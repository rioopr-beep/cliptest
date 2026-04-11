class SpaceEngine {
    constructor() {
        this.wrapper = document.getElementById('smooth-wrapper');
        this.content = document.getElementById('smooth-content');
        this.scenes = document.querySelectorAll('.scene-node');
        
        this.scroll = {
            current: 0,
            target: 0,
            ease: 0.08,
            limit: 0
        };

        this.mouse = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0
        };

        this.windowSize = {
            w: window.innerWidth,
            h: window.innerHeight
        };

        this.init();
    }

    init() {
        if (!this.wrapper || !this.content) return;

        document.body.style.height = `${this.content.getBoundingClientRect().height}px`;
        this.scroll.limit = this.content.clientHeight - this.windowSize.h;

        this.addEventListeners();
        this.update();
    }

    addEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this));
        
        window.addEventListener('scroll', () => {
            this.scroll.target = window.scrollY;
        }, { passive: true });

        window.addEventListener('mousemove', (e) => {
            this.mouse.targetX = (e.clientX / this.windowSize.w - 0.5) * 2;
            this.mouse.targetY = (e.clientY / this.windowSize.h - 0.5) * 2;
        });
    }

    onResize() {
        this.windowSize.w = window.innerWidth;
        this.windowSize.h = window.innerHeight;
        document.body.style.height = `${this.content.getBoundingClientRect().height}px`;
        this.scroll.limit = this.content.clientHeight - this.windowSize.h;
    }

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    updateScenes() {
        this.scenes.forEach((scene) => {
            const depth = parseFloat(scene.getAttribute('data-depth')) || 1.0;
            const rect = scene.getBoundingClientRect();
            const isVisible = rect.top < this.windowSize.h && rect.bottom > 0;

            if (isVisible) {
                const relativeScroll = (this.windowSize.h - rect.top) * 0.1;
                
                const front = scene.querySelector('.front-layer');
                const mid = scene.querySelector('.mid-layer');
                const back = scene.querySelector('.back-layer');

                if (front) {
                    const z = parseFloat(front.getAttribute('data-transform-z')) || 0;
                    front.style.transform = `translate3d(0, ${relativeScroll * -1.5}px, ${z + relativeScroll * depth * 2}px)`;
                }
                
                if (mid) {
                    const z = parseFloat(mid.getAttribute('data-transform-z')) || 0;
                    mid.style.transform = `translate3d(0, ${relativeScroll * -0.5}px, ${z + relativeScroll * depth}px) rotateX(${this.mouse.y * -5}deg) rotateY(${this.mouse.x * 5}deg)`;
                }

                if (back) {
                    const z = parseFloat(back.getAttribute('data-transform-z')) || 0;
                    back.style.transform = `translate3d(0, ${relativeScroll * 0.5}px, ${z - relativeScroll * depth * 0.5}px)`;
                }
            }
        });
    }

    update() {
        this.scroll.current = this.lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
        
        if (this.scroll.current < 0.1) this.scroll.current = 0;
        
        this.mouse.x = this.lerp(this.mouse.x, this.mouse.targetX, 0.05);
        this.mouse.y = this.lerp(this.mouse.y, this.mouse.targetY, 0.05);

        this.content.style.transform = `translate3d(0, ${-this.scroll.current}px, 0)`;

        this.updateScenes();

        requestAnimationFrame(this.update.bind(this));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if(document.querySelector('.canvas-3d-space')) {
            window.spaceEngine = new SpaceEngine();
        }
    }, 100);
});
