document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "API_KEY";

  const continueButton = document.querySelector(".continue-button");
  const form = document.getElementById("contact-form");
  const deliveryForm = document.getElementById("delivery-form");
  const deliverySection = document.querySelector(".delivery-step");
  const continueButtonDelivery = document.querySelector(".delivery-continue");
  const paymentSection = document.querySelector(".checkout-step:last-of-type");

  // --- Перехід до "Доставка" ---
  continueButton.addEventListener("click", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const firstName = formData.get("first-name").trim();
    const lastName = formData.get("last-name").trim();
    const phone = formData.get("phone").trim();
    const email = formData.get("email").trim();

    if (isValidForm(firstName, lastName, phone, email)) {
      deliverySection.style.opacity = "1";
      deliverySection.style.pointerEvents = "auto";
      deliveryForm.style.display = "block";
      deliverySection.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("Будь ласка, заповніть усі поля коректно!");
    }
  });

  // --- Перехід до "Оплата" ---
  continueButtonDelivery?.addEventListener("click", (event) => {
    event.preventDefault();
    const cityInput = deliveryForm.querySelector("#city")?.value.trim();
    const selectedMethod = deliveryForm.querySelector(
      "input[name='delivery-method']:checked"
    );

    if (cityInput && selectedMethod) {
      paymentSection.style.opacity = "1";
      paymentSection.style.pointerEvents = "auto";
      paymentSection.style.display = "block";
      paymentSection.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("Будь ласка, оберіть місто та спосіб доставки!");
    }
  });

  // --- Функція перевірки введених даних ---
  function isValidForm(firstName, lastName, phone, email) {
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ'-]{2,50}$/;
    const phoneRegex = /^\d{9,13}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
      nameRegex.test(firstName) &&
      nameRegex.test(lastName) &&
      phoneRegex.test(phone) &&
      emailRegex.test(email)
    );
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
