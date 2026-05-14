/* ================================================================
   PARTY CRUISERS LIMITED — MAIN JAVASCRIPT
   Version: 2.0 | Modular | Dependency-Free
================================================================ */

(function () {
  "use strict";

  /* ================================================================
     COMPONENT LOADER — Inject shared navbar & footer
  ================================================================ */
  function loadComponent(selector, url, callback) {
    const el = document.querySelector(selector);
    if (!el) return;
    fetch(url)
      .then(r => r.text())
      .then(html => {
        el.innerHTML = html;
        highlightActiveNav();
        if (callback) callback();
      })
      .catch(() => {
        // Graceful degradation: components may be inline
        highlightActiveNav();
      });
  }

  /* ================================================================
     ACTIVE NAV HIGHLIGHT
  ================================================================ */
  function highlightActiveNav() {
    const page = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-menu a, .mobile-menu a").forEach(link => {
      if (link.getAttribute("href") === page) {
        link.classList.add("active");
      }
    });
  }

  /* ================================================================
     INITIALISE ON DOM READY
  ================================================================ */
  document.addEventListener("DOMContentLoaded", function () {

    /* ---- Load shared components ---- */
    loadComponent("#navbar-placeholder", "includes/navbar.html", initNavbar);
    loadComponent("#footer-placeholder", "includes/footer.html");

    /* ---- Fallback: if navbar/footer are inline ---- */
    if (!document.getElementById("navbar-placeholder")) {
      initNavbar();
    }

    /* ---- Core init ---- */
    initCursor();
    initScrollTop();
    initStickyHeader();
    initFAQ();
    initCounters();
    initBlogFilter();
    initFormHandler();
    initTaglinePopup();
    initSwipers();
    highlightActiveNav();
  });

  /* ================================================================
     CURSOR
  ================================================================ */
  function initCursor() {
    const cursor = document.getElementById("cursor");
    const follower = document.getElementById("cursorFollower");
    if (!cursor || !follower) return;
    document.addEventListener("mousemove", function (e) {
      cursor.style.left = e.clientX - 5 + "px";
      cursor.style.top = e.clientY - 5 + "px";
      follower.style.left = e.clientX - 15 + "px";
      follower.style.top = e.clientY - 15 + "px";
    });
  }

  /* ================================================================
     NAVBAR (mobile + side menu)
  ================================================================ */
  function initNavbar() {
    /* Mobile menu */
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileOverlay = document.getElementById("mobileOverlay");
    const openBtn = document.getElementById("openMobileMenu");
    const closeBtn = document.getElementById("closeMobileMenu");

    function openMobile() {
      if (mobileMenu) mobileMenu.classList.add("open");
      if (mobileOverlay) mobileOverlay.classList.add("active");
    }
    function closeMobile() {
      if (mobileMenu) mobileMenu.classList.remove("open");
      if (mobileOverlay) mobileOverlay.classList.remove("active");
    }

    if (openBtn) openBtn.addEventListener("click", openMobile);
    if (closeBtn) closeBtn.addEventListener("click", closeMobile);
    if (mobileOverlay) mobileOverlay.addEventListener("click", closeMobile);

    /* Side menu */
    const sidemenuWrapper = document.getElementById("sidemenuWrapper");
    const sidemenuOverlay = document.getElementById("sidemenuOverlay");
    const closeSideMenu = document.getElementById("closeSideMenu");

    function closeSide() {
      if (sidemenuWrapper) sidemenuWrapper.classList.remove("open");
      if (sidemenuOverlay) sidemenuOverlay.classList.remove("active");
    }

    if (closeSideMenu) closeSideMenu.addEventListener("click", closeSide);
    if (sidemenuOverlay) sidemenuOverlay.addEventListener("click", closeSide);

    highlightActiveNav();
  }

  /* ================================================================
     STICKY HEADER SHADOW
  ================================================================ */
  function initStickyHeader() {
    const menuArea = document.querySelector(".menu-area");
    if (!menuArea) return;
    window.addEventListener("scroll", () => {
      menuArea.style.boxShadow = window.scrollY > 50
        ? "0 4px 30px rgba(0,0,0,0.12)"
        : "0 2px 20px rgba(0,0,0,0.08)";
    });
  }

  /* ================================================================
     SCROLL TO TOP
  ================================================================ */
  function initScrollTop() {
    const scrollTopBtn = document.getElementById("scrollTop");
    if (!scrollTopBtn) return;
    window.addEventListener("scroll", () => {
      const show = window.scrollY > 400;
      scrollTopBtn.classList.toggle("show", show);
      scrollTopBtn.style.display = show ? "flex" : "none";
    });
    scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ================================================================
     FAQ ACCORDION
  ================================================================ */
  function initFAQ() {
    document.querySelectorAll(".faq-question").forEach(q => {
      q.addEventListener("click", function () {
        const item = this.parentElement;
        const isActive = item.classList.contains("active");
        document.querySelectorAll(".faq-item").forEach(i => {
          i.classList.remove("active");
          const icon = i.querySelector(".faq-question .icon i");
          if (icon) icon.className = "fa-solid fa-plus";
        });
        if (!isActive) {
          item.classList.add("active");
          const icon = this.querySelector(".icon i");
          if (icon) icon.className = "fa-solid fa-minus";
        }
      });
    });
  }

  /* ================================================================
     COUNTER ANIMATION
  ================================================================ */
  function initCounters() {
    function animateCounter(el) {
      const target = parseInt(el.getAttribute("data-target"));
      const duration = 2000;
      const start = performance.now();
      function update(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + "+";
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target + "+";
      }
      requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll(".counter").forEach(el => counterObserver.observe(el));
  }

  /* ================================================================
     BLOG FILTER
  ================================================================ */
  function initBlogFilter() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const blogItems = document.querySelectorAll(".blog-item");
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener("click", function () {
        filterBtns.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        const filter = this.getAttribute("data-filter");
        blogItems.forEach(item => {
          const show = filter === "all" || item.classList.contains(filter);
          item.style.display = show ? "" : "none";
          item.classList.toggle("hidden", !show);
        });
      });
    });
  }

  /* ================================================================
     CONTACT FORM HANDLER
  ================================================================ */
  function initFormHandler() {
    /* Event type sub-select */
    const eventSelect = document.getElementById("eventSelect");
    if (eventSelect) {
      eventSelect.addEventListener("change", function () {
        const val = this.value;
        const sub = document.getElementById("subEventSelect");
        const other = document.getElementById("otherEventInput");
        if (sub) sub.style.display = "none";
        if (other) other.style.display = "none";
        if (val === "wedding" && sub) {
          sub.innerHTML = `<option value="">Select Sub Event</option>
            <option value="haldi">Haldi</option>
            <option value="mehendi">Mehendi</option>
            <option value="sangeet">Sangeet</option>
            <option value="reception">Reception</option>`;
          sub.style.display = "block";
        }
        if (val === "other" && other) other.style.display = "block";
      });
    }

    /* Form AJAX submission */
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const msg = document.getElementById("formMessage");
        const btn = this.querySelector("button[type='submit']");
        if (!btn) return;
        btn.textContent = "Submitting...";
        btn.disabled = true;
        const formData = new FormData(this);

        fetch("admin/api/contact.php", { method: "POST", body: formData })
          .then(r => r.json())
          .then(data => {
            if (msg) {
              msg.style.display = "block";
              msg.style.color = data.success ? "green" : "red";
              msg.textContent = data.success
                ? "Thank you! We'll be in touch within 24 hours."
                : (data.message || "Something went wrong. Please try again.");
            }
            if (data.success) contactForm.reset();
          })
          .catch(() => {
            if (msg) {
              msg.style.display = "block";
              msg.style.color = "red";
              msg.textContent = "Network error. Please WhatsApp us at +91 84336 59225.";
            }
          })
          .finally(() => {
            btn.textContent = "Submit Enquiry";
            btn.disabled = false;
          });
      });
    }
  }

  /* ================================================================
     TAGLINE POPUP
  ================================================================ */
  function initTaglinePopup() {
    const popup = document.getElementById("taglinePopup");
    const closePopup = document.getElementById("taglineClose");
    if (!popup) return;
    setTimeout(() => { popup.style.display = "block"; }, 9000);
    if (closePopup) closePopup.addEventListener("click", () => { popup.style.display = "none"; });
    document.querySelectorAll(".open-popup").forEach(btn => {
      btn.addEventListener("click", () => { popup.style.display = "none"; });
    });
  }

  /* ================================================================
     ALL SWIPER SLIDERS
  ================================================================ */
  function initSwipers() {
    if (typeof Swiper === "undefined") return;

    /* Hero */
    if (document.querySelector(".heroSwiper")) {
      new Swiper(".heroSwiper", {
        loop: true, speed: 1000,
        autoplay: { delay: 6000, disableOnInteraction: false },
        effect: "fade",
        fadeEffect: { crossFade: true },
        navigation: {
          nextEl: ".heroSwiper .swiper-button-next",
          prevEl: ".heroSwiper .swiper-button-prev"
        }
      });
    }

    /* Logo Slider */
    if (document.querySelector(".vvLogoSliderUnique")) {
      new Swiper(".vvLogoSliderUnique", {
        slidesPerView: 3, spaceBetween: 30,
        loop: true, speed: 800,
        autoplay: { delay: 2000, disableOnInteraction: false },
        breakpoints: {
          0: { slidesPerView: 2 },
          576: { slidesPerView: 3 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 3 }
        }
      });
    }

    /* Footprint */
    if (document.querySelector(".footprintSwiper")) {
      new Swiper(".footprintSwiper", {
        slidesPerView: 1.2, spaceBetween: 20,
        loop: true, speed: 800,
        autoplay: { delay: 4000, disableOnInteraction: false },
        navigation: { nextEl: ".footprint-next", prevEl: ".footprint-prev" },
        breakpoints: {
          576: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3 }
        }
      });
    }

    /* Video + Text (synced) */
    if (document.querySelector(".pclVideoMain2") && document.querySelector(".pclTextSlider2")) {
      initVideoTestimonials();
    }

    /* Generic inner page sliders */
    if (document.querySelector(".genericSwiper")) {
      new Swiper(".genericSwiper", {
        slidesPerView: 1, spaceBetween: 20,
        loop: true, speed: 800,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: {
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }
      });
    }
  }

  /* ================================================================
     VIDEO TESTIMONIALS (synced video + text sliders)
  ================================================================ */
  function initVideoTestimonials() {
    let isManual = false;
    const allVideos = document.querySelectorAll(".pcl-video2");

    const videoSlider = new Swiper(".pclVideoMain2", {
      spaceBetween: 20, loop: true, speed: 800, slidesPerView: 1,
      breakpoints: { 768: { slidesPerView: 2 } },
      navigation: { nextEl: ".pcl-video-next", prevEl: ".pcl-video-prev" }
    });

    const textSlider = new Swiper(".pclTextSlider2", {
      spaceBetween: 20, loop: true, speed: 800, slidesPerView: 1,
      pagination: { el: ".pcl-text-pagination", clickable: true },
      navigation: { nextEl: ".pcl-text-next", prevEl: ".pcl-text-prev" }
    });

    function stopAllVideos() {
      allVideos.forEach(v => { v.pause(); v.muted = true; v.currentTime = 0; });
    }
    function playActiveVideo() {
      const active = document.querySelector(".pclVideoMain2 .swiper-slide-active video");
      if (active) active.play().catch(() => {});
    }

    const videoNextBtn = document.querySelector(".pcl-video-next");
    const videoPrevBtn = document.querySelector(".pcl-video-prev");
    if (videoNextBtn) videoNextBtn.addEventListener("click", () => { isManual = true; });
    if (videoPrevBtn) videoPrevBtn.addEventListener("click", () => { isManual = true; });

    videoSlider.on("slideChangeTransitionStart", function () {
      stopAllVideos();
      setTimeout(playActiveVideo, 200);
      if (!isManual) textSlider.slideToLoop(videoSlider.realIndex);
      isManual = false;
    });

    /* Sound toggles */
    document.querySelectorAll(".pcl-sound-toggle2").forEach((btn, i) => {
      btn.addEventListener("click", function () {
        allVideos.forEach((v, idx) => { if (idx !== i) v.muted = true; });
        const video = allVideos[i];
        video.muted = !video.muted;
        btn.textContent = video.muted ? "🔊" : "🔇";
        video.play().catch(() => {});
      });
    });

    /* IntersectionObserver for video autoplay */
    const videoSection = document.querySelector(".pcl-premium-video-2");
    if (videoSection) {
      new IntersectionObserver(entries => {
        entries.forEach(e => {
          e.isIntersecting ? playActiveVideo() : stopAllVideos();
        });
      }, { threshold: 0.4 }).observe(videoSection);
    }
  }

})(); // end IIFE
