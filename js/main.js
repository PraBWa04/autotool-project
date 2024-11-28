const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
let currentSlide = 0;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentSlide);
  });
}

nextBtn.addEventListener("click", () => {
  showSlide(currentSlide + 1);
});

prevBtn.addEventListener("click", () => {
  showSlide(currentSlide - 1);
});

let autoSlide = setInterval(() => showSlide(currentSlide + 1), 5000);

document.querySelector(".slider").addEventListener("mouseenter", () => {
  clearInterval(autoSlide);
});

document.querySelector(".slider").addEventListener("mouseleave", () => {
  autoSlide = setInterval(() => showSlide(currentSlide + 1), 5000);
});

showSlide(currentSlide);
