// ============================================================
// rooms.js — Rooms page JS for Hotel de l'Aurelia
// ============================================================

// #region STATES
let guestCount = 2;
let showMenu   = false;

// Tracks which room was clicked for the modal
let selectedRoom  = "";
let selectedPrice = 0;
// #endregion


// #region GET ELEMENTS
const siteHeader   = document.getElementById("site-header");

const menuBtn      = document.querySelector(".header-btn");
const hamburger    = document.querySelector(".hamburger");
const nav          = document.querySelector(".header-nav");
const navMenu      = document.querySelector(".header-links");
const navLinks     = document.querySelectorAll(".header-links li");
const logoLink     = document.querySelector(".header-logo-link");

const checkinInput    = document.getElementById("checkin-input");
const checkoutInput   = document.getElementById("checkout-input");
const checkinDisplay  = document.getElementById("checkin-display");
const checkoutDisplay = document.getElementById("checkout-display");
const checkinField    = document.getElementById("checkin-field");
const checkoutField   = document.getElementById("checkout-field");
const guestsDisplay   = document.getElementById("guests-display");
const guestsMinus     = document.getElementById("guests-minus");
const guestsPlus      = document.getElementById("guests-plus");
const checkAvailBtn   = document.getElementById("check-availability");

const scrollToTopEl  = document.getElementById("scroll-to-top");
const scrollToTopBtn = document.querySelector(".scroll-to-top .btn");
const scrollCTAs     = document.querySelectorAll(".scroll-cta");

// Modal elements
const bookingModal   = document.getElementById("booking-modal");
const modalBackdrop  = document.getElementById("modal-backdrop");
const modalClose     = document.getElementById("modal-close");
const modalRoomName  = document.getElementById("modal-room-name");
const modalCheckin   = document.getElementById("modal-checkin");
const modalCheckout  = document.getElementById("modal-checkout");
const modalGuests    = document.getElementById("modal-guests");
const modalTotal     = document.getElementById("modal-total");
const modalName      = document.getElementById("modal-name");
const modalPhone     = document.getElementById("modal-phone");
const modalEmail     = document.getElementById("modal-email");
const modalSubmit    = document.getElementById("modal-submit");
const modalSuccess   = document.getElementById("modal-success");

// All "Book This Room" buttons
const bookBtns = document.querySelectorAll(".btn-book");
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

    if (window.scrollY > 600) {
        scrollToTopEl.classList.add("show");
    } else {
        scrollToTopEl.classList.remove("show");
    }
}, { passive: true });

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
    document.body.style.overflow = showMenu ? "hidden" : "";
});
// #endregion


// #region BOOKING BAR

function formatDate(dateStr) {
    if (!dateStr) return null;
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatDateShort(dateStr) {
    if (!dateStr) return "—";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// Set today as minimum check-in
const today    = new Date();
const todayStr = today.toISOString().split("T")[0];
checkinInput.min  = todayStr;
checkoutInput.min = todayStr;

// Pre-fill from URL params if coming from homepage booking bar
(function prefillFromURL() {
    const params   = new URLSearchParams(window.location.search);
    const checkin  = params.get("checkin");
    const checkout = params.get("checkout");
    const guests   = parseInt(params.get("guests"));

    if (checkin) {
        checkinInput.value          = checkin;
        checkinDisplay.textContent  = formatDate(checkin);
    }
    if (checkout) {
        checkoutInput.value         = checkout;
        checkoutDisplay.textContent = formatDate(checkout);
    }
    if (guests && guests >= 1 && guests <= 10) {
        guestCount              = guests;
        guestsDisplay.textContent = guests === 1 ? "1 Adult" : guests + " Adults";
    }
})();

checkinInput.addEventListener("change", function () {
    checkinDisplay.textContent = formatDate(this.value);

    if (this.value) {
        checkoutInput.min = this.value;
        if (checkoutInput.value && checkoutInput.value <= this.value) {
            checkoutInput.value         = "";
            checkoutDisplay.textContent = "Select date";
        }
    }
});

checkoutInput.addEventListener("change", function () {
    checkoutDisplay.textContent = formatDate(this.value);
});

checkinField.addEventListener("click",  () => checkinInput.showPicker());
checkoutField.addEventListener("click", () => checkoutInput.showPicker());

guestsMinus.addEventListener("click", function () {
    if (guestCount > 1) { guestCount--; updateGuestsDisplay(); }
});

guestsPlus.addEventListener("click", function () {
    if (guestCount < 10) { guestCount++; updateGuestsDisplay(); }
});

function updateGuestsDisplay() {
    guestsDisplay.textContent = guestCount === 1 ? "1 Adult" : guestCount + " Adults";
}

// "Check Availability" just smooth-scrolls to the rooms list on this page
checkAvailBtn.addEventListener("click", function () {
    const checkin  = checkinInput.value;
    const checkout = checkoutInput.value;

    if (!checkin) {
        flashField(checkinField);
    }
    if (!checkout) {
        flashField(checkoutField);
    }
    if (!checkin || !checkout) return;

    document.getElementById("rooms").scrollIntoView({ behavior: "smooth", block: "start" });
});

function flashField(field) {
    field.style.borderBottom = "2px solid var(--GOLD)";
    setTimeout(() => { field.style.borderBottom = ""; }, 1500);
}
// #endregion


// #region BOOKING MODAL

// Calculate nights between two date strings
function calcNights(checkin, checkout) {
    if (!checkin || !checkout) return 0;
    const msPerDay = 1000 * 60 * 60 * 24;
    const diff = new Date(checkout) - new Date(checkin);
    return Math.max(0, Math.round(diff / msPerDay));
}

// Format naira with commas e.g. 250000 → ₦250,000
function formatNaira(amount) {
    return "₦" + amount.toLocaleString("en-NG");
}

function openModal(roomName, pricePerNight) {
    selectedRoom  = roomName;
    selectedPrice = pricePerNight;

    const checkin  = checkinInput.value;
    const checkout = checkoutInput.value;
    const nights   = calcNights(checkin, checkout);

    // Populate room name
    modalRoomName.textContent = roomName;

    // Populate booking summary
    modalCheckin.textContent  = checkin  ? formatDateShort(checkin)  : "Not selected";
    modalCheckout.textContent = checkout ? formatDateShort(checkout) : "Not selected";
    modalGuests.textContent   = guestCount === 1 ? "1 Adult" : guestCount + " Adults";

    // Total calculation
    if (nights > 0) {
        const total = pricePerNight * nights;
        modalTotal.textContent = formatNaira(total) + " (" + nights + " night" + (nights > 1 ? "s" : "") + ")";
    } else {
        modalTotal.textContent = formatNaira(pricePerNight) + " / night";
    }

    // Reset form state in case modal was opened before
    resetModal();

    // Open
    bookingModal.classList.add("open");
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    bookingModal.classList.remove("open");
    bookingModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function resetModal() {
    // Show form, hide success
    modalSubmit.style.display  = "";
    modalSuccess.style.display = "none";

    // Clear inputs
    modalName.value  = "";
    modalPhone.value = "";
    modalEmail.value = "";

    // Clear any error highlights
    [modalName, modalPhone, modalEmail].forEach(function (input) {
        input.style.borderColor = "";
    });
}

// Wire up "Book This Room" buttons
bookBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
        const roomName = btn.dataset.room;
        const price    = parseInt(btn.dataset.price);
        openModal(roomName, price);
    });
});

// Close on backdrop click or close button
modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

// Close on Escape key
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && bookingModal.classList.contains("open")) {
        closeModal();
    }
});

// Form submission
modalSubmit.addEventListener("click", function () {
    const name  = modalName.value.trim();
    const phone = modalPhone.value.trim();
    const email = modalEmail.value.trim();

    // Basic validation — highlight empty fields
    let valid = true;

    if (!name) {
        highlightError(modalName);
        valid = false;
    }
    if (!phone) {
        highlightError(modalPhone);
        valid = false;
    }
    if (!email || !email.includes("@")) {
        highlightError(modalEmail);
        valid = false;
    }

    if (!valid) return;

    // Simulate a brief "sending" state
    modalSubmit.textContent = "Sending...";
    modalSubmit.disabled    = true;

    setTimeout(function () {
        // Show success state
        modalSubmit.style.display  = "none";
        modalSuccess.style.display = "flex";

        // Auto-close after 3.5 seconds
        setTimeout(closeModal, 3500);
    }, 1200);
});

function highlightError(input) {
    input.style.borderColor = "rgba(220, 80, 80, 0.7)";
    input.addEventListener("input", function clearError() {
        input.style.borderColor = "";
        input.removeEventListener("input", clearError);
    });
}
// #endregion


// #region SMOOTH SCROLL CTAs
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

// #region UNAVAILABLE MODAL
(function () {
    const modal    = document.getElementById("unavailable-modal");
    const backdrop = document.getElementById("unavailable-backdrop");
    const closeBtn = document.getElementById("unavailable-close");
    const okBtn    = document.getElementById("unavailable-ok");
 
    function openUnavailable() {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }
 
    function closeUnavailable() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }
 
    // Trigger on any element with data-unavailable="true"
    document.querySelectorAll("[data-unavailable='true']").forEach(function (el) {
        el.addEventListener("click", function (e) {
            e.preventDefault();
            openUnavailable();
        });
    });
 
    closeBtn.addEventListener("click", closeUnavailable);
    backdrop.addEventListener("click", closeUnavailable);
    okBtn.addEventListener("click", closeUnavailable);
 
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            closeUnavailable();
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

// Page hero
ScrollReveal().reveal(".page-hero-content", { ...scrollRevealOption });

// Room blocks — alternate left/right origin to match layout
ScrollReveal().reveal(".room-block:nth-child(odd) .room-block-image",   { ...scrollRevealOption, origin: "left" });
ScrollReveal().reveal(".room-block:nth-child(even) .room-block-image",  { ...scrollRevealOption, origin: "right" });
ScrollReveal().reveal(".room-block:nth-child(odd) .room-block-content", { ...scrollRevealOption, origin: "right", delay: 200 });
ScrollReveal().reveal(".room-block:nth-child(even) .room-block-content",{ ...scrollRevealOption, origin: "left",  delay: 200 });

// Compare table
ScrollReveal().reveal(".compare-section .section-header", { ...scrollRevealOption });
ScrollReveal().reveal(".compare-table-wrap", { ...scrollRevealOption, delay: 300 });

// CTA banner
ScrollReveal().reveal(".cta-content", { ...scrollRevealOption });

// Footer
ScrollReveal().reveal(".footer-top",         { ...scrollRevealOption });
ScrollReveal().reveal(".contacts",            { ...scrollRevealOption, interval: 500 });
ScrollReveal().reveal(".footer-socials",      { ...scrollRevealOption, delay: 500 });
ScrollReveal().reveal(".footer-copyright",    { ...scrollRevealOption, delay: 500 });
// #endregion