/* ==========================================
   TANAMI H.A.P.I Pitch Deck
   Interactive Slide Navigation
   ========================================== */

class HAPIPitchDeck {
  constructor() {
    this.currentSlide = 1;
    this.slides = document.querySelectorAll(".slide");
    this.totalSlides = this.slides.length;
    this.isAnimating = false;

    // Phase colors
    this.phaseColors = {
      H: "#f59e0b",
      A: "#3b82f6",
      P: "#22c55e",
      I: "#a855f7",
    };

    this.init();
  }

  init() {
    this.cacheDom();
    this.bindEvents();
    this.updateUI();
  }

  cacheDom() {
    this.progressCircle = document.getElementById("progressCircle");
    this.progressText = document.getElementById("progressText");
    this.phaseIndicator = document.getElementById("phaseIndicator");
    this.phaseLetter = this.phaseIndicator.querySelector(".phase-letter");
    this.phaseName = this.phaseIndicator.querySelector(".phase-name");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.slidesContainer = document.getElementById("slides");
  }

  bindEvents() {
    // Button navigation
    this.prevBtn.addEventListener("click", () => this.prev());
    this.nextBtn.addEventListener("click", () => this.next());

    // Keyboard navigation
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));

    // Touch/swipe navigation
    this.setupTouchEvents();

    // Double-click for fullscreen
    document.addEventListener("dblclick", () => this.toggleFullscreen());
  }

  handleKeyboard(e) {
    switch (e.key) {
      case "ArrowRight":
      case " ":
      case "Enter":
        e.preventDefault();
        this.next();
        break;
      case "ArrowLeft":
      case "Backspace":
        e.preventDefault();
        this.prev();
        break;
      case "Home":
        e.preventDefault();
        this.goTo(1);
        break;
      case "End":
        e.preventDefault();
        this.goTo(this.totalSlides);
        break;
      case "f":
      case "F":
        this.toggleFullscreen();
        break;
      case "Escape":
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        break;
    }

    // Number keys for quick navigation
    if (e.key >= "1" && e.key <= "9") {
      const num = parseInt(e.key);
      if (num <= this.totalSlides) {
        this.goTo(num);
      }
    }
  }

  setupTouchEvents() {
    let touchStartX = 0;
    let touchStartY = 0;

    this.slidesContainer.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      },
      { passive: true },
    );

    this.slidesContainer.addEventListener(
      "touchend",
      (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        // Only trigger if horizontal swipe is greater than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          diffX > 0 ? this.next() : this.prev();
        }
      },
      { passive: true },
    );
  }

  next() {
    if (this.isAnimating) return;
    if (this.currentSlide < this.totalSlides) {
      this.goTo(this.currentSlide + 1);
    }
  }

  prev() {
    if (this.isAnimating) return;
    if (this.currentSlide > 1) {
      this.goTo(this.currentSlide - 1);
    }
  }

  goTo(slideNum) {
    if (this.isAnimating || slideNum === this.currentSlide) return;
    if (slideNum < 1 || slideNum > this.totalSlides) return;

    this.isAnimating = true;

    const prevSlide = this.slides[this.currentSlide - 1];
    const nextSlide = this.slides[slideNum - 1];

    // Hide previous slide
    prevSlide.classList.remove("active");

    // Show next slide
    requestAnimationFrame(() => {
      nextSlide.classList.add("active");
    });

    this.currentSlide = slideNum;
    this.updateUI();

    // Reset animation lock
    setTimeout(() => {
      this.isAnimating = false;
    }, 500);
  }

  updateUI() {
    // Update progress ring
    const circumference = 2 * Math.PI * 45;
    const progress = this.currentSlide / this.totalSlides;
    const offset = circumference - progress * circumference;
    this.progressCircle.style.strokeDashoffset = offset;

    // Update progress text
    this.progressText.textContent = `${this.currentSlide}/${this.totalSlides}`;

    // Update phase indicator
    const currentSlideEl = this.slides[this.currentSlide - 1];
    const phase = currentSlideEl.dataset.phase;
    const phaseName = currentSlideEl.dataset.phaseName;

    this.phaseLetter.textContent = phase;
    this.phaseLetter.style.background = this.phaseColors[phase];
    this.phaseName.textContent = phaseName;

    // Update navigation buttons
    this.prevBtn.disabled = this.currentSlide === 1;
    this.nextBtn.disabled = this.currentSlide === this.totalSlides;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  new HAPIPitchDeck();
});

// Disable right-click
document.addEventListener("contextmenu", (e) => e.preventDefault());
