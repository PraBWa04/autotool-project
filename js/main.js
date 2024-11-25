const slides = document.querySelectorAll(".slide");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
let currentIndex = 0;

function updateSlide() {
  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentIndex);
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlide();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlide();
}

nextButton.addEventListener("click", nextSlide);
prevButton.addEventListener("click", prevSlide);

setInterval(nextSlide, 5000);
