export default class Card {
  constructor({
    data,
    cardSelector,
    handleCardClick,
    handleLikeClick,
    handleDeleteClick,
    userId,
  }) {
    this._name = data.name;
    this._link = data.link;
    this._id = data._id;
    this._ownerId = data.owner;
    this._userId = userId;
    this._isLiked = data.isLiked;
    this._cardSelector = cardSelector;
    this._handleCardClick = handleCardClick;
    this._handleLikeClick = handleLikeClick;
    this._handleDeleteClick = handleDeleteClick;
  }

  _getTemplate() {
    return document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
  }

  _setEventListeners() {
    this._element
      .querySelector(".card__image")
      .addEventListener("click", () => {
        this._handleCardClick({ name: this._name, link: this._link });
      });

    this._likeButton.addEventListener("click", () => {
      this._handleLikeClick(this._id, this.isLiked());
    });

    if (this._deleteButton) {
      this._deleteButton.addEventListener("click", () => {
        this._handleDeleteClick(this._id);
      });
    }
  }

  isLiked() {
    return this._isLiked;
  }

  updateLikes(newCardData) {
    if (newCardData.isLiked !== undefined) {
      this._isLiked = newCardData.isLiked;
    } else {
      console.error("Invalid likes data:", newCardData);
    }
    this._renderLikes();
  }

  _renderLikes() {
    if (this._isLiked) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
  }

  deleteCard() {
    this._element.remove();
    this._element = null;
  }

  createCard() {
    this._element = this._getTemplate();
    this._likeButton = this._element.querySelector(".card__like-button");
    this._deleteButton = this._element.querySelector(".card__delete-button");
    const cardImage = this._element.querySelector(".card__image");
    const cardTitle = this._element.querySelector(".card__title");

    cardImage.src = this._link;
    cardImage.alt = this._name;
    cardTitle.textContent = this._name;

    if (this._ownerId && this._ownerId !== this._userId) {
      this._deleteButton.remove();
    }

    this._renderLikes();
    this._setEventListeners();

    return this._element;
  }
}
