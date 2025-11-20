class Carousel {
    constructor(container) {
        this.container = container;
        this.items = container.querySelectorAll('.carousel-item');
        this.totalItems = this.items.length;
        this.currentIndex = 0;
        this.interval = null;
        this.isPlaying = true;
        this.slideDuration = 5000; // 5 seconds per slide
        
        this.init();
    }

    init() {
        // Show first item
        this.items[0].classList.add('active');
        
        // Create navigation dots
        this.createNavigation();
        
        // Start automatic sliding
        this.startAutoSlide();
        
        // Add touch support for mobile
        this.addTouchSupport();
    }

    createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'carousel-nav';
        
        for (let i = 0; i < this.totalItems; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            nav.appendChild(dot);
        }
        
        this.container.appendChild(nav);
    }

    goToSlide(index) {
        // Remove active class from current items
        this.items[this.currentIndex].classList.remove('active');
        this.container.querySelectorAll('.carousel-dot')[this.currentIndex].classList.remove('active');
        
        // Update index
        this.currentIndex = index;
        
        // Add active class to new items
        this.items[this.currentIndex].classList.add('active');
        this.container.querySelectorAll('.carousel-dot')[this.currentIndex].classList.add('active');
        
        // Reset timer
        this.resetAutoSlide();
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.totalItems;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
        this.goToSlide(prevIndex);
    }

    startAutoSlide() {
        this.interval = setInterval(() => this.nextSlide(), 5000);
    }

    resetAutoSlide() {
        clearInterval(this.interval);
        this.startAutoSlide();
    }

    addTouchSupport() {
        let touchstartX = 0;
        let touchendX = 0;
        
        this.container.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
        });
        
        this.container.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        this.handleSwipe = () => {
            if (touchendX < touchstartX) this.nextSlide();
            if (touchendX > touchstartX) this.prevSlide();
        };
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector('.carousel');
    if (carouselContainer) {
        new Carousel(carouselContainer);
    }
});