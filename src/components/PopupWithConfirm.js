import Popup from "./Popup.js";

export default class PopupWithConfirm extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._form = this._popup.querySelector(".modal__form");
    this._submitButton = this._form.querySelector(".modal__button");
    this._defaultButtonText = this._submitButton
      ? this._submitButton.textContent
      : "Yes";
  }

  setAction(action) {
    this._handleSubmit = action;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._handleSubmit();
    });
  }

  renderLoading(isLoading, loadingText = "Deleting...") {
    if (this._submitButton && isLoading) {
      this._submitButton.textContent = loadingText;
    }
  }

  resetButtonState() {
    if (this._submitButton) {
      this._submitButton.textContent = this._defaultButtonText;
      this._submitButton.disabled = false;
    }
  }

  open() {
    super.open();
    if (this._submitButton) {
      this._submitButton.disabled = false;
    }
  }
}
