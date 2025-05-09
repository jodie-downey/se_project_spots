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

import { setButtonText } from "../utils/helpers.js";

import Api from "../utils/Api.js";

import spotsLogo from "../images/Logo.svg";
import avatarPhoto from "../images/avatar.jpg";
import editProfilePen from "../images/profile_pen.svg";
import profilePostPen from "../images/new__post_plus.svg";
import editAvatarPen from "../images/Edit-avatar-pen.svg";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ddd35ca5-33ea-4875-a654-ffea3920c4de",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    avatarPhotoElement.src = userInfo.avatar;
  })
  .catch(console.error);

//modal elements
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__subtitle");
const avatarEditContainer = document.querySelector(
  ".profile__avatar-container"
);

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
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarInput = editAvatarModal.querySelector("#edit-avatar-input");
const deleteCardModal = document.querySelector("#delete-modal");
const confirmDeleteButton = deleteCardModal.querySelector(
  "#modal__delete-button"
);

//card elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

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
const avatarPhotoElement = document.querySelector("#avatar-photo");
avatarPhotoElement.src = avatarPhoto;
const editProfilePenEl = document.querySelector("#edit-profile-button");
editProfilePenEl.src = editProfilePen;
const profilePostPenEl = document.querySelector("#profile-post-button");
profilePostPenEl.src = profilePostPen;
const editAvatarPenEl = document.querySelector("#edit__avatar-button");
editAvatarPenEl.src = editAvatarPen;

function getCardElement(data) {
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

  if (data.isLiked) {
    cardLikeButton.classList.add("card__button_liked");
  }

  cardLikeButton.addEventListener("click", (evt) => {
    handleLike(evt, data);
  });

  cardDeleteButton.addEventListener("click", (evt) => {
    handleDeleteCard(cardElement, data);
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewImageEl.src = data.link;
    previewCaptionEl.textContent = data.name;
    previewImageEl.alt = data.name;
  });

  return cardElement;
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteCardModal);
}

function handleLike(evt, data) {
  selectedCardId = data._id;
  const cardLikeButton = evt.target;
  const isLiked = cardLikeButton.classList.contains("card__button_liked");
  api
    .changeLikedStatus(selectedCardId, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__button_liked");
    })
    .catch(console.error);
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
  const submitbttn = evt.submitter;
  setButtonText(submitbttn, true);
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitbttn, false);
    });

  closeModal(editProfileModal);
}

function handleAvatarModalSubmit(evt) {
  evt.preventDefault();
  const submitbttn = evt.submitter;
  setButtonText(submitbttn, true);
  api
    .editAvatarPhoto(editAvatarInput.value)
    .then((data) => {
      avatarPhotoElement.src = data.avatar;
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitbttn, false);
    });
  closeModal(editAvatarModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitbttn = evt.submitter;
  setButtonText(submitbttn, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      selectedCardId = null;
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitbttn, false, "Delete", "Deleting...");
    });
  closeModal(deleteCardModal);
}

deleteCardModal.addEventListener("submit", handleDeleteSubmit);

editModalForm.addEventListener("submit", handledEditModalFormSubmit);

avatarEditContainer.addEventListener("click", () => {
  openModal(editAvatarModal);
});

editAvatarModal.addEventListener("submit", handleAvatarModalSubmit);

function handledNewCardModalSubmit(evt) {
  evt.preventDefault();
  const submitbttn = evt.submitter;
  setButtonText(submitbttn, true);
  const cardData = {
    name: addCardCaptionInput.value,
    link: addCardLinkInput.value,
  };
  api
    .postCard(cardData)
    .then((res) => {
      const cardElement = getCardElement(res);
      cardsList.prepend(cardElement);
      closeModal(addNewCardModal);
      evt.target.reset();
      disableSubmitButton(submitNewCardModal, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitbttn, false);
    });
}

addCardForm.addEventListener("submit", handledNewCardModalSubmit);

enableValidation(settings);
