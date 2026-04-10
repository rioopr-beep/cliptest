// Fungsi Navigasi
const toggleNav = () => document.querySelector('.overlay').classList.toggle('active');

const Engine = {
    init() {
        this.setupCursor();
        this.setupLenis();
        this.setupScroll();
        this.setupAnimations();
        this.handleResize();
    },

    // Sistem Kursor
    setupCursor() {
        const cursor = document.querySelector(".cursor");
        const follower = document.querySelector(".cursor-follower");
        window.addEventListener("mousemove", (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
            gsap.to(follower, { x: e.clientX - 16, y: e.clientY - 16, duration: 0.15 });
        });
    },

    // Smooth Scroll (Lenis)
    setupLenis() {
        const lenis = new Lenis({ 
            duration: 1.2, 
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
        });
        function raf(time) { 
            lenis.raf(time); 
            requestAnimationFrame(raf); 
        }
        requestAnimationFrame(raf);
    },

    // Horizontal Scroll Engine
    setupScroll() {
        gsap.registerPlugin(ScrollTrigger);
        const content = document.querySelector(".scroll-content");
        const panels = gsap.utils.toArray(".panel");

        this.masterTween = gsap.to(panels, {
            xPercent: -100 * (panels.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: ".scroll-wrapper",
                pin: true,
                scrub: 1,
                // Mengambil lebar total konten secara dinamis
                end: () => "+=" + content.offsetWidth
            }
        });
    },

    // Animasi Text Reveal & Parallax
    setupAnimations() {
        // Tunggu sebentar untuk memastikan SplitType bekerja
        document.querySelectorAll(".animate").forEach(el => {
            const split = new SplitType(el, { types: 'chars' });
            
            gsap.fromTo(split.chars, 
                { y: 100, opacity: 0 }, 
                {
                    y: 0, 
                    opacity: 1, 
                    stagger: 0.04, 
                    duration: 0.8, 
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: el,
                        containerAnimation: this.masterTween,
                        start: "left 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Parallax Foto
        gsap.utils.toArray(".floating-photo").forEach(img => {
            gsap.to(img, {
                x: -500,
                rotation: 10,
                ease: "none",
                scrollTrigger: {
                    trigger: img,
                    containerAnimation: this.masterTween,
                    scrub: 1.2
                }
            });
        });
    },

    handleResize() { 
        window.addEventListener("resize", () => ScrollTrigger.refresh()); 
    }
};

// Eksekusi
window.onload = () => Engine.init();
