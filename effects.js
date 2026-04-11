// effects.js
document.addEventListener("DOMContentLoaded", () => {
    // Efek pergeseran nama saat scroll
    window.addEventListener('scroll', () => {
        const scroll = window.scrollY;
        const layers = document.querySelectorAll('.k-layer');
        layers.forEach((layer, index) => {
            layer.style.transform = `translateX(${scroll * (0.1 * (index + 1))}px)`;
        });
    });

    // Efek klik untuk mengubah warna link kontak
    const contacts = document.querySelectorAll('.kinetic-contact');
    contacts.forEach(contact => {
        contact.addEventListener('click', function() {
            contacts.forEach(c => c.classList.remove('is-active'));
            this.classList.add('is-active');
        });
    });
});
