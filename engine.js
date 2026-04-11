document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector('.gallery-container');
    
    // Daftar nama file foto Anda (sesuaikan dengan jumlah dan nama file di assets/)
    const photoList = ['1.webp', '2.webp', '3.webp'];

    photoList.forEach(fileName => {
        const img = document.createElement('img');
        img.src = `assets/${fileName}`;
        img.classList.add('rp-img');
        img.setAttribute('alt', 'Project RP Visual');
        
        // Memasukkan ke dalam galeri di index.html
        if (gallery) {
            gallery.appendChild(img);
        }
    });

    console.log("RP-System: Engine Aktif, Aset dimuat.");
});
