document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const themeIcon = document.querySelector('[data-theme-icon]');
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');

  const savedTheme = () => {
    try { return localStorage.getItem('portfolio-theme'); }
    catch { return null; }
  };

  function setTheme(mode, save = false) {
    const dark = mode === 'dark';
    root.classList.toggle('dark', dark);
    themeButton?.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
    if (themeIcon) themeIcon.innerHTML = dark ? '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="fill-current"><path d="M565-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-226.5 56.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="fill-current"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>';
    if (save) {
      try { localStorage.setItem('portfolio-theme', mode); }
      catch { }
    }
  }

  setTheme(savedTheme() || (systemTheme.matches ? 'dark' : 'light'));
  themeButton?.addEventListener('click', () => setTheme(root.classList.contains('dark') ? 'light' : 'dark', true));
  systemTheme.addEventListener('change', event => {
    if (!savedTheme()) setTheme(event.matches ? 'dark' : 'light');
  });

  
// 3D Carousel
class Carousel {
  constructor() {
    this.container = document.querySelector("[data-carousel]");
    this.carousel = document.querySelector("#carousel-project");
    this.cards = [...document.querySelectorAll(".slide-project")];
    this.prevBtn = document.querySelector("#carousel-previous");
    this.nextBtn = document.querySelector("#carousel-next");
    this.dotsContainer = document.querySelector("[data-carousel-dots]");

    if (!this.container || !this.carousel || !this.cards.length) return;

    this.cardCount = this.cards.length;
    this.currentIndex = 0;
    this.startX = null;
    this.lastSwipe = 0;
    this.isScrolling = false;

    this.createDots();
    this.setupEventListeners();
    this.update();
  }

  createDots() {
    if (!this.dotsContainer) return;

    this.dotsContainer.replaceChildren();

    this.cards.forEach((card, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to ${card.querySelector("strong").textContent}`);
      dot.addEventListener("click", () => this.goToCard(index));
      this.dotsContainer.appendChild(dot);
    });
  }

  setupEventListeners() {
    this.prevBtn?.addEventListener("click", () => this.prev());
    this.nextBtn?.addEventListener("click", () => this.next());

    this.container.addEventListener("wheel", e => this.handleScroll(e), { passive: false });

    this.carousel.addEventListener("pointerdown", e => this.handleDragStart(e));
    this.carousel.addEventListener("pointerup", e => this.handleDragEnd(e));
    this.carousel.addEventListener("pointercancel", () => this.startX = null);

    this.container.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        this.next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.prev();
      }
    });

    this.carousel.addEventListener("click", e => {
      if (Date.now() - this.lastSwipe < 350) e.preventDefault();
    }, true);

    window.addEventListener("resize", () => this.update());
  }

  handleDragStart(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    this.startX = e.clientX;
  }

  handleDragEnd(e) {
    if (this.startX === null) return;

    const distance = this.startX - e.clientX;
    this.startX = null;

    if (Math.abs(distance) < 50) return;

    this.lastSwipe = Date.now();
    distance > 0 ? this.next() : this.prev();
  }

  handleScroll(e) {
    // Horizontal scrolling only, so normal page scrolling still works.
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;

    e.preventDefault();
    if (this.isScrolling) return;

    this.isScrolling = true;
    e.deltaX > 0 ? this.next() : this.prev();

    setTimeout(() => this.isScrolling = false, 300);
  }

  update() {
    const desktop = window.innerWidth >= 1024;
    const spacing = Math.min(this.carousel.clientWidth * 0.30, 360);
    const middle = Math.floor(this.cardCount / 2);

    this.cards.forEach((card, index) => {
      let offset = index - this.currentIndex;

      if (offset > middle) offset -= this.cardCount;
      if (offset < -middle) offset += this.cardCount;

      const center = offset === 0;
      const visible = center || (desktop && Math.abs(offset) === 1);

      const x = offset * spacing;
      const scale = center ? 1 : 0.72;
      const rotation = center ? 0 : offset * 1;

      card.style.transform = `
        translate(-50%, -50%)
        translateX(${x}px)
        translateZ(${center ? 0 : -80}px)
        rotateY(${rotation}deg)
        scale(${scale})
      `;

      card.style.zIndex = center ? "30" : "20";

      card.classList.toggle("invisible", !visible);
      card.classList.toggle("opacity-0", !visible);
      card.classList.toggle("pointer-events-none", !visible);

      card.setAttribute("aria-hidden", String(!visible));
      card.querySelector("a").tabIndex = visible ? 0 : -1;
    });

    this.updateDots();
  }

  updateDots() {
    if (!this.dotsContainer) return;

    this.dotsContainer.querySelectorAll("button").forEach((dot, index) => {
      const active = index === this.currentIndex;

      dot.className = active
        ? "h-2 w-5 rounded-full bg-[#0088FF] transition-all"
        : "h-2 w-2 rounded-full bg-[#99CFFF] transition-all";

      dot.setAttribute("aria-pressed", String(active));
    });
  }

  prev() {
    this.goToCard((this.currentIndex - 1 + this.cardCount) % this.cardCount);
  }

  next() {
    this.goToCard((this.currentIndex + 1) % this.cardCount);
  }

  goToCard(index) {
    this.currentIndex = index;
    this.update();
  }
}

new Carousel();
});
