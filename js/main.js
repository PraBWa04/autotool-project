document.addEventListener("DOMContentLoaded", () => {
  // Слайдер
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const bottomSection = document.querySelector(".bottom-section");
  const topSection = document.querySelector(".top-section");
  let currentSlide = 0;
  let slideInterval;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  };

  const resetInterval = () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  };

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetInterval();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetInterval();
  });

  slideInterval = setInterval(nextSlide, 5000);

  window.addEventListener("scroll", () => {
    if (window.scrollY >= topSection.offsetHeight) {
      bottomSection.classList.add("fixed");
    } else {
      bottomSection.classList.remove("fixed");
    }
  });

  // Табуляція товарів
  const tabButtons = document.querySelectorAll(".tab-button");
  const productSections = document.querySelectorAll(".products");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const targetId = button.dataset.target;
      productSections.forEach((section) => {
        if (section.id === targetId) {
          section.classList.remove("hidden");
          section.classList.add("active");
        } else {
          section.classList.add("hidden");
          section.classList.remove("active");
        }
      });
    });
  });

  // Робота з "Улюбленими"
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const hearts = document.querySelectorAll(".heart-icon");

  hearts.forEach((heart) => {
    const productName = heart
      .closest(".product-card")
      .querySelector("h3").innerText;
    if (favorites.includes(productName)) {
      heart.src = "images/Icons/heart-filled.svg";
    }

    heart.addEventListener("click", () => {
      if (favorites.includes(productName)) {
        favorites.splice(favorites.indexOf(productName), 1);
        heart.src = "images/Icons/heart.svg";
      } else {
        favorites.push(productName);
        heart.src = "images/Icons/heart-filled.svg";
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
    });
  });

  // Робота з кошиком
  const cart = [];
  const cartCounter = document.querySelector(".cart .counter");
  const cartButtons = document.querySelectorAll(".add-to-cart");

  cartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productName = button
        .closest(".product-card")
        .querySelector("h3").innerText;
      cart.push(productName);
      cartCounter.textContent = cart.length;
      button.textContent = "Додано ✔";
      button.disabled = true;
    });
  });

  // Карусель
  const productsContainers = document.querySelectorAll(".products");
  const prevButton = document.querySelector(".carousel-control.prev");
  const nextButton = document.querySelector(".carousel-control.next");

  prevButton.addEventListener("click", () => {
    productsContainers.forEach((container) => {
      container.scrollBy({ left: -300, behavior: "smooth" });
    });
  });

  nextButton.addEventListener("click", () => {
    productsContainers.forEach((container) => {
      container.scrollBy({ left: 300, behavior: "smooth" });
    });
  });
});
