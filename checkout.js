document.addEventListener("DOMContentLoaded", () => {
  const continueButton = document.querySelector(".continue-button");
  const form = document.getElementById("contact-form");
  const deliveryForm = document.getElementById("delivery-form");
  const deliverySection = document.querySelector(".delivery-step");
  const continueButtonDelivery = document.querySelector(".delivery-continue");
  const paymentSection = document.querySelector(".checkout-step:last-of-type");

  // Перехід до "Доставка"
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
      deliveryForm.style.display = "block"; // Робимо блок доставки видимим
      deliverySection.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("Будь ласка, заповніть усі поля коректно!");
    }
  });

  // Перехід до "Оплата"
  continueButtonDelivery?.addEventListener("click", (event) => {
    event.preventDefault();

    const cityInput = deliveryForm.querySelector("#city")?.value.trim();
    const selectedMethod = deliveryForm.querySelector(
      "input[name='delivery-method']:checked"
    );

    if (cityInput && selectedMethod) {
      paymentSection.style.opacity = "1";
      paymentSection.style.pointerEvents = "auto";
      paymentSection.style.display = "block"; // Розкриваємо блок "Оплата"
      paymentSection.scrollIntoView({ behavior: "smooth" }); // Прокручування до "Оплата"
    } else {
      alert("Будь ласка, оберіть місто та спосіб доставки!");
    }
  });

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
});
