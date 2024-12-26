document.addEventListener("DOMContentLoaded", () => {
  const xmlPath = "data/tg-tool.xml"; // Шлях до XML-файлу
  const catalogContainer = document.getElementById("catalog");
  const itemsPerPage = 30; // Кількість товарів на сторінку
  let currentPage = 1;

  // Завантаження XML
  fetch(xmlPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((xmlText) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");

      if (xmlDoc.querySelector("parsererror")) {
        throw new Error("Помилка парсингу XML");
      }

      const products = Array.from(xmlDoc.querySelectorAll("offer"));

      if (products.length === 0) {
        catalogContainer.innerHTML = "<p>Товари не знайдено.</p>";
        return;
      }

      // Відображення першої сторінки
      displayProducts(products, currentPage, itemsPerPage);

      // Додайте кнопки для пагінації
      createPaginationButtons(products, itemsPerPage);
    })
    .catch((error) => {
      console.error("Помилка завантаження каталогу:", error);
      catalogContainer.innerHTML = `<p>Не вдалося завантажити каталог товарів. ${error.message}</p>`;
    });

  // Функція для відображення продуктів
  function displayProducts(products, page, itemsPerPage) {
    catalogContainer.innerHTML = ""; // Очистити каталог
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = products.slice(start, end);

    pageItems.forEach((product) => {
      const name = product.querySelector("name_ua")?.textContent || "Без назви";
      const price =
        product.querySelector("price")?.textContent || "Ціна не вказана";
      const currency =
        product.querySelector("currencyId")?.textContent || "UAH";
      const description =
        product.querySelector("description_ua")?.textContent ||
        "Опис відсутній";
      const image =
        product.querySelector("picture")?.textContent ||
        "images/default-image.jpg";
      const url = product.querySelector("url")?.textContent || "#";

      const productHTML = `
        <div class="product">
          <a href="${url}" target="_blank">
            <img src="${image}" alt="${name}" class="product-image" loading="lazy">
          </a>
          <h2>${name}</h2>
          <p>${description}</p>
          <p>Ціна: ${price} ${currency}</p>
        </div>
      `;
      catalogContainer.innerHTML += productHTML;
    });
  }

  // Функція для створення кнопок пагінації
  function createPaginationButtons(products, itemsPerPage) {
    const paginationContainer = document.createElement("div");
    paginationContainer.id = "pagination";
    const totalPages = Math.ceil(products.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      button.classList.add("pagination-button");
      button.addEventListener("click", () => {
        currentPage = i;
        displayProducts(products, currentPage, itemsPerPage);

        // Виділення активної кнопки
        document.querySelectorAll(".pagination-button").forEach((btn) => {
          btn.classList.remove("active");
        });
        button.classList.add("active");
      });
      paginationContainer.appendChild(button);
    }

    // Додати пагінацію під каталог
    catalogContainer.parentNode.appendChild(paginationContainer);
    document.querySelector(".pagination-button").classList.add("active");
  }
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
