import "./index.css";
import {
  settings,
  showInputError,
  hideInputError,
  checkInputValidity,
  hasInvalidInput,
  toggleButtonState,
  disableSubmitButton,
  resetValidation,
  setEventListeners,
  enableValidation,
} from "../scripts/validation.js";

import spotsLogo from "../images/Logo.svg";

const intitalCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and throguh the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",

    name: "Red bridge in fog",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

//modal elements
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__subtitle");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editModalNameInput = editProfileModal.querySelector("#modal-name-input");
const editModalDescriptionInput = editProfileModal.querySelector(
  "#modal-description-input"
);
const editModalForm = document.forms["profile-form"];

const profilePostButton = document.querySelector(".profile__post-button");
const addNewCardModal = document.querySelector("#add-card-profile-modal");
const closeButton = addNewCardModal.querySelector(".modal__close-button");
const submitNewCardModal = addNewCardModal.querySelector(
  ".modal__submit-button"
);
const addCardLinkInput = addNewCardModal.querySelector("#add-card-link-input");
const addCardCaptionInput = addNewCardModal.querySelector(
  "#add-card-name-input"
);
const addCardForm = document.forms["add-card-form"];
const popups = document.querySelectorAll(".modal");

//card elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

//preview modal
const previewModal = document.querySelector("#preview-modal");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");
const previewCloseButton = previewModal.querySelector(
  ".modal__close-button_type_preview"
);

//image elements
const logoElement = document.querySelector("#spots-logo");
logoElement.src = spotsLogo;

function getCardElement(data) {
  console.log(data);
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__button_liked");
  });

  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewImageEl.src = data.link;
    previewCaptionEl.textContent = data.name;
    previewImageEl.alt = data.name;
  });

  return cardElement;
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const modal = document.querySelector(".modal_opened");
    if (modal) {
      closeModal(modal);
    }
  }
}

popups.forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    if (
      evt.target.classList.contains("modal_opened") ||
      evt.target.classList.contains("modal__close-button")
    ) {
      closeModal(popup);
    }
  });
});

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editModalForm,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});

profilePostButton.addEventListener("click", () => {
  openModal(addNewCardModal);
});

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

function handledEditModalFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editProfileModal);
}
editModalForm.addEventListener("submit", handledEditModalFormSubmit);

function handledNewCardModalSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: addCardCaptionInput.value,
    link: addCardLinkInput.value,
    alt: addCardCaptionInput.textContent,
  };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  closeModal(addNewCardModal);
  evt.target.reset();
  disableSubmitButton(submitNewCardModal, settings);
}

addCardForm.addEventListener("submit", handledNewCardModalSubmit);

intitalCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.prepend(cardElement);
});

enableValidation(settings);
