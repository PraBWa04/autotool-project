document.addEventListener("DOMContentLoaded", function () {
  const bottomSection = document.querySelector(".bottom-section");
  const topSectionHeight = document.querySelector(".top-section").offsetHeight;

  window.addEventListener("scroll", () => {
    if (window.scrollY >= topSectionHeight) {
      bottomSection.classList.add("fixed");
    } else {
      bottomSection.classList.remove("fixed");
    }
  });
});

const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

nextBtn.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
});

prevBtn.addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
});

setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 5000);
