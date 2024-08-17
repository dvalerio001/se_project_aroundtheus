import FormValidator from "../components/FormValidator.js";
import Card from "../components/Card.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithConfirm from "../components/PopupWithConfirm.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js";
import { validationSettings, selectors } from "../utils/constants.js";
import "../pages/index.css";

console.log("Script started");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "bdefa1ce-28f3-4e1a-8e75-6e2193fb1dff",
    "Content-Type": "application/json",
  },
});

console.log("API initialized");

// Initialize form validators
const formValidators = {};
const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  console.log("Forms found:", formList.length);
  formList.forEach((formElement) => {
    const validator = new FormValidator(config, formElement);
    const formName = formElement.getAttribute("name");
    console.log("Registering validator for form:", formName);
    formValidators[formName] = validator;
    validator.enableValidation();
  });
};

enableValidation(validationSettings);
console.log("Form validation enabled");

// Initialize UserInfo
const userInfo = new UserInfo({
  nameSelector: selectors.profileTitle,
  descriptionSelector: selectors.profileDescription,
  avatarSelector: ".profile__image",
});

console.log("UserInfo initialized");

// Initialize Section for cards
let cardSection;
let userId;

function createCard(cardData) {
  const card = new Card({
    data: cardData,
    cardSelector: selectors.cardTemplate,
    handleCardClick: (data) => {
      imagePopup.open(data);
    },
    handleLikeClick: (cardId, isLiked) => {
      console.log(
        `Like clicked for card ${cardId}. Currently liked: ${isLiked}`
      );
      const likeMethod = isLiked
        ? api.unlikeCard.bind(api)
        : api.likeCard.bind(api);

      likeMethod(cardId)
        .then((newCardData) => {
          console.log("New card data after like/unlike:", newCardData);
          card.updateLikes(newCardData);
        })
        .catch((err) => console.error("Error updating like:", err));
    },
    handleDeleteClick: (cardId) => {
      console.log("Delete clicked", cardId);
      deleteCardPopup.open();
      deleteCardPopup.setAction(() => {
        deleteCardPopup.renderLoading(true);
        api
          .deleteCard(cardId)
          .then(() => {
            card.deleteCard();
            deleteCardPopup.close();
          })
          .catch((err) => console.error("Error deleting card:", err))
          .finally(() => {
            deleteCardPopup.resetButtonState();
          });
      });
    },
    userId: userId,
  });
  return card.createCard();
}

function handleProfileFormSubmit(formData) {
  console.log("Profile form submitted", formData);
  editProfilePopup.renderLoading(true);
  api
    .editProfile(formData.name, formData.description)
    .then((updatedUser) => {
      console.log("Profile updated", updatedUser);
      userInfo.setUserInfo({
        name: updatedUser.name,
        description: updatedUser.about,
        avatar: updatedUser.avatar,
      });
      editProfilePopup.close();
    })
    .catch((err) => {
      console.error("Profile update error:", err);
    })
    .finally(() => {
      editProfilePopup.renderLoading(false);
      editProfilePopup.resetButtonText();
    });
}

function handleAvatarFormSubmit(formData) {
  console.log("Avatar form submitted", formData);
  avatarEditPopup.renderLoading(true);
  api
    .setUserAvatar(formData.avatar)
    .then((userData) => {
      console.log("Avatar updated", userData);
      userInfo.setUserInfo({
        name: userData.name,
        description: userData.about,
        avatar: userData.avatar,
      });
      avatarEditPopup.close();
    })
    .catch((err) => {
      console.error("Avatar update error:", err);
    })
    .finally(() => {
      avatarEditPopup.renderLoading(false);
      avatarEditPopup.resetButtonText();
    });
}

function handleAddCardFormSubmit(formData) {
  console.log("Add card form submitted", formData);
  addCardPopup.renderLoading(true);
  api
    .addCard(formData.name, formData.link)
    .then((newCard) => {
      console.log("New card added", newCard);
      const cardElement = createCard(newCard);
      cardSection.addItem(cardElement);
      addCardPopup.close();
      addCardPopup.resetForm(); // Reset the form only after successful submission
    })
    .catch((err) => {
      console.error("Add card error:", err);
    })
    .finally(() => {
      addCardPopup.renderLoading(false);
      addCardPopup.resetButtonText();
    });
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
const avatarEditPopup = new PopupWithForm(
  selectors.avatarEditModal,
  handleAvatarFormSubmit
);
const deleteCardPopup = new PopupWithConfirm(selectors.deleteCardModal);

console.log("Popups initialized");

// Set up event listeners for popups
imagePopup.setEventListeners();
editProfilePopup.setEventListeners();
addCardPopup.setEventListeners();
avatarEditPopup.setEventListeners();
if (deleteCardPopup._popup) {
  deleteCardPopup.setEventListeners();
} else {
  console.warn("Delete card popup could not be initialized.");
}
console.log("Popup event listeners set");

// DOM elements
const profileEditButton = document.querySelector(selectors.profileEditButton);
const addNewCardButton = document.querySelector(selectors.addCardButton);
const profileTitleInput = document.querySelector(selectors.profileTitleInput);
const profileDescriptionInput = document.querySelector(
  selectors.profileDescriptionInput
);
const avatarEditButton = document.querySelector(selectors.avatarEditButton);

console.log("DOM elements selected");

// Event listeners
if (profileEditButton) {
  profileEditButton.addEventListener("click", () => {
    console.log("Profile edit button clicked");
    const currentUserInfo = userInfo.getUserInfo();
    profileTitleInput.value = currentUserInfo.name;
    profileDescriptionInput.value = currentUserInfo.description;
    const formValidator = formValidators["profile-edit-modal"];
    if (formValidator) {
      formValidator.resetForm();
    } else {
      console.warn("Form validator for profile-edit-modal not found");
    }
    editProfilePopup.open();
  });
} else {
  console.warn("Profile edit button not found.");
}

if (addNewCardButton) {
  addNewCardButton.addEventListener("click", () => {
    console.log("Add new card button clicked");
    const formValidator = formValidators["add-card-modal"];
    if (formValidator) {
      formValidator.resetForm();
    } else {
      console.warn("Form validator for add-card-modal not found");
    }
    addCardPopup.open();
  });
} else {
  console.warn("Add new card button not found.");
}

if (avatarEditButton) {
  avatarEditButton.addEventListener("click", () => {
    console.log("Avatar edit button clicked");
    const formValidator = formValidators["avatar-edit-modal"];
    if (formValidator) {
      formValidator.resetForm();
    } else {
      console.warn("Form validator for avatar-edit-modal not found");
    }
    avatarEditPopup.open();
  });
} else {
  console.warn("Avatar edit button not found.");
}

console.log("Event listeners added");

// Load data
api
  .getAppInfo()
  .then(([cardData, userData]) => {
    console.log("Initial data loaded", { cardData, userData });
    userId = userData._id;
    userInfo.setUserInfo({
      name: userData.name,
      description: userData.about,
      avatar: userData.avatar,
    });

    cardSection = new Section(
      {
        items: cardData,
        renderer: (item) => {
          const card = createCard(item);
          cardSection.addItem(card);
        },
      },
      selectors.cardSection
    );
    cardSection.renderItems();
    console.log("Cards rendered");
  })
  .catch((err) => {
    console.error("Error loading initial data:", err);
  });

console.log("Script finished");
