document.addEventListener("DOMContentLoaded", () => {
  const continueButton = document.getElementById("continue-to-shipping");

  continueButton.addEventListener("click", () => {
    alert("Форма успішно заповнена! Перейдіть до доставки.");
  });
});
