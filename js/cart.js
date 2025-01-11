document.addEventListener("DOMContentLoaded", () => {
  const removeButtons = document.querySelectorAll(".cart-item-remove");
  const totalItemsElement = document.getElementById("total-items");
  const totalPriceElement = document.getElementById("total-price");

  // Function to remove cart item
  removeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const cartItem = e.target.closest(".cart-item");
      cartItem.remove();
      updateSummary();
    });
  });

  // Function to update cart summary
  function updateSummary() {
    const cartItems = document.querySelectorAll(".cart-item");
    let totalItems = cartItems.length;
    let totalPrice = 0;

    cartItems.forEach((item) => {
      const price = parseFloat(
        item
          .querySelector(".cart-item-price")
          .textContent.replace(/[^0-9]/g, "")
      );
      totalPrice += price;
    });

    totalItemsElement.textContent = totalItems;
    totalPriceElement.textContent = `₴${totalPrice}`;
  }
});
