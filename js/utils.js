// Додавання товару до кошика
export function addToCart(productName, productPrice) {
  const cartData = JSON.parse(localStorage.getItem("cart")) || {
    items: [],
    totalPrice: 0,
  };
  cartData.items.push({ name: productName, price: productPrice });
  cartData.totalPrice += productPrice;
  localStorage.setItem("cart", JSON.stringify(cartData));

  const cartCounter = document.querySelector(".cart .counter");
  if (cartCounter) {
    cartCounter.textContent = cartData.items.length.toString();
  }
}

// Завантаження даних кошика
export function loadCart() {
  const cartData = JSON.parse(localStorage.getItem("cart")) || {
    items: [
      { name: "Гайковий ключ", price: 200 },
      { name: "Викрутка", price: 100 },
    ],
    totalPrice: 330,
  };
  return cartData;
}

// Перемикання стану "В обрані"
export function toggleFavorite(productData) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.findIndex((item) => item.name === productData.name);

  let isAdded;
  if (index > -1) {
    favorites.splice(index, 1);
    isAdded = false;
  } else {
    favorites.push(productData);
    isAdded = true;
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));

  const favoriteCounter = document.querySelector(".favorite .counter");
  if (favoriteCounter) {
    favoriteCounter.textContent = favorites.length.toString();
  }

  return isAdded;
}
