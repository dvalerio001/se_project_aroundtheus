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

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "bdefa1ce-28f3-4e1a-8e75-6e2193fb1dff",
    "Content-Type": "application/json",
  },
});

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
  avatarSelector: ".profile__image",
});

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
      const likeMethod = isLiked
        ? api.unlikeCard.bind(api)
        : api.likeCard.bind(api);

      likeMethod(cardId)
        .then((newCardData) => {
          card.updateLikes(newCardData.likes);
        })
        .catch((err) => console.error("Error updating like:", err));
    },
    handleDeleteClick: (cardId) => {
      deleteCardPopup.open();
      deleteCardPopup.setAction(() => {
        api
          .deleteCard(cardId)
          .then(() => {
            card.deleteCard();
            deleteCardPopup.close();
          })
          .catch((err) => console.error("Error deleting card:", err));
      });
    },
    userId: userId,
  });
  return card.createCard();
}

function handleProfileFormSubmit(formData) {
  editProfilePopup.renderLoading(true);
  api
    .editProfile(formData.name, formData.description)
    .then((updatedUser) => {
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
    });
}

function handleAvatarFormSubmit(formData) {
  avatarEditPopup.renderLoading(true);
  api
    .setUserAvatar(formData.avatar)
    .then((userData) => {
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
    });
}

function handleAddCardFormSubmit(formData) {
  addCardPopup.renderLoading(true);
  api
    .addCard(formData.name, formData.link)
    .then((newCard) => {
      const cardElement = createCard(newCard);
      cardSection.addItem(cardElement);
      addCardPopup.close();
    })
    .catch((err) => {
      console.error("Add card error:", err);
    })
    .finally(() => {
      addCardPopup.renderLoading(false);
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

// Set up event listeners for popups
imagePopup.setEventListeners();
editProfilePopup.setEventListeners();
addCardPopup.setEventListeners();
avatarEditPopup.setEventListeners();
deleteCardPopup.setEventListeners();

// DOM elements
const profileEditButton = document.querySelector(selectors.profileEditButton);
const addNewCardButton = document.querySelector(selectors.addCardButton);
const profileTitleInput = document.querySelector(selectors.profileTitleInput);
const profileDescriptionInput = document.querySelector(
  selectors.profileDescriptionInput
);
const avatarEditButton = document.querySelector(selectors.avatarEditButton);

// Event listeners
if (profileEditButton) {
  profileEditButton.addEventListener("click", () => {
    const currentUserInfo = userInfo.getUserInfo();
    profileTitleInput.value = currentUserInfo.name;
    profileDescriptionInput.value = currentUserInfo.description;

    if (formValidators["profile-form"]) {
      formValidators["profile-form"].resetValidation();
    }
    editProfilePopup.open();
  });
} else {
  console.warn("Profile edit button not found.");
}

if (addNewCardButton) {
  addNewCardButton.addEventListener("click", () => {
    if (formValidators["add-card-form"]) {
      formValidators["add-card-form"].resetValidation();
    }
    addCardPopup.open();
  });
} else {
  console.warn("Add new card button not found.");
}

if (avatarEditButton) {
  avatarEditButton.addEventListener("click", () => {
    if (formValidators["avatar-edit-form"]) {
      formValidators["avatar-edit-form"].resetValidation();
    }
    avatarEditPopup.open();
  });
} else {
  console.warn("Avatar edit button not found.");
}

// Load initial data
api
  .getAppInfo()
  .then(([cardData, userData]) => {
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
  })
  .catch((err) => {
    console.error("Error loading initial data:", err);
  });
