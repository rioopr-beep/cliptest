document.addEventListener('DOMContentLoaded', () => {
    console.log(
        '%c RIO PRATAMA %c ECOSYSTEM DEVELOPMENT ', 
        'background: #9d4edd; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;', 
        'background: #030305; color: #9d4edd; border: 1px solid #9d4edd; padding: 3px 8px; border-radius: 0 4px 4px 0;'
    );

    const preventDefaultBehaviors = () => {
        document.querySelectorAll('img, a').forEach(element => {
            element.addEventListener('dragstart', (e) => e.preventDefault());
        });
    };

    const handleVisibilityChange = () => {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.classList.add('system-paused');
            } else {
                document.body.classList.remove('system-paused');
            }
        });
    };

    const smoothAnchorScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement && window.spaceEngine) {
                    const targetRect = targetElement.getBoundingClientRect();
                    const absoluteTop = targetRect.top + window.spaceEngine.scroll.current;
                    
                    window.spaceEngine.scroll.target = absoluteTop;
                }
            });
        });
    };

    const initializeSystem = () => {
        preventDefaultBehaviors();
        handleVisibilityChange();
        smoothAnchorScroll();
    };

    initializeSystem();
});

window.addEventListener('beforeunload', () => {
    document.body.classList.add('system-unloading');
    if (window.spaceEngine) {
        window.spaceEngine = null;
    }
});
