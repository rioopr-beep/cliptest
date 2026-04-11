.split-text .char {
    display: inline-block;
    opacity: 0;
    transform: translateY(100%) rotateX(-90deg);
    transform-origin: bottom center;
    will-change: transform, opacity;
}

.split-text.is-visible .char {
    opacity: 1;
    transform: translateY(0) rotateX(0);
    transition: transform 0.8s var(--ease-wodniack), opacity 0.8s ease-out;
}

.hover-tilt {
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform;
}

.glitch-layer {
    position: relative;
}

.glitch-layer::before,
.glitch-layer::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
    pointer-events: none;
}

.glitch-layer::before {
    left: 2px;
    text-shadow: -1px 0 var(--color-neon);
    clip: rect(24px, 550px, 90px, 0);
    animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

.glitch-layer::after {
    left: -2px;
    text-shadow: -1px 0 #ff00ff;
    clip: rect(85px, 550px, 140px, 0);
    animation: glitch-anim 2.5s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
    0% { clip: rect(12px, 9999px, 83px, 0); }
    20% { clip: rect(65px, 9999px, 11px, 0); }
    40% { clip: rect(110px, 9999px, 131px, 0); }
    60% { clip: rect(32px, 9999px, 91px, 0); }
    80% { clip: rect(78px, 9999px, 19px, 0); }
    100% { clip: rect(14px, 9999px, 140px, 0); }
}

@keyframes glitch-anim-2 {
    0% { clip: rect(44px, 9999px, 122px, 0); }
    20% { clip: rect(15px, 9999px, 33px, 0); }
    40% { clip: rect(81px, 9999px, 11px, 0); }
    60% { clip: rect(112px, 9999px, 91px, 0); }
    80% { clip: rect(33px, 9999px, 55px, 0); }
    100% { clip: rect(98px, 9999px, 14px, 0); }
}

.reveal-mask {
    overflow: hidden;
    position: relative;
    display: inline-block;
}

.reveal-mask::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-neon);
    transform-origin: left;
    transform: scaleX(0);
    z-index: 2;
}

.reveal-mask.is-revealed::after {
    animation: mask-slide 1.2s var(--ease-wodniack) forwards;
}

.reveal-mask.is-revealed > * {
    animation: fade-in-delay 0.1s forwards 0.6s;
    opacity: 0;
}

@keyframes mask-slide {
    0% { transform: scaleX(0); transform-origin: left; }
    50% { transform: scaleX(1); transform-origin: left; }
    51% { transform: scaleX(1); transform-origin: right; }
    100% { transform: scaleX(0); transform-origin: right; }
}

@keyframes fade-in-delay {
    to { opacity: 1; }
}

.fade-up-element {
    opacity: 0;
    transform: translateY(40px) translateZ(0);
    transition: opacity 0.8s ease-out, transform 1s var(--ease-wodniack);
}

.fade-up-element.is-visible {
    opacity: 1;
    transform: translateY(0) translateZ(0);
}
