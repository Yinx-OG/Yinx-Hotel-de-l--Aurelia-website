// 1. States/Data //
let showMenu = false;

let currentIndex = 0;


// 2. Get HTML elements //
const menuBtn             = document.querySelector(".header-btn")
const hamburger           = document.querySelector(".hamburger")

const nav                 = document.querySelector(".header-nav")
const navMenu             = document.querySelector(".header-links")
const navlinks            = document.querySelectorAll(".header-links li")
const logoLink            = document.querySelector(".header-logo-link")

const galleryItems        = document.querySelectorAll(".gallery-item");

const backToTop           = document.querySelector(".scroll-to-top")
const backToTopBtn        = document.querySelector(".scroll-to-top .btn")

const lightbox            = document.getElementById("lightbox");
const lightboxImg         = document.getElementById("lightbox-img");
const lightboxCaption     = document.getElementById("lightbox-caption");
const lightboxClose       = document.querySelector(".lightbox-close");
const lightboxPrev        = document.querySelector(".lightbox-prev");
const lightboxNext        = document.querySelector(".lightbox-next");
const lightboxBackdrop    = document.querySelector(".lightbox-backdrop");

const galleryData = Array.from(galleryItems).map(function(item){
    return {
        src:   item.querySelector("img").src,
        alt:   item.querySelector("img").alt,
        label: item.dataset.label || "",
    };
});

const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration: 1000,
}


// 3. Logic //
function openLightbox(index){
    currentIndex = index;
    lightboxImg.src         = galleryData[index].src;
    lightboxImg.alt         = galleryData[index].alt;
    lightboxCaption.textContent = galleryData[index].label;
 
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // prevent page scroll while lightbox is open
}

function closeLightbox(){
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // restore page scroll
}

function triggerSlide(direction) {
    // direction: "right" = next, "left" = prev
    const animClass = direction === "right" ? "slide-in-right" : "slide-in-left";
 
    // Remove any existing animation class so it can re-trigger
    lightboxImg.classList.remove("slide-in-right", "slide-in-left");
 
    // Force a reflow so removing + re-adding the class actually replays the animation
    void lightboxImg.offsetWidth;
 
    lightboxImg.src                  = galleryData[currentIndex].src;
    lightboxImg.alt                  = galleryData[currentIndex].alt;
    lightboxCaption.textContent      = galleryData[currentIndex].label;
 
    lightboxImg.classList.add(animClass);
}

function showNext() {
    currentIndex = (currentIndex + 1) % galleryData.length;
    triggerSlide("right");
}
 
function showPrev() {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    triggerSlide("left");
}


// 4. Scenario //
menuBtn.addEventListener("click", function(){
    hamburger.classList.toggle("open");
    nav.classList.toggle("open");
    navMenu.classList.toggle("open");
    logoLink.classList.toggle("open");

    navlinks.forEach(function(item){
        item.classList.toggle("open")
    });

    showMenu = !showMenu
})

window.addEventListener("scroll", function(){
    if(window.scrollY > 650){
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

galleryItems.forEach(function(item, index){
    item.addEventListener("click", function(){
        openLightbox(index);
    });
});

backToTopBtn.addEventListener("click", function(){
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    })
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxBackdrop.addEventListener("click", closeLightbox);

lightboxPrev.addEventListener("click", showPrev);
lightboxNext.addEventListener("click", showNext);

document.addEventListener("keydown", function(e){
    if(!lightbox.classList.contains("open")) return;

    if(e.key === "Escape") closeLightbox();
    if(e.key === "ArrowRight") showNext();
    if(e.key === "ArrowLeft") showPrev();
});

document.querySelectorAll(".btn[data-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
        const target = btn.dataset.target;
        if (!target) return;
 
        if (target.startsWith("#")) {
            const el = document.querySelector(target);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }
 
        
        window.location.href = target;
    });
});

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

// 5. Scroll Reveal //
// hero-section
ScrollReveal().reveal(".hero-text", {
    ...scrollRevealOption,
})


// about-section
ScrollReveal().reveal(".subheader", {
    ...scrollRevealOption,
    delay: "500",
})

ScrollReveal().reveal(".header", {
    ...scrollRevealOption,
    delay: "1000",
})

ScrollReveal().reveal(".description", {
    ...scrollRevealOption,
    delay: "1500",
})

ScrollReveal().reveal(".about-img img", {
    ...scrollRevealOption,
    origin: "left",
})

ScrollReveal().reveal(".about-btn", {
    ...scrollRevealOption,
    delay: "1500",
})


// room-section
ScrollReveal().reveal(".room-card", {
    ...scrollRevealOption,
    interval: "700",
})


// gallery-section
ScrollReveal().reveal(".gallery-btn", {
    ...scrollRevealOption,
    delay: "1500",
})

ScrollReveal().reveal(".gallery-item", {
    ...scrollRevealOption,
    interval: "200",
    delay: "1000",
})


// footer
ScrollReveal().reveal(".footer-top", {
    ...scrollRevealOption,
})

ScrollReveal().reveal(".contacts", {
    ...scrollRevealOption,
    interval: "500",
})

ScrollReveal().reveal(".footer-socials", {
    ...scrollRevealOption,
    delay: "500",
})

ScrollReveal().reveal(".footer-copyright", {
    ...scrollRevealOption,
    delay: "500",
})