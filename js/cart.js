import { loadCart } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items-container");
  const totalItemsElement = document.getElementById("total-items");
  const totalPriceElement = document.getElementById("total-price");

  // Завантажуємо товари з localStorage
  const { items, totalPrice } = loadCart();

  if (items.length > 0) {
    items.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <p class="product-title">${item.name}</p>
        <p class="product-price">₴${item.price}</p>
        <button class="remove-button">Видалити</button>
      `;
      cartItemsContainer.appendChild(cartItem);
    });
  } else {
    cartItemsContainer.innerHTML = "<p>Кошик порожній</p>";
  }

  totalPriceElement.textContent = `₴${totalPrice}`;

  // Обробка кнопок "Видалити"
  const removeButtons = document.querySelectorAll(".remove-button");
  removeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const cartItem = e.target.closest(".cart-item");
      cartItem.remove();
      updateSummary();
    });
  });

  function updateSummary() {
    const cartItems = document.querySelectorAll(".cart-item");
    let totalItems = cartItems.length;
    let totalPrice = 0;

    cartItems.forEach((item) => {
      const price = parseFloat(
        item.querySelector(".product-price").textContent.replace(/[^0-9]/g, "")
      );
      totalPrice += price;
    });

    totalItemsElement.textContent = totalItems;
    totalPriceElement.textContent = `₴${totalPrice}`;
  }
});
