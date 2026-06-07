// ============================================================
// home.js — Homepage JS for Hotel de l'Aurelia
// ============================================================

// #region STATES
let currentSlide  = 0;
const TOTAL_SLIDES = 5;
const AUTO_DELAY   = 7000; // ms between auto-advances
let autoTimer      = null;
let guestCount     = 2;
let showMenu       = false;
// #endregion


// #region GET ELEMENTS
const siteHeader      = document.getElementById("site-header");

const menuBtn         = document.querySelector(".header-btn");
const hamburger       = document.querySelector(".hamburger");
const nav             = document.querySelector(".header-nav");
const navMenu         = document.querySelector(".header-links");
const navLinks        = document.querySelectorAll(".header-links li");
const logoLink        = document.querySelector(".header-logo-link");

const slidesTrack     = document.getElementById("slides-track");
const slides          = document.querySelectorAll(".slide");
const dots            = document.querySelectorAll(".dot");
const sliderPrev      = document.getElementById("slider-prev");
const sliderNext      = document.getElementById("slider-next");
const slideCurrentEl  = document.getElementById("slide-current");

const checkinInput    = document.getElementById("checkin-input");
const checkoutInput   = document.getElementById("checkout-input");
const checkinDisplay  = document.getElementById("checkin-display");
const checkoutDisplay = document.getElementById("checkout-display");
const checkinField = document.getElementById("checkin-field");
const checkoutField = document.getElementById("checkout-field");
const guestsDisplay   = document.getElementById("guests-display");
const guestsMinus     = document.getElementById("guests-minus");
const guestsPlus      = document.getElementById("guests-plus");
const checkAvailBtn   = document.getElementById("check-availability");

const scrollToTopEl   = document.getElementById("scroll-to-top");
const scrollToTopBtn  = document.querySelector(".scroll-to-top .btn");

const scrollCTAs      = document.querySelectorAll(".scroll-cta");
// #endregion


// #region HERO SLIDER

function goToSlide(index) {
    // Remove active from current
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");

    // Update index with wraparound
    currentSlide = (index + TOTAL_SLIDES) % TOTAL_SLIDES;

    // Move the track
    slidesTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Activate new slide + dot
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");

    // Update counter
    slideCurrentEl.textContent = currentSlide + 1;
}

function startAutoPlay() {
    stopAutoPlay();
    autoTimer = setInterval(function () {
        goToSlide(currentSlide + 1);
    }, AUTO_DELAY);
}

function stopAutoPlay() {
    if (autoTimer) clearInterval(autoTimer);
}

// Arrow buttons
sliderPrev.addEventListener("click", function () {
    goToSlide(currentSlide - 1);
    stopAutoPlay();
    startAutoPlay(); // reset timer after manual nav
});

sliderNext.addEventListener("click", function () {
    goToSlide(currentSlide + 1);
    stopAutoPlay();
    startAutoPlay();
});

// Dot buttons
dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
        goToSlide(parseInt(dot.dataset.index));
        stopAutoPlay();
        startAutoPlay();
    });
});

// Swipe support for touch devices
(function () {
    let touchStartX = 0;
    let touchEndX   = 0;

    document.querySelector(".hero-slider").addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.querySelector(".hero-slider").addEventListener("touchend", function (e) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) { // minimum swipe distance
            if (diff > 0) {
                goToSlide(currentSlide + 1); // swipe left → next
            } else {
                goToSlide(currentSlide - 1); // swipe right → prev
            }
            stopAutoPlay();
            startAutoPlay();
        }
    }, { passive: true });
})();

// Pause auto-play when tab is not visible, resume when it is
document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
});

// Kick off auto-play
startAutoPlay();
// #endregion


// #region STICKY HEADER

window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
        siteHeader.classList.add("scrolled");
        siteHeader.classList.remove("transparent");
    } else {
        siteHeader.classList.remove("scrolled");
        siteHeader.classList.add("transparent");
    }

    // Scroll to top button
    if (window.scrollY > 600) {
        scrollToTopEl.classList.add("show");
    } else {
        scrollToTopEl.classList.remove("show");
    }
}, { passive: true });

// Set initial state
siteHeader.classList.add("transparent");
// #endregion


// #region HAMBURGER MENU

menuBtn.addEventListener("click", function () {
    hamburger.classList.toggle("open");
    nav.classList.toggle("open");
    navMenu.classList.toggle("open");
    logoLink.classList.toggle("open");

    navLinks.forEach(function (item) {
        item.classList.toggle("open");
    });

    showMenu = !showMenu;

    // Prevent body scroll while menu is open
    document.body.style.overflow = showMenu ? "hidden" : "";
});
// #endregion


// #region BOOKING BAR

// Format a Date object to a readable string e.g. "Sat, Jul 12"
function formatDate(dateStr) {
    if (!dateStr) return "Select date";
    const date = new Date(dateStr + "T00:00:00"); // force local timezone
    return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// Set today as minimum for check-in
const today = new Date();
const todayStr = today.toISOString().split("T")[0];
checkinInput.min  = todayStr;
checkoutInput.min = todayStr;

checkinInput.addEventListener("change", function () {
    checkinDisplay.textContent = formatDate(this.value);

    // Check-out must be after check-in
    if (this.value) {
        checkoutInput.min = this.value;

        // If current checkout is before new checkin, clear it
        if (checkoutInput.value && checkoutInput.value <= this.value) {
            checkoutInput.value   = "";
            checkoutDisplay.textContent = "Select date";
        }
    }
});

checkoutInput.addEventListener("change", function () {
    checkoutDisplay.textContent = formatDate(this.value);
});

checkinField.addEventListener("click", () => {
    checkinInput.showPicker();

});

checkoutField.addEventListener("click", () => {
    checkoutInput.showPicker();
});

// Guest counter
guestsMinus.addEventListener("click", function () {
    if (guestCount > 1) {
        guestCount--;
        updateGuestsDisplay();
    }
});

guestsPlus.addEventListener("click", function () {
    if (guestCount < 10) {
        guestCount++;
        updateGuestsDisplay();
    }
});

function updateGuestsDisplay() {
    guestsDisplay.textContent = guestCount === 1
        ? "1 Adult"
        : guestCount + " Adults";
}

// Check Availability — builds URL params and navigates to rooms page
checkAvailBtn.addEventListener("click", function () {
    const checkin  = checkinInput.value;
    const checkout = checkoutInput.value;

    // Basic validation
    if (!checkin || !checkout) {
        // Highlight the missing field(s) briefly
        if (!checkin) {
            document.getElementById("checkin-field").style.borderBottom = "2px solid var(--GOLD)";
            setTimeout(function () {
                document.getElementById("checkin-field").style.borderBottom = "";
            }, 1500);
        }
        if (!checkout) {
            document.getElementById("checkout-field").style.borderBottom = "2px solid var(--GOLD)";
            setTimeout(function () {
                document.getElementById("checkout-field").style.borderBottom = "";
            }, 1500);
        }
        return;
    }

    // Build query string and navigate to rooms page
    const params = new URLSearchParams({
        checkin:  checkin,
        checkout: checkout,
        guests:   guestCount,
    });

    window.location.href = `/html/rooms.html?${params.toString()}`;
});
// #endregion


// #region SMOOTH SCROLL CTAs
// All buttons with data-target="#section-id" smooth-scroll to that section

scrollCTAs.forEach(function (btn) {
    btn.addEventListener("click", function () {
        const target = document.querySelector(btn.dataset.target);
        if (!target) return;

        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});
// #endregion


// #region SCROLL TO TOP
scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
// #endregion


// #region ACTIVE NAV LINK
// Highlight the nav link whose href matches the current page
(function () {
    const currentPath = window.location.pathname;
    const allNavLinks = document.querySelectorAll(".header-links a");
 
    allNavLinks.forEach(function (link) {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        if (linkPath === currentPath) {
            link.classList.add("nav-active");
        }
    });
})();
// #endregion


// #region SCROLL REVEAL
const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration: 1000,
};

// Amenities
ScrollReveal().reveal(".amenities-section .section-header", {
    ...scrollRevealOption,
});
ScrollReveal().reveal(".amenity-card", {
    ...scrollRevealOption,
    interval: 100,
    delay: 200,
});

// Dining
ScrollReveal().reveal(".dining-img", {
    ...scrollRevealOption,
    origin: "left",
});
ScrollReveal().reveal(".dining-content .subheader", {
    ...scrollRevealOption,
    delay: 300,
});
ScrollReveal().reveal(".dining-content .header", {
    ...scrollRevealOption,
    delay: 450,
});
ScrollReveal().reveal(".dining-content .description", {
    ...scrollRevealOption,
    delay: 600,
});
ScrollReveal().reveal(".dining-hours", {
    ...scrollRevealOption,
    delay: 750,
});
ScrollReveal().reveal(".dining-btn", {
    ...scrollRevealOption,
    delay: 900,
});

// Events
ScrollReveal().reveal(".events-section .section-header", {
    ...scrollRevealOption,
});
ScrollReveal().reveal(".event-card", {
    ...scrollRevealOption,
    interval: 200,
    delay: 200,
});

// Reviews
ScrollReveal().reveal(".reviews-section .section-header", {
    ...scrollRevealOption,
});
ScrollReveal().reveal(".review-card", {
    ...scrollRevealOption,
    interval: 200,
    delay: 200,
});

// CTA banner
ScrollReveal().reveal(".cta-content", {
    ...scrollRevealOption,
});

// Footer
ScrollReveal().reveal(".footer-top", { ...scrollRevealOption });
ScrollReveal().reveal(".contacts",   { ...scrollRevealOption, interval: 500 });
ScrollReveal().reveal(".footer-socials",  { ...scrollRevealOption, delay: 500 });
ScrollReveal().reveal(".footer-copyright",{ ...scrollRevealOption, delay: 500 });
// #endregion