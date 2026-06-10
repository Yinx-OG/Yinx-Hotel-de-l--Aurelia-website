// ============================================================
// contact.js — Contact page JS for Hotel de l'Aurelia
// ============================================================

// #region STATES
let showMenu = false;
// #endregion


// #region GET ELEMENTS
const siteHeader   = document.getElementById("site-header");

const menuBtn      = document.querySelector(".header-btn");
const hamburger    = document.querySelector(".hamburger");
const nav          = document.querySelector(".header-nav");
const navMenu      = document.querySelector(".header-links");
const navLinks     = document.querySelectorAll(".header-links li");
const logoLink     = document.querySelector(".header-logo-link");

const scrollToTopEl  = document.getElementById("scroll-to-top");
const scrollToTopBtn = document.querySelector(".scroll-to-top .btn");

// Form elements
const contactForm    = document.getElementById("contact-form");
const nameInput      = document.getElementById("contact-name");
const phoneInput     = document.getElementById("contact-phone");
const emailInput     = document.getElementById("contact-email");
const subjectSelect  = document.getElementById("contact-subject");
const messageInput   = document.getElementById("contact-message");
const submitBtn      = document.getElementById("form-submit");
const formSuccess    = document.getElementById("form-success");

// Error spans
const errorName    = document.getElementById("error-name");
const errorEmail   = document.getElementById("error-email");
const errorSubject = document.getElementById("error-subject");
const errorMessage = document.getElementById("error-message");
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


// #region CONTACT FORM

// Clear error on a field as soon as the user starts editing it
function watchField(input, errorEl, fieldEl) {
    input.addEventListener("input", function () {
        fieldEl = fieldEl || input;
        fieldEl.classList.remove("error");
        if (errorEl) errorEl.textContent = "";
    });
}

watchField(nameInput,    errorName,    nameInput);
watchField(emailInput,   errorEmail,   emailInput);
watchField(subjectSelect,errorSubject, subjectSelect);
watchField(messageInput, errorMessage, messageInput);

// Validate and return true if all required fields pass
function validate() {
    let valid = true;

    // Name
    if (!nameInput.value.trim()) {
        setError(nameInput, errorName, "Please enter your full name.");
        valid = false;
    }

    // Email
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
        setError(emailInput, errorEmail, "Please enter your email address.");
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setError(emailInput, errorEmail, "Please enter a valid email address.");
        valid = false;
    }

    // Subject
    if (!subjectSelect.value) {
        setError(subjectSelect, errorSubject, "Please select a subject.");
        valid = false;
    }

    // Message
    if (!messageInput.value.trim()) {
        setError(messageInput, errorMessage, "Please write a message.");
        valid = false;
    }

    return valid;
}

function setError(field, errorEl, message) {
    field.classList.add("error");
    if (errorEl) errorEl.textContent = message;
}

// Build mailto string from form values
function buildMailto() {
    const to      = "amosyinx@gmail.com";
    const subject = encodeURIComponent("[Aurelia Contact] " + subjectSelect.value);
    const body    = encodeURIComponent(
        "Name: "    + nameInput.value.trim()    + "\n" +
        "Phone: "   + (phoneInput.value.trim() || "Not provided") + "\n" +
        "Email: "   + emailInput.value.trim()   + "\n\n" +
        "Message:\n" + messageInput.value.trim()
    );
    return "mailto:" + to + "?subject=" + subject + "&body=" + body;
}

contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validate()) return;

    // Sending state
    submitBtn.textContent = "Sending...";
    submitBtn.disabled    = true;

    // Simulate a brief delay, then show success + open mailto
    setTimeout(function () {

        // 1. Try to open the user's mail client
        const mailto = buildMailto();
        window.location.href = mailto;

        // 2. Show success message regardless of whether mail client opens
        const formFields = contactForm.querySelectorAll(
            ".form-row, .form-group, .btn-submit"
        );
        formFields.forEach(function (el) {
            el.style.display = "none";
        });
        document.querySelector(".form-heading").style.display = "none";

        formSuccess.style.display = "flex";

    }, 900);
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

ScrollReveal().reveal(".page-hero-content", { ...scrollRevealOption });

ScrollReveal().reveal(".contact-details .subheader", { ...scrollRevealOption, delay: 100 });
ScrollReveal().reveal(".contact-details .header",    { ...scrollRevealOption, delay: 250 });
ScrollReveal().reveal(".contact-details .description",{ ...scrollRevealOption, delay: 400 });
ScrollReveal().reveal(".detail-card",  { ...scrollRevealOption, interval: 120, delay: 500 });
ScrollReveal().reveal(".contact-socials", { ...scrollRevealOption, delay: 700 });

ScrollReveal().reveal(".contact-form-wrap", { ...scrollRevealOption, origin: "right", delay: 200 });

ScrollReveal().reveal(".footer-top",        { ...scrollRevealOption });
ScrollReveal().reveal(".contacts",           { ...scrollRevealOption, interval: 500 });
ScrollReveal().reveal(".footer-socials",     { ...scrollRevealOption, delay: 500 });
ScrollReveal().reveal(".footer-copyright",   { ...scrollRevealOption, delay: 500 });
// #endregion