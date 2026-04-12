window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const winH = window.innerHeight;

    // 1. ZOOM PORTAL RIO
    const zoomProgress = Math.min(scrollY / (winH * 2), 1);
    
    // Perbarui ID agar sinkron dengan HTML (R, I, O)
    const e = document.getElementById('R');
    const m = document.getElementById('I');
    const a = document.getElementById('O');

    if (e && m && a) {
        // Efek menembus huruf (Scale 60x)
        e.style.transform = `translateX(${-zoomProgress * 110}vw) scale(${1 + zoomProgress * 60}) translateZ(${zoomProgress * 1000}px)`;
        m.style.transform = `scale(${1 + zoomProgress * 60}) translateZ(${zoomProgress * 1000}px) translateY(${zoomProgress * 60}vh)`;
        a.style.transform = `translateX(${zoomProgress * 110}vw) scale(${1 + zoomProgress * 60}) translateZ(${zoomProgress * 1000}px)`;
        
        // Pudar saat ditembus
        const opacity = 1 - (zoomProgress * 1.3);
        e.style.opacity = m.style.opacity = a.style.opacity = opacity;
    }

    // 2. HORIZONTAL GALLERY SLIDE
    const track = document.getElementById('gallery-track');
    // Mulai geser setelah scroll 1.5 layar
    const trackProgress = Math.max(0, (scrollY - (winH * 1.5)) / (winH * 7));
    
    if (track) {
        // Geser sejauh 450% lebar layar
        const moveX = trackProgress * 450; 
        track.style.transform = `translateX(${-moveX}vw)`;
    }

    // 3. BACKGROUND BLUR CONTROL
    const bg = document.getElementById('bg-stage');
    if (bg) {
        bg.style.filter = `blur(${zoomProgress * 25}px)`;
        bg.style.opacity = 0.3 - (zoomProgress * 0.2);
    }
});
