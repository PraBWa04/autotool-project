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
        favoriteCount = Math.max(0, favoriteCount - 1);
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

document.addEventListener("DOMContentLoaded", () => {
  const reviewsWrapper = document.querySelector(".reviews-wrapper");
  const reviews = document.querySelectorAll(".review");
  const prevArrow = document.querySelector(".carousel-arrow.prev");
  const nextArrow = document.querySelector(".carousel-arrow.next");

  const reviewWidth = reviews[0].offsetWidth + 20;
  let currentIndex = 0;

  const updateCarousel = () => {
    reviewsWrapper.style.transform = `translateX(-${
      currentIndex * reviewWidth
    }px)`;
  };

  prevArrow.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = reviews.length - 1;
    }
    updateCarousel();
  });

  nextArrow.addEventListener("click", () => {
    if (currentIndex < reviews.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  });

  window.addEventListener("resize", () => {
    const updatedReviewWidth = reviews[0].offsetWidth + 20;
    reviewsWrapper.style.transform = `translateX(-${
      currentIndex * updatedReviewWidth
    }px)`;
  });
});

window.addEventListener("resize", () => {
  const isMobile = window.innerWidth <= 768;
  const visibleReviews = isMobile ? 1 : 3;
  const updatedReviewWidth = reviewsWrapper.offsetWidth / visibleReviews + 20;
  reviewWidth = updatedReviewWidth;
  updateCarousel();
});

document.addEventListener("DOMContentLoaded", () => {
  const reviewForm = document.getElementById("review-form");
  const reviewsWrapper = document.querySelector(".reviews-wrapper");
  const leaveReviewBtn = document.getElementById("leave-review-btn");
  const modal = document.getElementById("review-modal");
  const closeModal = document.getElementById("close-modal");

  if (!reviewsWrapper) {
    console.error("reviewsWrapper не знайдено.");
    return;
  }

  if (!modal || !leaveReviewBtn || !closeModal) {
    console.error("Одного з елементів модального вікна не знайдено.");
    return;
  }

  // Логіка модального вікна
  leaveReviewBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    console.log("Модальне вікно відкрито.");
  });

  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    console.log("Модальне вікно закрито.");
  });

  // Обробка форми
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const comment = document.getElementById("comment").value.trim();

    if (!name) {
      alert("Введіть ваше ім'я.");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Введіть правильний email.");
      return;
    }
    if (!comment) {
      alert("Напишіть ваш відгук.");
      return;
    }

    const today = new Date();
    const date = `${today.getDate().toString().padStart(2, "0")}.${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${today.getFullYear()}`;

    const newReview = document.createElement("div");
    newReview.classList.add("review");
    newReview.innerHTML = `
        <div class="review-header">
          <h3>${name}</h3>
          <span class="date">${date}</span>
        </div>
        <p>${comment}</p>
      `;

    reviewsWrapper.appendChild(newReview);
    reviewForm.reset();
    modal.classList.add("hidden");
    console.log("Відгук додано.");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      item.classList.toggle("active");

      const answer = item.querySelector(".faq-answer");
      if (item.classList.contains("active")) {
        answer.style.maxHeight = answer.scrollHeight + "px";
        answer.style.opacity = "1";
      } else {
        answer.style.maxHeight = "0";
        answer.style.opacity = "0";
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const includeHTML = async (selector, url) => {
    const container = document.querySelector(selector);
    if (container) {
      const response = await fetch(url);
      if (response.ok) {
        const content = await response.text();
        container.innerHTML = content;
      } else {
        console.error(`Помилка завантаження ${url}: ${response.statusText}`);
      }
    }
  };

  includeHTML("header", "partials/header.html");
  includeHTML("footer", "partials/footer.html");
});

document.querySelectorAll(".menu a").forEach((link) => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const includeHTML = async (selector, url) => {
    const container = document.querySelector(selector);
    if (container) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const content = await response.text();
          container.innerHTML = content;
        } else {
          console.error(`Помилка завантаження ${url}: ${response.status}`);
        }
      } catch (error) {
        console.error(`Помилка: ${error.message}`);
      }
    }
  };

  // Динамічно підключаємо хедер і футер
  includeHTML("header", "partials/header.html");
  includeHTML("footer", "partials/footer.html");
});

document.addEventListener("DOMContentLoaded", () => {
  // Динамічне підключення хедера
  fetch("partials/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("header").innerHTML = data;
    })
    .catch((error) => console.error("Помилка завантаження хедера:", error));

  // Динамічне підключення футера
  fetch("partials/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("footer").innerHTML = data;
    })
    .catch((error) => console.error("Помилка завантаження футера:", error));

  // Підключення каталогу товарів з XML
  Promise.all([
    fetch("data/tg-tool.xml").then((res) => res.text()),
    fetch("data/products_feed.xml").then((res) => res.text()),
  ])
    .then(([xmlText1, xmlText2]) => {
      const parser = new DOMParser();
      const xmlDoc1 = parser.parseFromString(xmlText1, "application/xml");
      const xmlDoc2 = parser.parseFromString(xmlText2, "application/xml");

      // Перевірка на помилки парсингу
      if (
        xmlDoc1.querySelector("parsererror") ||
        xmlDoc2.querySelector("parsererror")
      ) {
        throw new Error("Помилка парсингу одного з XML файлів");
      }

      // Об'єднуємо всі категорії та продукти
      const combinedCategories = [
        ...xmlDoc1.querySelectorAll("category"),
        ...xmlDoc2.querySelectorAll("category"),
      ];
      const combinedProducts = [
        ...xmlDoc1.querySelectorAll("product"),
        ...xmlDoc2.querySelectorAll("product"),
      ];

      const catalogContainer = document.getElementById("catalog");

      if (catalogContainer && combinedProducts.length === 0) {
        catalogContainer.innerHTML = "<p>Товари не знайдено.</p>";
        return;
      }

      combinedProducts.forEach((product) => {
        const name = product.querySelector("name")?.textContent || "Без назви";
        const price =
          product.querySelector("price")?.textContent || "Ціна не вказана";
        const currency =
          product.querySelector("currency")?.textContent || "UAH";
        const description =
          product.querySelector("description")?.textContent || "Опис відсутній";
        const image =
          product.querySelector("image")?.textContent ||
          "images/default-image.jpg";

        const productHTML = `
          <div class="product">
            <img src="${image}" alt="${name}" class="product-image">
            <h2>${name}</h2>
            <p>${description}</p>
            <p>Ціна: ${price} ${currency}</p>
          </div>
        `;
        catalogContainer.innerHTML += productHTML;
      });
    })
    .catch((error) => {
      console.error("Помилка завантаження каталогу:", error);
      const catalogContainer = document.getElementById("catalog");
      if (catalogContainer) {
        catalogContainer.innerHTML = `<p>Не вдалося завантажити каталог товарів. ${error.message}</p>`;
      }
    });
});

document.addEventListener("DOMContentLoaded", () => {
  // Відстеження додавання до кошика
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productCard = event.target.closest(".product-card");
      const productName =
        productCard.querySelector(".product-title")?.textContent.trim() ||
        "Товар";
      const productPrice =
        parseFloat(productCard.querySelector(".product-price")?.textContent) ||
        0;

      fbq("track", "AddToCart", {
        content_name: productName,
        currency: "UAH",
        value: productPrice,
      });
      console.log(`Event: AddToCart — ${productName}, ${productPrice} UAH`);
    });
  });

  // Відстеження початку оформлення замовлення
  document.querySelector(".checkout-button")?.addEventListener("click", () => {
    fbq("track", "InitiateCheckout", {
      currency: "UAH",
      value: 0,
    });
    console.log("Event: InitiateCheckout");
  });

  // Відстеження додавання платіжної інформації
  document.querySelectorAll('input[name="payment-method"]').forEach((input) => {
    input.addEventListener("change", () => {
      fbq("track", "AddPaymentInfo", {
        currency: "UAH",
        value: 0,
      });
      console.log("Event: AddPaymentInfo");
    });
  });

  // Відстеження завершення покупки
  document.querySelector(".confirm-button")?.addEventListener("click", () => {
    fbq("track", "Purchase", {
      content_name: "Завершено покупку",
      currency: "UAH",
      value: totalSum,
    });
    console.log("Event: Purchase");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const favoriteButtons = document.querySelectorAll(".add-to-favorites");
  const favoriteCounter = document.querySelector(".favorite .counter");

  // Завантаження існуючих улюблених товарів
  let favoriteItems = JSON.parse(localStorage.getItem("favorites")) || [];

  const updateCounter = () => {
    favoriteCounter.textContent = favoriteItems.length;
  };

  // Оновлення лічильника
  updateCounter();

  favoriteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const productCard = e.target.closest(".product-card");
      const productName = productCard.querySelector("h3").textContent;
      const productPrice = productCard.querySelector("p").textContent;
      const productImage = productCard.querySelector("img").src;

      const productData = {
        name: productName,
        price: productPrice,
        image: productImage,
      };

      // Додавання або видалення з улюбленого
      const index = favoriteItems.findIndex(
        (item) => item.name === productName
      );
      if (index > -1) {
        favoriteItems.splice(index, 1);
        alert("Товар видалено з улюбленого!");
      } else {
        favoriteItems.push(productData);
        alert("Товар додано до улюбленого!");
      }

      localStorage.setItem("favorites", JSON.stringify(favoriteItems));
      updateCounter();
    });
  });
});
