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
const profileCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const editModalDescriptionInput = editProfileModal.querySelector(
  "#modal-description-input"
);
const editModalForm = editProfileModal.querySelector(".modal__form");

const profilePostButton = document.querySelector(".profile__post-button");
const addNewCardModal = document.querySelector("#add-card-profile-modal");
const closeNewCardModal = addNewCardModal.querySelector(".modal__close-button");
const submitNewCardModal = addNewCardModal.querySelector(
  ".modal__submit-button"
);
const addCardLinkInput = addNewCardModal.querySelector("#add-card-link-input");
const addCardCaptionInput = addNewCardModal.querySelector(
  "#add-card-name-input"
);

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
    cardDeleteButton.closest(".card").remove();
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewImageEl.src = data.link;
    previewCaptionEl.textContent = data.name;
    previewImageEl.alt = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editProfileModal);
});

profilePostButton.addEventListener("click", () => {
  openModal(addNewCardModal);
});

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

profileCloseButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

closeNewCardModal.addEventListener("click", () => {
  closeModal(addNewCardModal);
});

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
}

addNewCardModal.addEventListener("submit", handledNewCardModalSubmit);

previewModal.addEventListener("click", () => {
  closeModal(previewModal);
});

intitalCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.prepend(cardElement);
});
