document.addEventListener('DOMContentLoaded', () => {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    
    if (!loaderWrapper) return;

    let progress = 0;
    const duration = 1500; 
    const intervalTime = 25;
    const step = (100 / (duration / intervalTime));

    const loadingInterval = setInterval(() => {
        progress += step;
        
        const jitter = Math.random() * 3;
        let currentProgress = Math.min(progress + jitter, 100);
        
        if (progressText) {
            progressText.textContent = Math.floor(currentProgress).toString().padStart(2, '0');
        }
        
        if (progressBar) {
            progressBar.style.width = `${currentProgress}%`;
        }

        if (currentProgress >= 100) {
            clearInterval(loadingInterval);
            completeLoading();
        }
    }, intervalTime);

    function completeLoading() {
        setTimeout(() => {
            loaderWrapper.classList.add('is-hidden');
            
            setTimeout(() => {
                document.body.classList.add('system-ready');
                triggerInitialAnimations();
            }, 800);
            
        }, 500);
    }

    function triggerInitialAnimations() {
        const splitTexts = document.querySelectorAll('.split-text');
        splitTexts.forEach(el => {
            if(el.closest('.hero-container')) {
                el.classList.add('is-visible');
            }
        });

        const revealMasks = document.querySelectorAll('.reveal-mask');
        revealMasks.forEach(el => {
            if(el.closest('.hero-container')) {
                el.classList.add('is-revealed');
            }
        });

        const fadeElements = document.querySelectorAll('.fade-up-element');
        fadeElements.forEach((el, index) => {
            if(el.closest('.hero-container')) {
                setTimeout(() => {
                    el.classList.add('is-visible');
                }, index * 150);
            }
        });
    }
});
