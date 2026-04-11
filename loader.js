// loader.js
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    // Menahan loader selama 1.5 detik agar kesan "sistem booting" terasa
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);
});
