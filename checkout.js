document.addEventListener("DOMContentLoaded", () => {
  const continueButton = document.querySelector(".continue-button");
  const form = document.getElementById("contact-form");
  const deliveryForm = document.getElementById("delivery-form");
  const deliverySection = document.querySelector(".delivery-step");

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
      deliverySection.querySelector("h2").style.color = "#333";
      deliveryForm.style.display = "block";

      deliverySection.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("Будь ласка, заповніть усі поля коректно!");
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
