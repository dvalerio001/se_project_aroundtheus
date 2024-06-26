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
const profileEditForm = profileEditModal.querySelector(".modal__form");

//Card Modal
const cardListEl = document.querySelector(".cards__list");
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;
const addCardModal = document.querySelector("#add-card-modal");
const addCardForm = addCardModal.querySelector(".modal__form");
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

function closePopUpClick(evt) {
  if (evt.target === evt.currentTarget) {
    closePopUp(evt.currentTarget);
  }
}

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

function renderCard(cardData, wrapper) {
  const cardElement = getCardElement(cardData);
  wrapper.prepend(cardElement);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const name = cardTitleInput.value;
  const link = cardUrlInput.value;
  renderCard({ name, link }, cardListEl);
  closePopUp(addCardModal);
  cardTitleInput.value = "";
  cardUrlInput.value = "";
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button"); //find delete button

  deleteButton.addEventListener("click", () => {
    //add event listener to the delete button
    cardElement.remove(); //delete card
  });

  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_active"); //.toggle will remove the like when clicked again.
  });
  cardTitleEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardImageEl.addEventListener("click", () => {
    previewCardImage.src = data.link;
    previewCardImage.alt = data.name;
    previewCardCaption.textContent = data.name;
    openPopUp(previewCardModal);
  });
  return cardElement;
}

//Event Listeners

profileEditButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openPopUp(profileEditModal);
});

profileEditCloseButton.addEventListener("click", () =>
  closePopUp(profileEditModal)
);

profileEditForm.addEventListener("submit", handleProfileEditSubmit);
addCardForm.addEventListener("submit", handleAddCardSubmit);

//add New Card
addNewCardButton.addEventListener("click", () => openPopUp(addCardModal));
addCardCloseButton.addEventListener("click", () => closePopUp(addCardModal));

//close preview modal
previewCloseButton.addEventListener("click", () =>
  closePopUp(previewCardModal)
);

initialCards.forEach((cardData) => renderCard(cardData, cardListEl));
