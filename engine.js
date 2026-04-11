document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector('.gallery-container');
    const photoList = [
        '1.1775917841-picsay.webp',
        '2.1775917841-pics.webp'
    ];

    photoList.forEach(fileName => {
        const img = document.createElement('img');
        img.src = `assets/${fileName}`;
        img.classList.add('rp-img');
        
        img.onload = () => {
            img.classList.add('loaded');
        };

        if (gallery) {
            gallery.appendChild(img);
        }
    });
});
