// ===== HOT DEALS SLIDER =====
const hotDealsSwiper = new Swiper(".hot-deals-slider", {
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  slidesPerView: 4,
  spaceBetween: 30,
  breakpoints: {
    1200: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
    900: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    600: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    0: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
  },
});

// Pause on hover
document
  .querySelector(".hot-deals-slider")
  .addEventListener("mouseenter", () => {
    hotDealsSwiper.autoplay.stop();
  });

document
  .querySelector(".hot-deals-slider")
  .addEventListener("mouseleave", () => {
    hotDealsSwiper.autoplay.start();
  });
