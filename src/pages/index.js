import FormValidator from "../components/FormValidator.js";
import Card from "../components/Card.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import {
  initialCards,
  validationSettings,
  selectors,
} from "../utils/constants.js";
import "../pages/index.css";

// Initialize form validators
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

// Initialize UserInfo
const userInfo = new UserInfo({
  nameSelector: selectors.profileTitle,
  descriptionSelector: selectors.profileDescription,
});

// Initialize Section for cards
const cardListSection = new Section(
  {
    items: initialCards,
    renderer: (item) => {
      const card = createCard(item);
      cardListSection.addItem(card);
    },
  },
  selectors.cardSection
);

function createCard(item) {
  const card = new Card(item, selectors.cardTemplate, handleCardClick);
  return card.getCardElement();
}

// Initialize Popups
const imagePopup = new PopupWithImage(selectors.imageModal);
const editProfilePopup = new PopupWithForm(
  selectors.profileEditModal,
  handleProfileFormSubmit
);
const addCardPopup = new PopupWithForm(
  selectors.addCardModal,
  handleAddCardFormSubmit
);

// Set up event listeners for popups
imagePopup.setEventListeners();
editProfilePopup.setEventListeners();
addCardPopup.setEventListeners();

// Functions
function handleCardClick(data) {
  imagePopup.open(data);
}

function handleProfileFormSubmit(formData) {
  userInfo.setUserInfo({
    name: formData.name,
    description: formData.description,
  });
  editProfilePopup.close();
}

function handleAddCardFormSubmit(formData) {
  const card = createCard(formData);
  cardListSection.addItem(card);
  addCardPopup.close();
  document.querySelector(selectors.addCardModal).querySelector("form").reset();
}

// DOM elements
const profileEditButton = document.querySelector(selectors.profileEditButton);
const addNewCardButton = document.querySelector(selectors.addCardButton);
const profileTitleInput = document.querySelector(selectors.profileTitleInput);
const profileDescriptionInput = document.querySelector(
  selectors.profileDescriptionInput
);

// Event listeners
profileEditButton.addEventListener("click", () => {
  const currentUserInfo = userInfo.getUserInfo();
  profileTitleInput.value = currentUserInfo.name;
  profileDescriptionInput.value = currentUserInfo.description;

  // Reset the form validation state
  formValidators["editProfileModal"].resetForm();
  editProfilePopup.open();
});

addNewCardButton.addEventListener("click", () => {
  formValidators["addCardModal"].resetForm();
  addCardPopup.open();
});

// Render initial cards
cardListSection.renderItems();
