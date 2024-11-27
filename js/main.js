const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
let currentSlide = 0;

// Функція для показу слайду
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
    }
  });
}

// Додавання обробників
if (nextBtn && prevBtn) {
  nextBtn.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  });

  prevBtn.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  });
}

// Автоматична зміна слайдів
let interval = setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 5000);

// Зупинка при наведенні
document.querySelector(".slider").addEventListener("mouseenter", () => {
  clearInterval(interval);
});

// Відновлення інтервалу після наведення
document.querySelector(".slider").addEventListener("mouseleave", () => {
  interval = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 5000);
});
