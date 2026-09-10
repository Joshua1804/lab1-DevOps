(() => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (navToggle && header && mobileNav) {
    const closeMenu = () => {
      header.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    };

    const openMenu = () => {
      header.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Close menu");
    };

    navToggle.addEventListener("click", () => {
      header.classList.contains("is-open") ? closeMenu() : openMenu();
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  const revealTargets = document.querySelectorAll("[data-reveal]");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (revealTargets.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = Number(el.dataset.revealDelay) || 0;
          window.setTimeout(() => el.classList.add("is-visible"), delay);
          observer.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  const lightbox = document.getElementById("lightbox");
  const mosaicItems = document.querySelectorAll(".mosaic-item");

  if (lightbox && mosaicItems.length) {
    const image = document.getElementById("lightbox-image");
    const titleEl = document.getElementById("lightbox-title");
    const regionEl = document.getElementById("lightbox-region");
    const closeBtn = document.getElementById("lightbox-close");
    const prevBtn = document.getElementById("lightbox-prev");
    const nextBtn = document.getElementById("lightbox-next");
    const focusable = [prevBtn, closeBtn, nextBtn];

    const items = Array.from(mosaicItems).map((item) => ({
      src: item.querySelector("img").src,
      alt: item.querySelector("img").alt,
      title: item.querySelector(".mosaic-title").textContent,
      region: item.querySelector(".mosaic-region").textContent,
    }));

    let currentIndex = 0;
    let lastFocused = null;

    const render = (index) => {
      const item = items[index];
      image.src = item.src;
      image.alt = item.alt;
      titleEl.textContent = item.title;
      regionEl.textContent = item.region;
    };

    const open = (index) => {
      currentIndex = index;
      lastFocused = document.activeElement;
      render(currentIndex);
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => lightbox.classList.add("is-open"));
      closeBtn.focus();
    };

    const close = () => {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      const finish = () => {
        lightbox.hidden = true;
      };
      if (prefersReducedMotion) {
        finish();
      } else {
        lightbox.addEventListener("transitionend", finish, { once: true });
      }
      if (lastFocused) lastFocused.focus();
    };

    const step = (delta) => {
      currentIndex = (currentIndex + delta + items.length) % items.length;
      render(currentIndex);
    };

    mosaicItems.forEach((item, index) => {
      item.addEventListener("click", () => open(index));
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => step(-1));
    nextBtn.addEventListener("click", () => step(1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });

    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "Tab") {
        const currentPos = focusable.indexOf(document.activeElement);
        const nextPos =
          currentPos === -1
            ? 0
            : (currentPos + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
        event.preventDefault();
        focusable[nextPos].focus();
      }
    });
  }
})();
