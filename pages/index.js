import FormValidator from "../components/FormValidator.js";
import Card from "../components/Card.js";

const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },

  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },

  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },

  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },

  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },

  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
  },
];

//Edit Modal

const profileEditModal = document.querySelector("#profile-edit-modal");
const profileEditForm = document.forms["editProfileModal"];

//Card Modal
const cardListEl = document.querySelector(".cards__list");
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;
const addCardModal = document.querySelector("#add-card-modal");
const addCardForm = document.forms["addCardModal"];
const cardTitleInput = addCardForm.querySelector(".modal__input_type_title");
const cardUrlInput = addCardForm.querySelector(".modal__input_type_url");

//Preview Modal

const previewCardModal = document.querySelector("#preview-card-modal");
const previewCardImage = previewCardModal.querySelector(
  ".modal__preview-image"
);
const previewCardCaption = previewCardModal.querySelector(
  ".modal__preview-caption"
);

//Buttons

const profileEditButton = document.querySelector("#profile-edit-button");
const profileEditCloseButton = profileEditModal.querySelector(".modal__close");
const addNewCardButton = document.querySelector(".profile__add-button");
const addCardCloseButton = addCardModal.querySelector(".modal__close");
const previewCloseButton = previewCardModal.querySelector(
  "#modal-close-button"
);

//Modal Inputs

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);

//Objects

const validationSettings = {
  formSelector: ".modal",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const formValidators = {};
const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    const validator = new FormValidator(config, formElement);
    const formName = formElement.getAttribute("name");
    formValidators[formName] = validator;
    validator.enableValidation();
  });
};

enableValidation(validationSettings);

function closePopUp(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeModalWithEscape);
  modal.removeEventListener("mousedown", handleOverlay);
  modal
    .querySelector(".modal__close")
    .removeEventListener("click", closeModalWithEscape);
}

function openPopUp(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeModalWithEscape);
  modal.addEventListener("mousedown", handleOverlay);
  modal
    .querySelector(".modal__close")
    .addEventListener("click", closeModalWithEscape);
}

function closeModalWithEscape(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    closePopUp(openModal);
  }
}

function handleOverlay(evt) {
  if (Array.from(evt.target.classList).includes("modal_opened")) {
    closePopUp(evt.target);
  }
}

function handleProfileEditSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopUp(profileEditModal);
}

function handleImageClick(cardData) {
  previewCardImage.src = cardData.link;
  previewCardCaption.textContent = cardData.name;
  openPopUp(previewCardModal);
}

function renderCard(cardData, method = "prepend") {
  const card = new Card(cardData, cardTemplate, handleImageClick);
  const cardElement = card.getCardElement();
  cardListEl[method](cardElement);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const name = cardTitleInput.value;
  const link = cardUrlInput.value;
  renderCard({ name, link });
  closePopUp(addCardModal);
  cardTitleInput.value = "";
  cardUrlInput.value = "";
}

//Event Listeners

profileEditButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openPopUp(profileEditModal);
});

profileEditForm.addEventListener("submit", handleProfileEditSubmit);
initialCards.forEach((cardData) => renderCard(cardData));

//add New Card

addCardForm.addEventListener("submit", handleAddCardSubmit);
addNewCardButton.addEventListener("click", () => openPopUp(addCardModal));
const closeButtons = document.querySelectorAll(".modal__close");
closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closePopUp(modal));
});
