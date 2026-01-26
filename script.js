/* ==========================================
   TANAMI Pitch Deck - Interactive Script
   Fixed navigation + Enhanced animations
   ========================================== */

class PitchDeck {
  constructor() {
    this.currentSlide = 1;
    this.totalSlides = 14
    this.init();
  }

  init() {
    this.cacheDom();
    this.bindEvents();
    this.updateUI();
    // Reset all slides first, then animate current
    this.resetAllSlides();
    this.showSlideContent(this.slides[0]);
  }

  cacheDom() {
    this.slides = document.querySelectorAll(".slide");
    this.progressBar = document.getElementById("progressBar");
    this.currentSlideEl = document.getElementById("currentSlide");
    this.totalSlidesEl = document.getElementById("totalSlides");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.slidesContainer = document.getElementById("slidesContainer");
    this.headerLogo = document.querySelector(".header-logo");
  }

  bindEvents() {
    this.prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.prev();
    });
    this.nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.next();
    });

    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
    this.setupTouchEvents();

    // Double-click for fullscreen only, no click to navigate
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

    if (e.key >= "1" && e.key <= "9") {
      const slideNum = parseInt(e.key);
      if (slideNum <= this.totalSlides) {
        this.goTo(slideNum);
      }
    }
  }

  setupTouchEvents() {
    let touchStartX = 0;

    this.slidesContainer.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    this.slidesContainer.addEventListener(
      "touchend",
      (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
          diff > 0 ? this.next() : this.prev();
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
    const goingForward = slideNum > this.currentSlide;

    // Hide previous slide content first
    this.hideSlideContent(prevSlide);

    // Remove active from previous
    prevSlide.classList.remove("active");
    prevSlide.classList.add(goingForward ? "exit-left" : "exit-right");

    // Prepare next slide
    nextSlide.classList.add(goingForward ? "enter-right" : "enter-left");

    // Small delay then show next
    requestAnimationFrame(() => {
      nextSlide.classList.remove("enter-right", "enter-left");
      nextSlide.classList.add("active");

      // Show content of new slide
      this.showSlideContent(nextSlide);
    });

    this.currentSlide = slideNum;
    this.updateUI();

    // Cleanup
    setTimeout(() => {
      prevSlide.classList.remove("exit-left", "exit-right");
      this.isAnimating = false;
    }, 600);
  }

  resetAllSlides() {
    this.slides.forEach((slide) => {
      const animatables = slide.querySelectorAll(".anim");
      animatables.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(40px)";
      });
    });
  }

  hideSlideContent(slide) {
    const animatables = slide.querySelectorAll(".anim");
    animatables.forEach((el) => {
      el.style.transition = "all 0.3s ease";
      el.style.opacity = "0";
      el.style.transform = "translateY(-20px)";
    });
  }

  showSlideContent(slide) {
    const animatables = slide.querySelectorAll(".anim");
    animatables.forEach((el, index) => {
      // Reset first
      el.style.opacity = "0";
      el.style.transform = "translateY(40px)";

      // Then animate in with stagger
      setTimeout(
        () => {
          el.style.transition = "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        },
        100 + index * 80,
      );
    });
  }

  updateUI() {
    const progress = (this.currentSlide / this.totalSlides) * 100;
    this.progressBar.style.width = `${progress}%`;

    this.currentSlideEl.textContent = this.currentSlide;
    this.totalSlidesEl.textContent = this.totalSlides;

    this.prevBtn.disabled = this.currentSlide === 1;
    this.nextBtn.disabled = this.currentSlide === this.totalSlides;

    // Handle Header Logo visibility (hide on slide 1 and last slide)
    if (this.currentSlide === 1 || this.currentSlide === this.totalSlides) {
      if (this.headerLogo) this.headerLogo.classList.remove("visible");
    } else {
      if (this.headerLogo) this.headerLogo.classList.add("visible");
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  new PitchDeck();

  // Cursor trail effect
  const cursor = document.createElement("div");
  cursor.className = "cursor-glow";
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });
});

// Disable right-click
document.addEventListener("contextmenu", (e) => e.preventDefault());
