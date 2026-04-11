/**
 * Fungsi untuk membuka/menutup Menu Navigasi
 */
function toggleMenu() {
    const options = document.getElementById('menuOptions');
    const trigger = document.querySelector('.menu-trigger');
    
    // Toggle class 'active' untuk memicu animasi CSS
    options.classList.toggle('active');
    trigger.classList.toggle('active');
}

/**
 * Mencegah Klik Menu tertutup secara tidak sengaja
 */
document.addEventListener('click', function(event) {
    const nav = document.querySelector('.bottom-nav');
    const options = document.getElementById('menuOptions');
    const trigger = document.querySelector('.menu-trigger');
    
    // Jika klik dilakukan di luar area menu, tutup menu
    if (!nav.contains(event.target)) {
        options.classList.remove('active');
        trigger.classList.remove('active');
    }
});

/**
 * GSAP Animasi untuk teks saat slide muncul (Optional)
 */
window.onload = () => {
    gsap.from(".top-left-brand", { 
        duration: 1.5, 
        y: -50, 
        opacity: 0, 
        ease: "power4.out" 
    });
};
