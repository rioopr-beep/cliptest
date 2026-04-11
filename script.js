// 1. Fungsi Toggle Menu
function toggleMenu() {
    const options = document.getElementById('menuOptions');
    const trigger = document.querySelector('.menu-trigger');
    options.classList.toggle('active');
    trigger.classList.toggle('active');
}

// 2. Fungsi Menghilangkan Loader (Solusi Stuck)
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    
    // Memberi sedikit jeda agar transisinya halus
    setTimeout(() => {
        loader.classList.add('finished');
    }, 1000); 
});

// 3. Menutup menu jika klik di luar
document.addEventListener('click', function(event) {
    const nav = document.querySelector('.bottom-nav');
    const options = document.getElementById('menuOptions');
    const trigger = document.querySelector('.menu-trigger');
    if (nav && !nav.contains(event.target)) {
        options.classList.remove('active');
        trigger.classList.remove('active');
    }
});
