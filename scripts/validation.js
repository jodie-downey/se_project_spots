const setEventListeners = (formEl) => {
  const inputList = Array.from(document.querySelectorAll(".modal__input"));
  const buttonElement = Array.from(
    document.querySelectorAll(".modal__submit-button")
  );
  console.log(inputList);
  console.log(buttonElement);
};

const enableValidation = () => {
  const formList = document.querySelectorAll(".modal__form");
  formList.forEach((formEl) => {
    setEventListeners(formEl);
  });
};

enableValidation();
