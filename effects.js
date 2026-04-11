/* effects.js */

class CursorEffects {
    constructor() {
        this.dot = document.getElementById('cursor-dot');
        this.outline = document.getElementById('cursor-outline');
        this.interactiveElements = document.querySelectorAll('a, button, .magnetic-button, [data-hover]');
        
        this.mouse = { x: 0, y: 0 };
        this.outlinePos = { x: 0, y: 0 };
        
        this.init();
    }

    init() {
        if (!this.dot || !this.outline) return;

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            this.dot.style.transform = `translate(calc(${this.mouse.x}px - 50%), calc(${this.mouse.y}px - 50%))`;
        });

        const renderOutline = () => {
            this.outlinePos.x += (this.mouse.x - this.outlinePos.x) * 0.15;
            this.outlinePos.y += (this.mouse.y - this.outlinePos.y) * 0.15;
            
            this.outline.style.transform = `translate(calc(${this.outlinePos.x}px - 50%), calc(${this.outlinePos.y}px - 50%))`;
            requestAnimationFrame(renderOutline);
        };
        requestAnimationFrame(renderOutline);

        this.interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.outline.classList.add('hover-active'));
            el.addEventListener('mouseleave', () => this.outline.classList.remove('hover-active'));
        });
    }
}

class MagneticEffects {
    constructor() {
        this.magneticItems = document.querySelectorAll('.magnetic-button');
        this.init();
    }

    init() {
        this.magneticItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                item.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                
                const label = item.querySelector('.button-label');
                if(label) {
                    label.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
                }
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translate(0px, 0px)';
                
                const label = item.querySelector('.button-label');
                if(label) {
                    label.style.transform = 'translate(0px, 0px)';
                }
            });
        });
    }
}

class TextAnimator {
    constructor() {
        this.textElements = document.querySelectorAll('.title-primary, .title-secondary');
        this.init();
    }

    init() {
        this.textElements.forEach(el => {
            if(el.classList.contains('split-text') || el.children.length > 0) return;
            
            const content = el.innerText;
            el.innerHTML = '';
            el.classList.add('split-text');
            
            // PERBAIKAN: Memaksa kontainer teks menjadi flexbox yang bisa membungkus baris
            el.style.display = 'flex';
            el.style.flexWrap = 'wrap';
            el.style.justifyContent = 'center';
            
            content.split('').forEach((char, i) => {
                const charSpan = document.createElement('span');
                charSpan.className = 'char';
                
                // PERBAIKAN: Membiarkan spasi normal agar browser bisa memutus baris
                if (char === ' ') {
                    charSpan.innerHTML = ' ';
                    charSpan.style.whiteSpace = 'pre';
                } else {
                    charSpan.innerHTML = char;
                }
                
                charSpan.style.transitionDelay = `${i * 0.03}s`;
                el.appendChild(charSpan);
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CursorEffects();
    new MagneticEffects();
    new TextAnimator();
});
