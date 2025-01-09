document.addEventListener("DOMContentLoaded", () => {
  const continueButton = document.querySelector(".continue-button");
  const form = document.getElementById("contact-form");
  const deliveryForm = document.getElementById("delivery-form");
  const deliverySection = document.querySelector(".delivery-step");

  // --- Додаємо слухачі на введення даних у поля, щоб очищати помилки ---
  // --- Додаємо слухачі на введення даних у поля, щоб очищати помилки ---
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const feedback = input.nextElementSibling;
      if (feedback && feedback.classList.contains("invalid-feedback")) {
        feedback.textContent = "";
        input.classList.remove("is-invalid");
      }
    });
  });

  // --- Перехід до "Доставка" ---
  continueButton.addEventListener("click", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const firstName = formData.get("first-name").trim();
    const lastName = formData.get("last-name").trim();
    const phone = formData.get("phone").trim();
    const email = formData.get("email").trim();

    if (validateForm(firstName, lastName, phone, email)) {
      deliverySection.style.opacity = "1";
      deliverySection.style.pointerEvents = "auto";
      deliveryForm.style.display = "block";
      deliverySection.scrollIntoView({ behavior: "smooth" });
    }
  });

  // --- Одна функція перевірки полів ---
  function validateForm(firstName, lastName, phone, email) {
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ'-]{2,50}$/;
    const phoneRegex = /^\+?38\s?\(?0\d{2}\)?\s?\d{3}-?\d{2}-?\d{2}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let isValid = true;

    // --- Перевірка імені ---
    const firstNameInput = document.getElementById("first-name");
    const firstNameError = createErrorElement(firstNameInput);
    if (!firstName) {
      showError(firstNameInput, firstNameError, "Поле не може бути порожнім.");
      isValid = false;
    } else if (!nameRegex.test(firstName)) {
      showError(
        firstNameInput,
        firstNameError,
        "Некоректне ім'я. Допустимі тільки літери."
      );
      isValid = false;
    }

    // --- Перевірка прізвища ---
    const lastNameInput = document.getElementById("last-name");
    const lastNameError = createErrorElement(lastNameInput);
    if (!lastName) {
      showError(lastNameInput, lastNameError, "Поле не може бути порожнім.");
      isValid = false;
    } else if (!nameRegex.test(lastName)) {
      showError(
        lastNameInput,
        lastNameError,
        "Некоректне прізвище. Допустимі тільки літери."
      );
      isValid = false;
    }

    // --- Перевірка телефону ---
    const phoneInput = document.getElementById("phone");
    const phoneError = createErrorElement(phoneInput);

    if (!phone) {
      showError(phoneInput, phoneError, "Поле не може бути порожнім.");
      isValid = false;
    } else if (
      phone.length < 10 ||
      phone.length > 15 ||
      !/^\d+$/.test(phone.replace(/[\s()+-]/g, ""))
    ) {
      showError(
        phoneInput,
        phoneError,
        "Некоректний номер. Введіть від 10 до 15 цифр без зайвих символів."
      );
      isValid = false;
    } else {
      phoneInput.classList.remove("is-invalid");
      phoneError.textContent = "";
    }

    // --- Перевірка електронної пошти ---
    const emailInput = document.getElementById("email");
    const emailError = createErrorElement(emailInput);
    if (!email) {
      showError(emailInput, emailError, "Поле не може бути порожнім.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showError(
        emailInput,
        emailError,
        "Некоректна електронна пошта. Вкажіть у форматі example@email.com."
      );
      isValid = false;
    }

    return isValid;
  }

  // --- Функція для створення блоку помилки, якщо він не існує ---
  function createErrorElement(inputElement) {
    let errorElement =
      inputElement.parentNode.querySelector(".invalid-feedback");
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "invalid-feedback";
      inputElement.parentNode.appendChild(errorElement);
    }
    return errorElement;
  }

  // --- Відображення помилки ---
  function showError(inputElement, errorElement, message) {
    inputElement.classList.add("is-invalid");
    errorElement.textContent = message;
  }

  // --- Автопідказки міст ---
  const cityInput = document.getElementById("city");
  cityInput.addEventListener("input", async function () {
    const query = this.value.trim();
    if (query.length >= 2) {
      const cities = await getCities(query);
      showAutocomplete(this, cities);
    }
  });

  // --- Автопідказки відділень ---
  const warehouseInput = document.createElement("input");
  warehouseInput.id = "warehouse";
  warehouseInput.placeholder = "Введіть номер чи назву відділення...";
  document.querySelector(".delivery-form").appendChild(warehouseInput);

  warehouseInput.addEventListener("input", async function () {
    const city = cityInput.value.trim();
    const query = this.value.trim().toLowerCase();
    if (city.length > 0 && query.length >= 2) {
      const warehouses = await getWarehousesByCity(city);
      const matchingWarehouses = warehouses.filter((warehouse) =>
        warehouse.toLowerCase().includes(query)
      );
      showAutocomplete(this, matchingWarehouses);
    }
  });

  // --- Функція автопідказок ---
  function showAutocomplete(inputElement, suggestions) {
    const dropdown = document.createElement("ul");
    dropdown.className = "autocomplete-dropdown";

    dropdown.innerHTML = suggestions
      .map((item) => `<li class="autocomplete-item">${item}</li>`)
      .join("");

    removeExistingDropdown(inputElement);
    inputElement.parentNode.appendChild(dropdown);

    dropdown.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        inputElement.value = e.target.textContent;
        dropdown.remove();
      }
    });
  }

  function removeExistingDropdown(inputElement) {
    const existingDropdown = inputElement.parentNode.querySelector(
      ".autocomplete-dropdown"
    );
    if (existingDropdown) {
      existingDropdown.remove();
    }
  }

  // --- Отримання міст ---
  async function getCities(query) {
    const requestBody = {
      apiKey: apiKey,
      modelName: "Address",
      calledMethod: "getCities",
      methodProperties: {
        FindByString: query,
      },
    };

    const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    return data.success ? data.data.map((city) => city.Description) : [];
  }

  // --- Отримання відділень ---
  async function getWarehousesByCity(city) {
    const requestBody = {
      apiKey: apiKey,
      modelName: "Address",
      calledMethod: "getWarehouses",
      methodProperties: {
        CityName: city,
      },
    };

    const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    return data.success
      ? data.data.map((warehouse) => warehouse.Description)
      : [];
  }
});
