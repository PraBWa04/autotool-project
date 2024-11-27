const slides = document.querySelectorAll(".slide");
const sliderWrapper = document.querySelector(".slider-wrapper");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
let currentSlide = 0;

function showSlide(index) {
  const offset = -index * 100;
  sliderWrapper.style.transform = `translateX(${offset}%)`;
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

let autoSlide = setInterval(nextSlide, 5000);

document.querySelector(".slider").addEventListener("mouseenter", () => {
  clearInterval(autoSlide);
});

document.querySelector(".slider").addEventListener("mouseleave", () => {
  autoSlide = setInterval(nextSlide, 5000);
});

showSlide(currentSlide);
