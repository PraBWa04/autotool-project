import { addToCart, toggleFavorite } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  // Функція для підключення зовнішніх HTML частин (header та footer)
  const includeHTML = async (selector, url) => {
    const container = document.querySelector(selector);
    if (!container) {
      console.warn(`Елемент з селектором ${selector} не знайдено.`);
      return;
    }
    try {
      const response = await fetch(url);
      if (response.ok) {
        container.innerHTML = await response.text();
      } else {
        console.error(`Помилка завантаження ${url}: ${response.statusText}`);
        container.innerHTML = `<p>Не вдалося завантажити ${url}.</p>`;
      }
    } catch (error) {
      console.error(`Помилка завантаження ${url}: ${error.message}`);
      container.innerHTML = `<p>Не вдалося завантажити ${url}. Перевірте інтернет-з'єднання.</p>`;
    }
  };

  // Завантажуємо header та footer
  includeHTML("header", "partials/header.html");
  includeHTML("footer", "partials/footer.html");

  const xmlPath = ["data/tg-tool.xml", "data/products_feed.xml"];
  const catalogContainer = document.getElementById("catalog-container");
  const paginationContainer = document.getElementById("pagination");
  const categoryContainer = document.getElementById("category-filters");
  const itemsPerPage = 30;
  let currentPage = 1;
  let products = [];
  let categories = [];

  // Завантаження XML
  Promise.all(xmlPath.map((path) => fetch(path).then((res) => res.text())))
    .then((responses) => {
      const parser = new DOMParser();
      responses.forEach((xmlText) => {
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
        if (xmlDoc.querySelector("parsererror")) {
          console.error(
            "Помилка парсингу XML:",
            xmlDoc.querySelector("parsererror").textContent
          );
        } else {
          const offers = Array.from(xmlDoc.querySelectorAll("offer"));
          offers.forEach((offer) => {
            const category =
              offer.querySelector("category")?.textContent || "Інше";
            if (!categories.includes(category)) {
              categories.push(category);
            }
          });
          products.push(...offers);
        }
      });
      displayCategories(categories);
      displayProducts(currentPage, itemsPerPage);
      setupPagination(products.length, itemsPerPage);
    })
    .catch((error) => {
      console.error("Помилка завантаження XML:", error);
      catalogContainer.innerHTML = `<p>Не вдалося завантажити каталог товарів.</p>`;
    });

  // Відображення категорій
  function displayCategories(categories) {
    categories.forEach((category) => {
      const categoryButton = document.createElement("button");
      categoryButton.textContent = category;
      categoryButton.classList.add("category-button");
      categoryButton.addEventListener("click", () => {
        filterByCategory(category);
      });
      categoryContainer.appendChild(categoryButton);
    });

    // Додаємо кнопку для "Всі товари"
    const allButton = document.createElement("button");
    allButton.textContent = "Всі товари";
    allButton.classList.add("category-button");
    allButton.addEventListener("click", () => {
      displayProducts(1, itemsPerPage, products);
      setupPagination(products.length, itemsPerPage);
    });
    categoryContainer.appendChild(allButton);
  }

  // Фільтрація за категорією
  function filterByCategory(category) {
    const filteredProducts = products.filter((product) => {
      const productCategory =
        product.querySelector("category")?.textContent || "Інше";
      return productCategory === category;
    });
    displayProducts(1, itemsPerPage, filteredProducts);
    setupPagination(filteredProducts.length, itemsPerPage);
  }

  // Відображення товарів
  function displayProducts(page, itemsPerPage, items = products) {
    catalogContainer.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    if (items.length === 0) {
      catalogContainer.innerHTML = `<p>Товари не знайдені за обраними фільтрами.</p>`;
      return;
    }

    items.slice(start, end).forEach((item) => {
      const name = item.querySelector("name_ua")?.textContent || "Без назви";
      const price =
        item.querySelector("price")?.textContent || "Ціна не вказана";
      const image =
        item.querySelector("picture")?.textContent ||
        "images/default-image.jpg";

      const productCard = document.createElement("div");
      productCard.classList.add("product-card", "best-offers-card");

      productCard.innerHTML = `
        <button class="add-to-favorites">
          <svg
            class="favorite-svg"
            width="24"
            height="24"
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
        </button>
        <img src="${image}" alt="${name}" class="product-image" />
        <h3 class="product-title">${name}</h3>
        <div class="product-footer">
          <p class="product-price">${price} грн</p>
          <button class="add-to-cart">
            <span>В кошик</span>
            <img src="images/Icons/cart-white.svg" alt="Кошик" class="cart-icon" />
          </button>
        </div>
      `;

      catalogContainer.appendChild(productCard);

      const favoriteButton = productCard.querySelector(".add-to-favorites");
      const cartButton = productCard.querySelector(".add-to-cart");

      // Обробка додавання до улюбленого
      favoriteButton.addEventListener("click", () => {
        const productData = {
          name,
          price,
          image,
        };
        const isFavorite = toggleFavorite(productData);

        const path = favoriteButton.querySelector("path");
        path.setAttribute("fill", isFavorite ? "#08a744" : "white");
        path.setAttribute("stroke", isFavorite ? "#08a744" : "black");
      });

      // Обробка додавання до кошика
      cartButton.addEventListener("click", () => {
        addToCart(name, price);
        alert(`Товар "${name}" додано до кошика за ціною ${price} грн`);
      });
    });
  }

  // Пагінація
  function setupPagination(totalItems, itemsPerPage) {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxButtons = 5;

    if (currentPage > 1) {
      const prevButton = document.createElement("button");
      prevButton.textContent = "Попередня";
      prevButton.classList.add("pagination-button");
      prevButton.addEventListener("click", () => {
        currentPage--;
        displayProducts(currentPage, itemsPerPage);
        setupPagination(totalItems, itemsPerPage);
      });
      paginationContainer.appendChild(prevButton);
    }

    // Додаємо кнопки сторінок пагінації
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(
      totalPages,
      currentPage + Math.floor(maxButtons / 2)
    );

    if (startPage > 1) {
      const firstButton = document.createElement("button");
      firstButton.textContent = "1";
      firstButton.classList.add("pagination-button");
      firstButton.addEventListener("click", () => {
        currentPage = 1;
        displayProducts(currentPage, itemsPerPage);
        setupPagination(totalItems, itemsPerPage);
      });
      paginationContainer.appendChild(firstButton);

      if (startPage > 2) {
        const ellipsisStart = document.createElement("span");
        ellipsisStart.textContent = "...";
        ellipsisStart.classList.add("pagination-ellipsis");
        paginationContainer.appendChild(ellipsisStart);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      button.classList.add("pagination-button");
      if (i === currentPage) button.classList.add("active");

      button.addEventListener("click", () => {
        currentPage = i;
        displayProducts(currentPage, itemsPerPage);
        setupPagination(totalItems, itemsPerPage);
      });

      paginationContainer.appendChild(button);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsisEnd = document.createElement("span");
        ellipsisEnd.textContent = "...";
        ellipsisEnd.classList.add("pagination-ellipsis");
        paginationContainer.appendChild(ellipsisEnd);
      }

      const lastButton = document.createElement("button");
      lastButton.textContent = totalPages;
      lastButton.classList.add("pagination-button");
      lastButton.addEventListener("click", () => {
        currentPage = totalPages;
        displayProducts(currentPage, itemsPerPage);
        setupPagination(totalItems, itemsPerPage);
      });
      paginationContainer.appendChild(lastButton);
    }

    if (currentPage < totalPages) {
      const nextButton = document.createElement("button");
      nextButton.textContent = "Наступна";
      nextButton.classList.add("pagination-button");
      nextButton.addEventListener("click", () => {
        currentPage++;
        displayProducts(currentPage, itemsPerPage);
        setupPagination(totalItems, itemsPerPage);
      });
      paginationContainer.appendChild(nextButton);
    }
  }

  // Лічильники для кошика та улюбленого
  const cartCounter = document.querySelector(".cart .counter");
  const favoriteCounter = document.querySelector(".favorite .counter");
  let cartCount = 0;
  let favoriteCount = 0;

  // Оновлення лічильників
  function updateCounters() {
    cartCounter.textContent = cartCount > 0 ? cartCount : "0";
    favoriteCounter.textContent = favoriteCount > 0 ? favoriteCount : "0";
  }

  // Відстеження подій для улюблених товарів і кошика
  document.addEventListener("click", (event) => {
    if (event.target.closest(".add-to-favorites")) {
      const productCard = event.target.closest(".product-card");
      const productName = productCard
        .querySelector(".product-title")
        .textContent.trim();
      const path = event.target.closest("svg").querySelector("path");
      const isFavorite = path.getAttribute("fill") === "#08a744";

      if (isFavorite) {
        path.setAttribute("fill", "white");
        favoriteCount = Math.max(0, favoriteCount - 1);
      } else {
        path.setAttribute("fill", "#08a744");
        favoriteCount++;
      }

      updateCounters();
    }

    if (event.target.closest(".add-to-cart")) {
      cartCount++;
      updateCounters();
      alert("Товар додано до кошика!");
    }
  });

  // Фільтрація за ціною та брендами
  function filterProducts() {
    const selectedFilters = {
      priceMin: parseFloat(document.getElementById("price-range").value) || 0,
      priceMax: parseFloat(document.getElementById("price-range").max) || 10000,
      brands: Array.from(
        document.querySelectorAll(".filters input[type='checkbox']:checked")
      ).map((input) => input.id),
    };

    const filteredProducts = products.filter((product) => {
      const price =
        parseFloat(product.querySelector("price")?.textContent) || 0;
      const brand = product.querySelector("brand")?.textContent || "";

      return (
        price >= selectedFilters.priceMin &&
        price <= selectedFilters.priceMax &&
        (selectedFilters.brands.length === 0 ||
          selectedFilters.brands.includes(brand))
      );
    });

    displayProducts(1, itemsPerPage, filteredProducts);
    setupPagination(filteredProducts.length, itemsPerPage);
  }

  // Пошук товарів за назвою
  const searchInput = document.getElementById("search-input");
  searchInput?.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter((product) => {
      const productName =
        product.querySelector("name_ua")?.textContent.toLowerCase() || "";
      return productName.includes(searchTerm);
    });

    displayProducts(1, itemsPerPage, filteredProducts);
    setupPagination(filteredProducts.length, itemsPerPage);
  });
});
