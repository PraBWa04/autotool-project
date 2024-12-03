document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const bottomSection = document.querySelector(".bottom-section");
  const topSection = document.querySelector(".top-section");
  let currentSlide = 0;
  let slideInterval;

  // Slide functionality
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

  nextBtn?.addEventListener("click", () => {
    nextSlide();
    resetInterval();
  });

  prevBtn?.addEventListener("click", () => {
    prevSlide();
    resetInterval();
  });

  slideInterval = setInterval(nextSlide, 5000);

  // Sticky bottom section
  window.addEventListener("scroll", () => {
    const topHeight = topSection ? topSection.offsetHeight : 0;
    bottomSection.classList.toggle("fixed", window.scrollY >= topHeight);
  });

  // Tabs for products
  const tabButtons = document.querySelectorAll(".tab-button");
  const productSections = document.querySelectorAll(".products");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const targetId = button.dataset.target;
      productSections.forEach((section) => {
        section.classList.toggle("hidden", section.id !== targetId);
      });
    });
  });

  // Counters for cart and favorites
  const cartCounter = document.querySelector(".cart .counter");
  const favoriteCounter = document.querySelector(".favorite .counter");
  let cartCount = 0;
  let favoriteCount = 0;

  // Buttons for product cards
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    // Favorite button
    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add("add-to-favorites");
    favoriteButton.innerHTML = `
      <svg
        class="favorite-svg"
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          stroke="black"
          stroke-width="1.5"
        />
      </svg>
    `;
    card.appendChild(favoriteButton);

    favoriteButton.addEventListener("click", () => {
      const path = favoriteButton.querySelector("path");
      const isCurrentlyFavorite = path.getAttribute("fill") === "#08a744";

      // Toggle favorite status
      if (isCurrentlyFavorite) {
        path.setAttribute("fill", "white");
        path.setAttribute("stroke", "black");
        favoriteCount = Math.max(0, favoriteCount - 1); // Prevent going below zero
      } else {
        path.setAttribute("fill", "#08a744");
        path.setAttribute("stroke", "#08a744");
        favoriteCount++;
      }

      // Update counter
      favoriteCounter.textContent = favoriteCount > 0 ? favoriteCount : "0";
    });

    // Cart button
    const cartButton = document.createElement("button");
    cartButton.classList.add("add-to-cart");
    cartButton.innerHTML = `
      <img
        src="images/Icons/cart-white.svg"
        alt="Cart"
        class="cart-icon"
      />
    `;
    card.appendChild(cartButton);

    cartButton.addEventListener("click", () => {
      cartCount++;
      cartCounter.textContent = cartCount > 0 ? cartCount : "0";
    });
  });
});
