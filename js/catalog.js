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

  const xmlPath = "data/tg-tool.xml";
  const catalogContainer = document.getElementById("catalog-container");
  const paginationContainer = document.getElementById("pagination");
  const itemsPerPage = 30;
  let currentPage = 1;
  let products = [];

  // Завантаження XML
  fetch(xmlPath)
    .then((response) => response.text())
    .then((xmlText) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
      if (xmlDoc.querySelector("parsererror")) {
        throw new Error("Помилка парсингу XML");
      }
      products = Array.from(xmlDoc.querySelectorAll("offer"));
      displayProducts(currentPage, itemsPerPage);
      setupPagination(products.length, itemsPerPage);
    })
    .catch((error) => {
      console.error("Помилка завантаження XML:", error);
      catalogContainer.innerHTML = `<p>Не вдалося завантажити каталог товарів.</p>`;
    });

  // Фільтрація
  document.getElementById("apply-filters").addEventListener("click", () => {
    const minPrice =
      parseFloat(document.getElementById("price-min").value) || 0;
    const maxPrice =
      parseFloat(document.getElementById("price-max").value) || Infinity;

    const filteredProducts = products.filter((product) => {
      const price =
        parseFloat(product.querySelector("price")?.textContent) || 0;
      return price >= minPrice && price <= maxPrice;
    });

    displayProducts(1, itemsPerPage, filteredProducts);
    setupPagination(filteredProducts.length, itemsPerPage);
  });

  // Відображення товарів
  function displayProducts(page, itemsPerPage, items = products) {
    catalogContainer.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    items.slice(start, end).forEach((item) => {
      const name = item.querySelector("name_ua")?.textContent || "Без назви";
      const price =
        item.querySelector("price")?.textContent || "Ціна не вказана";
      const image =
        item.querySelector("picture")?.textContent ||
        "images/default-image.jpg";

      catalogContainer.innerHTML += `
        <div class="product-card">
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
            <span class="product-price">${price} грн</span>
            <button class="add-to-cart">
              <img
                src="images/Icons/cart-white.svg"
                alt="Кошик"
                class="cart-icon"
              />
            </button>
          </div>
        </div>`;
    });
  }

  // Пагінація
  function setupPagination(totalItems, itemsPerPage) {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxButtons = 5; // Максимальна кількість кнопок для відображення

    // Додаємо кнопку "Попередня"
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

    // Визначаємо, які кнопки відображати
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(
      totalPages,
      currentPage + Math.floor(maxButtons / 2)
    );

    // Додаємо кнопку "1", якщо вона не в діапазоні
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

      // Додаємо еліпс, якщо необхідно
      if (startPage > 2) {
        const ellipsisStart = document.createElement("span");
        ellipsisStart.textContent = "...";
        ellipsisStart.classList.add("pagination-ellipsis");
        paginationContainer.appendChild(ellipsisStart);
      }
    }

    // Додаємо основні кнопки пагінації
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

    // Додаємо кнопку "211", якщо вона не в діапазоні
    if (endPage < totalPages) {
      // Додаємо еліпс перед останньою сторінкою, якщо необхідно
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

    // Додаємо кнопку "Наступна"
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
});
