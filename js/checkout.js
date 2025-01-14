document.addEventListener("DOMContentLoaded", () => {
  const continueButton = document.querySelector(".continue-button");
  const form = document.getElementById("contact-form");
  const deliveryForm = document.getElementById("delivery-form");
  const deliverySection = document.querySelector(".delivery-step");
  const paymentSection = document.querySelector(".payment-step");

  // --- Поле для відділення ---
  const warehouseInputWrapper = document.createElement("div");
  warehouseInputWrapper.className = "form-group mt-2";
  warehouseInputWrapper.style.display = "none";

  const warehouseInput = document.createElement("input");
  warehouseInput.type = "text";
  warehouseInput.placeholder = "Введіть номер чи назву відділення...";
  warehouseInput.className = "form-control";

  warehouseInputWrapper.appendChild(warehouseInput);

  // --- Поля для кур'єрської доставки ---
  const courierFieldsWrapper = document.createElement("div");
  courierFieldsWrapper.className = "form-group mt-3";
  courierFieldsWrapper.style.display = "none";

  const streetInput = document.createElement("input");
  streetInput.type = "text";
  streetInput.placeholder = "Вулиця";
  streetInput.className = "form-control mt-2";

  const houseInput = document.createElement("input");
  houseInput.type = "text";
  houseInput.placeholder = "Будинок";
  houseInput.className = "form-control mt-2";

  const apartmentInput = document.createElement("input");
  apartmentInput.type = "text";
  apartmentInput.placeholder = "Квартира";
  apartmentInput.className = "form-control mt-2";

  courierFieldsWrapper.appendChild(streetInput);
  courierFieldsWrapper.appendChild(houseInput);
  courierFieldsWrapper.appendChild(apartmentInput);

  // --- Вставка в потрібні місця ---
  const deliveryOptions = document.querySelectorAll(
    'input[name="delivery-method"]'
  );
  const novaPoshtaBranchOption = deliveryOptions[0].closest("label");
  novaPoshtaBranchOption.insertAdjacentElement(
    "afterend",
    warehouseInputWrapper
  );

  const novaPoshtaCourierOption = deliveryOptions[1].closest("label");
  novaPoshtaCourierOption.insertAdjacentElement(
    "afterend",
    courierFieldsWrapper
  );

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
      deliverySection.querySelector(".step-number").style.color = "#000";
      deliverySection.querySelector("h2").style.color = "#000";

      deliveryForm.style.display = "block";
      deliverySection.scrollIntoView({ behavior: "smooth" });
    }
  });

  function showFieldError(inputElement, message) {
    let errorElement =
      inputElement.parentNode.querySelector(".invalid-feedback");
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "invalid-feedback";
      inputElement.parentNode.appendChild(errorElement);
    }
    inputElement.classList.add("is-invalid"); // Додаємо червону рамку
    errorElement.textContent = message; // Відображаємо повідомлення про помилку

    // Додаємо обробник події для очищення помилки при введенні коректних даних
    inputElement.addEventListener("input", () => {
      inputElement.classList.remove("is-invalid");
      errorElement.textContent = "";
    });
  }

  // --- Перехід до "Оплата" ---
  const deliveryContinueButton = document.querySelector(".delivery-continue");
  const deliveryInputs = document.querySelectorAll(
    "#city, input[name='delivery-method'], input[placeholder='Вулиця'], input[placeholder='Будинок'], input[placeholder='Квартира'], input[placeholder*='відділення']"
  );

  function clearErrorOnInput(inputElement) {
    inputElement.addEventListener("input", () => {
      const feedback = inputElement.nextElementSibling;
      if (feedback && feedback.classList.contains("invalid-feedback")) {
        feedback.textContent = "";
        inputElement.classList.remove("is-invalid");
      }
    });
  }

  // Очищуємо всі поля при введенні
  deliveryInputs.forEach(clearErrorOnInput);

  // --- Перехід до "Оплата" ---
  deliveryContinueButton.addEventListener("click", (event) => {
    event.preventDefault();

    const cityInputField = document.getElementById("city");
    const selectedDeliveryMethod = document.querySelector(
      'input[name="delivery-method"]:checked'
    );

    if (!cityInputField.value.trim()) {
      showFieldError(cityInputField, "Будь ласка, введіть назву міста!");
      return;
    }

    if (!selectedDeliveryMethod) {
      showFieldError(
        document.querySelector(".delivery-options"),
        "Оберіть спосіб доставки!"
      );
      return;
    }

    if (
      selectedDeliveryMethod.value === "Відділення Нова Пошта" &&
      !warehouseInput.value.trim()
    ) {
      showFieldError(warehouseInput, "Введіть номер або назву відділення!");
      return;
    }

    if (selectedDeliveryMethod.value === "Кур’єр Нова Пошта") {
      if (!streetInput.value.trim()) {
        showFieldError(streetInput, "Введіть вулицю!");
        return;
      }
      if (!houseInput.value.trim()) {
        showFieldError(houseInput, "Введіть номер будинку!");
        return;
      }
    }

    // Зробити секцію "Оплата" видимою
    paymentSection.classList.add("active");
    const paymentContent = paymentSection.querySelector(".payment-content");
    paymentContent.style.display = "block";
    paymentContent.style.maxHeight = "600px";
    paymentSection.scrollIntoView({ behavior: "smooth" });
  });

  // --- Логіка для вибору способу доставки ---
  deliveryOptions.forEach((option) => {
    option.addEventListener("change", () => {
      if (option.value === "Відділення Нова Пошта") {
        warehouseInputWrapper.style.display = "block";
        courierFieldsWrapper.style.display = "none";
      } else if (option.value === "Кур’єр Нова Пошта") {
        warehouseInputWrapper.style.display = "none";
        courierFieldsWrapper.style.display = "block";
      }
    });
  });

  function validateForm(firstName, lastName, phone, email) {
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ'-]{2,50}$/;
    const phoneRegex = /^\+?38\s?\(?0\d{2}\)?\s?\d{3}-?\d{2}-?\d{2}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let isValid = true;

    const firstNameInput = document.getElementById("first-name");
    const firstNameError = createErrorElement(firstNameInput);
    if (!firstName) {
      showError(firstNameInput, firstNameError, "Поле не може бути порожнім.");
      isValid = false;
    } else if (!nameRegex.test(firstName)) {
      showError(firstNameInput, firstNameError, "Некоректне ім'я.");
      isValid = false;
    }

    const lastNameInput = document.getElementById("last-name");
    const lastNameError = createErrorElement(lastNameInput);
    if (!lastName) {
      showError(lastNameInput, lastNameError, "Поле не може бути порожнім.");
      isValid = false;
    } else if (!nameRegex.test(lastName)) {
      showError(lastNameInput, lastNameError, "Некоректне прізвище.");
      isValid = false;
    }

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
      showError(phoneInput, phoneError, "Некоректний номер.");
      isValid = false;
    }

    const emailInput = document.getElementById("email");
    const emailError = createErrorElement(emailInput);
    if (!email) {
      showError(emailInput, emailError, "Поле не може бути порожнім.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showError(emailInput, emailError, "Некоректна електронна пошта.");
      isValid = false;
    }

    return isValid;
  }

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

  function showError(inputElement, errorElement, message) {
    inputElement.classList.add("is-invalid");
    errorElement.textContent = message;
  }

  const cityInput = document.getElementById("city");

  // --- Автопідказка для міст ---
  cityInput.addEventListener("input", async function () {
    const query = this.value.trim();
    if (query.length >= 2) {
      const cities = await getCities(query);
      showAutocomplete(this, cities);
    }
  });

  // --- Автопідказка для відділень ---
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

  // --- Функція показу автопідказок ---
  function showAutocomplete(inputElement, suggestions) {
    removeExistingDropdown();

    if (suggestions.length === 0) return;

    const dropdown = document.createElement("ul");
    dropdown.className = "autocomplete-dropdown";
    dropdown.style.position = "absolute";
    dropdown.style.zIndex = "999";
    dropdown.style.width = `${inputElement.offsetWidth}px`;
    dropdown.style.marginTop = "5px";

    // Додавання варіантів до списку
    dropdown.innerHTML = suggestions
      .map((item) => `<li class="autocomplete-item">${item}</li>`)
      .join("");

    inputElement.parentNode.appendChild(dropdown);

    // Подія вибору значення з автопідказки
    dropdown.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        inputElement.value = e.target.textContent;
        removeExistingDropdown();
      }
    });
  }

  // --- Функція видалення існуючого списку ---
  function removeExistingDropdown() {
    const existingDropdown = document.querySelector(".autocomplete-dropdown");
    if (existingDropdown) {
      existingDropdown.remove();
    }
  }

  // --- Запит міст ---
  async function getCities(query) {
    const requestBody = {
      apiKey: "a6e7f26727a0b152d96a7b9406519df9",
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

  // --- Запит відділень ---
  async function getWarehousesByCity(city) {
    const requestBody = {
      apiKey: "a6e7f26727a0b152d96a7b9406519df9",
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
