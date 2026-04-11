// navigation.js
document.addEventListener("DOMContentLoaded", () => {
    fetch('config.json')
        .then(response => response.json())
        .then(data => {
            // Ambil deskripsi dan masukkan ke halaman About
            const desc = document.getElementById('about-desc');
            if(desc) desc.innerText = data.about.description;
        })
        .catch(err => console.error("RP-System Error: Data tidak ditemukan"));
});
