document.addEventListener("DOMContentLoaded", () => {
  const removeButtons = document.querySelectorAll(".remove-button");
  const totalItemsElement = document.getElementById("total-items");
  const totalPriceElement = document.getElementById("total-price");

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
