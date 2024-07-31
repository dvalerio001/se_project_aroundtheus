export default class Card {
  constructor(data, cardSelector, handleImageClick) {
    this._data = data;
    this._name = data.name;
    this._link = data.link;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
  }

  // Private methods
  _setEventListeners() {
    this._cardImageElement.addEventListener("click", () => {
      this._handleImageClick(this._data);
    });

    this._deleteButton.addEventListener("click", () => {
      this._handleDeleteButton();
    });

    this._likeButton.addEventListener("click", () => {
      this._handleLikeButton();
    });
  }

  _handleDeleteButton() {
    this._cardElement.remove();
    this._cardElement = null;
  }

  _handleLikeButton() {
    this._likeButton.classList.toggle("card__like-button_active");
  }

  // Public methods
  getCardElement() {
    // Clone the card template and select the .card element
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.cloneNode(true)
      .querySelector(".card");

    // Check if elements are found
    this._cardImageElement = this._cardElement.querySelector(".card__image");
    this._cardNameEl = this._cardElement.querySelector(".card__title");
    this._deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );
    this._likeButton = this._cardElement.querySelector(".card__like-button");

    // Set image source and alt text
    this._cardImageElement.src = this._link;
    this._cardImageElement.alt = `Photo of ${this._name}`;

    // Set card name text content
    this._cardNameEl.textContent = this._name;

    // Set event listeners after all elements are initialized
    this._setEventListeners();

    return this._cardElement;
  }
}
